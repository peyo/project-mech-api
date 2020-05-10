const MakeService = {
  getAllMake(db) {
    return db
      .select('*')
      .from('make')
  },

  getById(db, id) {
    return db
      .from('make')
      .select('*')
      .where('id', id)
      .first()
  },

  serializeMake(make) {
    return {
      id: make.id,
      make: make.make
    }
  }
}

module.exports = MakeService