-- Esquema base de adidas3d (PostgreSQL), reconstruido desde las entidades TypeORM
-- del backend compilado. Verifica contra: pg_dump -U postgres -s adidas3d
--
-- Uso:
--   createdb -U postgres adidas3d
--   psql -U postgres -d adidas3d -f database/schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- El backend genera el id de sesion como AAAAMMDD_NNN usando nextval('sessions_sec').
CREATE SEQUENCE IF NOT EXISTS sessions_sec START 1;

CREATE TABLE IF NOT EXISTS sessions (
    id            varchar(20)  PRIMARY KEY,
    session_start timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status        varchar(255) NOT NULL DEFAULT 'active',
    session_end   timestamp    NULL
);

CREATE TABLE IF NOT EXISTS customise (
    id              uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      varchar      NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    tablet_id       varchar(2)   NOT NULL,
    line_id         varchar(255) NOT NULL,
    user_name       varchar(255) NOT NULL,
    round_id        varchar(255) NOT NULL,
    "timestamp"     timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    product_type    varchar(255) NOT NULL,
    product_id      varchar(255) NOT NULL,
    -- TypeORM "simple-array": valores separados por coma, p. ej. "var_color_rojo,var_emb_01"
    personalization text         NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customise_session   ON customise(session_id);
CREATE INDEX IF NOT EXISTS idx_customise_timestamp ON customise("timestamp");
