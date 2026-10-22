/**
 * Type partagé entre l'API DummyJSON, le serveur local et l'affichage.
 *
 * Une date est optionnelle car DummyJSON n'en fournit pas pour ses commentaires.
 */
export type Reply = {
  id: string
  postId: number
  parentId: string | null
  author: string
  body: string
  createdAt?: number
  automated: boolean
}
