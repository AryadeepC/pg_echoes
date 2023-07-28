-- CREATE DATABASE echoes;

CREATE TABLE
    users (
        id UUID PRIMARY KEY NOT NULL,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        reset_password_token VARCHAR(255),
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
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    );

EXPLAIN ANALYZE SELECT * FROM posts;

ALTER TABLE posts ADD COLUMN search_docs tsvector;

UPDATE posts
SET
    search_docs = setweight(to_tsvector(title), A) || setweight(to_tsvector(author), C) || setweight(to_tsvector(summary), B) || setweight(to_tsvector(body), D);

SELECT *
FROM posts
WHERE
    search_docs @@ websearch_to_tsquery('test')
ORDER BY
    ts_rank(
        search_docs,
        websearch_to_tsquery('test')
    ) ASC;

SELECT *
FROM posts
WHERE
    search_docs @@ to_tsquery('simple','e:*')
ORDER BY
    ts_rank(
        search_docs,
        to_tsquery('simple','e:*')
    );



CREATE INDEX search_idx ON posts USING gin (search_docs);


DROP INDEX search_idx;

ALTER TABLE posts RENAME COLUMN search_terms TO search_docs;


SELECT *
FROM posts
WHERE
    search_terms @@ to_tsquery('simple','co:*');

SELECT *
FROM posts
WHERE
    search_terms @@ websearch_to_tsquery('test');







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