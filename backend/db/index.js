import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const getDbConnection = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
};

export const dbConn = getDbConnection();

