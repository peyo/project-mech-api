const VinMakeService = {
  getAllVinMake(db) {
    return db.select("*").from("vinmake");
  },

  getById(db, id) {
    return db.from("vinmake").select("*").where("id", id);
  },

  serializeVinMake(vinmake) {
    return {
      id: vinmake.id,
      make_vin: vinmake.make_vin,
      short_vin: vinmake.short_vin,
    };
  },
};

module.exports = VinMakeService;
