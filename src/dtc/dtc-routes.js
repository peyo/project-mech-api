const express = require('express')
const DTCService = require('./dtc-service')

const dtcRouter = express.Router()

const serializeDTC = dtc => ({
  id: dtc.id,
  dtc: dtc.dtc,
  description: dtc.description,
  make_id: dtc.make_id
})

dtcRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    DTCService.getAllDTC(knexInstance)
      .then(dtc => {
        res.json(dtc.map(serializeDTC))
      })
      .catch(next)
  })

dtcRouter
  .route('/:dtc_id')
  .all((req, res, next) => {
    DTCService.getById(
      req.app.get('db'),
      req.params.dtc_id
    )
      .then(dtc => {
        if (!dtc) {
          return res.status(404).json({
            error: { message: `DTC doesn't exist.` }
          })
        }
        res.dtc = dtc
        next()
      })
      .catch(next)
  })

module.exports = dtcRouter