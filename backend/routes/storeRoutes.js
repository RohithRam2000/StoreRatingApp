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

router.get("/ratings", async (req, res) => {
    const query = 'SELECT * FROM ratings';      
    dbConn.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching ratings', error: err });
        }
        res.json(results);
    }); 
}
);


// add another route to get ratings by userId
router.get("/ratings/:userId", async (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT * FROM ratings WHERE user_id = ?';
    dbConn.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching ratings', error: err });
        }
        res.json(results);
    });
});

router.post("/:storeId/rate", async (req, res) => {
    const { userId, rating } = req.body;
    const storeId = req.params.storeId;

    if (!userId || !storeId || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Invalid rating submission' });
    }

    const checkQuery = 'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?';
    dbConn.query(checkQuery, [userId, storeId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking existing rating', error: err });
        }

        const updateAverageRating = () => {
            const avgQuery = 'SELECT AVG(rating) as averageRating FROM ratings WHERE store_id = ?';
            dbConn.query(avgQuery, [storeId], (avgErr, avgResults) => {
                if (avgErr) {
                    return res.status(500).json({ message: 'Error calculating average rating', error: avgErr });
                }

                const averageRating = avgResults[0].averageRating;
                const updateStoreQuery = 'UPDATE stores SET avg_rating = ? WHERE id = ?';
                dbConn.query(updateStoreQuery, [averageRating, storeId], (updateStoreErr) => {
                    if (updateStoreErr) {
                        return res.status(500).json({ message: 'Error updating store average rating', error: updateStoreErr });
                    }
                    res.json({ message: 'Rating processed and average rating updated successfully' });
                });
            });
        };

        if (results.length > 0) {
            const updateQuery = 'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?';
            dbConn.query(updateQuery, [rating, userId, storeId], (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({ message: 'Error updating rating', error: updateErr });
                }
                updateAverageRating();
            });
        } else {
            const insertQuery = 'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)';
            dbConn.query(insertQuery, [userId, storeId, rating], (insertErr) => {
                if (insertErr) {
                    return res.status(500).json({ message: 'Error submitting rating', error: insertErr });
                }
                updateAverageRating();
            });
        }
    });
});

export default router;
