const path = require('path')
const express = require('express')
const CarsService = require('./cars-service')
const { requireAuth } = require('../middleware/jwt-auth')

const carsRouter = express.Router()
const jsonParser = express.json()

carsRouter
  .route('/')
  .get((req, res, next) => {
    CarsService.getAllCars(req.app.get('db'))
      .then(cars => {
        res.json(cars.map(CarsService.serializeCar))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { make, model, vin, user_id, make_id, date_created } = req.body
    const newCar = { make, model, vin, user_id, make_id }
    
    for (const [key, value] of Object.entries(newCar)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.`}
        })
      }
    }

    newCar.date_created = date_created;

    CarsService.insertCar(
      req.app.get('db'),
      newCar
    )

      .then(car => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${car.id}`))
          .json(serializeCar(car))
      })
      .catch(next)
  })

carsRouter
  .route('/:car_id')
  .all(requireAuth)
  .all(checkCarExists)
  .get((req, res) => {
    res.json(CarsService.serializeCar(res.car))
  })
  .delete((req, res, next) => {
    CarsService.deleteDelete(
      req.app.get('db'),
      req.params.car_id
    )
      .then(numRowsAffected => {
      res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { make, model, vin, user_id, make_id, date_created } = req.body
    const carToUpdate = { make, model, vin, user_id, make_id }

    const numberOfValues = Object.values(carToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must container either 'make', 'model', or 'VIN'.`
        }
      })
    
    carToUpdate.date_created = date_created;
    
    CarsService.updateCar(
      req.app.get('db'),
      req.params.car_id,
      carToUpdate
    )
      .then(numRowsAffected => {
      res.status(204).end()
      })
      .catch(next)
  })

async function checkCarExists(req, res, next) {
  try {
    const car = await CarsService.getById(
      req.app.get('db'),
      req.params.car_id
    )

    if (!car)
      return res.status(404).json({
        error: `Car doesn't exist`
      })

    res.car = car
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = carsRouter