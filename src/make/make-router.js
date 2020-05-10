const express = require("express");
const MakeService = require("./make-service");
const { requireAuth } = require('../middleware/jwt-auth');

const makeRouter = express.Router();

makeRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
  const knexInstance = req.app.get("db");
  MakeService.getAllMake(knexInstance)
    .then((make) => {
      res.json(make.map(MakeService.serializeMake));
    })
    .catch(next);
});

makeRouter
  .route("/:make_id")
  .all(requireAuth)
  .all(checkMakeExists)
  .all((req, res, next) => {
    MakeService.getById(req.app.get("db"), req.params.make_id)
      .then((make) => {
        if (!make) {
          return res.status(404).json({
            error: { message: `Make doesn't exist.` },
          });
        }
        res.make = make;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(MakeService.serializeMake(res.make));
  });

async function checkMakeExists(req, res, next) {
  try {
    const make = await MakeService.getById(
      req.app.get('db'),
      req.params.make_id
    )

    if (!make)
      return res.status(404).json({
        error: `Make doesn't exist`
      })

    res.make = make
    next()
  } catch (error) {
    next(error)
  }
}


module.exports = makeRouter;
