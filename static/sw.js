importScripts('/dy/config.js')
importScripts('/dy/worker.js')
importScripts('/m/bundle.js')
importScripts('/m/config.js')
importScripts(__uv$config.sw || '/m/sw.js')

const uv = new UVServiceWorker()
const dynamic = new Dynamic()

self.dynamic = dynamic

function a(e) {
  const AJAX = new XMLHttpRequest()
  AJAX.open("POST", '/active', true)
  AJAX.setRequestHeader('Content-Type', 'application/json')
  AJAX.send(
    JSON.stringify({
      user: localStorage.getItem('fname') || '',
      name: localStorage.getItem('lname') || '',
      event: e
    })
  )
  return e
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async function () {
      if (await dynamic.route(event)) {
        return a(await dynamic.fetch(event))
      }

      if (event.request.url.startsWith(location.origin + '/a/')) {
        return a(await uv.fetch(event))
      }

      return a(await fetch(event.request))
    })()
  )
})
