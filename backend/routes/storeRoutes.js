import express from "express";
import { dbConn } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const query = 'SELECT * FROM stores';
    dbConn.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching stores', error: err });
        }
        res.json(results);
    });
});

router.get("/:id/ratings", async (req, res) => {
    const storeId = req.params.id;
    const query = 'SELECT AVG(rating) as averageRating FROM ratings WHERE store_id = ?';
    dbConn.query(query, [storeId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching ratings', error: err });
        }
        res.json(results[0]);
    });
});

router.post("/rate", async (req, res) => {
    const { userId, storeId, rating } = req.body;
    if (!userId || !storeId || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Invalid rating submission' });
    }
    const query = 'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?';
    dbConn.query(query, [userId, storeId, rating, rating], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error submitting rating', error: err });
        }
        res.json({ message: 'Rating submitted successfully' });
    });
});

export default router;
