-- SQLite
-- SQLite
CREATE TABLE Block (
	id	TEXT PRIMARY KEY,
	id_page	TEXT ,
	type	TEXT ,
	content	TEXT ,
    FOREIGN KEY (id_page) REFERENCES Page(id)
);