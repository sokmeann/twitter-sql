-- CREATE TABLES -- FOR OWN REFERENCE OF QUERIES

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name TEXT DEFAULT NULL,
picture_url TEXT
);

CREATE TABLE tweets (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) NOT NULL,
content TEXT DEFAULT NULL
);
