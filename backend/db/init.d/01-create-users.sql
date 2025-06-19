CREATE TABLE IF NOT EXISTS users (
  id               SERIAL PRIMARY KEY,
  usuario          VARCHAR(50) UNIQUE NOT NULL,
  contraseña       VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  mail             VARCHAR(100) UNIQUE NOT NULL,
  telefono         VARCHAR(20)
);

