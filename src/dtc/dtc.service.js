const DTCService = {
  getAllDTC(knex) {
    return knex.select('*').from('dtc')
  },

  getById(knex, id) {
    return knex
      .from('dtc')
      .select('*')
      .where('id', id)
      .first()
  }
}

module.exports = DTCService