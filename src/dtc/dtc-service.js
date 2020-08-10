const xss = require("xss");
const moment = require("moment");

const DtcService = {
  getAllDtc(db) {
    return db
      .from("dtc")
      .select(
        "dtc.id",
        "dtc.dtc",
        "dtc.description",
        "dtc.vinmake_id",
        db.raw(`count(DISTINCT comments) AS number_of_comments`)
      )
      .leftJoin("vinmake", "dtc.vinmake_id", "vinmake.id")
      .leftJoin("comments", "dtc.id", "comments.dtc_id")
      .groupBy("dtc.id", "vinmake.id");
  },
  getDtcById(db, dtc_id) {
    return db
      .from("dtc")
      .select("*")
      .where("id", dtc_id)
      .then((rows) => {
        return rows[0];
      });
  },
  getCommentsForDtc(db, dtc_id) {
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
      .where("comments.dtc_id", dtc_id)
      .leftJoin("vinmake", "comments.vinmake_id", "vinmake.id")
      .leftJoin("dtc", "comments.dtc_id", "dtc.id")
      .leftJoin("users", "comments.user_id", "users.id")
      .groupBy("comments.id", "vinmake.id", "dtc.id", "users.id");
  },
  serializeDtc(dtc) {
    return {
      id: dtc.id,
      dtc: dtc.dtc,
      description: dtc.description,
      vinmake_id: dtc.vinmake_id,
      number_of_comments: Number(dtc.number_of_comments) || 0,
    };
  },
  serializeDtcById(dtc) {
    return {
      id: dtc.id,
      dtc: dtc.dtc,
      description: dtc.description,
      vinmake_id: dtc.vinmake_id,
    };
  },
  serializeDtcComment(comment) {
    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: moment(new Date(comment.date_created)).calendar(),
      date_modified: moment(new Date(comment.date_modified)).calendar() || null,
      vinmake_id: comment.vinmake_id,
      dtc_id: comment.dtc_id,
      user_id: comment.user_id,
    };
  },
};

module.exports = DtcService;
