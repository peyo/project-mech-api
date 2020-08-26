
const mongoose = require('mongoose');

const KarmaSchema = new mongoose.Schema({
    karma: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
});

const Karma = mongoose.model('Karma', KarmaSchema);

KarmaSchema.index(
    {
        "user": 1,
        "comment": 1
    }
)
module.exports = { Karma };
