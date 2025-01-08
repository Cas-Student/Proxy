import express from 'express'
import config from '../config.js'
export const dev = express.Router()

//Checks if user exists
dev.use((req, res, next) => {
  if (req.method == 'GET') {
    next()
  }
  if (typeof req.body.user !== 'undefined') {
    if (typeof req.body.name !== 'undefined') {
      req.body.user += '@' + req.body.name
    }
  next()
  } else {
    res.redirect('/buffer')
  }
})

//Checks if request was made by a set user
dev.use((req, res, next) => {
  if (typeof dev.Accounts === 'undefined' || req.method == 'GET') {
    next()
  }
  let user = req.body.user
  user = user.split('@')
  if (user[0] in dev.Accounts) {
    next()
  } else {
    console.log('Error loging in... ' + JSON.stringify(req.body))
    res.status(422).json({error: 'user not found', user: user[0]})
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
  if (req.method == 'GET') {
    next()
  }
  const user = req.body.user
  if (user.split('@')[0] in config.bufferArray) {
    res.redirect('/buffer')
  } else {
  next()
  }
})

//User validation
dev.post('/validate-user', async(req, res) => {
    console.log('Validate User')
    if (req.method == 'POST') {
      try {
        await dev.client.connect()
        const database = dev.client.db("Accounts")
        const db = database.collection("Information")
        const cursor = db.find()
        await cursor.forEach(doc => {
          const user = (req.body.user).split('@')[0]
          let data = (user in doc) ? doc[user] : {error: `Could not find: "${req.body.user}"`}
          if (!('error' in data)) {
            let msg = {}
            msg[req.body.name] = (data.name = req.body.name)
            msg[req.body.password] = (data.password = req.body.password)
            msg.status = data.status
            console.log(req.body.user + ' attempted to log in')
            res.status(200).json(msg)
          } else {
            console.log('Body: ' + JSON.stringify(req.body))
            console.log('Response' + JSON.stringify(data))
            res.status(404).json(data)
          }
        })
      } catch (error) {
        res.status(500).json({error: error.message})
      } finally {
        try {
          await dev.client.close(false)
         } catch (error) {
          console.log(error)
        }
      }
    } else {
      res.status(403).json({error: `Method: ${req.method} is not supported`})
    }
  })
  
  //Records search history
  dev.post('/insert-database', async(req, res) => {
    console.log('Insert: ' + JSON.stringify(req.body))
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
      await dev.client.connect()
      const database = dev.client.db('Accounts')
      const db = database.collection('Users')
      db.insertOne(data)
      if (data.user) {
        res.redirect('/?search=' + req.body.is)
      } else {
        res.end()
      }
    } catch (error) {
      res.status(500).json({error: error.message})
    } finally {
      try {
        await dev.client.close(false)
       } catch (error) {
        console.log(error)
      }
    }
  })
  
  //Server and localStorage
  dev.use('/storage', async(req, res) => {
    if (req.method == 'POST') {
      try {
        await dev.client.connect()
        const database = dev.client.db('Accounts')
        const db = database.collection('Storage')
        if (req.body.action == 'Send') {
          console.log('Sending to storage...' + req.body.user)
          db.insertOne({user: req.body.user, storage: req.body.storage, date: new Date()})
          res.status(200)
          console.log('Sent...' + req.body.user)
        } else if (req.body.action == 'Recieve') {
          console.log('Sending to dev.client...' + req.body.user)
          let d
          let array = []
          await db.find({user: req.body.user}).sort().forEach(doc => {
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
        try {
          await dev.client.close(false)
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      res.status(403).json({error: `Method: ${req.method} is not supported`})
    }
})

export function tracker(app, options = {}) {
  let last = ''
  app.all('*', (req, res, next) => {
    let file = req.path
    if (file == '/ads.txt' || file == '/robots.txt') {
      res.status(404)
    }
    let IP = req.headers["x-forwarded-for"]
    if (
      (options.debug === 'true') ||
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
      for (let user in dev.Accounts) {
        if ("ip" in dev.Accounts[user]) {
          if (dev.Accounts[user]["ip"] === IP) {
              output += 'Request from: ' + user
              logged = true
            }
          }
        }
        if (!logged) {
          output += 'Request: ' + IP
        }
        if (file.substring(2, 7) != 'ADMIN') {
          if (file.charAt(1) !== '$') {
            console.log(output + ' > ' + req.method + ': ' + file)
          } else {
            file = file.replaceAll('%20', ' ')
            console.log(output + ' > ' + file.substring(2))
          }
        }
        if (options.headers === "true") {
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
      }
  })
}
