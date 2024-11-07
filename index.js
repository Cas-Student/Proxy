//ENV Vars
const blacklist = process.env.blacklist || ""; //Blacklisted IPs
const debug = process.env.debug || "false";
const headers = process.env.headers || "false";
const tracker = process.env.tracker || "true";
let pnpm = true // For Running pnpm
let users; // Pre-declares users
if (pnpm) {
  users = {"user":{"password":"passwd"}}; //All user data
} else {
  users = JSON.parse(process.env.users);
}

//Imports
console.log("loading imports...");
import { MongoClient } from "mongodb";
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
  let last = ''
  console.log("----------\nTracking\n----------");
  app.use((req, res, next) => {
    let file = req.path
    let IP = req.headers["x-forwarded-for"]
    if (
      (debug === 'true') ||
      (last != file) &&
      (
        !(file.substring(0, 4) === '/dy/') &&
        !(file.substring(0, 3) === '/m/') &&
        !(file.substring(0, 9) === '/bundles/') &&
        !(file.substring(0, 8) === '/assets/') &&
        !(file.substring(0, 3) === '/a/')
      )
    ) {
      last = file
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
      if (!logged) {
        output += 'Request: ' + IP
      }
      if ((blacklist.split(/[ ;]+/)).includes(IP)) {
        console.log(output + ' > BLACKLISTED')
        process.exit(1)
      } else {
        route()
      }
      if (file.charAt(1) !== '$') {
        console.log(output + ' > ' + req.method + ': ' + file)
      } else {
        file = file.replaceAll('%20', ' ')
        console.log(output + ' > ' + file.substring(2))
      }
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

const username = encodeURIComponent("userProbe")
const password = encodeURIComponent(process.env.dbPassword || 'SHHH')
const cluster = "hacker-hub.vd4tq.mongodb.net"
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Hacker-Hub`
const client = new MongoClient(uri)

app.get('/data', async(req, res) => {
  try {
    await client.connect()
    const database = client.db("Accounts")
    const ratings = database.collection("Users")
    const cursor = ratings.find()
    await cursor.forEach(doc => res.status(200).json(doc))
  } catch {
    res.status(500).json({message: error.message})
  } finally {
    await client.close();
  }
})
