//Imports
console.log("Loading imports...");
import { MongoClient } from "mongodb"
import { Server } from 'socket.io'
import express from 'express'
import http from 'node:http'
import { createBareServer } from '@tomphttp/bare-server-node'
import path from 'node:path'
import cors from 'cors'
import config from './config.js'
import { msg } from  './routes/msg.js'
import { dev, tracker } from'./routes/system.js'
import os from 'os'
console.log("Done");

const __dirname = process.cwd()
const server = http.createServer()
const app = express(server)
const bareServer = createBareServer('/o/')
const PORT = process.env.PORT || 8080
const socket = io(os.hostname + ':' + PORT, {transports: ['websocket']})
console.log(socket)
console.log("Running on port: " + PORT);

//Stored Accounts
let Accounts = {}

const username = encodeURIComponent("userProbe")
const password = encodeURIComponent(process.env.dbPassword || '1Q3W5E7R9T2Y4U6I8O0P')
const cluster = "hacker-hub.vd4tq.mongodb.net"
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Hacker-Hub`
const client = new MongoClient(uri)
dev.client = client

try {
  await client.connect()
  const database = client.db("Accounts")
  const db = database.collection("Information")
  const cursor = db.find()
  await cursor.forEach(doc => Accounts = doc)
} catch {
  Accounts = {User: {name: 'name'}}
} finally {
  try {
    await client.close(false)
  } catch (e) {
    console.log(e)
  }
}

console.log('--------------------')
console.log('      Accounts      ')
console.log('--------------------')
for (let user in Accounts) {
  console.log(user + ' | ' + Accounts[user]['name'])
  console.log('--------------------')
}
dev.Accounts = Accounts

console.log("Loading dependencies...")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))
console.log("Done");

console.log('Loading routes...')
app.use('/dev', dev) //Route to /dev - system directory
app.use('/msg', msg) //Route to /msg - messages
config.routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, 'static', route.file))
  })
})
console.log('Done')

if (process.env.tracker || true) {
  tracker(app, {
    debug: process.env.debug || "true",
    headers: process.env.headers || "false"
  })
}

server
.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res)
  } else {
    app(req, res)
  }
})
.on('upgrade', (req, socket, head) => {
  console.log('Server upgrading')
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head)
  } else {
    socket.end()
  }
})
.on('listening', () => {
  console.log(`Running at http://localhost:${PORT}`)
})
.listen({
  port: PORT,
})

/*
socket
.on('connect', () => {
  console.log('Connected to:', socket.id)
})
.on('connect_error', (err) => {
  console.log('socket.io connect error:', err)
})
*/

const io = new Server(server, {
  cors: {
      origin: '*'
  }
})
io.on('connection', (socket) => {
  console.log('user connected: ', socket.id)
  socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id)
  })
})
