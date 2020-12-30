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
        "cars.user_id"
      )
      .leftJoin("users", "cars.user_id", "users.id");
  },
  insertUserUniqueCar(db, newCar) {
    return db
      .insert(newCar)
      .into("cars")
      .returning("*")
      .then(([car]) => car);
  },
  getCarByUserId(db, user_id) {
    return CarsService.getAllCars(db).where("cars.user_id", user_id);
  },
  getCarByCarId(db, car_id) {
    return CarsService.getAllCars(db).where("cars.id", car_id);
  },
  deleteCarByCarId(db, car_id) {
    return CarsService.getAllCars(db).where("cars.id", car_id).delete();
  },
  serializeCar(car) {
    return {
      id: car.id,
      make: xss(car.make),
      model: xss(car.model),
      vin: xss(car.vin),
      vinmake_id: car.vinmake_id,
      date_created: moment(new Date(car.date_created)).calendar(),
      user_id: car.user_id,
    };
  },
};

module.exports = CarsService;