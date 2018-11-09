const Router = require('express').Router
const Score = require('../models/score')

var apiRouter = Router()

apiRouter.route('/score')
    .get((req, res, next) => {
        Score.find({}).sort({ score: -1 })
            .then(
                (val) => {
                    res.status(200)
                    res.json(val)
                }
            ).catch(
                (err) => {
                    console.log('Error: ', err)
                    res.status(500)
                    res.json()
                }
            )
    })
    .post((req, res, next) => {
        let body = req.body
        let response = { body }
        // res.json(body)
        let newScore = new Score(body);
        newScore.save()
            .then(
                (val) => {
                    res.status(200)
                    res.json(val)
                }
            )
            .catch(
                (err) => {
                    console.log('Error: ', err)
                    res.status(500)
                    res.json()
                }
            )
    })

module.exports = apiRouter