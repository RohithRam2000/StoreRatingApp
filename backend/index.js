import express from 'express';
import cors from 'cors';
import storeRoutes from './routes/storeRoutes.js';
import authRoutes from './routes/authRoutes.js';

import { dbConn } from './db/index.js';



const app = express();
app.use(cors());
app.use(express.json());
app.use('/stores', storeRoutes);
app.use('/auth', authRoutes);


dbConn.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.listen(5555, () => {
    console.log('Server running on port 5000');
});
