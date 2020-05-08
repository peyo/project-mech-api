const express = require('express')
const MakeService = require('./make-service')

const makeRouter = express.Router()

const serializeMake = make => ({
  id: make.id,
  make: make.make
})

makeRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    MakeService.getAllMake(knexInstance)
      .then(make => {
        res.json(make.map(serializeMake))
      })
      .catch(next)
  })

makeRouter
  .route('/:make_id')
  .all((req, res, next) => {
    MakeService.getById(
      req.app.get('db'),
      req.params.make_id
    )
      .then(make => {
        if (!make) {
          return res.status(404).json({
            error: { message: `Make doesn't exist.` }
          })
        }
        res.make = make
        next()
      })
      .catch(next)
  })

module.exports = makeRouter