const anonymousIdKey = 'confession-anonymous-id'

export function getAnonymousId() {
  const existingId = window.localStorage.getItem(anonymousIdKey)
  if (existingId) return existingId

  const newId = crypto.randomUUID()
  window.localStorage.setItem(anonymousIdKey, newId)
  return newId
}
