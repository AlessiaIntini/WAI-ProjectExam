
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

//add new page
exports.addPage = (page) => {
  return new Promise ((resolve, reject) => {

    if(page.publicationDate<page.creationDate){
      resolve({ error: 'dates are wrong.' });
    }else{
    const sql = 'INSERT INTO Page(id_p, title, author, creationDate, publicationDate) VALUES (?, ?,?, DATE(?), DATE(?))';
    db.run(sql, [page.id_p ,page.title, page.author, page.creationDate, page.publicationDate], function(err) {
      if(err){ reject(err);
      }else{
        for(const block of page.blocks){
          exports.addBlock(block,this.lastID)
        }
        resolve(this.lastID);
      }
    })
  }
    
  });

};

exports.addBlock=(block,pageId)=>{
 return new Promise ((resolve, reject) => {
      
      const sql2 = 'INSERT INTO Block(id_b, page_id, type, content) VALUES (?, ?,?, ?)';
      db.run(sql2, [block.id_b , pageId ,block.type, block.content], function(err) {
        if(err) reject(err);
        else resolve(this.lastID);
      
    })
  })
}

//update an existing page
exports.updatePage=(page,pageId)=>{
  return new Promise ((resolve, reject) => {
    const sql = 'UPDATE page SET  title=?,  publicationDate=DATE(?) WHERE id_p=?';
    db.run(sql, [page.title,  page.publicationDate, pageId], function(err) {
      if(err) {
        console.log(err);
        reject(err);
      }
      else resolve(this.lastID);
    });
  });
};
//operations on pages and blocks