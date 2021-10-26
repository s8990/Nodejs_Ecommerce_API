const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true,
    },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
