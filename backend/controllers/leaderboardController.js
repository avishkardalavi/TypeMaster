const {
    getDatabase
} = require("../config/database");


/* =========================================
   GET GLOBAL LEADERBOARD
========================================= */

const getLeaderboard = async (req, res) => {

    try {

        const db =
            getDatabase();


        const typingResults =
            db.collection("typingResults");


        /* =====================================
           AGGREGATE USER PERFORMANCE
        ===================================== */

        const leaderboard =
            await typingResults.aggregate([

                /* ---------------------------------
                   GROUP RESULTS BY USER
                --------------------------------- */

                {
                    $group: {

                        _id: "$userId",

                        bestWpm: {
                            $max: "$wpm"
                        },

                        averageWpm: {
                            $avg: "$wpm"
                        },

                        averageAccuracy: {
                            $avg: "$accuracy"
                        },

                        testsCompleted: {
                            $sum: 1
                        },

                        totalCharacters: {
                            $sum: "$characters"
                        },

                        totalMistakes: {
                            $sum: "$mistakes"
                        }

                    }
                },


                /* ---------------------------------
                   GET USER INFORMATION
                --------------------------------- */

                {
                    $lookup: {

                        from: "users",

                        localField: "_id",

                        foreignField: "_id",

                        as: "user"

                    }
                },


                /* ---------------------------------
                   CONVERT USER ARRAY
                --------------------------------- */

                {
                    $unwind: "$user"
                },


                /* ---------------------------------
                   SORT
                --------------------------------- */

                {
                    $sort: {

                        bestWpm: -1,

                        averageAccuracy: -1,

                        testsCompleted: -1

                    }
                },


                /* ---------------------------------
                   LIMIT
                --------------------------------- */

                {
                    $limit: 100
                },


                /* ---------------------------------
                   SELECT FIELDS
                --------------------------------- */

                {
                    $project: {

                        _id: 0,

                        userId: "$_id",

                        username: "$user.username",

                        bestWpm: {
                            $round: [
                                "$bestWpm",
                                0
                            ]
                        },

                        averageWpm: {
                            $round: [
                                "$averageWpm",
                                0
                            ]
                        },

                        averageAccuracy: {
                            $round: [
                                "$averageAccuracy",
                                1
                            ]
                        },

                        testsCompleted: 1,

                        totalCharacters: 1,

                        totalMistakes: 1

                    }
                }

            ]).toArray();


        /* =====================================
           ADD RANK
        ===================================== */

        const rankedLeaderboard =
            leaderboard.map(
                (player, index) => ({

                    rank:
                        index + 1,

                    ...player

                })
            );


        /* =====================================
           RESPONSE
        ===================================== */

        res.json({

            success: true,

            count:
                rankedLeaderboard.length,

            leaderboard:
                rankedLeaderboard

        });


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while loading leaderboard."

        });

    }

};


module.exports = {
    getLeaderboard
};