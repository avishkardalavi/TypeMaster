const express = require("express");

const {
    getAchievements
} = require("../controllers/achievementController");

const authenticateToken =
    require("../middleware/authMiddleware");


const router =
    express.Router();


/* =========================================
   GET USER ACHIEVEMENTS
========================================= */

router.get(
    "/",
    authenticateToken,
    getAchievements
);


module.exports = router;