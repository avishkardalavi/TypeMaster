const express = require("express");

const {
    getParagraphs,
    addParagraph,
    updateParagraph,
    deleteParagraph
} = require("../controllers/paragraphController");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();


// Anyone can view paragraphs
router.get("/", getParagraphs);


// Only admins can manage paragraphs
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    addParagraph
);

router.put(
    "/:id",
    authenticateToken,
    requireAdmin,
    updateParagraph
);

router.delete(
    "/:id",
    authenticateToken,
    requireAdmin,
    deleteParagraph
);

module.exports = router;