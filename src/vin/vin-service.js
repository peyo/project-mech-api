const VINService = {
  getAllVIN(db) {
    return db
      .select('*')
      .from('vin')
  },

  getById(db, id) {
    return db
      .from('vin')
      .select('*')
      .where('id', id)
      .first()
  },

  serializeVIN(vin) {
    return {
      id: vin.id,
      vin: vin.vin,
      make: vin.make
    }
  }
}

module.exports = VINService