const CarsService = {
  insertCar(db, newCar) {
    return db
      .insert(newCar)
      .into('cars')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(db, id) {
    return db
      .from('cars')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteCar(db, id) {
    return db('cars')
      .where({ id })
      .delete()
  },

  updateCar(db, id, newCarFields) {
    return db('cars')
      .where({ id })
      .update(newCarFields)
  },
}

module.exports = CarsService