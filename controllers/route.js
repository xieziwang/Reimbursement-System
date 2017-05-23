var badyParser = require("body-parser");
var Users = require("../models/userModel");
var Records = require("../models/recordModel");

module.exports = function(app) {

    app.use(badyParser.json()); // parse the json out of the http request body
    app.use(badyParser.urlencoded({ extended: true })); // encode the url

    // find all users
    // app.get("/api/users/all", function(req, res) {
    //     Users.find(function(err, users) {
    //         if (err) throw err;
    //         res.send(users);
    //     });
    // });

    // find a user by email
    app.post("/api/users/email", function(req, res) {
        Users.find({ email: req.body.email, password: req.body.password },
            function(err, user) {
                if (err) throw err;
                res.send(user); // server send this user back,or an empty array
            });
    });

    // new user or update profile
    app.post("/api/users", function(req, res) {
        // update the profile
        if (req.body.id) {
            Users.findByIdAndUpdate(req.body.id, {
                name: req.body.name,
                phone: req.body.phone,
                password: req.body.password
            }, {new: true}, function(err, user) {
                if (err) throw err;
                res.send(user);
            });
        } else {
            // create a new user
            var newUser = new Users({
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                password: req.body.password
            });
            newUser.save(function(err, user) {
                if (err) throw err;
                res.send(user);
            });
        }
    });

    // find records for a user by email
    app.post("/api/users/records/email", function(req, res) {
        Records.find({ email: req.body.email },
            function(err, records) {
                if (err) throw err;
                res.send(records);
            });
    });

    // find all non-manager records for managers
    app.post("/api/users/records/non-manager", function(req, res) {
        Records.find({email:{$ne:req.body.email}},function(err, records) {
            if (err) throw err;
            res.send(records);
        });
    });

    // find all non-Approved records for managers
    // app.get("/api/users/records/non-approved", function(req, res) {
    //     Records.find({ isDone: false }, function(err, records) {
    //         if (err) throw err;
    //         res.send(records);
    //     });
    // });

    // approve or submit a new record
    app.post("/api/users/records", function(req, res) {
        // update a record
        if (req.body.id) {
            Records.findByIdAndUpdate(req.body.id, {
                isDone: true
            }, function(err, record) {
                if (err) throw err;
                res.send(record);
            });
        } else {
            // create a new record
            var newRecord = new Records({
                email: req.body.email,
                name: req.body.name,
                category: req.body.category,
                date: req.body.date,
                address: req.body.address,
                price: req.body.price,
                isDone: req.body.isDone
            });
            newRecord.save(function(err, record) {
                if (err) throw err;
                res.send(record);
                console.log(record);
            });
        }

    });

    // delete a record by id
    app.delete("/api/records/:id", function(req, res) {
        Records.findByIdAndRemove(req.params.id, function(err, record) {
            if (err) throw err;
            res.send(record);
        });
    });
}
