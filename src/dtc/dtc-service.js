const xss = require("xss");

const DTCService = {
  getAllDTC(db) {
    return db
      .from("dtc")
      .select(
        "dtc.id",
        "dtc.dtc",
        "dtc.description",
        "dtc.make",
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
        "comm.make",
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
      .where("comm.dtc_id", dtc_id)
      .leftJoin("users", "comm.username", "users.id")
      .groupBy("comm.id", "users.id");
  },

  serializeDTC(dtc) {
    return {
      id: dtc.id,
      dtc: dtc.dtc,
      description: dtc.description,
      make: dtc.make,
      number_of_comments: Number(dtc.number_of_comments) || 0,
    };
  },

  serializeDTCComment(comment) {
    const { user } = comment;
    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: new Date(comment.date_created),
      date_modified: new Date(comment.date_modified) || null,
      make: comment.make,
      dtc_id: comment.dtc_id,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        date_created: new Date(user.date_created),
      },
    }
  },
}

module.exports = DTCService;
