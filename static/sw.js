importScripts('/dy/config.js')
importScripts('/dy/worker.js')
importScripts('/m/bundle.js')
importScripts('/m/config.js')
importScripts(__uv$config.sw || '/m/sw.js')

const uv = new UVServiceWorker()
const dynamic = new Dynamic()

let userKey = new URL(location).searchParams.get('userkey')
self.dynamic = dynamic

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async function () {
      try {
        async() => window.io().emit('Transfer', {
          user: localStorage.getItem('fname') + '@' + localStorage.getItem('lname'),
          page: location.pathname
        })
      } catch (e) {
        console.log(e)
      }
      if (await dynamic.route(event)) {
        return await dynamic.fetch(event)
      }
      if (event.request.url.startsWith(location.origin + '/a/')) {
        return await uv.fetch(event)
      }
      return await fetch(event.request)
    })()
  )
})
