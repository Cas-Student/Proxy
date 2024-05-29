console.log("loading imports...");
import express from 'express'
import basicAuth from 'express-basic-auth'
import http from 'node:http'
import { createBareServer } from '@tomphttp/bare-server-node'
import path from 'node:path'
import cors from 'cors'
import config from './config.js'
import Accounts from './static/assets/accounts/users.js';
console.log("Done");

const __dirname = process.cwd()
const server = http.createServer()
const app = express(server)
const bareServer = createBareServer('/o/')
const PORT = process.env.PORT || 8080
console.log("Running on port: " + PORT);

//IP Finding
app.get('/', (req, res) => {
  const ip = req.get('X-Forwarded-For');
  console.log("\n");
  console.log("At: " + Date());
  console.log("ROOT IP: " + ip);
  res.end();
});

if (config.challenge) {
  console.log('Password protection is enabled.')
  app.use(
    basicAuth(
      {
        challenge: true,
        users: Accounts
      }
    )
  )
} else if (!config.challenge) {
  console.log('Password protection is disabled.')
}

console.log('--------------------')
console.log('      Accounts      ')
console.log('--------------------')
for (let user in Accounts) {
  console.log(user + ' | ' + Accounts[user])
  console.log('--------------------')
}

console.log("Going to main file...");
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))
console.log("Done");

console.log("Setting routes")
if (config.routes !== false) {
  const routes = [
    { path: '/ap', file: 'apps.html' },
    { path: '/ac', file: 'account.html'},
    { path: '/g', file: 'games.html' },
    { path: '/s', file: 'settings.html' },
    { path: '/t', file: 'tabs.html' },
    { path: '/p', file: 'go.html' },
    { path: '/', file: 'index.html' },
    { path: '/m', file: 'movies.html' },
  ]

  routes.forEach((route) => {
    app.get(route.path, (req, res) => {
      res.sendFile(path.join(__dirname, 'static', route.file))
    })
  })
}

if (config.local !== false) {
  app.get('/e/*', (req, res, next) => {
    const baseUrls = [
      'https://raw.githubusercontent.com/v-5x/x/fixy',
      'https://raw.githubusercontent.com/ypxa/y/main',
      'https://raw.githubusercontent.com/ypxa/w/master',
    ]
    fetchData(req, res, next, baseUrls)
  })
}
console.log("Done");

console.log("Fetching data...");
const fetchData = async (req, res, next, baseUrls) => {
  try {
    const reqTarget = baseUrls.map((baseUrl) => `${baseUrl}/${req.params[0]}`)
    let data
    let asset

    for (const target of reqTarget) {
      asset = await fetch(target)
      if (asset.ok) {
        data = await asset.arrayBuffer()
        break
      }
    }

    if (data) {
      res.end(Buffer.from(data))
    } else {
      next()
    }
  } catch (error) {
    console.error('Error fetching:', error)
    next(error)
  }
}
console.log("Done");

server.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res)
  } else {
    app(req, res)
  }
})

server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head)
  } else {
    socket.end()
  }
})

server.on('listening', () => {
  console.log(`Running at http://localhost:${PORT}`)
})

server.listen({
  port: PORT,
})

console.log("Completed index.js settings.");

