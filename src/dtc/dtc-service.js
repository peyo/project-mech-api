const xss = require("xss");

const DTCService = {
  getAllDTC(db) {
    return db
      .from("dtc")
      .select(
        "dtc.id",
        "dtc.dtc",
        "dtc.description",
        "dtc.make_id",
        db.raw(`count(DISTINCT comm) AS number_of_comments`)
      )
      .leftJoin("comments AS comm", "dtc.id", "comm.dtc_id")
      .groupBy("dtc.id");
  },

  getById(db, id) {
    return DTCService.getAllDTC(db)
      .where("dtc.id", id)
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
      .leftJoin("users", "comm.user_id", "user.id")
      .groupBy("comm.id", "user.id");
  },

  serializeDTC(dtc) {
    return {
      id: dtc.id,
      dtc: dtc.dtc,
      dtc: dtc.description,
      dtc: make_id,
      number_of_comments: Number(dtc.number_of_comments) || 0,
    }
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
