import { createHash } from 'node:crypto'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
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
