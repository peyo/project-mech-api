const xss = require("xss");
const moment = require("moment");

const CommentsService = {
  getAllComments(db) {
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
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  dtc.id,
                  dtc.dtc,
                  dtc.description,
                  dtc.vinmake_id
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
      .leftJoin("vinmake", "comm.vinmake_id", "vinmake.id")
      .leftJoin("dtc", "comm.dtc_id", "dtc.id")
      .leftJoin("users", "comm.user_id", "users.id")
      .groupBy("comm.id", "vinmake.id", "dtc.id", "users.id");
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
      .then(([comment]) => comment)
      .then((comment) => CommentsService.getById(db, comment.id));
  },

  deleteComment(db, id) {
    return db("comments")
      .where({ id })
      .delete();
  },

  updateComment(db, id, newCommentFields) {
    return db("comments")
      .where({ id })
      .update(newCommentFields);
  },

  serializeComment(comment) {
    const { user, dtc, vinmake } = comment;
    return {
      id: comment.id,
      comment: xss(comment.comment),
      date_created: moment(new Date(comment.date_created))
        .calendar(),
      date_modified:
        moment(new Date(comment.date_modified))
          .calendar() || null,
      vinmake_id: {
        id: vinmake.id,
        make_vin: vinmake.make_vin,
        short_vin: vinmake.short_vin,
      },
      dtc_id: {
        id: dtc.id,
        dtc: dtc.dtc,
        description: dtc.description,
        vinmake_id: dtc.vinmake_id,
      },
      user_id: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        date_created:
          moment(new Date(user.date_created))
            .format()
      },
    };
  },
};

module.exports = CommentsService;
