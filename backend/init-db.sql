CREATE DATABASE StoreRatingApp;
USE StoreRatingApp;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) BETWEEN 20 AND 60),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) BETWEEN 8 AND 16),
    address VARCHAR(400),
    role ENUM('admin', 'user', 'storeowner') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(400) NOT NULL,
    owner_id INT NOT NULL,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE (user_id, store_id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
