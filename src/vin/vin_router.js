const express = require('express')
const VINService = require('./vin-service')

const vinRouter = express.Router()

const serializeVIN = vin => ({
  id: vin.id,
  vin: vin.vin,
  make: vin.make
})

vinRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    VINService.getAllVIN(knexInstance)
      .then(vin => {
        res.json(vin.map(serializeVIN))
      })
      .catch(next)
  })

vinRouter
  .route('/:vin_id')
  .all((req, res, next) => {
    VINService.getById(
      req.app.get('db'),
      req.params.vin_id
    )
      .then(vin => {
        if (!vin) {
          return res.status(404).json({
            error: { message: `VIN doesn't exist.` }
          })
        }
        res.vin = vin
        next()
      })
      .catch(next)
  })

module.exports = vinRouter