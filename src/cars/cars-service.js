const xss = require('xss')

const CarsService = {
  getAllCars(db) {
    return db
      .from("cars")
      .select(
        "cars.id",
        "cars.make",
        "cars.model",
        "cars.vin",
        "cars.vinmake_id",
        "cars.date_created",
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  users.id,
                  users.username,
                  users.nickname,
                  users.date_created
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .leftJoin("users", "cars.username", "users.id")
      .groupBy("cars.id", "users.id")
  },

  getById(db, id) {
    return CarsService.getAllCars(db)
      .where("cars.id", id)
      .first();
  },

  insertUser(db, newCar) {
    return db
      .insert(newCar)
      .into('cars')
      .returning('*')
      .then(([car]) => car)
  },

  deleteCar(db, id) {
    return db("cars").where({ id }).delete();
  },

  serializeCar(car) {
    const { user } = car
    return {
      id: car.id,
      make: xss(car.make),
      model: xss(car.model),
      vin: xss(car.vin),
      vinmake_id: car.vinmake_id,
      date_created: new Date(car.date_created),
      user_id: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        date_created: new Date(user.date_created),
      },
    }
  },
};

module.exports = CarsService;
