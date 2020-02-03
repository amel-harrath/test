const express = require("express");
const Router = express.Router();
//DB Connection
const mysqlConnection = require("../connection");
//Security Middleware
const checkAuth = require("../middleware/check_auth");
const checkOwner = require("../middleware/check_owner");




//Get a list of all users 
Router.get("/", checkAuth, (req, res) => {
    mysqlConnection.query("SELECT * FROM user", (err, rows, fields) => {
        if (!err) {
            if (rows.length > 0)
                res.send(rows);
            else
                return res.status(204).json({
                    "error": {
                        "statusCode": 204,
                        "message": "No users were found!"
                    }
                });

        }
        else
            console.log(err);

    });
});

//Get a user using his id
Router.get("/:id", checkAuth, checkOwner, (req, res) => {
    mysqlConnection.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err, rows, fields) => {
        if (!err) {
            if (rows.length > 0)
                res.send(rows);
            else
                return res.status(204).json({
                    "error": {
                        "statusCode": 204,
                        "message": "No user with given id was  found!"
                    }
                });
        }
        else {
            console.log(err);
        }
    });
});

//Login
Router.post("/login", (req, res) => {
    var countryCode = req.body.countryCode;
    var phone = req.body.phone;
    var password = req.body.pwd;

    mysqlConnection.query("SELECT * FROM user WHERE countryCode = ? AND phone = ?", [countryCode, phone], (err, rows, fields) => {
        if (err) {
            console.log(err);
        }
        else {
            if (rows.length > 0) {
                if (rows[0].pwd == password) {

                    //Store AccessToken
                    mysqlConnection.query("INSERT INTO accesstoken VALUES (default,default,default,?)", [rows[0].id], (error, rest, fields) => {
                        if (!error) {
                            mysqlConnection.query("SELECT * FROM accesstoken WHERE id = ?", [rest.insertId], (er, re, fields) => {
                                if (!er) {
                                    res.send({
                                        re
                                    });
                                }
                            });

                        }

                    });

                }
                else
                    return res.status(204).json({
                        "error": {
                            "statusCode": 204,
                            "message": "Phone and password does not match!"
                        }
                    });
            }
            else
                return res.status(204).json({
                    "error": {
                        "statusCode": 204,
                        "message": "Phone does not exist!"
                    }
                });
        }
    });

});

module.exports = Router;