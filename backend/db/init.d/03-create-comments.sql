CREATE TABLE IF NOT EXISTS comments (
  id          SERIAL PRIMARY KEY,
  comment     VARCHAR(1024) NOT NULL,
  creator_id  INT NOT NULL,
  phobia_id   INT NOT NULL,
  date        DATE NOT NULL
);
