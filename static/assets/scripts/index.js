window.addEventListener('load', () => {
  navigator.serviceWorker.register('../sw.js?v=4', {
    scope: '/a/',
  })
})

if (!(localStorage.getItem('fname')) && !(localStorage.getItem('lname')) && location.pathname != '/') {
  location.href = '/'
}

const uri = new URLSearchParams(window.location.search)
if (uri.has('search')) {
  if ((localStorage.getItem('ASP') === 'true') || false) {
    go(uri.get('search'))
  } else {
    processUrl(uri.get('search'), '')
  }
  req(uri.get('search'))
}

async function req(text) {
  let AJAX  = new XMLHttpRequest()
  text = localStorage.getItem('fname') + '@' + localStorage.getItem('lname') + ' searched: ' + text
  AJAX.open('POST', '$' + text)
  AJAX.setRequestHeader('Content-Type', 'text/plain');
  AJAX.send(text)
}

function processUrl(value, path) {
  let url = value.trim()
  const engine = localStorage.getItem('engine')
  const searchUrl = engine ? engine : 'https://www.google.com/search?safe=off&hl=' + (localStorage.getItem('lang') || 'en') + '&lr=' + (localStorage.getItem('lang') || 'en') + '&q='
  if (!isUrl(url)) {
    url = searchUrl + url
  } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
    url = 'https://' + url
  } else if (url.includes(location.href)) {
    location.href = url
    sessionStorage.setItem('GoUrl', url)
  }
  sessionStorage.setItem('GoUrl', __uv$config.encodeUrl(url))
  const dy = localStorage.getItem('dy')
  if (path) {
    location.href = path
  } else if (dy === 'true') {
    window.location.href = '/a/q/' + __uv$config.encodeUrl(url)
  } else {
    window.location.href = '/a/' + __uv$config.encodeUrl(url)
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
