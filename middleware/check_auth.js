const jwt = require('jsonwebtoken')
//DB Connection
const mysqlConnection = require("../connection");


const verifyAccessToken = (req, res, next) => {
    try {

        //Header's authorization contains the accesstoken id created after user login
        const accesstoken_id = req.headers.authorization;

        if (!req.headers.authorization) {
            return res.status(401).json({
                "error": {
                    "statusCode": 401,
                    "message": "Unauthorized request"
                }
            });
        } else {

            //Fetch accesstoken from DB
            mysqlConnection.query("SELECT * FROM accesstoken WHERE id = ?", [accesstoken_id], (err, rows, fields) => {
                if (!err) {
                    if (rows.length > 0) {

                        let ts = Date.now();
                        let valid_date = rows[0].createdAt.getTime() + (rows[0].ttl * 1000);

                        if (ts - valid_date < 0) {
                            //pass current user id to the other middleware
                            req.user_id = rows[0].id_user;
                            next();
                        }
                        else
                            return res.status(401).json({
                                "error": {
                                    "statusCode": 401,
                                    "message": "Authorization failed"
                                }
                            });



                    } else

                        return res.status(401).json({
                            "error": {
                                "statusCode": 401,
                                "message": "Authorization failed"
                            }
                        });



                } else
                    console.log(err);
            });

        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            "error": {
                "statusCode": 500,
                "message": "Something went wrong!"
            }
        });

    }
};

module.exports = verifyAccessToken;