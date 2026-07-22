import { createHash } from 'node:crypto'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const letterRecipient = env.VITE_LETTER_RECIPIENT?.trim()
  const letterMessage = env.VITE_LETTER_MESSAGE?.trim()
  const letterSignature = env.VITE_LETTER_SIGNATURE?.trim()
  const letterAuthor = env.VITE_LETTER_AUTHOR?.trim()

  if (!letterRecipient || !letterMessage || !letterSignature || !letterAuthor) {
    throw new Error('Missing required letter configuration. Set VITE_LETTER_RECIPIENT, VITE_LETTER_MESSAGE, VITE_LETTER_SIGNATURE, and VITE_LETTER_AUTHOR')
  }

  const password = (env.SITE_PASSWORD || env.PASSWORD || '').trim().toLocaleLowerCase()
  const passwordHash = password
    ? createHash('sha256').update(password).digest('hex')
    : ''

  return {
    define: {
      __SITE_PASSWORD_HASH__: JSON.stringify(passwordHash),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
