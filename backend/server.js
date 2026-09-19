require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    connectDatabase,
    getDatabase
} = require("./config/database");

const authRoutes =
    require("./routes/auth");

const testRoutes =
    require("./routes/tests");

const userRoutes =
    require("./routes/users");

const leaderboardRoutes =
    require("./routes/leaderboard");

const achievementRoutes =
    require("./routes/achievements");

const authenticateToken =
    require("./middleware/authMiddleware");

const paragraphRoutes =
    require("./routes/paragraphs");


const app =
    express();


/* =========================================
   MIDDLEWARE
========================================= */

app.use(
    cors()
);

app.use(
    express.json()
);


/* =========================================
   BASIC API
========================================= */

app.get(
    "/api",
    (req, res) => {

        res.json({

            success: true,

            message:
                "TypeMaster API is running!"

        });

    }
);


/* =========================================
   DATABASE TEST
========================================= */

app.get(
    "/api/db-test",
    async (req, res) => {

        try {

            const db =
                getDatabase();

            const result =
                await db.command({
                    ping: 1
                });


            res.json({

                success: true,

                message:
                    "MongoDB Atlas connected successfully!",

                result

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Database connection failed."

            });

        }

    }
);


/* =========================================
   AUTH ROUTES
========================================= */

app.use(
    "/api/auth",
    authRoutes
);

/* =========================================
   TEST ROUTES
========================================= */

app.use(
    "/api/tests",
    testRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/leaderboard",
    leaderboardRoutes
);

app.use(
    "/api/achievements",
    achievementRoutes
);

app.use(
    "/api/paragraphs",
    paragraphRoutes
);

/* =========================================
   PROTECTED TEST ROUTE
========================================= */

app.get(
    "/api/protected",
    authenticateToken,
    (req, res) => {

        res.json({

            success: true,

            message:
                "You accessed a protected route!",

            user:
                req.user

        });

    }
);


/* =========================================
   START SERVER
========================================= */

const PORT =
    process.env.PORT || 5000;


async function startServer() {

    try {

        await connectDatabase();

        app.listen(
            PORT,
            () => {

                console.log(
                    `TypeMaster server running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Failed to start server:",
            error
        );

    }

}


startServer();