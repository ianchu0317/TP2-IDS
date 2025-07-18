CREATE TABLE IF NOT EXISTS phobias (
  id           SERIAL PRIMARY KEY,
  phobia_name  VARCHAR(100) NOT NULL,
  description  TEXT,
  creator_id   INT NOT NULL,
  likes        INT DEFAULT 0,
  date         DATE NOT NULL DEFAULT CURRENT_DATE,

  -- definimos la foreing key hacia user.id
  CONSTRAINT fk_phobias_creator
  FOREIGN KEY (creator_id)
  REFERENCES users(id)
);
