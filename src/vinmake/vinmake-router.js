const express = require("express");
const VINMakeService = require("./vinmake-service");
const { requireAuth } = require("../middleware/jwt-auth");

const vinMakeRouter = express.Router();

vinMakeRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    VINMakeService.getAllVINMake(knexInstance)
      .then((vinmake) => {
        res.json(vinmake.map(VINMakeService.serializeVINMake));
      })
      .catch(next);
  });

vinMakeRouter
  .route("/:vinmake_id")
  .all(requireAuth)
  .all(checkVINMakeExists)
  .all((req, res, next) => {
    VINMakeService.getById(req.app.get("db"), req.params.vinmake_id)
      .then((vinmake) => {
        if (!vinmake) {
          return res.status(404).json({
            error: { message: `VIN and Make don't exist.` },
          });
        }
        res.vinmake = vinmake;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(VINMakeService.serializeVINMake(res.vinmake));
});


async function checkVINMakeExists(req, res, next) {
  try {
    const vinmake = await VINMakeService.getById(
      req.app.get('db'),
      req.params.vinmake_id
    )

    if (!vinmake)
      return res.status(404).json({
        error: `VIN and Make don't exist.`
      })

    res.vinmake = vinmake
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = vinMakeRouter;
