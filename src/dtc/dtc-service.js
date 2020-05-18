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
        db.raw(`count(DISTINCT comm) AS number_of_comments`)
      )
      .leftJoin("vinmake", "dtc.vinmake_id", "vinmake.id")
      .leftJoin("comments AS comm", "dtc.id", "comm.dtc_id")
      .groupBy("dtc.id", "vinmake.id");
  },

  getDtcById(db, id) {
    return DTCService.getAllDTC(db).where("dtc.id", id).first();
  },

  getCommentsForDtc(db, dtc_id) {
    return db
      .from("comments AS comm")
      .select(
        "comm.id",
        "comm.comment",
        "comm.date_created",
        "comm.date_modified",
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
        "comm.dtc_id",
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
      .leftJoin("vinmake", "comm.vinmake_id", "vinmake.id")
      .leftJoin("users", "comm.user_id", "users.id")
      .groupBy("comm.id", "vinmake.id", "users.id");
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

  serializeDtcComment(comment) {
    const { user, vinmake } = comment;
    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: moment(new Date(comment.date_created))
        .startOf("day")
        .fromNow(),
      date_modified:
        moment(new Date(comment.date_modified))
          .startOf("day")
          .fromNow() || null,
      vinmake_id: {
        id: vinmake.id,
        make_vin: vinmake.make_vin,
        short_vin: vinmake.short_vin,
      },
      dtc_id: comment.dtc_id,
      user_id: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        date_created: new Date(user.date_created)
      },
    };
  },
};

module.exports = DtcService;
