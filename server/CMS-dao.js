
const sqlite = require('sqlite3');
const {Page, Block} = require('./CMSModels');

// open the database
const db = new sqlite.Database('CMS.sqlite', (err) => {
  if (err) throw err;
});

exports.listPages = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Page';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      const pages = rows.map((p) => new Page(p.id,p.title,p.author,p.creationDate,p.publicationDate));
      resolve(pages);
    });
  });
}
//operations on pages and blocks