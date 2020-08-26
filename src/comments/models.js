
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    vinmake: { type: mongoose.Schema.Types.ObjectId, ref: 'VinMake' },
    dtc: { type: mongoose.Schema.Types.ObjectId, ref: 'DTC' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    karmas: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Karma'
    }]
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Comment };
