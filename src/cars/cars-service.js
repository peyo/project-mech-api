const xss = require("xss");
const moment = require("moment");

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
      .leftJoin("users", "cars.user_id", "users.id")
      .groupBy("cars.id", "users.id");
  },

  insertUserUniqueCar(db, newCar) {
    return db
      .insert(newCar)
      .into("cars")
      .returning("*")
      .then(([car]) => car);
  },

  getCarByUserId(db, userId) {
    return CarsService.getAllCars(db)
      .where("cars.user_id", userId);
  },

  deleteCarByCarId(db, carId) {
    return CarsService.getAllCars(db)
      .where("cars.id", carId)
      .delete();
  },

  serializeCar(car) {
    return {
      id: car.id,
      make: xss(car.make),
      model: xss(car.model),
      vin: xss(car.vin),
      vinmake_id: car.vinmake_id,
      date_created: moment(new Date(car.date_created))
        .subtract(10, 'days').calendar(),
      user_id: car.user_id
    };
  },
};

module.exports = CarsService;
