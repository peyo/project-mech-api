const express = require("express");
const DtcService = require("./dtc-service");

const dtcRouter = express.Router();

dtcRouter.route("/").get((req, res, next) => {
  DtcService.getAllDtc()
    .then((dtc) => {
      res.json(dtc.map(DtcService.serializeDtc));
    })
    .catch(next);
});

dtcRouter
  .route("/:dtc_id")
  .all(checkDtcExists)
  .get((req, res, next) => {

    DtcService.getById(req.params.dtc_id)
      .then((dtc) => {
        if (!dtc) {
          return res.status(404).json({
            error: {
              message: `DTC doesn't exist`,
            },
          });
        }
        res.dtc = dtc;
        next();
      })
      .then(() => {
        res.json(DtcService.serializeDtcById(res.dtc));
      })
      .catch(next);
  });

dtcRouter.route("/:dtc_id/comments/").get((req, res, next) => {
  DtcService.getCommentsForDtc(req.params.dtc_id)
    .then((comments) => {
      res.json(comments.map(DtcService.serializeDtcComment));
    })
    .catch(next);
});

async function checkDtcExists(req, res, next) {
  try {

    const dtc = await DtcService.getById(req.params.dtc_id);

    if (!dtc)
      return res.status(404).json({
        error: {
          message: `DTC doesn't exist.`,
        },
      });

    res.dtc = dtc;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = dtcRouter;
