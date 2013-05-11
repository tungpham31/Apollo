CREATE TABLE users(
	username CHAR(255),
	password CHAR(255),
	fullName CHAR(255),
	DOB DATE
	job CHAR(255),
	country CHAR(255),
	PRIMARY KEY(username)
);


CREATE TABLE topics(
	topicName CHAR(255)
	username CHAR(255)
	PRIMARY KEY(username, topicName)
	FOREIGN KEY (username) REFERENCES (users)
	ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE twitts(
	twittDate TIMESTAMP
	content CHAR(255)
	username CHAR(255)
	topicName CHAR(255)
	PRIMARY KEY (username, topicName, content)
	FOREIGN KEY (username) REFERENCES (users)
	ON DELETE CASCADE ON UPDATE CASCADE
);