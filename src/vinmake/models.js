
const mongoose = require('mongoose');

const VinMakeSchema = new mongoose.Schema({
    make_vin: { type: String, required: true },
    short_vin: { type: String, required: true },
    date_created: { type: Date, default: Date.now }
});

const VinMake = mongoose.model('VinMake', VinMakeSchema);
module.exports = { VinMake };
