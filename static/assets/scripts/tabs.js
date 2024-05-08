document.addEventListener('DOMContentLoaded', function (event) {
  const addTabButton = document.getElementById('add-tab')
  const tabList = document.getElementById('tab-list')
  const iframeContainer = document.getElementById('iframe-container')

  let tabCounter = 1

  addTabButton.addEventListener('click', () => {
    const newTab = document.createElement('li')
    const tabTitle = document.createElement('span')
    const newIframe = document.createElement('iframe')

    tabTitle.textContent = `New Tab`
    tabTitle.className = 'tab-title'
    newTab.dataset.tabId = tabCounter
    newTab.addEventListener('click', switchTab)
    newTab.setAttribute('draggable', true)

    const closeButton = document.createElement('button')
    closeButton.classList.add('close-tab')
    closeButton.innerHTML = '&#10005;'

    closeButton.addEventListener('click', (event) => {
      event.stopPropagation()

      const tabToRemove = tabList.querySelector(`[data-tab-id='${newTab.dataset.tabId}']`)
      const iframeToRemove = iframeContainer.querySelector(`[data-tab-id='${newTab.dataset.tabId}']`)

      if (tabToRemove && iframeToRemove) {
        const removedTabId = parseInt(tabToRemove.dataset.tabId)
        tabToRemove.remove()
        iframeToRemove.remove()

        const remainingTabs = Array.from(tabList.querySelectorAll('li'))
        if (remainingTabs.length > 0) {
          let indexToActivate = remainingTabs.findIndex((tab) => parseInt(tab.dataset.tabId) > removedTabId)
          if (indexToActivate === -1) {
            indexToActivate = remainingTabs.length - 1
          }
          const nextTabToActivate = remainingTabs[indexToActivate]
          const nextIframeToActivate = iframeContainer.querySelector(
            `[data-tab-id='${nextTabToActivate.dataset.tabId}']`
          )

          if (nextTabToActivate && nextIframeToActivate) {
            nextTabToActivate.classList.add('active')
            nextIframeToActivate.classList.add('active')
          }
        }
      }
    })

    newTab.appendChild(tabTitle)
    newTab.appendChild(closeButton)
    tabList.appendChild(newTab)

    const allTabs = Array.from(tabList.querySelectorAll('li'))
    allTabs.forEach((tab) => tab.classList.remove('active'))
    const allIframes = Array.from(iframeContainer.querySelectorAll('iframe'))
    allIframes.forEach((iframe) => iframe.classList.remove('active'))

    newTab.classList.add('active')

    newIframe.src = '/'
    newIframe.dataset.tabId = tabCounter
    newIframe.classList.add('active')
    iframeContainer.appendChild(newIframe)

    // svery epic
    newIframe.addEventListener('load', () => {
      const title = newIframe.contentDocument.title
      tabTitle.textContent = title
    })

    tabCounter++
  })

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) {
      console.warn('Received message from unexpected origin:', event.origin)
      return
    }

    console.log('Received message:', event.data)

    if (event.data && event.data.url) {
      const iframes = Array.from(iframeContainer.querySelectorAll('iframe'))
    } else {
      console.log('No URL data in the message.')
    }

    const activeIframe = iframes.find((iframe) => iframe.classList.contains('active'))

    if (activeIframe) {
      console.log('Visible iframe:', activeIframe)

      const tabToUpdate = tabList.querySelector(`[data-tab-id='${activeIframe.dataset.tabId}']`)

      if (tabToUpdate) {
        console.log('Tab to update:', tabToUpdate)

        const tabTitle = tabToUpdate.querySelector('.tab-title')

        if (tabTitle) {
          console.log('Tab title:', tabTitle)
          tabTitle.textContent = event.data.url
          console.log('Hostname:', event.data.url)
        } else {
          console.log('No tab title element found.')
        }
      } else {
        console.log('No tab to update found.')
      }
    } else {
      console.log('No visible iframe found.')
    }
  })

  function switchTab(event) {
    const tabId = event.target.closest('li').dataset.tabId

    const allTabs = Array.from(tabList.querySelectorAll('li'))
    allTabs.forEach((tab) => tab.classList.remove('active'))
    const allIframes = Array.from(iframeContainer.querySelectorAll('iframe'))
    allIframes.forEach((iframe) => iframe.classList.remove('active'))

    const selectedTab = tabList.querySelector(`[data-tab-id='${tabId}']`)
    if (selectedTab) {
      selectedTab.classList.add('active')
    } else {
      console.log('No selected tab found with ID:', tabId)
    }

    const selectedIframe = iframeContainer.querySelector(`[data-tab-id='${tabId}']`)
    if (selectedIframe) {
      selectedIframe.classList.add('active')
    } else {
      console.log('No selected iframe found with ID:', tabId)
    }
  }

  let dragTab = null

  tabList.addEventListener('dragstart', (event) => {
    dragTab = event.target
  })

  tabList.addEventListener('dragover', (event) => {
    event.preventDefault()
    const targetTab = event.target
    if (targetTab.tagName === 'LI' && targetTab !== dragTab) {
      const targetIndex = Array.from(tabList.children).indexOf(targetTab)
      const dragIndex = Array.from(tabList.children).indexOf(dragTab)
      if (targetIndex < dragIndex) {
        tabList.insertBefore(dragTab, targetTab)
      } else {
        tabList.insertBefore(dragTab, targetTab.nextSibling)
      }
    }
  })

  tabList.addEventListener('dragend', () => {
    dragTab = null
  })
})

function reload() {
  const iframeContainer = document.getElementById('iframe-container')
  const iframes = Array.from(iframeContainer.querySelectorAll('iframe'))
  const activeIframe = iframes.find((iframe) => iframe.classList.contains('active'))
  activeIframe.src = activeIframe.src
}

function expand() {
  const iframeContainer = document.getElementById('iframe-container')
  const iframes = Array.from(iframeContainer.querySelectorAll('iframe'))
  const activeIframe = iframes.find((iframe) => iframe.classList.contains('active'))
  activeIframe.requestFullscreen()
}

function goBack() {
  const iframeContainer = document.getElementById('iframe-container')
  const iframes = Array.from(iframeContainer.querySelectorAll('iframe'))
  const activeIframe = iframes.find((iframe) => iframe.classList.contains('active'))
  activeIframe.contentWindow.history.back()
}

function goForward() {
  const iframeContainer = document.getElementById('iframe-container')
  const iframes = Array.from(iframeContainer.querySelectorAll('iframe'))
  const activeIframe = iframes.find((iframe) => iframe.classList.contains('active'))
  activeIframe.contentWindow.history.forward()
}
function erudaToggle() {
  const iframeContainer = document.getElementById('iframe-container')
  const iframes = Array.from(iframeContainer.querySelectorAll('iframe'))
  const activeIframe = iframes.find((iframe) => iframe.classList.contains('active'))

  const erudaWindow = activeIframe.contentWindow
  const erudaDocument = activeIframe.contentDocument

  if (!erudaWindow || !erudaDocument) return

  if (erudaWindow.eruda?._isInit) {
    erudaWindow.eruda.destroy()
  } else {
    let script = erudaDocument.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/eruda'
    script.onload = function () {
      if (!erudaWindow) return
      erudaWindow.eruda.init()
      erudaWindow.eruda.show()
    }
    erudaWindow.document?.head?.appendChild(script) || erudaDocument.head.appendChild(script)
  }
}
