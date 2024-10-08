//ENV Vars
const blacklist = process.env.blacklist || ""; //Blacklisted IPs
const debug = process.env.debug || "false";
const headers = process.env.headers || "false";
const login  = process.env.login || "false";
const tracker = process.env.tracker || "true";
let pnpm = false // For Running pnpm
let users; // Pre-declares users
if (pnpm) {
  users = {"user":{"passwd":"null"}}; //All user data
} else {
  users = JSON.parse(process.env.users);
}

//Imports
console.log("loading imports...");
import express from 'express'
import basicAuth from 'express-basic-auth'
import http from 'node:http'
import { createBareServer } from '@tomphttp/bare-server-node'
import path from 'node:path'
import cors from 'cors'
import config from './config.js'
console.log("Done");

const __dirname = process.cwd()
const server = http.createServer()
const app = express(server)
const bareServer = createBareServer('/o/')
const PORT = process.env.PORT || 8080
console.log("Running on port: " + PORT);

var Accounts = {}; //username and passwords
for (let key in users) {
  if (!("CLOSED" in users[key])) {
    Accounts[key] = users[key]['password'];
  }
}

if (login === "true") {
  console.log('Password protection is enabled.')
  app.use(
    basicAuth(
      {
        challenge: true,
        users: Accounts
      }
    )
  )
} else if (config.challenge === "false") {
  console.log('Password protection is disabled.')
}

console.log('--------------------')
console.log('      Accounts      ')
console.log('--------------------')
for (let user in Accounts) {
  console.log(user + ' | ' + Accounts[user])
  console.log('--------------------')
}

console.log("Loading routes")
app.use(express.json())
//app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))
function route() {
  if (config.routes !== false) {
    const routes = [
      { path: '/ap', file: 'apps.html' },
      { path: '/g', file: 'games.html' },
      { path: '/s', file: 'settings.html' },
      { path: '/t', file: 'tabs.html' },
      { path: '/p', file: 'go.html' },
      { path: '/', file: 'index.html' },
    ]

    routes.forEach((route) => {
      app.get(route.path, (req, res) => {
        res.sendFile(path.join(__dirname, 'static', route.file))
      })
    })
  }
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

if (tracker) {
  console.log("----------\nTracking\n----------");
  app.use((req, res, next) => {
    let file = req.path
    let IP = req.headers["x-forwarded-for"]
    if (
      (debug === 'true') ||
      (
        !(file.substring(0, 4) === '/dy/') &&
        !(file.substring(0, 3) === '/m/') &&
        !(file.substring(0, 9) === '/bundles/') &&
        !(file.substring(0, 8) === '/assets/')
      )
    ) {
      let output = ''
      let logged = false;
      for (let user in users) {
        if ("ip" in users[user]) {
          if (users[user]["ip"] === IP) {
            output += 'Request from: ' + user
            logged = true
          }
        }
      }
      if (!logged && IP != '2604:2dc0:100:375c::dedf') {
        output += 'Request: ' + IP
      }
      if ((blacklist.split(/[ ;]+/)).includes(IP)) {
        console.log(output + ' > BLACKLISTED')
        process.exit(1)
      } else {
        route()
      }
      console.log(output + ' > ' + req.method + ': ' + file)
      if (headers === "true") {
        console.log(
          'headers:\n' + JSON.stringify(req.headers) //All headers
          .replaceAll('\",\"', '\",\"\n  ') //Makes indents for new headers
          .replaceAll(';', ';\n    ') //Makes indents for new parts of header
          .replaceAll(':', ' : ') //Makes value/key differance easier to see
          .replace('{', '{\n')
          .slice(0,-1) + '\n}'
        )
      }
      next()
    } else {
      if ((blacklist.split(/[ ;]+/)).includes(IP)) {
        console.log('Request: ' + IP + ' > BLACKLISTED')
        process.exit(1)
      } else {
        route()
      }
      next()
    }
  })
} else {
  route()
}
