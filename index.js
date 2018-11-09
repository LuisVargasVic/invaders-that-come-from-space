const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const dbName = "invadersDB"

let dbUrl = `mongodb://invaderUser:invaderPass@cluster0-shard-00-00-lxnbj.mongodb.net:27017,cluster0-shard-00-01-lxnbj.mongodb.net:27017,cluster0-shard-00-02-lxnbj.mongodb.net:27017/${dbName}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`

mongoose.connect(dbUrl, {useNewUrlParser: true}, (err) => {
    if (err) {
        console.log('Error connecting to the database: ', process.env.MONGO_DB, "\n", err)
    }
    else {
        console.log(`Connected to Database: ${dbName}\n`)
    }
})

let db = mongoose.connection

db.on('error', (err) => {
    console.log("err:", err)
    console.error.bind(console, 'MongoDB connection error:')
})

const PORT = process.env.PORT || 8080
process.env.BASE_PORT = PORT

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'invaders-front')))
app.use(express.static(path.join(__dirname, 'invaders-front', 'css')))
app.use(express.static(path.join(__dirname, 'invaders-front', 'js')))
app.use(express.static(path.join(__dirname, 'invaders-front', 'js', 'lib')))

if (process.env.IS_LOCALHOST) {
    app.use(cors({
        credentials: true,
        origin: (origin, callback) => {
            // check if origin is valid here. If valid, return null.
            callback(null, true)
        }
    }))
} else {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
    })
}

app.use('/', require('./routes/staticRouter.js'))
app.use('/api', require('./routes/apiRouter.js'))

// Start server only after DB is connected
db.once('open', () => {
    console.log("DB Connected...")
    http.createServer(app).listen(PORT, () => {
        console.log(`Listening on port ${PORT} . . .\n`)
    })
})