-- CREATE DATABASE echoes;

CREATE TABLE
    users (
        id UUID PRIMARY KEY NOT NULL,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        reset_password_token VARCHAR(10),
        reset_password_expiry BIGINT
    );

CREATE TABLE
    posts (
        id UUID NOT NULL PRIMARY KEY,
        author VARCHAR(100) NOT NULL,
        author_id UUID REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        body TEXT NOT NULL,
        cover VARCHAR(1000),
        views INT DEFAULT 0,
        createdAt TIMESTAMPTZ NOT NULL,
        updatedAt TIMESTAMPTZ NOT NULL
    );

INSERT INTO
    users (username, email, password)
VALUES (
        'Arya',
        'arya@gmail.com',
        'Arya@123'
    );

INSERT INTO
    posts (
        author,
        author_id,
        title,
        summary,
        body,
        cover,
        createdAt,
        updatedAt
    )
VALUES (
        'Arya',
        1,
        'ila be winnieng',
        'whodunnit',
        'Mr Blanc or Monsieur Poirot',
        'that''s what she said',
        '2023-07-06T08:01:28.943Z',
        '2023-07-06T08:01:28.943Z'
    );