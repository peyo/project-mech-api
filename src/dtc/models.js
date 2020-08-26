
const mongoose = require('mongoose');

const DTCSchema = new mongoose.Schema({
    dtc: { type: String, required: true },
    description: { type: String, required: true },
    probable_cause: { type: String },
    vinmake_id: { type: mongoose.Schema.Types.ObjectId, ref: 'VinMake' }
});

const DTC = mongoose.model('DTC', DTCSchema);

module.exports = { DTC };
