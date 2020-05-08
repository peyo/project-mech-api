const MakeService = {
  getAllMake(knex) {
    return knex.select('*').from('make')
  },

  getById(knex, id) {
    return knex
      .from('make')
      .select('*')
      .where('id', id)
      .first()
  }
}

module.exports = MakeService