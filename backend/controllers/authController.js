const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    getDatabase
} = require("../config/database");


/* =========================================
   REGISTER
========================================= */

const register = async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;


        /* ---------- VALIDATION ---------- */

        if (
            !username ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Username, email and password are required."

            });

        }


        if (username.length < 3) {

            return res.status(400).json({

                success: false,

                message:
                    "Username must contain at least 3 characters."

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least 6 characters."

            });

        }


        /* ---------- DATABASE ---------- */

        const db = getDatabase();

        const users =
            db.collection("users");


        /* ---------- CHECK EXISTING USER ---------- */

        const existingUser =
            await users.findOne({

                $or: [

                    {
                        email:
                            email.toLowerCase()
                    },

                    {
                        username:
                            username.toLowerCase()
                    }

                ]

            });


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "Username or email already exists."

            });

        }


        /* ---------- HASH PASSWORD ---------- */

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );


        /* ---------- CREATE USER ---------- */

        const newUser = {

            username:
                username.trim(),

            email:
                email.toLowerCase().trim(),

            password:
                hashedPassword,

            role :
                "user",

            createdAt:
                new Date()

        };


        const result =
            await users.insertOne(
                newUser
            );


        /* ---------- RESPONSE ---------- */

        res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            user: {

                id:
                    result.insertedId,

                username:
                    newUser.username,

                email:
                    newUser.email

            }

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error during registration."

        });

    }

};


/* =========================================
   LOGIN
========================================= */

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        /* ---------- VALIDATION ---------- */

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        /* ---------- DATABASE ---------- */

        const db = getDatabase();

        const users =
            db.collection("users");


        /* ---------- FIND USER ---------- */

        const user =
            await users.findOne({

                email:
                    email.toLowerCase().trim()

            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        /* ---------- VERIFY PASSWORD ---------- */

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        /* ---------- CREATE JWT ---------- */

        const token =
            jwt.sign(

                {

                    userId:
                        user._id.toString(),

                    username:
                        user.username,

                    email:
                        user.email,

                    role:
                        user.role || "user"

                },

                process.env.JWT_SECRET,

                {

                    expiresIn:
                        "7d"

                }

            );


        /* ---------- RESPONSE ---------- */

        res.json({

            success: true,

            message:
                "Login successful.",

            token,

            user: {

                id:
                    user._id,

                username:
                    user.username,

                email:
                    user.email,

                role:
                    user.role || "user"

            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error during login."

        });

    }

};


module.exports = {

    register,

    login

};