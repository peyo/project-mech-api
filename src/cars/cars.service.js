const CarsService = {
  getAllCars(knex) {
    return knex.select('*').from('cars')
  },

  createCar(knex, newCar) {
    return knex
      .insert(newCar)
      .into('cars')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex
      .from('cars')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteCar(knex, id) {
    return knex('cars')
      .where({ id })
      .delete()
  },

  updateCar(knex, id, newCarFields) {
    return knex('cars')
      .where({ id })
      .update(newCarFields)
  },
}

module.exports = CarsService