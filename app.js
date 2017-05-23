/* Created by Jingying Wang */

var express = require('express');
var app = express();

// connect to mongodb
var mongoose = require("mongoose");
var databaseUrl = require("./config/database");
mongoose.connect(databaseUrl);
// mongoose.connect("mongodb://helen:sitacorp@ds145315.mlab.com:45315/sita-project");

// user controller
var routeCtr = require("./controllers/route");
routeCtr(app);

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 1337;
app.listen(port);
