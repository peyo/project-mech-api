const xss = require("xss");

const DTCService = {
  getById(db, id) {
    return db.from("dtc").select("*")
      .where("id", id)
      .first();
  },

  getCommentsForDTC(db, dtc_id) {
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
                  user.nickname,
                  user.date_created
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .where("comm.dtc_id", dtc_id)
      .leftJoin(
        "users",
        "comm.user_id",
        "user.id"
      )
      .groupBy("comm.id", "user.id");
  },

  serializeDTCComments(comments) {
    const { user } = comments;
    return {
      id: comments.id,
      comment: xss(comments.comment),
      date_created: new Date(comments.date_created),
      date_modified: new Date(comments.date_modified) || null,
      make_id: comments.make_id,
      dtc_id: comments.dtc_id,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        date_created: new Date(user.date_created),
      },
    };
  },
};

module.exports = DTCService;
