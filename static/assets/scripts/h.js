let inFrame

try {
  inFrame = window !== top
} catch (e) {
  inFrame = true
}

if (!inFrame && !navigator.userAgent.includes('Firefox')) {
  const popup = open('about:blank', '_blank')
  if (!popup || popup.closed) {
    alert('Please allow popups and redirects. Clicking ok won\'t do. Please go to the top right corner of your screen, which says pop-up blocked. allow it, and refresh.')
  } else {
    const doc = popup.document
    const iframe = doc.createElement('iframe')
    const style = iframe.style
    const link = doc.createElement('link')
    const name = localStorage.getItem('name') || 'start.hcps.org'
    const icon = localStorage.getItem('icon') || './favicon.png'

    doc.title = name
    link.rel = 'icon'
    link.href = icon

    iframe.src = location.href
    style.position = 'fixed'
    style.top = style.bottom = style.left = style.right = 0
    style.border = style.outline = 'none'
    style.width = style.height = '100%'

    doc.head.appendChild(link)
    doc.body.appendChild(iframe)

    const pLink = localStorage.getItem(encodeURI('pLink')) || 'https://start.hcps.org'
    location.replace(pLink)

    const script = doc.createElement('script')
    script.textContent = `
      window.addEventListener('beforeunload', function (event) {
        event.stopImmediatePropagation();
      });
    `
    doc.head.appendChild(script)
  }
}
