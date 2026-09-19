const { ObjectId } = require("mongodb");

const {
    getDatabase
} = require("../config/database");


/* =========================================
   SAVE TYPING TEST RESULT
========================================= */

const saveTestResult = async (req, res) => {

    try {

        const {
            wpm,
            accuracy,
            mistakes,
            characters,
            difficulty,
            duration
        } = req.body;


        /* =====================================
           VALIDATION
        ===================================== */

        if (
            wpm === undefined ||
            accuracy === undefined ||
            mistakes === undefined ||
            characters === undefined ||
            !difficulty ||
            duration === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All test result fields are required."

            });

        }


        if (
            !["easy", "medium", "hard"]
                .includes(difficulty)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid difficulty."

            });

        }


        /* =====================================
           DATABASE
        ===================================== */

        const db =
            getDatabase();


        const typingResults =
            db.collection(
                "typingResults"
            );


        /* =====================================
           CREATE RESULT
        ===================================== */

        const result = {

            userId:
                new ObjectId(
                    req.user.userId
                ),

            wpm:
                Number(wpm),

            accuracy:
                Number(accuracy),

            mistakes:
                Number(mistakes),

            characters:
                Number(characters),

            difficulty,

            duration:
                Number(duration),

            createdAt:
                new Date()

        };


        /* =====================================
           INSERT
        ===================================== */

        const insertResult =
            await typingResults.insertOne(
                result
            );


        /* =====================================
           RESPONSE
        ===================================== */

        res.status(201).json({

            success: true,

            message:
                "Typing test result saved successfully.",

            result: {

                id:
                    insertResult.insertedId,

                wpm:
                    result.wpm,

                accuracy:
                    result.accuracy,

                mistakes:
                    result.mistakes,

                characters:
                    result.characters,

                difficulty:
                    result.difficulty,

                duration:
                    result.duration,

                createdAt:
                    result.createdAt

            }

        });


    } catch (error) {

        console.error(
            "Save test result error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while saving test result."

        });

    }

};


/* =========================================
   GET USER RESULTS
========================================= */

const getUserResults = async (req, res) => {

    try {

        const db =
            getDatabase();


        const typingResults =
            db.collection(
                "typingResults"
            );


        const results =
            await typingResults
                .find({

                    userId:
                        new ObjectId(
                            req.user.userId
                        )

                })
                .sort({
                    createdAt: -1
                })
                .toArray();


        res.json({

            success: true,

            count:
                results.length,

            results

        });


    } catch (error) {

        console.error(
            "Get user results error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while fetching test results."

        });

    }

};

const clearUserHistory = async (req, res) => {
    try {
        const db = getDatabase();
        const typingResults = db.collection("typingResults");

        const userId = new ObjectId(req.user.userId);

        const result = await typingResults.deleteMany({
            userId: userId
        });

        res.json({
            success: true,
            message: "Typing history cleared successfully.",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error(
            "Clear typing history error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while clearing typing history."
        });
    }
};

module.exports = {

    saveTestResult,

    getUserResults,

    clearUserHistory

};