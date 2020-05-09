const VINService = {
  getAllVIN(knex) {
    return knex.select('*').from('vin')
  },

  getById(knex, id) {
    return knex
      .from('vin')
      .select('*')
      .where('id', id)
      .first()
  }
}

module.exports = VINService