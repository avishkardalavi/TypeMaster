const express = require("express");

const {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
} = require("../controllers/userController");

const authenticateToken =
    require("../middleware/authMiddleware");


const router =
    express.Router();


/* =========================================
   GET PROFILE
========================================= */

router.get(
    "/profile",
    authenticateToken,
    getProfile
);


/* =========================================
   UPDATE PROFILE
========================================= */

router.put(
    "/profile",
    authenticateToken,
    updateProfile
);

router.put(
    "/change-password",
    authenticateToken,
    changePassword
);

router.delete(
    "/account",
    authenticateToken,
    deleteAccount
);

module.exports = router;