const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/database");


const ACHIEVEMENTS = [
    {
        id: "first-steps",
        name: "First Steps",
        description: "Complete your first typing test.",
        icon: "bi-flag-fill",
        type: "tests",
        target: 1
    },
    {
        id: "getting-faster",
        name: "Getting Faster",
        description: "Reach 40 WPM.",
        icon: "bi-lightning-fill",
        type: "wpm",
        target: 40
    },
    {
        id: "speed-runner",
        name: "Speed Runner",
        description: "Reach 60 WPM.",
        icon: "bi-rocket-takeoff-fill",
        type: "wpm",
        target: 60
    },
    {
        id: "fast-fingers",
        name: "Fast Fingers",
        description: "Reach 80 WPM.",
        icon: "bi-fire",
        type: "wpm",
        target: 80
    },
    {
        id: "speed-demon",
        name: "Speed Demon",
        description: "Reach 100 WPM.",
        icon: "bi-wind",
        type: "wpm",
        target: 100
    },
    {
        id: "sharpshooter",
        name: "Sharpshooter",
        description: "Achieve 100% accuracy.",
        icon: "bi-bullseye",
        type: "accuracy",
        target: 100
    },
    {
        id: "dedicated-typist",
        name: "Dedicated Typist",
        description: "Complete 10 typing tests.",
        icon: "bi-journal-check",
        type: "tests",
        target: 10
    },
    {
        id: "typing-veteran",
        name: "Typing Veteran",
        description: "Complete 25 typing tests.",
        icon: "bi-trophy-fill",
        type: "tests",
        target: 25
    }
];


/* =========================================
   GET USER ACHIEVEMENTS
========================================= */

const getAchievements = async (req, res) => {

    try {

        const db = getDatabase();

        const typingResults =
            db.collection("typingResults");

        const userAchievements =
            db.collection("userAchievements");


        const userId =
            new ObjectId(
                req.user.userId
            );


        /* -----------------------------------------
           GET USER TESTS
        ----------------------------------------- */

        const results =
            await typingResults
                .find({
                    userId
                })
                .toArray();


        const testsCompleted =
            results.length;


        const bestWpm =
            results.length > 0
                ? Math.max(
                    ...results.map(
                        result =>
                            Number(
                                result.wpm || 0
                            )
                    )
                )
                : 0;


        const bestAccuracy =
            results.length > 0
                ? Math.max(
                    ...results.map(
                        result =>
                            Number(
                                result.accuracy || 0
                            )
                    )
                )
                : 0;


        /* -----------------------------------------
           CHECK ACHIEVEMENTS
        ----------------------------------------- */

        const unlockedIds = [];


        for (
            const achievement
            of ACHIEVEMENTS
        ) {

            let unlocked = false;


            if (
                achievement.type === "tests"
            ) {

                unlocked =
                    testsCompleted >=
                    achievement.target;

            }


            if (
                achievement.type === "wpm"
            ) {

                unlocked =
                    bestWpm >=
                    achievement.target;

            }


            if (
                achievement.type === "accuracy"
            ) {

                unlocked =
                    bestAccuracy >=
                    achievement.target;

            }


            if (unlocked) {

                unlockedIds.push(
                    achievement.id
                );

            }

        }


        /* -----------------------------------------
           SAVE UNLOCKED ACHIEVEMENTS
        ----------------------------------------- */

        if (
            unlockedIds.length > 0
        ) {

            const operations =
                unlockedIds.map(
                    achievementId => ({

                        updateOne: {

                            filter: {

                                userId,

                                achievementId

                            },

                            update: {

                                $setOnInsert: {

                                    userId,

                                    achievementId,

                                    unlockedAt:
                                        new Date()

                                }

                            },

                            upsert: true

                        }

                    })
                );


            await userAchievements.bulkWrite(
                operations
            );

        }


        /* -----------------------------------------
           GET STORED ACHIEVEMENTS
        ----------------------------------------- */

        const storedAchievements =
            await userAchievements
                .find({
                    userId
                })
                .toArray();


        const storedMap =
            new Map(
                storedAchievements.map(
                    item => [
                        item.achievementId,
                        item.unlockedAt
                    ]
                )
            );


        /* -----------------------------------------
           BUILD RESPONSE
        ----------------------------------------- */

        const achievements =
            ACHIEVEMENTS.map(
                achievement => ({

                    ...achievement,

                    unlocked:
                        storedMap.has(
                            achievement.id
                        ),

                    unlockedAt:
                        storedMap.get(
                            achievement.id
                        ) || null

                })
            );


        res.json({

            success: true,

            summary: {

                total:
                    ACHIEVEMENTS.length,

                unlocked:
                    achievements.filter(
                        item =>
                            item.unlocked
                    ).length,

                testsCompleted,

                bestWpm,

                bestAccuracy

            },

            achievements

        });


    } catch (error) {

        console.error(
            "Achievement error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load achievements."

        });

    }

};


module.exports = {
    getAchievements
};