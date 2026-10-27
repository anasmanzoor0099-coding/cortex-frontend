import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <-- Import kiya

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      
    manifest: {
  name: 'Cortex Learning',
  short_name: 'Cortex',
  description: 'Learn deeply. Build boldly.',
  theme_color: '#FDFBF7',
  background_color: '#FDFBF7',
  display: 'standalone',
  // Yahan purpose: 'any' add karna zaroori hai
  icons: [
    {
      src: 'pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any' 
    },
    {
      src: 'pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any' 
    },
    // Maskable icons (Android ke liye behtar look)
    {
      src: 'pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: 'pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]
}
    })
  ],
  server: {
    port: 5173,
  },
});