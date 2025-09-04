// Service Worker for Tollow PWA
const CACHE_NAME = 'tollow-v1.0.2'
const STATIC_CACHE_NAME = 'tollow-static-v1.0.2'
const DYNAMIC_CACHE_NAME = 'tollow-dynamic-v1.0.2'

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
]

// 需要缓存的API端点
const API_CACHE_PATTERNS = [
  /^\/api\/texts/,
  /^\/api\/user/,
  /^\/api\/progress/,
]

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Static assets cached successfully')
        // 立即激活新的Service Worker
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error)
      })
  )
})

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated successfully')
        // 控制所有页面
        return self.clients.claim()
      })
  )
})

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // 跳过非HTTP请求
  if (!request.url.startsWith('http')) {
    return
  }
  
  // 处理不同类型的请求
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request))
  } else if (request.method === 'POST') {
    event.respondWith(handlePostRequest(request))
  }
})

// 处理GET请求
async function handleGetRequest(request) {
  const url = new URL(request.url)
  
  try {
    // 尝试从网络获取
    const networkResponse = await fetch(request)
    
    // 如果是成功的响应，缓存它
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', request.url)
    
    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 如果是HTML请求，返回离线页面
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html')
    }
    
    // 其他请求返回默认响应
    return new Response('Network error', { status: 503 })
  }
}

// 处理POST请求
async function handlePostRequest(request) {
  try {
    // 尝试发送请求
    const response = await fetch(request)
    
    // 如果成功，可以在这里添加一些逻辑
    // 比如缓存响应数据等
    
    return response
  } catch (error) {
    console.error('POST request failed:', error)
    
    // 对于POST请求，我们通常不能从缓存返回
    // 但可以返回一个错误响应
    return new Response('Network error', { status: 503 })
  }
}

// 推送通知事件
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || '您有新的通知',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      tag: data.tag || 'default',
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Tollow', options)
    )
  }
})

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action) {
    // 处理通知动作
    handleNotificationAction(event.action, event.notification.data)
  } else {
    // 默认行为：打开应用
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// 处理通知动作
function handleNotificationAction(action, data) {
  switch (action) {
    case 'practice':
      clients.openWindow('/practice')
      break
    case 'library':
      clients.openWindow('/library')
      break
    case 'profile':
      clients.openWindow('/profile')
      break
    default:
      clients.openWindow('/')
  }
}

// 后台同步事件
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync())
  }
})

// 执行后台同步
async function performBackgroundSync() {
  try {
    // 这里可以执行一些后台任务
    // 比如同步用户数据、上传离线内容等
    
    console.log('Background sync completed')
    
    // 发送通知
    await self.registration.showNotification('Tollow', {
      body: '后台同步完成',
      icon: '/favicon.ico',
    })
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// 消息事件处理
self.addEventListener('message', (event) => {
  console.log('Message received in Service Worker:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

// 错误事件处理
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error)
})

// 未处理的Promise拒绝
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

// 缓存管理函数
async function clearOldCaches() {
  const cacheNames = await caches.keys()
  const oldCaches = cacheNames.filter(name => 
    name !== STATIC_CACHE_NAME && name !== DYNAMIC_CACHE_NAME
  )
  
  await Promise.all(oldCaches.map(name => caches.delete(name)))
  console.log('Old caches cleared')
}

// 预缓存重要资源
async function precacheImportantResources() {
  const cache = await caches.open(STATIC_CACHE_NAME)
  
  // 预缓存一些重要的动态资源
  const importantResources = [
    '/api/texts/popular',
    '/api/user/profile',
  ]
  
  try {
    await Promise.all(
      importantResources.map(url => 
        fetch(url).then(response => {
          if (response.ok) {
            return cache.put(url, response)
          }
        }).catch(() => {
          // 忽略预缓存失败
        })
      )
    )
    console.log('Important resources precached')
  } catch (error) {
    console.error('Precaching failed:', error)
  }
}

// 定期清理缓存
setInterval(() => {
  clearOldCaches()
}, 24 * 60 * 60 * 1000) // 每24小时清理一次

// 初始化时预缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(precacheImportantResources())
})
