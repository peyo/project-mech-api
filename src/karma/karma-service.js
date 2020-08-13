const KarmaService = {
  getByCommentId(db, id) {
    return db
      .from("karma")
      .select("*")
      .where("comment_id", id)
      .then((rows) => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .from("karma")
      .select("*")
      .where("id", id)
      .then((rows) => {
        return rows[0];
      });
  },
  updateKarma(db, id, newKarma) {
    return db
      .from("karma")
      .where({ id })
      .update(newKarma);
  },
  insertKarma(db, newKarma) {
    return db
      .insert(newKarma)
      .into("karma")
      .return("*")
      .then((rows) => {
        return rows[0];
      });
  }
}

module.exports = KarmaService;