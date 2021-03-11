CREATE TABLE tv_shows {
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
}

CREATE TABLE category {
	id serial primary key,
	name character varying(255) NOT NULL
}

CREATE TABLE show_category {
	id serial primary key,
	category_id INTEGER,
	tv_shows_id INTEGER
	FOREIGN KEY category_id REFERENCES category (id),
	FOREIGN KEY shows_id REFERENCES tv_shows (id),
}

CREATE TABLE seasons {
	id serial primary key,
	name character varying(255),
	aired DATE,
	description TEXT,
	poster character varying(255),
	tv_show_id INTEGER,
	FOREIGN KEY (tv_show_id) REFERENCES Shows(id)
}

CREATE TABLE shows {
	id serial primary key,
	number INTEGER,
	aired DATE,
	description TEXT,
	season_id INTEGER,
	FOREIGN KEY (season_id) REFERENCES seasons(id)
}

CREATE TABLE users {
	id serial primary key,
	name character varying(255) NOT NULL UNIQ,
	email character varying(255) NOT NULL UNIQ,
	password character varying(255) NOT NULL,
	role boolean DEFAULT false
}

CREATE TABLE user_tv_shows {
	id serial primary key,
	tv_shows_id INTEGER,
	user_id INTEGER,
	status character varying(255) NOT NULL,
	rating INTEGER
}
