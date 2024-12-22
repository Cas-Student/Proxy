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
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async function () {
      let e
      if (await dynamic.route(event)) {
        e = await dynamic.fetch(event)
        a(e)
        return e
      }
      if (event.request.url.startsWith(location.origin + '/a/')) {
        e = await uv.fetch(event)
        a(e)
        return e
      }
      e = await fetch(event.request)
      a(e)
      return e
    })()
  )
})
