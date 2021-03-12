CREATE TABLE IF NOT EXISTS series (
	id serial primary key,
	name character varying(255) NOT NULL,
	airDate DATE,
	works BOOLEAN,
	tagline TEXT, 
	image character varying(255) NOT NULL,
	description character varying(255),
	language character varying(255),
	network character varying(255),
	homepage character varying(255)
);

CREATE TABLE IF NOT EXISTS category (
	id serial primary key,
	name character varying(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS seriesCategory (
	id serial primary key,
	category_id INTEGER,
	series_id INTEGER,
	FOREIGN KEY (category_id) REFERENCES category (id),
	FOREIGN KEY (series_id) REFERENCES series (id)
);

CREATE TABLE IF NOT EXISTS seasons (
	id serial primary key,
	name character varying(255),
	number INTEGER,
	airDate DATE,
	overview TEXT,
	poster character varying(255),
	series_id INTEGER,
	FOREIGN KEY (series_id) REFERENCES series(id)
);

CREATE TABLE IF NOT EXISTS episodes (
	id serial primary key,
	number INTEGER,
	airDate DATE,
	overview TEXT,
	season_id INTEGER,
	series_id INTEGER,
	FOREIGN KEY (season_id) REFERENCES seasons (id),
	FOREIGN KEY (series_id) REFERENCES series (id)
);

CREATE TABLE IF NOT EXISTS users (
	id serial primary key,
	name character varying(255) NOT NULL UNIQUE,
	email character varying(255) NOT NULL UNIQUE,
	password character varying(255) NOT NULL,
	role boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS episodeUser (
	id serial primary key,
	episodes_id INTEGER,
	user_id INTEGER,
	status character varying(255) NOT NULL,
	rating INTEGER,
	FOREIGN KEY (episodes_id) REFERENCES episodes(id)
	FOREIGN KEY (user_id) REFERENCES users(id)
);
