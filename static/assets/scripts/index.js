window.addEventListener('load', () => {
  navigator.serviceWorker.register('../sw.js?v=4', {
    scope: '/a/',
  })
})

//User Logging
window.onload(async function() {
  let AJAX  = new XMLHttpRequest()
  let user = localStorage.getItem('fname')
  AJAX.open('GET', '/get-active')
  AJAX.onreadystatechange(function() {
    if (AJAX.readyState == 4 && AJAX.status == 200) {
      if (user in AJAX.response) {
        if (AJAX.response.user = true) {
          alert('ERROR: LOGGED IN ON ANOTHER DEVICE! CONTACT DEVELOPER IF A RESET IS NEEDED.')
          location.href = 'start.hcps.org'
        } else {
          const POST = new XMLHttpRequest()
          POST.open('POST', '/post-active')
          POST.onreadystatechange(function() {
            if (POST.readyState == 4 && POST.status != 200) {
              alert('ERROR: COULD NOT LOG USER TO DATABASE')
              location.href = 'start.hcps.org'
            }
          })
          POST.send({
            user: user,
            active: true
          })
        }
      } else {
        alert('ERROR: NOT IN SYSTEM LOGS')
        location.href = 'start.hcps.org'
      }
    }
  })
  AJAX.send()
})

window.onbeforeunload(function() {
  const AJAX = new XMLHttpRequest()
  AJAX.open('POST', '/post-database')
  AJAX.onreadystatechange(function() {
    if (AJAX.readyState == 4 && AJAX.status != 200) {
      alert('ERROR: COULD NOT POST TO DATABASE! CONTACT DEVELOPER FOR SUPPORT.')
    }
  })
  AJAX.send({
    user: localStorage.getItem('fname'),
    active: false
  })
})

const form = document.getElementById('fs')
const input = document.getElementById('is')

const uri = new URLSearchParams(window.location.search)

if (uri.has('search')) {
  processUrl(uri.get('search'), "");
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
  const searchUrl = engine ? engine : 'https://www.google.com/search?hl=' + localStorage.getItem('lang') + '&lr=' + localStorage.getItem('lang') + '&q='
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
