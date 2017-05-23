var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var recordSchema = new Schema({
    email: String,
    name: String,
    category: String,
    date: Date,
    address: String,
    price: Number,
    isDone: Boolean
});

var Records = mongoose.model("Records", recordSchema);
module.exports = Records;
