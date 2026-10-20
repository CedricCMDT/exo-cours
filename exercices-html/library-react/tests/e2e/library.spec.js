import { test, expect } from '@playwright/test'

const books = [
  {
    id: 'moby-1',
    volumeInfo: {
      title: 'Moby-Dick',
      authors: ['Herman Melville'],
      publishedDate: '1851',
      language: 'en',
      description: 'Un roman sur la mer et la baleine blanche.',
      categories: ['Fiction'],
    },
  },
  {
    id: 'verne-2',
    volumeInfo: {
      title: 'Vingt mille lieues sous les mers',
      authors: ['Jules Verne'],
      publishedDate: '1870',
      language: 'fr',
      description: 'Voyage à bord du Nautilus.',
    },
  },
]

async function mockBooks(page) {
  await page.route('https://www.googleapis.com/books/v1/volumes**', async route => {
    const url = new URL(route.request().url())
    if (url.pathname.endsWith('/volumes')) {
      const q = url.searchParams.get('q')
      const items = q === 'introuvable' ? [] : q === 'verne' ? [books[1]] : books
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ totalItems: items.length, items }) })
      return
    }
    const id = decodeURIComponent(url.pathname.split('/').at(-1))
    const book = books.find(item => item.id === id)
    await route.fulfill({
      status: book ? 200 : 404,
      contentType: 'application/json',
      body: JSON.stringify(book || { error: { message: 'Livre introuvable' } }),
    })
  })
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear())
  await mockBooks(page)
})

test('affiche les livres dès le chargement', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Bibliothèque', exact: true })).toBeVisible()
  await expect(page.getByText('2 livres affichés')).toBeVisible()
  await expect(page.getByRole('link', { name: /Moby-Dick/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Vingt mille lieues/ })).toBeVisible()
})

test('valide la recherche seulement à la soumission, puis efface le champ et redonne le focus', async ({ page }) => {
  await page.goto('/')
  const search = page.getByRole('searchbox', { name: 'Rechercher un livre' })
  await expect(page.getByText('Recherche validée : subject:fiction')).toBeVisible()

  await search.fill('  verne  ')
  await expect(page.getByText('Recherche validée : subject:fiction')).toBeVisible()
  await search.press('Enter')

  await expect(page.getByText('Recherche validée : verne')).toBeVisible()
  await expect(page.getByText('1 livre affiché')).toBeVisible()
  await expect(page.getByRole('link', { name: /Vingt mille lieues/ })).toBeVisible()

  await page.getByRole('button', { name: 'Effacer' }).click()
  await expect(search).toHaveValue('')
  await expect(search).toBeFocused()
  await expect(page.getByText('Recherche validée : verne')).toBeVisible()
})

test('affiche Aucun résultat pour une recherche vide de résultats', async ({ page }) => {
  await page.goto('/')
  const search = page.getByRole('searchbox', { name: 'Rechercher un livre' })
  await search.fill('introuvable')
  await search.press('Enter')
  await expect(page.getByText('Aucun résultat.')).toBeVisible()
  await expect(page.getByText('0 livre affiché')).toBeVisible()
})

test('ouvre une fiche, utilise le retour navigateur et recharge une URL directe', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Moby-Dick/ }).click()
  await expect(page).toHaveURL(/\/books\/moby-1$/)
  await expect(page.getByRole('heading', { name: 'Moby-Dick' })).toBeVisible()
  await expect(page.getByText('Herman Melville')).toBeVisible()
  await expect(page.getByText('Un roman sur la mer et la baleine blanche.')).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Bibliothèque', exact: true })).toBeVisible()
  await page.goto('/books/verne-2')
  await expect(page.getByRole('heading', { name: 'Vingt mille lieues sous les mers' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Vingt mille lieues sous les mers' })).toBeVisible()
})

test('ajoute, retire et conserve les favoris après rechargement', async ({ page }) => {
  await page.goto('/books/moby-1')
  await expect(page.getByText('Favoris : 0')).toBeVisible()
  await page.getByRole('button', { name: 'Ajouter aux favoris' }).click()
  await expect(page.getByText('Favoris : 1')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Favoris : 1')).toBeVisible()
  await page.getByRole('button', { name: 'Retirer des favoris' }).click()
  await expect(page.getByText('Favoris : 0')).toBeVisible()
})

test('gère une valeur localStorage incorrecte', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('library-favorites', '{invalide'))
  await page.goto('/')
  await expect(page.getByText('Favoris : 0')).toBeVisible()
  await expect(page.getByText('2 livres affichés')).toBeVisible()
})

test('affiche une erreur HTTP puis l’efface lors d’une nouvelle recherche réussie', async ({ page }) => {
  let failed = false
  await page.unroute('https://www.googleapis.com/books/v1/volumes**')
  await page.route('https://www.googleapis.com/books/v1/volumes**', async route => {
    const url = new URL(route.request().url())
    if (!failed && url.pathname.endsWith('/volumes')) {
      failed = true
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Clé API refusée' } }),
      })
      return
    }
    if (url.pathname.endsWith('/volumes')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: books }) })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(books[0]) })
    }
  })

  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('Clé API refusée')
  const search = page.getByRole('searchbox', { name: 'Rechercher un livre' })
  await search.fill('verne')
  await search.press('Enter')
  await expect(page.getByText('2 livres affichés')).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('reste utilisable sur écran mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.getByRole('searchbox', { name: 'Rechercher un livre' })).toBeVisible()
  await page.getByRole('link', { name: /Moby-Dick/ }).click()
  await expect(page.getByRole('button', { name: 'Ajouter aux favoris' })).toBeVisible()
})
