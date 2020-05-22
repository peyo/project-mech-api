const express = require("express");
const VinMakeService = require("./vinmake-service");
const { requireAuth } = require("../middleware/jwt-auth");

const vinMakeRouter = express.Router();

vinMakeRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    VinMakeService.getAllVinMake(
      req.app.get("db")
    )
      .then((vinmake) => {
        res.json(vinmake.map(VinMakeService.serializeVinMake));
      })
      .catch(next);
  });

vinMakeRouter
  .route("/:vinmake_id")
  .all(requireAuth)
  .all(checkVinMakeExists)
  .all((req, res, next) => {
    VinMakeService.getById(
      req.app.get("db"),
      req.params.vinmake_id
    )
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
    res.json(VinMakeService.serializeVinMake(res.vinmake));
});


async function checkVinMakeExists(req, res, next) {
  try {
    const vinmake = await VinMakeService.getById(
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
