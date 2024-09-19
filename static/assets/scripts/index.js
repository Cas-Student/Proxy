window.addEventListener('load', () => {
  navigator.serviceWorker.register('../sw.js?v=4', {
    scope: '/a/',
  })
})

const form = document.getElementById('fs')
const input = document.getElementById('is')

if (form && input) {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (input.value === '/') {
      alert('Error: '  + window.location)
      location.href = location.href;
    } else {
      processUrl(input.value, "");
    }
  });
}

function processUrl(value, path) {
  let url = value.trim()
  const engine = localStorage.getItem('engine')
  const searchUrl = engine ? engine : 'https://www.google.com/search?hl=' + localStorage.getItem('lang') + '&lr=' + localStorage.getItem('lang') + '&q='

  if (!isUrl(url)) {
    url = searchUrl + url
  } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
    url = 'https://' + url
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
