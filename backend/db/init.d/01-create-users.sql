CREATE TABLE IF NOT EXISTS users (
  id                INT PRIMARY KEY,
  username          VARCHAR(50) UNIQUE NOT NULL,
  email             VARCHAR(100) UNIQUE NOT NULL,
  phone             VARCHAR(20)
  hashed_password   VARCHAR(255) NOT NULL,
  register_date     DATE NOT NULL,
);

