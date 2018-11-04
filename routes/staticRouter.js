const Router = require('express').Router
const path = require('path')

var staticRouter = Router()

staticRouter.route('/')
    .get((req, res, next) => {
        res.status(200).sendFile(path.join(__dirname, '../invaders-front', 'gl-app-invaders.html'))
    })

module.exports = staticRouter