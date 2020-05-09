const express = require('express')
const DTCService = require('./dtc-service')

const dtcRouter = express.Router()

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

dtcRouter
  .route(':dtc_id/comments/')
  .all(checkDTCExists)
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
    const { comment, date_created, date_modified, make_id, dtc_id, user_id } = req.body
    const commentToUpdate = { comment, make_id, dtc_id, user_id }

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
    commentToUpdate.date_created = date_created;

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

module.exports = dtcRouter