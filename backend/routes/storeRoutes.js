import express from "express";
import { dbConn } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const query = "SELECT * FROM stores";
    try {
        const result = await dbConn.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json({ message: "Error fetching stores", error });
    }
});

router.get("/:id/ratings", async (req, res) => {
    const storeId = req.params.id;
    const query = "SELECT AVG(rating) as averageRating FROM ratings WHERE store_id = $1";
    try {
        const result = await dbConn.query(query, [storeId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ message: "Error fetching ratings", error });
    }
});

router.get("/ratings", async (req, res) => {
    const query = "SELECT * FROM ratings";
    try {
        const result = await dbConn.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ message: "Error fetching ratings", error });
    }
});

router.get("/ratings/:userId", async (req, res) => {
    const userId = req.params.userId;
    const query = "SELECT * FROM ratings WHERE user_id = $1";
    try {
        const result = await dbConn.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching user ratings:", error);
        res.status(500).json({ message: "Error fetching user ratings", error });
    }
});

router.post("/:storeId/rate", async (req, res) => {
    const { userId, rating } = req.body;
    const storeId = req.params.storeId;

    if (!userId || !storeId || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating submission" });
    }

    try {
        const checkQuery = "SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2";
        const checkResult = await dbConn.query(checkQuery, [userId, storeId]);

        const updateAverageRating = async () => {
            const avgQuery = "SELECT AVG(rating) as averageRating FROM ratings WHERE store_id = $1";
            const avgResult = await dbConn.query(avgQuery, [storeId]);
            const averageRating = avgResult.rows[0].averagerating;

            const updateStoreQuery = "UPDATE stores SET avg_rating = $1 WHERE id = $2";
            await dbConn.query(updateStoreQuery, [averageRating, storeId]);
            res.json({ message: "Rating processed and average rating updated successfully" });
        };

        if (checkResult.rows.length > 0) {
            const updateQuery = "UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3";
            await dbConn.query(updateQuery, [rating, userId, storeId]);
            await updateAverageRating();
        } else {
            const insertQuery = "INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)";
            await dbConn.query(insertQuery, [userId, storeId, rating]);
            await updateAverageRating();
        }
    } catch (error) {
        console.error("Error processing rating:", error);
        res.status(500).json({ message: "Error processing rating", error });
    }
});

export default router;
