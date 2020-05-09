const MakeService = {
  getAllMake(db) {
    return db.select('*').from('make')
  },

  getById(db, id) {
    return db
      .from('make')
      .select('*')
      .where('id', id)
      .first()
  }
}

module.exports = MakeService