import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sessionApi } from './sessionApi'
export default defineConfig({ plugins: [react(), sessionApi()] })
