
const sqlite = require('sqlite3');
const {Page, Block} = require('./CMSModels');

// open the database
const db = new sqlite.Database('CMS.sqlite', (err) => {
  if (err) throw err;
});

exports.listPages = () => {
  return new Promise((resolve, reject) => {

   const sql1='SELECT * FROM Block'
   db.all(sql1, [], (err, rows) => {
    if (err) {
      reject(err);
    }
    const blocks = rows.map((b) => new Block(b.id_b,b.type,b.content,b.page_id));

    const sql = 'SELECT * FROM Page';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      const pages = rows.map((row) => {
        const b = blocks
          .filter((c) => c.id_page === row.id_p)
          .map((block) => new Block(block.id_b,block.type,block.content,block.page_id)
           );
          // .reduce((p1,p2)=> p1.page_id === p2.page_id ? p1.blocks.push(new Block(p2.id_b,p2.type,p2.content,p2.page_id)):{ })
        
      //const pages = rows.map((p) => new Page(p.id_p,p.title,p.author,p.creationDate,p.publicationDate,new Block(p.id_b,p.type,p.content,p.id_page)));
      const page=new Page(row.id_p,row.title,row.author,row.creationDate,row.publicationDate,b)
      return page
    })
      resolve(pages);
     })
    });

 });
}

// exports.updateAnswer = (answer, answerId) => {
//   return new Promise ((resolve, reject) => {
//     const sql = 'UPDATE answer SET text=?, author=?, date=DATE(?), score=? WHERE id=?';
//     db.run(sql, [answer.text, answer.author, answer.date, answer.score, answerId], function(err) {
//       if(err) {
//         console.log(err);
//         reject(err);
//       }
//       else resolve(this.lastID);
//     });
//   });
// };


//operations on pages and blocks