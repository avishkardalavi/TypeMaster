const express = require("express");

const {
    saveTestResult,
    getUserResults,
    clearUserHistory
} = require("../controllers/testController");

const authenticateToken =
    require("../middleware/authMiddleware");


const router =
    express.Router();


/* =========================================
   SAVE RESULT
========================================= */

router.post(
    "/",
    authenticateToken,
    saveTestResult
);

router.delete(
    "/history",
    authenticateToken,
    clearUserHistory
);

/* =========================================
   GET USER RESULTS
========================================= */

router.get(
    "/",
    authenticateToken,
    getUserResults
);



module.exports = router;