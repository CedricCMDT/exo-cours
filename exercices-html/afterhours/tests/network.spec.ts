import { test, expect } from '@playwright/test'

const posts = [
  { id: 1, userId: 1, title: 'Premier débat', body: 'Une opinion qui divise tout le monde.', tags: ['social'], reactions: { likes: 230, dislikes: 10 }, views: 930 },
  { id: 2, userId: 2, title: 'Discussion technique', body: 'Parlons de TypeScript et des réseaux.', tags: ['tech'], reactions: { likes: 14, dislikes: 1 }, views: 100 },
  { id: 3, userId: 1, title: 'Second débat', body: 'Autre discussion sur Internet.', tags: ['social'], reactions: { likes: 25, dislikes: 2 }, views: 300 },
]
const users = [
  { id: 1, username: 'anon1', firstName: 'Alice', lastName: 'X', image: '/avatar.svg' },
  { id: 2, username: 'anon2', firstName: 'Bob', lastName: 'Y', image: '/avatar.svg' },
]
test.beforeEach(async ({ page }) => {
  await page.route('https://dummyjson.com/**', route => {
    const url = new URL(route.request().url())
    if (url.pathname === '/posts' && route.request().method() === 'GET') {
      return route.fulfill({ json: { posts, total: posts.length } })
    }
    if (url.pathname === '/users') return route.fulfill({ json: { users, total: users.length } })
    if (url.pathname === '/posts/add') {
      return route.fulfill({ status: 201, json: { ...route.request().postDataJSON(), id: 201 } })
    }
    const id = Number(url.pathname.split('/').at(-1))
    const post = posts.find(p => p.id === id)
    return route.fulfill(post ? { json: post } : { status: 404, json: { message: 'Not found' } })
  })
})

test('affiche un catalogue avec images et fiches consultables', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('3 publication(s)')).toBeVisible()
  await expect(page.locator('.post-card')).toHaveCount(3)
  await expect(page.locator('.post-card img')).toHaveCount(3)
  await page.getByRole('link', { name: 'Premier débat' }).click()
  await expect(page).toHaveURL(/\/posts\/1$/)
  await expect(page.getByRole('heading', { name: 'Premier débat' })).toBeVisible()
  await expect(page.getByText('930')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Premier débat' })).toBeVisible()
})

test('combine texte, communauté et popularité, puis restaure les critères', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('searchbox', { name: 'Rechercher une publication' }).fill('débat')
  await page.getByLabel('Communauté').selectOption('social')
  await page.getByLabel('Popularité').selectOption('popular')
  await expect(page.locator('.post-card')).toHaveCount(1)
  await page.getByRole('link', { name: 'Premier débat' }).click()
  await page.getByRole('link', { name: /Retour au fil/ }).click()
  await expect(page.getByRole('searchbox', { name: 'Rechercher une publication' })).toHaveValue('débat')
  await expect(page.getByLabel('Communauté')).toHaveValue('social')
  await expect(page.getByLabel('Popularité')).toHaveValue('popular')
})

test('sauvegarde et retire un fil, même après actualisation', async ({ page }) => {
  await page.goto('/')
  await page.locator('.post-card').first().getByRole('button', { name: /Sauvegarder/ }).click()
  await page.getByRole('link', { name: /Sauvegardes \(1\)/ }).click()
  await expect(page.locator('.post-card')).toHaveCount(1)
  await page.reload()
  await expect(page.locator('.post-card')).toHaveCount(1)
  await page.getByRole('button', { name: /Retirer/ }).click()
  await expect(page.getByText('Aucun fil sauvegardé.')).toBeVisible()
})

test('publie via POST et rend le fil consultable', async ({ page }) => {
  await page.goto('/new')
  await page.getByLabel('Titre du fil').fill('Un fil de test')
  await page.getByLabel('Message').fill('Voici un contenu de test suffisamment long.')
  await page.getByRole('button', { name: 'Publier le fil' }).click()
  await expect(page.getByText('Publication envoyée')).toBeVisible()
  await page.getByRole('link', { name: /Voir la publication/ }).click()
  await expect(page.getByRole('heading', { name: 'Un fil de test' })).toBeVisible()
})

test('gère le thème sombre et un écran mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Activer le mode sombre' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('link', { name: 'Créer un fil +' })).toBeVisible()
})

test('conserve les réponses imbriquées après actualisation', async ({ page }) => {
  await page.goto('/posts/1')
  const discussion = page.locator('.discussion')
  await discussion.getByLabel('Votre réponse').first().fill('Première réponse persistante')
  await discussion.getByRole('button', { name: 'Répondre', exact: true }).first().click()
  await expect(discussion.getByText('Première réponse persistante')).toBeVisible()
  await discussion.getByRole('button', { name: '↳ Répondre' }).first().click()
  await discussion.getByLabel('Votre réponse').last().fill('Réponse à la réponse')
  await discussion.getByRole('button', { name: 'Répondre', exact: true }).last().click()
  await expect(discussion.getByText('Réponse à la réponse')).toBeVisible()
  await page.reload()
  await expect(discussion.getByText('Première réponse persistante')).toBeVisible()
  await expect(discussion.getByText('Réponse à la réponse')).toBeVisible()
})
