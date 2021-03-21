DROP TABLE IF EXISTS series CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS seriesCategory CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS episodeUser CASCADE;
DROP TABLE IF EXISTS seriesUser CASCADE;

CREATE TABLE IF NOT EXISTS series (
	id serial primary key,
	name character varying(255) NOT NULL,
	airDate DATE,
	works BOOLEAN,
	tagline TEXT, 
	image character varying(255) NOT NULL,
	description TEXT,
	language character varying(255),
	network character varying(255),
	homepage character varying(255)
);

CREATE TABLE IF NOT EXISTS category (
	id serial primary key,
	name character varying(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS seriesCategory (
	id serial primary key,
	category_id INTEGER,
	series_id INTEGER,
	FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE,
	FOREIGN KEY (series_id) REFERENCES series (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seasons (
	id serial primary key,
	name character varying(255),
	number INTEGER,
	airDate DATE,
	overview TEXT,
	poster character varying(255),
	series_id INTEGER,
	FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS episodes (
	id serial primary key,
	name character varying(255),
	number INTEGER,
	airDate DATE,
	overview TEXT,
	season_id INTEGER,
	FOREIGN KEY (season_id) REFERENCES seasons (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
	id serial primary key,
	name character varying(255) NOT NULL UNIQUE,
	email character varying(255) NOT NULL UNIQUE,
	password character varying(255) NOT NULL,
	role boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS seriesUser (
	id serial primary key,
	status character varying(255),
	rating INTEGER,
	series_id INTEGER,
	user_id INTEGER,
	FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
