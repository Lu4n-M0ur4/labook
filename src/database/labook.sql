-- Active: 1700574792135@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

CREATE TABLE
    posts(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER NOT NULL DEFAULT(0),
        dislikes INTEGER NOT NULL DEFAULT(0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (creator_id) 
        REFERENCES users (id) 
        ON UPDATE CASCADE 
        ON DELETE CASCADE
    )

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL DEFAULT(0),
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE
)

INSERT INTO users
VALUES (
        'u001',
        'Fulano',
        'fulano@email.com',
        'fulano123',
        'token123',
        '2023-10-16T12:00:0.000Z'
    ),
    (
        'u002',
        'Beltrana',
        'beltrana@email.com',
        'beltrana00',
        'token123',
        '2023-11-16T12:00:0.000Z'
    );

    INSERT INTO posts 
    VALUES(
        'p001',
        'u001',
        'Olá Mundo',
        0,
        0,
        '2023-10-16T13:00:0.000Z',
        '2023-10-16T13:00:0.000Z'
    ),(
        'p002',
        'u002',
        'Olá Galera da minha rede',
        0,
        0,
        '2023-10-16T13:00:0.000Z',
        '2023-10-16T13:00:0.000Z'
    );

    INSERT INTO likes_dislikes 
    VALUES (
        'u001',
        'p002',
        0
    )

    UPDATE posts SET dislikes = 1 WHERE id = 'p002';

SELECT * FROM posts;

DROP Table posts;