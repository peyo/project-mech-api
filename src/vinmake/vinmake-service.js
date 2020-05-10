const VINMakeService = {
  getAllVINMake(db) {
    return db
      .select('*')
      .from('vinmake')
  },

  getById(db, id) {
    return db
      .from('vinmake')
      .select('*')
      .where('id', id)
      .first()
  },

  serializeVINMake(vinmake) {
    return {
      id: vinmake.id,
      vin: vinmake.make_vin,
      make: vinmake.short_vin
    }
  }
}

module.exports = VINMakeService