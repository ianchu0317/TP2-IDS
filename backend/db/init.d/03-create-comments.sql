CREATE TABLE IF NOT EXISTS comments (
  id          SERIAL PRIMARY KEY,
  comment     VARCHAR(255) NOT NULL,
  creator_id  INT NOT NULL,
  phobia_id   INT NOT NULL,
  likes       INT DEFAULT 0,
  date        DATE NOT NULL
);
