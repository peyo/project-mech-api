const CommentsService = {
  getById(db, id) {
    return db
      .from("comments AS comm")
      .select(
        "comm.id",
        "comm.comment",
        "comm.date_created",
        "comm.date_modified",
        "comm.make_id",
        "comm.dtc_id",
        "comm.user_id",
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  user.id,
                  user.username,
                  user,nickname,
                  user.date_created
              ) tmp)
            )
          )`
        )
      )
      .leftJoin("users", "comm.user_id", "user.id")
      .where("comm.id", id)
      .first();
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into("comments")
      .returning("*")
      .then((comment) => comment)
      .then(comment => 
        CommentsService.getById(db, comment.id)
      )
  },

  deleteComment(db, id) {
    return db("comments").where({ id }).delete();
  },

  updateComment(db, id, newCommentFields) {
    return db("comments").where({ id }).update(newCommentFields);
  },

  serializeComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      comment: filterXSS(comment.comment),
      date_created: new Date(comment.date_created),
      date_modified: new Date(comment.date_modified) || null,
      make_id: comment.make_id,
      dtc_id: comment.dtc_id,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        date_created: new Date(user.date_created)
      }
    }
  }
};

module.exports = CommentsService;
