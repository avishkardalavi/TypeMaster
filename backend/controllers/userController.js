const { ObjectId } = require("mongodb");

const {
    getDatabase
} = require("../config/database");

const bcrypt = require("bcryptjs");


/* =========================================
   GET USER PROFILE
========================================= */

const getProfile = async (req, res) => {

    try {

        const db = getDatabase();

        const users =
            db.collection("users");

        const typingResults =
            db.collection("typingResults");


        const user =
            await users.findOne(
                {
                    _id:
                        new ObjectId(
                            req.user.userId
                        )
                },
                {
                    projection: {
                        password: 0
                    }
                }
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        /* =====================================
           USER RESULTS
        ===================================== */

        const results =
            await typingResults
                .find({
                    userId:
                        new ObjectId(
                            req.user.userId
                        )
                })
                .toArray();


        const testsCompleted =
            results.length;


        let bestWpm = 0;
        let totalWpm = 0;

        let bestAccuracy = 0;
        let totalAccuracy = 0;

        let totalCharacters = 0;
        let totalMistakes = 0;


        results.forEach(
            result => {

                const wpm =
                    Number(
                        result.wpm || 0
                    );

                const accuracy =
                    Number(
                        result.accuracy || 0
                    );


                bestWpm =
                    Math.max(
                        bestWpm,
                        wpm
                    );


                bestAccuracy =
                    Math.max(
                        bestAccuracy,
                        accuracy
                    );


                totalWpm += wpm;

                totalAccuracy +=
                    accuracy;


                totalCharacters +=
                    Number(
                        result.characters || 0
                    );


                totalMistakes +=
                    Number(
                        result.mistakes || 0
                    );

            }
        );


        const averageWpm =
            testsCompleted > 0
                ? totalWpm /
                  testsCompleted
                : 0;


        const averageAccuracy =
            testsCompleted > 0
                ? totalAccuracy /
                  testsCompleted
                : 0;


        /* =====================================
           RESPONSE
        ===================================== */

        res.json({

            success: true,

            user: {

                id:
                    user._id,

                username:
                    user.username,

                email:
                    user.email,

                createdAt:
                    user.createdAt

            },

            statistics: {

                testsCompleted,

                bestWpm:
                    Math.round(bestWpm),

                averageWpm:
                    Math.round(
                        averageWpm
                    ),

                bestAccuracy:
                    Number(
                        bestAccuracy.toFixed(1)
                    ),

                averageAccuracy:
                    Number(
                        averageAccuracy.toFixed(1)
                    ),

                totalCharacters,

                totalMistakes

            }

        });


    } catch (error) {

        console.error(
            "Get profile error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while loading profile."

        });

    }

};


/* =========================================
   UPDATE USERNAME
========================================= */

const updateProfile = async (req, res) => {

    try {

        const {
            username
        } = req.body;


        if (!username) {

            return res.status(400).json({

                success: false,

                message:
                    "Username is required."

            });

        }


        const cleanUsername =
            username.trim();


        if (
            cleanUsername.length < 3
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Username must contain at least 3 characters."

            });

        }


        const db = getDatabase();

        const users =
            db.collection("users");


        /* =====================================
           CHECK USERNAME
        ===================================== */

        const existingUser =
            await users.findOne({

                username: {
                    $regex:
                        `^${escapeRegex(cleanUsername)}$`,
                    $options: "i"
                },

                _id: {
                    $ne:
                        new ObjectId(
                            req.user.userId
                        )
                }

            });


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "Username is already taken."

            });

        }


        /* =====================================
           UPDATE
        ===================================== */

        await users.updateOne(

            {
                _id:
                    new ObjectId(
                        req.user.userId
                    )
            },

            {
                $set: {

                    username:
                        cleanUsername

                }

            }

        );


        res.json({

            success: true,

            message:
                "Profile updated successfully.",

            username:
                cleanUsername

        });


    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while updating profile."

        });

    }

};


/* =========================================
   ESCAPE REGEX
========================================= */

function escapeRegex(
    value
) {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long."
            });
        }

        const db = getDatabase();
        const users = db.collection("users");

        const userId = new ObjectId(req.user.userId);

        const user = await users.findOne({
            _id: userId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            12
        );

        await users.updateOne(
            {
                _id: userId
            },
            {
                $set: {
                    password: hashedPassword
                }
            }
        );

        res.json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {
        console.error(
            "Change password error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while changing password."
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { currentPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password is required."
            });
        }

        const db = getDatabase();

        const users = db.collection("users");
        const typingResults = db.collection("typingResults");
        const userAchievements =
            db.collection("userAchievements");

        const userId =
            new ObjectId(req.user.userId);


        /* =========================================
           FIND USER
        ========================================= */

        const user = await users.findOne({
            _id: userId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }


        /* =========================================
           VERIFY PASSWORD
        ========================================= */

        const passwordMatches =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }


        /* =========================================
           DELETE TYPING RESULTS
        ========================================= */

        const resultsDeleted =
            await typingResults.deleteMany({
                userId: userId
            });


        /* =========================================
           DELETE ACHIEVEMENTS
        ========================================= */

        const achievementsDeleted =
            await userAchievements.deleteMany({
                userId: userId
            });


        /* =========================================
           DELETE USER
        ========================================= */

        const userDeleted =
            await users.deleteOne({
                _id: userId
            });


        if (userDeleted.deletedCount !== 1) {

            return res.status(500).json({
                success: false,
                message: "Unable to delete user account."
            });

        }


        /* =========================================
           RESPONSE
        ========================================= */

        res.json({
            success: true,
            message: "Account deleted successfully.",

            deletedData: {
                typingResults:
                    resultsDeleted.deletedCount,

                achievements:
                    achievementsDeleted.deletedCount,

                account:
                    userDeleted.deletedCount
            }
        });


    } catch (error) {

        console.error(
            "Delete account error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while deleting account."
        });

    }
};

module.exports = {

    getProfile,
    changePassword,
    deleteAccount,
    updateProfile

};