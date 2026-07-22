/// <reference types="vite/client" />

declare const __SITE_PASSWORD_HASH__: string

interface ImportMetaEnv {
  readonly VITE_LETTER_AUTHOR: string
  readonly VITE_LETTER_MESSAGE: string
  readonly VITE_LETTER_RECIPIENT: string
  readonly VITE_LETTER_SIGNATURE: string
}
