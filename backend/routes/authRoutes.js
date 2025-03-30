import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbConn } from '../db/index.js';
import { UserRoleEnum } from '../enums/UserRoleEnum.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, address, password, role = UserRoleEnum.USER } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, address, password, role) VALUES ($1, $2, $3, $4, $5)';
        const values = [name, email, address, hashedPassword, role];
        await dbConn.query(query, values);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
        const result = await dbConn.query(query, [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role, user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
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
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await dbConn.query(query, [userId]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = 'UPDATE users SET password = $1 WHERE id = $2';
        await dbConn.query(updateQuery, [hashedPassword, userId]);
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/users', async (req, res) => {
    const query = 'SELECT * FROM users';
    try {
        const result = await dbConn.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

export default router;