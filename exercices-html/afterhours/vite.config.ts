import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sessionApi } from './server/sessionApi'
export default defineConfig({ plugins: [react(), sessionApi()] })
