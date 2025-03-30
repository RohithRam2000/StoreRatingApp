import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbConn } from '../db/index.js'
import { UserRoleEnum } from '../enums/UserRoleEnum.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, address, password, role = UserRoleEnum.USER } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)';
        dbConn.query(query, [name, email, address, hashedPassword, role], (err, result) => {
            console.log(err, 'err', result, 'result')
            if (err) {
                return res.status(500).json({ message: 'Error registering user', error: err });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    dbConn.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role, user });
    });
});

router.post('/changepassword', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const query = 'SELECT * FROM users WHERE id = ?';
        dbConn.query(query, [userId], async (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).json({ message: 'User not found' });
            }
            const user = results[0];
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';

            dbConn.query(updateQuery, [hashedPassword, userId], (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({ message: 'Error updating password', error: updateErr });
                }
                res.json({ message: 'Password changed successfully' });
            }
            );
        }
        );
    } catch (error) {
        console.log(error,'error')
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Server error' });
    }
}
);



export default router;