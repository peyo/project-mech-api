
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    user_name: { type: String },
    nickname: { type: String },
    password: { type: String },
    date_created: { type: Date },
    address: {
        street: { type: String },
        number: { type: String },
        zipcode: { type: String },
        city: { type: String },
        state: { type: String }
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
