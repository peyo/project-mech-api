const path = require("path");
const express = require("express");
const CarsService = require("./cars-service");
const { requireAuth } = require("../middleware/jwt-auth");

const carsRouter = express.Router();
const jsonParser = express.json();

carsRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    CarsService.getCarByUserId(req.app.get("db"), req.user.id)
      .then((cars) => {
        res.json(cars.map(CarsService.serializeCar));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { make, model, vinmake_id, date_created } = req.body;
    const newCar = { make, model, vinmake_id };

    for (const [key, value] of Object.entries(newCar)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.` },
        });
      }
    }

    newCar.date_created = date_created;
    newCar.user_id = req.user.id;

    CarsService.insertUserUniqueCar(req.app.get("db"), newCar)
      .then((car) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${car.id}`))
          .json(CarsService.serializeCar(car));
      })
      .catch(next);
  });

carsRouter
  .route("/:car_id")
  .all(checkCarExists)
  .all(requireAuth)
  .get((req, res, next) => {
    CarsService.getCarByUserId(req.app.get("db"), req.user.id)
      .then((cars) => {
        res.json(cars.map(CarsService.serializeCar));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    CarsService.deleteCarByCarId(req.app.get("db"), req.params.car_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkCarExists(req, res, next) {
  try {
    const car = await CarsService.getById(req.app.get("db"), req.params.car_id);

    if (!car)
      return res.status(404).json({
        error: {
          message: `Car doesn't exist.`,
        },
      });

    res.car = car;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = carsRouter;
