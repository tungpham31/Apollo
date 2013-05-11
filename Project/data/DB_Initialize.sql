drop table if exists users;
drop table if exists topics;
drop table if exists twitts;
drop table if exists userfollow;

CREATE TABLE users(
	username CHAR(255),
	password CHAR(255),
	fullname CHAR(255),
	DOB DATE,
	job CHAR(255),
	country CHAR(255),
	PRIMARY KEY(username)
);

INSERT INTO users(username, password, fullname, DOB, job, country) VALUES
("tim", "mit", "Timothy Richards", "1993-04-28", "Professor", "United States"),
("tungpham31", "tung", "Tung Pham", "1993-04-29", "Software Engineer", "Vietnam"),  
("ant", "ant", "Anthony Moh", "1989-03-11", "Hacker", "Malaysia"),
("albert", "albert", "Albert Williams", "1995-01-30", "Computer Scientist", "Canada"),
("joe", "joe", "Joseph Leclerc", "1992-12-15", "Pimp", "Brazil"),
("obama", "obama", "Barack Obama", "1974-02-19", "President", "France");

CREATE TABLE topics(
	topicname CHAR(255),
	username CHAR(255),
	PRIMARY KEY(username, topicname),
	FOREIGN KEY (username) REFERENCES users
);

INSERT INTO topics(topicname, username) VALUES
("dinosaurs", ""),
("turtles", ""),
("dinosaurs", "tim"),
("dinosaurs", "tungpham31"),
("turtles", "tim");

CREATE TABLE twitts(
	twittdate TIMESTAMP,
	content CHAR(255),
	username CHAR(255),
	fullname CHAR(255),
	topicname CHAR(255),
	PRIMARY KEY (username, topicname, content),
	FOREIGN KEY (username) REFERENCES users
);

INSERT INTO twitts(twittdate, content, username, fullname, topicname) VALUES
("2001-11-21 23:55:55", "I like #dinosaurs", "tim", "Timothy Richards", "dinosaurs"),
("2002-01-13 08:22:25", "I like #turtles and #dinosaurs", "tim", "Timothy Richards", "turtles"),
("2002-01-13 08:22:25", "I like #turtles and #dinosaurs", "tim", "Timothy Richards", "dinosaurs"),
("2004-04-24 21:23:13", "I have a big #dinosaurs", "tungpham31", "Tung Pham", "dinosaurs");

CREATE TABLE userfollow(
	followername CHAR(255),
	followedname CHAR(255),
	PRIMARY KEY (followername, followedname),
	FOREIGN KEY (followername) references users,
	FOREIGN KEY (followedname) references users
);

INSERT INTO userfollow(followername, followedname) VALUES
("tim", "tungpham31"),
("albert", "tungpham31"),
("ant", "tungpham31");