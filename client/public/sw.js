const CACHE_NAME = 'peakforge-v3';
const STATIC_CACHE = 'peakforge-static-v3';
const DYNAMIC_CACHE = 'peakforge-dynamic-v3';
const OFFLINE_CACHE = 'peakforge-offline-v3';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/david.png',
  '/offline.html'
];

// Install event
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(OFFLINE_CACHE).then(cache => {
        console.log('💾 Setting up offline cache');
        return cache.put('/offline.html', new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PeakForge - Offline</title>
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                background: #111827; 
                color: white; 
                margin: 0; 
                padding: 20px; 
                text-align: center; 
                min-height: 100vh; 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center; 
              }
              .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
              .offline-title { font-size: 2rem; margin-bottom: 1rem; }
              .offline-message { font-size: 1.1rem; opacity: 0.8; max-width: 400px; }
              .retry-btn { 
                background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
                border: none; 
                color: white; 
                padding: 12px 24px; 
                border-radius: 8px; 
                font-size: 1rem; 
                margin-top: 2rem; 
                cursor: pointer; 
              }
            </style>
          </head>
          <body>
            <div class="offline-icon">📱</div>
            <h1 class="offline-title">You're Offline</h1>
            <p class="offline-message">
              No internet connection detected. Your progress is saved locally and will sync when you're back online.
            </p>
            <button class="retry-btn" onclick="window.location.reload()">
              Try Again
            </button>
          </body>
          </html>
        `, { headers: { 'Content-Type': 'text/html' } }));
      })
    ]).then(() => {
      console.log('✅ Static assets cached');
        return self.skipWaiting();
    }).catch(error => {
      console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.includes('peakforge-') || 
                (!cacheName.includes('-v3') && cacheName.includes('peakforge-'))) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Enhanced fetch event with better caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline indicator for API calls
              return new Response(JSON.stringify({ 
                error: 'offline', 
                message: 'No internet connection' 
              }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            });
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (url.pathname.includes('.js') || url.pathname.includes('.css') || 
      url.pathname.includes('.png') || url.pathname.includes('.jpg') ||
      url.pathname.includes('.svg') || url.pathname.includes('.woff')) {
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then(response => {
              if (response.ok) {
                const responseToCache = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseToCache));
              }
              return response;
            });
        })
    );
    return;
  }

  // Handle navigation requests with network-first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseToCache));
          }
            return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline page
              return caches.match('/offline.html');
          });
      })
    );
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseToCache));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Enhanced background sync
self.addEventListener('sync', event => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'task-completion':
    event.waitUntil(syncTaskCompletions());
      break;
    case 'habit-update':
      event.waitUntil(syncHabitUpdates());
      break;
    case 'progress-sync':
      event.waitUntil(syncProgressData());
      break;
    default:
      console.log('Unknown sync tag:', event.tag);
  }
});

// Sync task completions when back online
async function syncTaskCompletions() {
  try {
    const pendingActions = await getPendingActions();
    const taskActions = pendingActions.filter(action => 
      action.type === 'COMPLETE_TASK' || action.type === 'SKIP_TASK'
    );
    
    for (const action of taskActions) {
      try {
        const endpoint = action.type === 'COMPLETE_TASK' ? '/api/tasks/complete' : '/api/tasks/skip';
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: action.taskId,
            timestamp: action.timestamp
          })
        });
        
        await removePendingAction(action.id);
        console.log('✅ Synced task action:', action.type, action.taskId);
      } catch (error) {
        console.error('❌ Failed to sync task action:', error);
      }
    }
  } catch (error) {
    console.error('❌ Task sync failed:', error);
  }
}

// Sync habit updates
async function syncHabitUpdates() {
  try {
    const pendingActions = await getPendingActions();
    const habitActions = pendingActions.filter(action => action.type === 'UPDATE_HABIT');
    
    for (const action of habitActions) {
      try {
        await fetch('/api/habits/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        
        await removePendingAction(action.id);
        console.log('✅ Synced habit update:', action.data.habitId);
      } catch (error) {
        console.error('❌ Failed to sync habit update:', error);
      }
    }
  } catch (error) {
    console.error('❌ Habit sync failed:', error);
  }
}

// Sync progress data
async function syncProgressData() {
  try {
    const pendingActions = await getPendingActions();
    const progressActions = pendingActions.filter(action => action.type === 'UPDATE_PROGRESS');
    
    for (const action of progressActions) {
      try {
        await fetch('/api/progress/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        
        await removePendingAction(action.id);
        console.log('✅ Synced progress update');
      } catch (error) {
        console.error('❌ Failed to sync progress update:', error);
      }
    }
  } catch (error) {
    console.error('❌ Progress sync failed:', error);
  }
}

// Helper functions for offline storage
async function getPendingActions() {
  try {
    const cache = await caches.open(OFFLINE_CACHE);
    const response = await cache.match('/offline/pending-actions');
  
  if (response) {
    return await response.json();
    }
  } catch (error) {
    console.error('Failed to get pending actions:', error);
  }
  
  return [];
}

async function removePendingAction(actionId) {
  try {
    const pendingActions = await getPendingActions();
    const updatedActions = pendingActions.filter(action => action.id !== actionId);
  
    const cache = await caches.open(OFFLINE_CACHE);
    await cache.put('/offline/pending-actions', 
      new Response(JSON.stringify(updatedActions), {
        headers: { 'Content-Type': 'application/json' }
      })
    );
  } catch (error) {
    console.error('Failed to remove pending action:', error);
  }
}

// Enhanced push notification handling
self.addEventListener('push', event => {
  let options = {
    body: 'Time to complete your daily wellness tasks! 💪',
    icon: '/david.png',
    badge: '/david.png',
    vibrate: [100, 50, 100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Date.now().toString()
    },
    actions: [
      {
        action: 'open',
        title: 'Open PeakForge',
        icon: '/david.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/david.png'
      }
    ],
    tag: 'peakforge-reminder',
    renotify: true,
    requireInteraction: false
  };

  if (event.data) {
    try {
    const payload = event.data.json();
      options = { ...options, ...payload };
    } catch (error) {
      console.error('Failed to parse push payload:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(options.title || 'PeakForge', options)
  );
});

// Enhanced notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          // If app is already open, focus it
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // Otherwise open new window
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Periodic background sync for data updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContentInBackground());
  }
});

async function syncContentInBackground() {
  try {
    // Sync user progress
    await fetch('/api/user/progress');
    
    // Sync latest tasks
    await fetch('/api/tasks/current');
    
    // Sync community updates
    await fetch('/api/community/feed');
    
    console.log('✅ Background content sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
