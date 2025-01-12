window.addEventListener("load", () => {
  navigator.serviceWorker.register('../sw.js', {
    scope: '/a/',
  })
})

const uri = new URLSearchParams(window.location.search)
if (uri.has('search')) {
  document.getElementsByClassName('search-container').innerHTML = 'Searching... ' + uri.get('search')
  if (typeof localStorage.getItem('ASP') === 'undefined') {
    localStorage.setItem('ASP', 'true')
  }
  if (localStorage.getItem('ASP') == 'false') {
    processUrl(uri.get('search'))
  } else {
    go(uri.get('search'))
  }
}

if (!(localStorage.getItem('fname')) && !(localStorage.getItem('lname')) && location.pathname != '/') {
  location.href = '/'
}

function processUrl(value, path) {
  let url = value.trim()
  const engine = localStorage.getItem('engine')
  const searchUrl = engine ? engine : 'https://www.google.com/search?safe=off&hl=' + (localStorage.getItem('lang') || 'en') + '&lr=' + (localStorage.getItem('lang') || 'en') + '&q='
  if (!isUrl(url)) {
    url = searchUrl + url
  } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
    url = `https://${url}`
  }
  sessionStorage.setItem('GoUrl', __uv$config.encodeUrl(url))
  const dy = localStorage.getItem('dy')
  if (dy === "true") {
    window.location.href = `/a/q/${__uv$config.encodeUrl(url)}`
  } else if (path) {
    location.href = path
  } else {
    window.location.href = `/a/${__uv$config.encodeUrl(url)}`
  }
}

function go(value) {
  processUrl(value, '/p')
}

function blank(value) {
  processUrl(value)
}

function isUrl(val = '') {
  if (/^http(s?):\/\//.test(val) || (val.includes('.') && val.substr(0, 1) !== ' ')) return true
  return false
}
