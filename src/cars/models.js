
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vin: { type: String },
  vinmake: { type: mongoose.Schema.Types.ObjectId, ref: 'VinMake' },
  date_created: { type: Date, default: Date.now }
});


const Car = mongoose.model('Car', CarSchema);

module.exports = { Car };
