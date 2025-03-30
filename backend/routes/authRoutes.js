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
            console.log(err,'err',result,'result')
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
        res.json({ token, role: user.role });
    });
});

export default router;