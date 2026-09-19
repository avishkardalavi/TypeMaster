const jwt = require("jsonwebtoken");


const authenticateToken =
    (req, res, next) => {

        try {

            const authHeader =
                req.headers.authorization;


            if (!authHeader) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Authentication token required."

                });

            }


            const token =
                authHeader.startsWith("Bearer ")

                    ? authHeader.substring(7)

                    : authHeader;


            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );


            req.user =
                decoded;


            next();


        } catch (error) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid or expired token."

            });

        }

    };


module.exports =
    authenticateToken;