import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import memoriesApi from './plugins/memories-api.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), memoriesApi()],
  server: {
    // host: true para poder abrirlo desde el celular en la misma red Wi-Fi
    host: true,
    // las fotos nuevas no deben recargar la página
    watch: { ignored: ['**/public/recuerdos/**'] },
  },
})
