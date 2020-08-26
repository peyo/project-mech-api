const Karma = required('./models');

const KarmaService = {
  getByCommentId(comment) {
    return Karma.find({
      comment
    })
    // return db
    //   .from("karma")
    //   .select("*")
    //   .where("comment_id", id)
    //   .then((rows) => {
    //     return rows[0];
    //   });
  },
  getById(_id) {
    return Karma.findOne({
      _id
    })
    // return db
    //   .from("karma")
    //   .select("*")
    //   .where("id", id)
    //   .then((rows) => {
    //     return rows[0];
    //   });
  },
  updateKarma(_id, newKarma) {
    return Karma.findOneAndUpdate({
      _id
    },
    {
      $set: newKarma
    })
    // return db
    //   .from("karma")
    //   .where({ id })
    //   .update(newKarma);
  },
  insertKarma(newKarma) {
    return Karma.create(newKarma)
    // return db
    //   .insert(newKarma)
    //   .into("karma")
    //   .return("*")
    //   .then((rows) => {
    //     return rows[0];
    //   });
  }
}

module.exports = KarmaService;