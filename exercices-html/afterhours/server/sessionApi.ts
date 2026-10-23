import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { communityPosts } from '../src/data/community'
import { archiveReplyCount } from '../src/data/archiveReplies'

/**
 * Routeur HTTP utilisé par le plugin Vite pour /session-api.
 *
 * Les comptes, sessions, publications et commentaires sont conservés en
 * mémoire du processus Node.js ; ce choix répond au périmètre du TD.
 * L'API externe DummyJSON et ce service local ont des responsabilités
 * distinctes et ne partagent pas leur stockage.
 */

type Account = {
  id: number
  username: string
  salt: string
  passwordHash: string
  bio: string
  joinedAt: string
}

type NewPost = {
  id: number
  title: string
  body: string
  tags: string[]
  userId: number
  createdAt: string
  reactions: { likes: number; dislikes: number }
  views: number
  local: true
}

type NewComment = {
  id: string
  postId: number
  parentId: string | null
  author: string
  userId: number
  body: string
  createdAt: number
  automated: false
}

// Stockage de session en mémoire, partagé par les routes du processus Node.js.
const accounts: Account[] = []
const newPosts: NewPost[] = []
const newComments: NewComment[] = []
const sessions = new Map<string, number>() // token de session → ID utilisateur

// Identifiant de démarrage : permet au client de détecter une nouvelle session serveur.
const bootId = randomUUID()
let nextUserId = 100000
let nextPostId = 1000000

// Utilitaires HTTP, authentification et sérialisation des réponses.
function sendJson(res: ServerResponse, status: number, value: unknown) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(value))
}

async function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  let text = ''

  // Une requête POST/PATCH transporte du JSON dans son corps.
  for await (const chunk of req) {
    text += chunk.toString()
    if (text.length > 30000) throw new Error('Message trop volumineux.')
  }
  return JSON.parse(text || '{}') as Record<string, unknown>
}

// Les mots de passe sont hachés avec un sel aléatoire avant stockage en mémoire.
function hashPassword(password: string, salt: string): Buffer {
  return scryptSync(password, salt, 64)
}

function tokenFrom(req: IncomingMessage): string | null {
  const pair = (req.headers.cookie || '')
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith('afterhours_session='))
  return pair ? pair.slice('afterhours_session='.length) : null
}

function signedInUser(req: IncomingMessage): Account | undefined {
  const token = tokenFrom(req)
  if (!token) return undefined
  const userId = sessions.get(token)
  return accounts.find(account => account.id === userId)
}

function publicProfile(account: Account) {
  // Ne jamais envoyer le sel ni le hash du mot de passe au navigateur.
  return {
    id: account.id,
    username: account.username,
    firstName: '',
    lastName: '',
    bio: account.bio,
    joinedAt: account.joinedAt,
  }
}

function createSession(res: ServerResponse, account: Account) {
  const token = randomBytes(32).toString('hex')
  sessions.set(token, account.id)
  // HttpOnly : un script côté navigateur ne peut pas lire ce cookie.
  res.setHeader('Set-Cookie', `afterhours_session=${token}; Path=/; HttpOnly; SameSite=Lax`)
  sendJson(res, 200, { user: publicProfile(account) })
}

function isKnownPost(id: number): boolean {
  // Les identifiants 1 à 9999 sont réservés aux publications distantes.
  // Les autres publications sont résolues à partir des ressources locales.
  return newPosts.some(post => post.id === id) ||
    communityPosts.some(post => post.id === id) ||
    (Number.isInteger(id) && id >= 1 && id <= 9999)
}

// Les actions sont réparties selon la méthode et le chemin de la requête.
async function handle(req: IncomingMessage, res: ServerResponse) {
  const path = (req.url || '/').split('?')[0]
  const method = req.method || 'GET'
  const user = signedInUser(req)

  // GET /state : recharger le forum sans effacer la session.
  if (method === 'GET' && path === '/state') {
    return sendJson(res, 200, {
      bootId,
      user: user ? publicProfile(user) : null,
      members: accounts.map(publicProfile),
      posts: newPosts,
      comments: newComments,
    })
  }

  // POST /register : créer un compte, puis ouvrir automatiquement sa session.
  if (method === 'POST' && path === '/register') {
    const data = await readBody(req)
    const username = String(data.username || '').trim()
    const password = String(data.password || '')

    if (!/^[\p{L}\p{N}_-]{3,24}$/u.test(username)) {
      return sendJson(res, 400, { error: 'Pseudo : 3 à 24 caractères, sans espace.' })
    }
    if (password.length < 8 || password.length > 128) {
      return sendJson(res, 400, { error: 'Mot de passe : 8 à 128 caractères.' })
    }
    if (accounts.some(account => account.username.toLowerCase() === username.toLowerCase())) {
      return sendJson(res, 409, { error: 'Ce pseudo existe déjà.' })
    }

    const salt = randomBytes(16).toString('hex')
    const account: Account = {
      id: nextUserId++,
      username,
      salt,
      passwordHash: hashPassword(password, salt).toString('hex'),
      bio: '',
      joinedAt: new Date().toISOString(),
    }

    accounts.push(account)
    return createSession(res, account)
  }

  // POST /login : vérifier le mot de passe, sans le renvoyer au client.
  if (method === 'POST' && path === '/login') {
    const data = await readBody(req)
    const username = String(data.username || '').trim().toLowerCase()
    const account = accounts.find(item => item.username.toLowerCase() === username)
    const password = String(data.password || '')

    // Même calcul si l'utilisateur n'existe pas, pour éviter une comparaison fragile.
    const expected = account
      ? Buffer.from(account.passwordHash, 'hex')
      : Buffer.alloc(64)
    const actual = hashPassword(password, account?.salt || 'absent-account')

    if (!account || !timingSafeEqual(actual, expected)) {
      return sendJson(res, 401, { error: 'Pseudo ou mot de passe incorrect.' })
    }
    return createSession(res, account)
  }

  // POST /logout : le token est retiré de la mémoire du serveur.
  if (method === 'POST' && path === '/logout') {
    const token = tokenFrom(req)
    if (token) sessions.delete(token)
    res.setHeader('Set-Cookie', 'afterhours_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
    return sendJson(res, 200, { ok: true })
  }

  // Toutes les routes suivantes demandent une connexion.
  if (!user) return sendJson(res, 401, { error: 'Connecte-toi pour continuer.' })

  // PATCH /profile : petite biographie visible sur la page du compte.
  if (method === 'PATCH' && path === '/profile') {
    const data = await readBody(req)
    user.bio = String(data.bio || '').trim().slice(0, 240)
    return sendJson(res, 200, { user: publicProfile(user) })
  }

  // POST /posts : enregistrer une nouvelle discussion.
  if (method === 'POST' && path === '/posts') {
    const data = await readBody(req)
    const title = String(data.title || '').trim()
    const body = String(data.body || '').trim()
    const tag = String(data.tag || 'social').trim().toLowerCase()

    if (title.length < 5 || title.length > 100 ||
        body.length < 15 || body.length > 10000 ||
        !/^[a-z0-9-]{2,20}$/.test(tag)) {
      return sendJson(res, 400, { error: 'Titre, message ou communauté invalide.' })
    }

    const post: NewPost = {
      id: nextPostId++,
      title,
      body,
      tags: [tag],
      userId: user.id,
      createdAt: new Date().toISOString(),
      reactions: { likes: 0, dislikes: 0 },
      views: 0,
      local: true,
    }
    newPosts.unshift(post)
    return sendJson(res, 201, { post })
  }

  // PATCH/DELETE /posts/:id : seul l'auteur peut modifier ou supprimer.
  const postIdMatch = path.match(/^\/posts\/(\d+)$/)
  if (postIdMatch && (method === 'PATCH' || method === 'DELETE')) {
    const index = newPosts.findIndex(post => post.id === Number(postIdMatch[1]))
    if (index === -1) return sendJson(res, 404, { error: 'Publication introuvable.' })
    if (newPosts[index].userId !== user.id) {
      return sendJson(res, 403, { error: 'Cette publication ne t’appartient pas.' })
    }

    if (method === 'DELETE') {
      const postId = newPosts[index].id
      newPosts.splice(index, 1)
      // Les commentaires attachés à un sujet supprimé disparaissent aussi.
      for (let i = newComments.length - 1; i >= 0; i--) {
        if (newComments[i].postId === postId) newComments.splice(i, 1)
      }
      return sendJson(res, 200, { ok: true })
    }

    const data = await readBody(req)
    const title = String(data.title || '').trim()
    const body = String(data.body || '').trim()
    if (title.length < 5 || title.length > 100 || body.length < 15 || body.length > 10000) {
      return sendJson(res, 400, { error: 'Contenu invalide.' })
    }
    newPosts[index].title = title
    newPosts[index].body = body
    return sendJson(res, 200, { post: newPosts[index] })
  }

  // POST /comments : répondre à un sujet ou à un commentaire existant.
  if (method === 'POST' && path === '/comments') {
    const data = await readBody(req)
    const postId = Number(data.postId)
    const parentId = data.parentId === null ? null : String(data.parentId || '')
    const body = String(data.body || '').trim()

    if (!Number.isInteger(postId) || !isKnownPost(postId) || !body || body.length > 2000) {
      return sendJson(res, 400, { error: 'Commentaire invalide.' })
    }

    // Les fils d'archive ont désormais un nombre variable de réponses.
    // On n'accepte un parent fictif que si son index existe vraiment.
    const archivePost = communityPosts.find(post => post.id === postId)
    // Exemple : archive-20000-a, archive-20000-b ou archive-20000-18.
    const match = parentId?.match(new RegExp('^archive-' + postId + '-(a|b|c|[0-9]+)$'))
    const archiveIndex = match
      ? (match[1].length === 1 && 'abc'.includes(match[1])
          ? 'abc'.indexOf(match[1])
          : Number(match[1]))
      : -1

    const validArchiveParent = Boolean(
      archivePost && match &&
      Number.isInteger(archiveIndex) &&
      archiveIndex >= 0 &&
      archiveIndex < archiveReplyCount(archivePost) &&
      (archiveIndex < 3
        ? match[1] === 'abc'[archiveIndex]
        : match[1] === String(archiveIndex)),
    )

    // Les réponses renvoyées par DummyJSON ont des IDs 'api-123'.
    // Le contenu est importé dans le navigateur via le vrai GET /comments.
    const validApiParent = postId > 0 && postId <= 9999 &&
      /^api-[1-9][0-9]*$/.test(parentId || '')

    const validParent = !parentId ||
      validArchiveParent ||
      validApiParent ||
      newComments.some(comment => comment.id === parentId && comment.postId === postId)

    if (!validParent) return sendJson(res, 400, { error: 'Réponse introuvable.' })

    const comment: NewComment = {
      id: randomUUID(),
      postId,
      parentId,
      author: user.username,
      userId: user.id,
      body,
      createdAt: Date.now(),
      automated: false,
    }
    newComments.push(comment)
    return sendJson(res, 201, { comment })
  }

  // PATCH/DELETE /comments/:id : autorisation contrôlée sur le serveur.
  const commentMatch = path.match(/^\/comments\/([a-z\d-]+)$/i)
  if (commentMatch && (method === 'PATCH' || method === 'DELETE')) {
    const index = newComments.findIndex(comment => comment.id === commentMatch[1])
    if (index === -1) return sendJson(res, 404, { error: 'Commentaire introuvable.' })
    if (newComments[index].userId !== user.id) {
      return sendJson(res, 403, { error: 'Ce commentaire ne t’appartient pas.' })
    }
    if (method === 'DELETE') {
      newComments.splice(index, 1)
      return sendJson(res, 200, { ok: true })
    }
    const data = await readBody(req)
    const body = String(data.body || '').trim()
    if (!body || body.length > 2000) {
      return sendJson(res, 400, { error: 'Commentaire invalide.' })
    }
    newComments[index].body = body
    return sendJson(res, 200, { comment: newComments[index] })
  }

  return sendJson(res, 404, { error: 'Cette route n’existe pas.' })
}

/**
 * 4. Une seule ligne de configuration Vite suffit.
 * Le plugin intercepte les URL /session-api avant de servir les fichiers React.
 * Cette API existe pendant « npm run dev », pas sur un hébergement statique.
 */
export function sessionApi(): Plugin {
  return {
    name: 'afterhours-memory-api',
    configureServer(server) {
      server.middlewares.use('/session-api', (req, res) => {
        void handle(req, res).catch(error => {
          sendJson(res, 400, {
            error: error instanceof Error ? error.message : 'Erreur du serveur local.',
          })
        })
      })
    },
  }
}
