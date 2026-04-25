const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: String,
    email: String,
    image: String,
})

module.exports = mongoose.model("user", UserSchema);