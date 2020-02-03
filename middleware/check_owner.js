const jwt = require('jsonwebtoken')


const verifyOwner = (req, res, next) => {
    try {
        //if the id of the user data to demanded does not match the id of the current user
        //authorization is denied
        if (req.user_id != req.params.id) {
            return res.status(403).json({
                "error": {
                    "statusCode": 403,
                    "message": "Access denied"
                }
            });
        } else
            next();

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

module.exports = verifyOwner;