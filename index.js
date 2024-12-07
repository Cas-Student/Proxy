const bufferArray = ['Cas']

//ENV Vars
const blacklist = process.env.blacklist || ""; //Blacklisted IPs
const debug = process.env.debug || "true";
const headers = process.env.headers || "false";
const tracker = process.env.tracker || "true";

//Imports
console.log("loading imports...");
import { MongoClient } from "mongodb";
import express from 'express'
import http from 'node:http'
import { createBareServer } from '@tomphttp/bare-server-node'
import path from 'node:path'
import cors from 'cors'
import config from './config.js'
import exec from 'child_process'
console.log("Done");

const __dirname = process.cwd()
const server = http.createServer()
const app = express(server)
const bareServer = createBareServer('/o/')
const PORT = process.env.PORT || 8080
console.log("Running on port: " + PORT);

//Stored Accounts
let Accounts = {}

const username = encodeURIComponent("userProbe")
const password = encodeURIComponent(process.env.dbPassword || 'qaANtuGAGx23eM10')
const cluster = "hacker-hub.vd4tq.mongodb.net"
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Hacker-Hub`
const client = new MongoClient(uri)

try {
  await client.connect()
  const database = client.db("Accounts")
  const ratings = database.collection("Information")
  const cursor = ratings.find()
  await cursor.forEach(doc => Accounts = doc)
} catch {
  Accounts = {}
} finally {
  await client.close();
}

console.log('--------------------')
console.log('      Accounts      ')
console.log('--------------------')
for (let user in Accounts) {
  console.log(user + ' | ' + Accounts[user]['name'])
  console.log('--------------------')
}

console.log("Loading routes")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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
      { path: '/buffer', file: 'buffer.html' }
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
      for (let user in Accounts) {
        if ("ip" in Accounts[user]) {
          if (Accounts[user]["ip"] === IP) {
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
      }2
      if (file.substring(2, 8) != 'ADMIN@') {
        if (file.charAt(1) !== '$') {
          console.log(output + ' > ' + req.method + ': ' + file)
        } else {
          file = file.replaceAll('%20', ' ')
          console.log(output + ' > ' + file.substring(2))
        }
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

/*
const username = encodeURIComponent("userProbe")
const password = encodeURIComponent(process.env.dbPassword)
const cluster = "hacker-hub.vd4tq.mongodb.net"
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Hacker-Hub`
const client = new MongoClient(uri)
*/

//Route to /dev - system directory
const dev = express.Router()
app.use('/dev', dev)

//Checks if user exists
dev.use((req, res, next) => {
  if (req.method == 'GET') next()
  const user = req.body.user
  if (typeof req.body.user !== 'undefined') {
    if (typeof req.body.name !== 'undefined') {
      req.body.user += '@' + req.body.name
    }
    next()
  } else {
    res.status(422).json({error: 'No user provided'})
  }
})

//Checks if request was made by a set user
dev.use((req, res, next) => {
  if (req.method == 'GET') next()
  const user = req.body.user
  if (user.split('@')[0] in Accounts) {
    next()
  } else {
    res.status(422).json({error: 'user not found', user: user.split('@')[0]})
  }
})

//Reduces requests
let lastRequest, lastMinute
dev.use((req, res, next) => {
  if (req != lastRequest) {
    lastRequest = req
    lastMinute = new Date().getMinutes()
    next()
  } else if(lastMinute = new Date().getMinutes()) {
    lastRequest = req
    lastMinute = new Date().getMinutes()
    next()
  } else {
    console.log(`Spam request from: ${req.body.user}`)
    res.send(JSON.stringify({error: 'Request made too soon!'}))
  }
})

//Checks user's buffer state
dev.use((req, res, next) => {
  if (req.method == 'GET') next()
  const user = req.body.user
  if (user.split('@')[0] in bufferArray) {
    res.redirect('/buffer')
  } else {
    next()
  }
})

//User validation
dev.post('/validate-user', async(req, res) => {
  if (req.method == 'POST') {
    try {
      await client.connect()
      const database = client.db("Accounts")
      const ratings = database.collection("Information")
      const cursor = ratings.find()
      await cursor.forEach(doc => {
        let data = (req.body.user in doc) ? doc[req.body.user] : {error: `Could not find: "${req.body.user}"`}
        if (!('error' in data)) {
          let msg = {}
          msg[req.body.name] = (data.name = req.body.name)
          msg[req.body.password] = (data.password = req.body.password)
          msg.status = data.status
          console.log(req.body.user + ' attempted to log in')
          res.status(200).json(msg)
        } else {
          res.status(404).json(data)
        }
      })
    } catch (error) {
      res.status(500).json({error: error.message})
    } finally {
      await client.close(true);
    }
  } else {
    res.status(403).json({error: `Method: ${req.method} is not supported`})
  }
})

//Records search history
dev.post('/insert-database', async(req, res) => {
  let data = {}
  data['user'] = req['body']['user']
  if (typeof req.body.is !== 'undefined') {
    data['searched'] = req['body']['is']
  } else if (typeof req.body.opened !== 'undefined') {
    data['opened'] = req.body.opened
  } else {
    console.log(`Error in ${req.body.user}'s request: ${req.body}`)
  }
  data['website'] = req.headers.host
  data['date'] = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"long", day:"numeric", hour: "numeric", minute: 'numeric', second: 'numeric'})
  try {
    await client.connect()
    const database = client.db('Accounts')
    const ratings = database.collection('Users')
    ratings.insertOne(data)
    if (data.user) {
      res.redirect('/?search=' + req.body.is)
    } else {
      res.end()
    }
  } catch (error) {
    res.status(500).json({error: error.message})
  } finally {
    try {
      await client.close(false)
    } catch (error) {
      console.log(error)
    }
  }
})

//Server and localStorage
dev.use('/storage', async(req, res) => {
  if (req.method == 'POST') {
    try {
      await client.connect()
      const database = client.db('Accounts')
      const ratings = database.collection('Storage')
      if (req.body.action == 'Send') {
        console.log('Sending to storage...' + req.body.user)
        ratings.insertOne({user: req.body.user, storage: req.body.storage, date: new Date()})
        res.status(200)
        console.log('Sent...' + req.body.user)
      } else if (req.body.action == 'Recieve') {
        console.log('Sending to client...' + req.body.user)
        let d
        let array = []
        await ratings.find({user: req.body.user}).sort().forEach(doc => {
          if (d > doc.date) {
            d = doc.date
          } else if (typeof d === 'undefined') {
            d = doc.date
          }
          array.push(doc)
        })
        for (let key in array) {
          if (array[key]['date'] == d) {
            res.status(200).json(array[key]['storage'])
            console.log('Sent...' + req.body.user)
          }
        }
      } else {
        console.log('Action not found!')
        res.status(422).json({error: 'Action not found'})
      }
    } catch (error) {
      res.status(500).json({error: error.message})
    } finally {
      await client.close()
    }
  } else {
    res.status(403).json({error: `Method: ${req.method} is not supported`})
  }
})

//Route to /stat
const stat = express.Router()
app.use('/stat', stat)

//Data Charts
stat.get('/chart', (req, res) => {
  res.send(`<body style="background: #21313C"><div style="text-align: center"><iframe id='i' style="background: #21313C;border: none;" src="https://charts.mongodb.com/charts-project-0-uaxsvvj/embed/charts?id=fa3bfd96-4084-462b-b19f-f05cf4f0e7c4&maxDataAge=120&theme=dark&autoRefresh=true"></iframe></div><script>const frame = document.getElementById('i'); i.height = window.innerHeight; i.width = window.innerHeight * 4/3;</script>`)
})

const shell = express.Router()
dev.use('/shell', shell)

shell.post('/execute', (req, res) => {
  if (typeof req.body.command !== 'undefined' && typeof req.body.password !== 'undefined' && req.body.password == Accounts.Admin.password) {
    exec.exec(`echo ${req.body.command} >> commands.txt`)
    exec.exec(req.body.command, (error, stdout, stderr) => {
      if (error) {
        res.send(JSON.stringify({error: error}))
      }
      res.send(JSON.stringify({stdout: stdout, stderr: stderr}))
    })
  }
})
shell.get('/execute', (req, res) => {
  exec.exec('cat commands.txt', (error, stdout, stderr) => {
    if (error) {
      res.setHeader('Content-Type', 'text/plain')
      res.send(error)
    }
    res.setHeader('Content-Type', 'text/plain')
    res.send('------\nOutput\n------\n' + stdout.replace('\\\\n', '\\n') + '------\nERROR\n------' + stderr)
  })
})

const msg = express.Router()
app.use('/msg', msg)

msg.use('render', (req, res) => {
  res.send(new Date())
})
