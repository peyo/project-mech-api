const path = require("path");
const express = require("express");
const CommentsService = require("./comments-service");
const { requireAuth } = require("../middleware/jwt-auth");
const commentsRouter = express.Router();
const jsonParser = express.json();

commentsRouter
  .route("/")
  .get((req, res, next) => {
    CommentsService.getAllComments(req.app.get("db"))
      .then((comments) => {
        res.json(comments.map(CommentsService.serializeComment));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { comment, date_created, vinmake_id, dtc_id } = req.body;
    const newComment = { comment, vinmake_id, dtc_id };

    for (const [key, value] of Object.entries(newComment))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    newComment.user_id = req.user.id;
    newComment.date_created = date_created;

    CommentsService.insertComment(
      req.app.get("db"),
      newComment
    )
      .then((comment) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(CommentsService.serializeComment(comment));
      })
      .catch(next);
  });

module.exports = commentsRouter;
