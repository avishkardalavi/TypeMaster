const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/database");


/* =========================================
   GET PARAGRAPHS
========================================= */

const getParagraphs = async (req, res) => {

    try {

        const db = getDatabase();

        const paragraphs =
            await db.collection("paragraphs")
                .find({})
                .sort({
                    difficulty: 1,
                    createdAt: -1
                })
                .toArray();


        res.json({
            success: true,
            count: paragraphs.length,
            paragraphs
        });


    } catch (error) {

        console.error(
            "Get paragraphs error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to load paragraphs."
        });

    }

};


/* =========================================
   ADD PARAGRAPH
========================================= */

const addParagraph = async (req, res) => {

    try {

        const {
            text,
            difficulty
        } = req.body;


        if (!text || !text.trim()) {

            return res.status(400).json({
                success: false,
                message: "Paragraph text is required."
            });

        }


        const validDifficulties = [
            "easy",
            "medium",
            "hard"
        ];


        if (
            !difficulty ||
            !validDifficulties.includes(
                difficulty.toLowerCase()
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Difficulty must be easy, medium, or hard."
            });

        }


        const db = getDatabase();


        const paragraph = {

            text: text.trim(),

            difficulty:
                difficulty.toLowerCase(),

            createdAt: new Date(),

            updatedAt: new Date()

        };


        const result =
            await db.collection("paragraphs")
                .insertOne(paragraph);


        res.status(201).json({

            success: true,

            message:
                "Paragraph added successfully.",

            paragraph: {
                _id: result.insertedId,
                ...paragraph
            }

        });


    } catch (error) {

        console.error(
            "Add paragraph error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to add paragraph."
        });

    }

};


/* =========================================
   UPDATE PARAGRAPH
========================================= */

const updateParagraph = async (req, res) => {

    try {

        const {
            id
        } = req.params;

        const {
            text,
            difficulty
        } = req.body;


        if (!ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid paragraph ID."
            });

        }


        if (!text || !text.trim()) {

            return res.status(400).json({
                success: false,
                message: "Paragraph text is required."
            });

        }


        const validDifficulties = [
            "easy",
            "medium",
            "hard"
        ];


        if (
            !difficulty ||
            !validDifficulties.includes(
                difficulty.toLowerCase()
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Difficulty must be easy, medium, or hard."
            });

        }


        const db = getDatabase();


        const result =
            await db.collection("paragraphs")
                .updateOne(
                    {
                        _id:
                            new ObjectId(id)
                    },
                    {
                        $set: {

                            text: text.trim(),

                            difficulty:
                                difficulty.toLowerCase(),

                            updatedAt:
                                new Date()

                        }
                    }
                );


        if (
            result.matchedCount === 0
        ) {

            return res.status(404).json({
                success: false,
                message: "Paragraph not found."
            });

        }


        res.json({

            success: true,

            message:
                "Paragraph updated successfully."

        });


    } catch (error) {

        console.error(
            "Update paragraph error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to update paragraph."
        });

    }

};


/* =========================================
   DELETE PARAGRAPH
========================================= */

const deleteParagraph = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        if (!ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid paragraph ID."
            });

        }


        const db = getDatabase();


        const result =
            await db.collection("paragraphs")
                .deleteOne({
                    _id:
                        new ObjectId(id)
                });


        if (
            result.deletedCount === 0
        ) {

            return res.status(404).json({
                success: false,
                message: "Paragraph not found."
            });

        }


        res.json({

            success: true,

            message:
                "Paragraph deleted successfully."

        });


    } catch (error) {

        console.error(
            "Delete paragraph error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to delete paragraph."
        });

    }

};


module.exports = {
    getParagraphs,
    addParagraph,
    updateParagraph,
    deleteParagraph
};