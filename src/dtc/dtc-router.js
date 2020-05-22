const express = require("express");
const DtcService = require("./dtc-service");
const { requireAuth } = require("../middleware/jwt-auth");

const dtcRouter = express.Router();
const jsonParser = express.json();

dtcRouter
  .route("/")
  .get((req, res, next) => {
  DtcService.getAllDtc(req.app.get("db"))
    .then((dtc) => {
      res.json(dtc.map(DtcService.serializeDtc));
    })
    .catch(next);
});

dtcRouter
  .route("/:dtc_id")
  .get((req, res, next) => {
    DtcService.getDtcById(
      req.app.get("db"),
      req.params.dtc_id)
      .then((dtc) => {
        if (!dtc) {
          return res.status(404).json({
            error: { message: `DTC doesn't exist` },
          });
        }
        res.dtc = dtc;
        next();
      })
      .then(() => {
        res.json((DtcService.serializeDtcById(res.dtc)));
      })
      .catch(next);
  })

dtcRouter
  .route("/:dtc_id/comments/")
  .get((req, res, next) => {
    DtcService.getCommentsForDtc(
      req.app.get("db"),
      req.params.dtc_id
    )
      .then((comments) => {
        res.json(comments.map(DtcService.serializeDtcComment));
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      comment,
      date_created,
      date_modified,
      vinmake_id,
      dtc_id,
      user_id,
    } = req.body;
    const commentToUpdate = { comment, vinmake_id, dtc_id, user_id };

    const numberOfValues = Object.values(commentToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain a comment.`,
        },
      });
    }

    commentToUpdate.date_created = date_created;
    commentToUpdate.date_modified = date_modified;

    DtcService.updateComment(
      req.app.get("db"),
      req.params.dtc_id,
      commentToUpdate
    )

      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkDtcExists(req, res, next) {
  try {
    const dtc = await DtcService.getById(req.app.get("db"), req.params.dtc_id);

    if (!dtc)
      return res.status(404).json({
        error: `DTC doesn't exist.`,
      });

    res.dtc = dtc;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = dtcRouter;
