const express = require("express");
const Router = express.Router();
//DB Connection
const mysqlConnection = require("../connection");
//Security Middleware
const checkAuth = require("../middleware/check_auth");


//Searhc for kiosk
Router.post("/search", checkAuth, (req, res) => {
    var lat = req.body.lat;
    var long = req.body.long;
    var distance = req.body.distance;
    var page = req.body.page;
    var offset = req.body.offset;

    //Start and End index for pagination
    const startIndex = (page - 1) * offset;
    const endIndex = page * offset;

    const results = {}




    //Stored Procedure Call
    var sql = "SET @lat = ?;SET @lon = ?;SET @dis = ?;CALL Searchkiosk(@lat,@lon,@dis);";
    mysqlConnection.query(sql, [lat, long, distance], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    if (element.length > 0) {


                        //Pagination

                        if (startIndex > 0) {
                            results.previous = {
                                page: page - 1,
                                offset: offset
                            }
                        }

                        results.result = element.slice(startIndex, endIndex);

                        if (endIndex < element.length) {
                            results.next = {
                                page: page + 1,
                                offset: offset
                            }
                        }

                        // For now the result is returned as it is fetched from the DB
                        //To get the desired Output I'm planning on spending sometime on formatting the result
                        //to create the organized object 
                        res.send(results);
                    }

                    else
                        return res.status(204).json({
                            "error": {
                                "statusCode": 204,
                                "message": "No Kiosk was found!"
                            }
                        });
                }
            });

        }
        else
            console.log(err);
    });
});



module.exports = Router;