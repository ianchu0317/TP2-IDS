CREATE TABLE IF NOT EXISTS comments (
  id          SERIAL PRIMARY KEY,
  comment     VARCHAR(1024) NOT NULL,
  creator_id  INT NOT NULL,
  phobia_id   INT NOT NULL,
  date        DATE NOT NULL CURRENT DATE,

  -- Foreign key a users
  CONSTRAINT fk_comment_creator
  FOREIGN KEY (creator_id)
  REFERENCES users(id)

  -- Foreign key a phobias
  CONSTRAINT fk_comment_phobia
  FOREIGN KEY (phobia_id)
  REFERENCES phobias(id) 


  
);
