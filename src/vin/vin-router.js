const express = require("express");
const VINService = require("./vin-service");
const { requireAuth } = require("../middleware/jwt-auth");

const vinRouter = express.Router();

vinRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    VINService.getAllVIN(knexInstance)
      .then((vin) => {
        res.json(vin.map(VINService.serializeVIN));
      })
      .catch(next);
  });

vinRouter
  .route("/:vin_id")
  .all(requireAuth)
  .all(checkVINExists)
  .all((req, res, next) => {
    VINService.getById(req.app.get("db"), req.params.vin_id)
      .then((vin) => {
        if (!vin) {
          return res.status(404).json({
            error: { message: `VIN doesn't exist.` },
          });
        }
        res.vin = vin;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(VINService.serializeVIN(res.vin));
});


async function checkVINExists(req, res, next) {
  try {
    const vin = await VINService.getById(
      req.app.get('db'),
      req.params.vin_id
    )

    if (!vin)
      return res.status(404).json({
        error: `VIN doesn't exist.`
      })

    res.vin = vin
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = vinRouter;
