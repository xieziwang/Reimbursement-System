var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    name: String,
    password: String,
    phone: Number,
    isManager: Boolean
});

var Users = mongoose.model("Users", userSchema);
module.exports = Users;
