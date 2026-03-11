const CACHE_NAME = 'rabbit-tracker-v1.15';

// 初始需要缓存的本地文件
const INITIAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './vue.global.prod.js',
  './remixicon.css',
  './remixicon.woff2',
  './rabbit-tracker-happy.jpg',
  './rabbit-tracker-light.jpg',
  './rabbit-tracker-heavy.jpg',
  './rabbit-tracker-sad.jpg',
  './rabbit-tracker-bg.jpg',
  './rabbit-tracker-appbg.jpg'
];

// 安装阶段：存入基础文件
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(INITIAL_ASSETS).then(() => {
        console.log('所有初始资源已缓存');
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('删除旧缓存:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // 忽略非HTTP请求
  if (!e.request.url.startsWith('http')) {
    return;
  }

  // 忽略某些特定请求
  if (e.request.destination === 'document' && e.request.mode !== 'navigate') {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // 如果缓存里有，优先用缓存
      if (cachedResponse) {
        return cachedResponse;
      }

      // 缓存里没有，去网络请求
      return fetch(e.request).then((networkResponse) => {
        // 确保请求成功才缓存
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // 克隆响应以避免消费两次
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // 彻底断网且缓存也没有时，回退到主页
        return caches.match('./index.html');
      });
    })
  );
});

// 监听来自页面的消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});