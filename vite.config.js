import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'html-async-css-and-trim-preload',
      transformIndexHtml(html) {
        const modulePreloadPatterns = ['virtual_pwa-register', 'workbox-window']
        const enableAsyncCss = false
        let transformed = html

        const noscripts = []
        transformed = transformed.replace(/<noscript>[\s\S]*?<\/noscript>/g, (match) => {
          const token = `__NOSCRIPT_${noscripts.length}__`
          noscripts.push(match)
          return token
        })

        transformed = transformed.replace(
          /<link\s+rel="modulepreload"[^>]*href="([^"]+)"[^>]*>\s*/g,
          (match, href) => {
            return modulePreloadPatterns.some((p) => href.includes(p)) ? '' : match
          }
        )

        if (enableAsyncCss) {
          transformed = transformed.replace(
            /<link([^>]*?)rel="stylesheet"([^>]*?)href="([^"]+\.css)"([^>]*)>/g,
            (match, pre, mid, href, post) => {
              if (!href.includes('/assets/')) return match
              const attrs = `${pre}${mid}${post}`
              const hasCrossorigin = attrs.includes('crossorigin')
              const crossorigin = hasCrossorigin ? ' crossorigin' : ''
              return [
                `<link rel="preload" as="style" href="${href}"${crossorigin}>`,
                `<link rel="stylesheet" href="${href}"${crossorigin} media="print" onload="this.media='all'">`,
                `<noscript><link rel="stylesheet" href="${href}"${crossorigin}></noscript>`
              ].join('')
            }
          )
        }

        transformed = transformed.replace(/__NOSCRIPT_(\d+)__/g, (match, index) => noscripts[Number(index)])

        return transformed
      }
    },
    vue(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        'icon.png',
        'remixicon.css',
        'remixicon.woff2',
        'rabbit-tracker-*.jpg',
        'rabbit-tracker-*.jpeg'
      ],
      manifest: {
        name: '自律警官兔 (Officer Bunny Self-Discipline Tracker)',
        short_name: '警官兔',
        start_url: '/',
        display: 'standalone',
        background_color: '#dfe6e9',
        theme_color: '#6c5ce7',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
})
