let config = {
  challenge: true, // Set to true if you want to enable password protection.
  routes: [
    { path: '/ap', file: 'apps.html' },
    { path: '/g', file: 'games.html' },
    { path: '/s', file: 'settings.html' },
    { path: '/t', file: 'tabs.html' },
    { path: '/p', file: 'go.html' },
    { path: '/', file: 'index.html' },
    { path: '/buffer', file: 'buffer.html' }
  ],
  local: true, // Change this to false to disable local assets.
}

export default config