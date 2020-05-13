const express = require('express')
const DTCService = require('./dtc-service')
const { requireAuth } = require('../middleware/jwt-auth')

const dtcRouter = express.Router()
const jsonParser = express.json();

dtcRouter
  .route('/')
  .get((req, res, next) => {
    DTCService.getAllDTC(req.app.get('db'))
      .then(dtc => {
      res.json(dtc.map(DTCService.serializeDTC))
      })
    .catch(next)
  })

dtcRouter
  .route('/:dtc_id')
  .get((req, res) => {
    res.json(DTCService.serializeDTC(res.dtc))
  })

dtcRouter
  .route('/:dtc_id/comments/')
  .get((req, res, next) => {
    DTCService.getCommentsForDTC(
      req.app.get('db'),
      req.params.dtc_id
    )
      .then(comments => {
          res.json(comments.map(DTCService.serializeDTCComment))
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    DTCService.deleteCommentInDTC(
      req.app.get('db'),
      req.params.dtc_id
    )
      .then(() => {
      res.status(204).end()
      })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { comment, date_created, date_modified, vinmake_id, dtc_id, user_id } = req.body
    const commentToUpdate = { comment, vinmake_id, dtc_id, user_id }

    const numberOfValues = Object.values(commentToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain a comment.`
        }
      })
    }

    commentToUpdate.date_created = date_created;
    commentToUpdate.date_modified = date_modified;

    DTCService.updateComment(
      req.app.get('db'),
      req.params.dtc_id,
      commentToUpdate
    )

      .then(numRowsAffected => {
      res.status(204).end()
      })
      .catch(next)
  })

async function checkDTCExists(req, res, next) {
  try {
    const dtc = await DTCService.getById(
      req.app.get('db'),
      req.params.dtc_id
    )

    if (!dtc)
      return res.status(404).json({
        error: `DTC doesn't exist.`
      })

    res.dtc = dtc
    next()
  } catch (error) {
    next(error)
  }
}


module.exports = dtcRouter