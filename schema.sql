CREATE TABLE if not exists tv_shows (
	id serial primary key,
	name character varying(255) NOT NULL,
	aired DATE,
	works BOOLEAN,
	tagline TEXT, 
	poster character varying(255) NOT NULL,
	des character varying(255),
	leng character varying(255),
	network character varying(255),
	url character varying(255)
);

CREATE TABLE if not exists category (
	id serial primary key,
	name character varying(255) NOT NULL
);

CREATE TABLE if not exists show_category (
	id serial primary key,
	category_id INTEGER,
	tv_shows_id INTEGER,
	FOREIGN KEY (category_id) REFERENCES category (id),
	FOREIGN KEY (tv_shows_id) REFERENCES tv_shows (id)
);

CREATE TABLE if not exists seasons (
	id serial primary key,
	name character varying(255),
	aired DATE,
	description TEXT,
	poster character varying(255),
	tv_show_id INTEGER,
	FOREIGN KEY (tv_show_id) REFERENCES shows (id)
);

CREATE TABLE if not exists shows (
	id serial primary key,
	number INTEGER,
	aired DATE,
	description TEXT,
	season_id INTEGER,
	FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE if not exists users (
	id serial primary key,
	name character varying(255) NOT NULL UNIQUE,
	email character varying(255) NOT NULL UNIQUE,
	password character varying(255) NOT NULL,
	role boolean DEFAULT false
);

CREATE TABLE if not exists user_tv_shows (
	id serial primary key,
	tv_shows_id INTEGER,
	user_id INTEGER,
	status character varying(255) NOT NULL,
	rating INTEGER
);
