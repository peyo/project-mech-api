const xss = require("xss");
const moment = require("moment");

const CommentsService = {
  getAllComments(db) {
    return db
      .from("comments")
      .select(
        "comments.id",
        "comments.comment",
        "comments.date_created",
        "comments.date_modified",
        "comments.vinmake_id",
        "comments.dtc_id",
        "comments.user_id"
      )
      .leftJoin("vinmake", "comments.vinmake_id", "vinmake.id")
      .leftJoin("dtc", "comments.dtc_id", "dtc.id")
      .leftJoin("users", "comments.user_id", "users.id");
  },
  getById(db, id) {
    return db
      .from("comments")
      .select("*")
      .where("id", id)
      .then((rows) => {
        return rows[0];
      });
  },
  postComment(db, newComment) {
    return db
      .insert(newComment)
      .into("comments")
      .returning("*")
      .then(([comment]) => comment);
  },
  deleteComment(db, id) {
    return db("comments").where({ id }).delete();
  },
  updateComment(db, id, newComment) {
    return db("comments").where({ id }).update(newComment);
  },
  serializeComment(comment, nickname) {
    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: moment(new Date(comment.date_created)).calendar(),
      vinmake_id: comment.vinmake_id,
      dtc_id: comment.dtc_id,
      user_id: {
        id: comment.user_id,
        nickname: nickname,
      },
    };
  },
};

module.exports = CommentsService;
