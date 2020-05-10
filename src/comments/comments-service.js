const xss = require('xss')

const CommentsService = {
  getAllComments(db) {
    return db
      .from("comments AS comm")
      .select(
        "comm.id",
        "comm.comment",
        "comm.date_created",
        "comm.date_modified",
        "comm.make_vin",
        "comm.dtc",
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  users.id,
                  users.username,
                  users.nickname,
                  users.date_created
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .leftJoin("users", "comm.user_id", "users.id")
      .groupBy("comm.id", "users.id");
  },

  getById(db, id) {
    return CommentsService.getAllComments(db)
      .where("comm.id", id)
      .first();
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into("comments")
      .returning("*")
      .then((comment) => comment)
      .then((comment) => CommentsService.getById(db, comment.id));
  },

  deleteComment(db, id) {
    return db("comments").where({ id }).delete();
  },

  updateComment(db, id, newCommentFields) {
    return db("comments").where({ id }).update(newCommentFields);
  },

  serializeComment(comment) {
    const { user } = comment;
    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: new Date(comment.date_created),
      date_modified: new Date(comment.date_modified) || null,
      make: comment.make_vin,
      dtc: comment.dtc,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        date_created: new Date(user.date_created),
      },
    };
  },
};

module.exports = CommentsService;
