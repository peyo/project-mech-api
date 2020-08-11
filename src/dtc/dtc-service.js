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
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  vinmake.id,
                  vinmake.make_vin,
                  vinmake.short_vin
              ) tmp)
            )
          ) AS "vinmake"`
        ),
        db.raw(`count(DISTINCT comments) AS number_of_comments`)
      )
      .leftJoin("vinmake", "dtc.vinmake_id", "vinmake.id")
      .leftJoin("comments", "dtc.id", "comments.dtc_id")
      .groupBy("dtc.id", "vinmake.id");
  },
  getById(db, dtc_id) {
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
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  vinmake.id,
                  vinmake.make_vin,
                  vinmake.short_vin
              ) tmp)
            )
          ) AS "vinmake"`
        ),
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  dtc.id,
                  dtc.dtc,
                  dtc.description
              ) tmp)
            )
          ) AS "dtc"`
        ),
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
      .where("comments.dtc_id", dtc_id)
      .leftJoin("vinmake", "comments.vinmake_id", "vinmake.id")
      .leftJoin("dtc", "comments.dtc_id", "dtc.id")
      .leftJoin("users", "comments.user_id", "users.id")
      .groupBy("comments.id", "vinmake.id", "dtc.id", "users.id");
  },
  serializeDtc(dtc) {
    const { vinmake } = dtc;
    return {
      id: dtc.id,
      dtc: dtc.dtc,
      description: dtc.description,
      vinmake_id: {
        id: vinmake.id,
        make_vin: vinmake.make_vin,
        short_vin: vinmake.short_vin,
      },
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
    const { user, vinmake, dtc } = comment;
    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: moment(new Date(comment.date_created)).calendar(),
      date_modified: moment(new Date(comment.date_modified)).calendar() || null,
      vinmake_id: {
        id: vinmake.id,
        make_vin: vinmake.make_vin,
        short_vin: vinmake.short_vin,
      },
      dtc_id: {
        id: dtc.id,
        dtc: dtc.dtc,
        description: dtc.description,
      },
      user_id: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        date_created: moment(new Date(user.date_created)).calendar(),
      },
    };
  },
};

module.exports = DtcService;
