import { expect, test } from '@playwright/test'

/**
 * Les tests bloquent les appels externes vers DummyJSON pour rester stables.
 * Les interactions avec notre serveur local /session-api restent réelles.
 */
const posts = [
  {
    id: 1,
    userId: 1,
    title: 'Premier débat',
    body: 'Une opinion qui divise tout le monde.',
    tags: ['social'],
    reactions: { likes: 230, dislikes: 10 },
    views: 930,
  },
  {
    id: 2,
    userId: 2,
    title: 'Discussion technique',
    body: 'Parlons de TypeScript et des réseaux.',
    tags: ['tech'],
    reactions: { likes: 14, dislikes: 1 },
    views: 100,
  },
  {
    id: 3,
    userId: 1,
    title: 'Second débat',
    body: 'Autre discussion sur Internet.',
    tags: ['social'],
    reactions: { likes: 25, dislikes: 2 },
    views: 300,
  },
]

const users = [
  { id: 1, username: 'anon1', firstName: 'Alice', lastName: 'X', image: '/avatar.svg' },
  { id: 2, username: 'anon2', firstName: 'Bob', lastName: 'Y', image: '/avatar.svg' },
]

const comments = [
  {
    id: 1,
    postId: 1,
    body: 'Un commentaire issu de la fausse API.',
    likes: 3,
    user: { id: 2, username: 'anon2', fullName: 'Bob Y' },
  },
]

test.beforeEach(async ({ page }) => {
  // Le pop-up n'est pas l'objet des tests fonctionnels du forum.
  await page.addInitScript(() => sessionStorage.setItem('ah-intro-seen', '1'))

  await page.route('https://dummyjson.com/**', (route) => {
    const url = new URL(route.request().url())
    if (url.pathname === '/posts' && route.request().method() === 'GET')
      return route.fulfill({ json: { posts, total: posts.length } })
    if (url.pathname === '/users')
      return route.fulfill({ json: { users, total: users.length } })
    if (url.pathname === '/comments')
      return route.fulfill({ json: { comments, total: comments.length } })
    if (url.pathname === '/posts/add')
      return route.fulfill({ status: 201, json: { ...route.request().postDataJSON(), id: 201 } })

    const id = Number(url.pathname.split('/').at(-1))
    const post = posts.find((item) => item.id === id)
    return route.fulfill(
      post ? { json: post } : { status: 404, json: { message: 'Not found' } },
    )
  })
})

test('la vraie API reste la source prioritaire avec des filtres réutilisables', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('.api-source-counts')).toContainText('3 posts API')
  await expect(page.locator('.post-card')).toHaveCount(3)

  await page.getByRole('searchbox', { name: 'RECHERCHER' }).fill('Premier débat')
  await expect(page.locator('.post-card')).toHaveCount(1)
  await page.getByRole('link', { name: 'Premier débat', exact: true }).click()
  await expect(page).toHaveURL(/\/posts\/1$/)
  await expect(page.locator('.detail-card h1')).toHaveText('Premier débat')
  await expect(page.getByText('Un commentaire issu de la fausse API.')).toBeVisible()
})

test('les catégories, le mode archives et le laboratoire REST fonctionnent', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.api-source-counts')).toContainText('3 posts API')

  await page.getByLabel('CATÉGORIE').selectOption('tech')
  await expect(page.locator('.post-card')).toHaveCount(1)
  await page.getByLabel('CATÉGORIE').selectOption('')

  await page.getByRole('button', { name: 'GET', exact: true }).click()
  await expect(page.locator('.api-lab-result')).toContainText('HTTP 200')

  await page.getByRole('button', { name: 'ARCHIVES FR' }).click()
  await expect(page.locator('.post-card').first()).toBeVisible()
  await expect(page.locator('.api-source-panel')).toContainText('ARCHIVES FR')
})

test('une inscription, une publication et un commentaire survivent à une actualisation', async ({
  page,
}) => {
  const username = 'test_' + Math.floor(Math.random() * 1000000)
  await page.goto('/account')
  await page.getByRole('button', { name: 'Inscription' }).click()
  await page.getByLabel('Pseudo').fill(username)
  await page.getByLabel('Mot de passe').fill('SecretDemo2026')
  await page.getByRole('button', { name: 'Créer mon compte' }).click()
  await expect(page.getByRole('heading', { name: '@' + username })).toBeVisible()

  await page.goto('/new')
  await page.getByLabel('Titre du fil').fill('Une publication de test')
  await page.getByLabel('Message').fill('Voici un texte suffisamment long pour publier un vrai sujet local.')
  await page.getByRole('button', { name: 'Publier le fil' }).click()
  await expect(page.getByText('Publication envoyée')).toBeVisible()
  await page.getByRole('link', { name: /Voir la publication/ }).click()

  await page.getByLabel('Ta réponse').first().fill('Une réponse locale persistante.')
  await page.getByRole('button', { name: 'Répondre', exact: true }).first().click()
  await expect(page.getByText('Une réponse locale persistante.')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Une réponse locale persistante.')).toBeVisible()
})

/**
 * Contraste WCAG : comparer les couleurs CSS réelles, après passage en clair.
 * Cela détecte les anciens titres blancs sur cartes blanches.
 */
test('le thème clair garde des titres et textes lisibles, y compris sur mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.locator('.post-card').first()).toBeVisible()

  await page.getByRole('button', { name: 'Activer le thème clair' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  const ratios = await page.locator('.post-card').first().evaluate((card) => {
    function rgb(value: string): number[] {
      const match = value.match(/[0-9.]+/g) ?? []
      return match.slice(0, 3).map(Number)
    }
    function luminance(c: number[]) {
      const channel = c.map((n) => {
        const v = n / 255
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
      })
      return channel[0] * 0.2126 + channel[1] * 0.7152 + channel[2] * 0.0722
    }
    function contrast(element: Element) {
      const foreground = luminance(rgb(getComputedStyle(element).color))
      const background = luminance(rgb(getComputedStyle(card).backgroundColor))
      return (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05)
    }
    return {
      title: contrast(card.querySelector('h3 a')!),
      paragraph: contrast(card.querySelector('p')!),
    }
  })

  expect(ratios.title).toBeGreaterThanOrEqual(4.5)
  expect(ratios.paragraph).toBeGreaterThanOrEqual(4.5)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  // Vérifier aussi la page de compte : les labels étaient presque blancs sur blanc.
  await page.goto('/account')
  const labelContrast = await page.locator('.composer .ui-field__label').first().evaluate((label) => {
    function luminance(value: string) {
      const [r, g, b] = (value.match(/[0-9.]+/g) ?? []).slice(0, 3).map(Number)
      const [rr, gg, bb] = [r, g, b].map((n) => {
        const channel = n / 255
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
      })
      return rr * 0.2126 + gg * 0.7152 + bb * 0.0722
    }
    const foreground = luminance(getComputedStyle(label).color)
    const background = luminance(getComputedStyle(label.closest('.composer')!).backgroundColor)
    return (Math.max(foreground, background) + 0.05) /
      (Math.min(foreground, background) + 0.05)
  })
  expect(labelContrast).toBeGreaterThanOrEqual(4.5)
})
