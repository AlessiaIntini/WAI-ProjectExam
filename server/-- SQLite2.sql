-- -- SQLite
CREATE TABLE Block (
	id	TEXT PRIMARY KEY,
	id_page	TEXT ,
	type	TEXT ,
	content	TEXT ,
    FOREIGN KEY (id) REFERENCES Page(id_page)
);
-- DROP TABLE Block