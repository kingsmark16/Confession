const unlockKey = 'confession-unlocked'

export function hasUnlockedSession() {
  return Boolean(__SITE_PASSWORD_HASH__)
    && window.sessionStorage.getItem(unlockKey) === __SITE_PASSWORD_HASH__
}

export function saveUnlockedSession() {
  window.sessionStorage.setItem(unlockKey, __SITE_PASSWORD_HASH__)
}
