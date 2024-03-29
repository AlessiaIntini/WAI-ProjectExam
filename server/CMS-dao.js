
const sqlite = require('sqlite3');
const {Page, Block,Title} = require('./CMSModels');

// open the database
const db = new sqlite.Database('CMS.sqlite', (err) => {
  if (err) throw err;
});

//operations on pages and blocks
//list of all pages
exports.listPages = () => {
  return new Promise((resolve, reject) => {
   const sql1='SELECT * FROM Block'
   db.all(sql1, [], (err, rows) => {
    if (err) {
      reject(err);
    }
    const blocks = rows.map((b) => new Block(b.id_b,b.type,b.content,b.page_id,b.pos));

    const sql = 'SELECT * FROM Page';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      const pages = rows.map((row) => {
        const b = blocks
          .filter((c) => c.id_page === row.id_p)
          .map((block) => new Block(block.id_b,block.type,block.content,block.page_id,block.pos)
           );
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

//update an existing page
exports.updatePage=(page,pageId)=>{
  return new Promise ((resolve, reject) => {
    const sql = 'UPDATE Page SET  title=?, author=?, creationDate=DATE(?),  publicationDate=DATE(?) WHERE id_p=?';
    db.run(sql, [page.title,page.author,page.creationDate, page.publicationDate, pageId], function(err) {

      if(err) {
        console.log(err);
        reject(err);
      }
    for(const bp of page.blocks){
      exports.updatePositionBlock(bp,bp.id_b)
    }
    
    if(page.newBlocks.length>0){
      for(const block of page.newBlocks){
        exports.addBlock(block,pageId)
      }
    }
    
    if(page?.editableBlock?.length>0){
      for(const block of page.editableBlock){
        exports.updateBlock(block,block.id_b)
      }
    }
    if(page?.deleteBlocks?.length>0){
      for(const block of page.deleteBlocks ){
        exports.deleteBlocksByContent(block)
        exports.deleteBlocksById(block.id_b)
        
      }
    }

    resolve(exports.getBlocks(pageId))
  })
  });
};

exports.getBlocks=(pageId)=>{
  return new Promise ((resolve, reject) => {
  const sql1 = 'SELECT * FROM Block WHERE page_id=?';
    db.all(sql1, [pageId], (err, rows) => {
      if (err) {
        reject(err);
      }
      let blocks = rows.map((b) => new Block(b.id_b,b.type,b.content,b.page_id,b.pos));
      resolve(blocks)
    })
    });
    
}

//delete a page
exports.deletePage=(page,pageId)=>{
  return new Promise((resolve, reject) => {

    exports.deleteBlocksByPageid(pageId)

    const sql = 'DELETE FROM Page WHERE id_p=?';
    db.run(sql, [pageId], function (err) {
      if (err) {
        reject(err);
      }
      resolve(null)
    });
  });

}

//add block to new page
exports.addBlock=(block,pageId)=>{
 return new Promise ((resolve, reject) => {
      const sql2 = 'INSERT INTO Block(id_b, page_id, type, content,pos) VALUES (?, ?,?, ?,?)';
      db.run(sql2, [block.id_b , pageId ,block.type, block.content,block.pos], function(err) {
        if(err) reject(err);
        else resolve(this.lastID);
      
    })
  })
}

//delete block
exports.deleteBlocksByPageid=(pageId)=>{
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Block WHERE page_id=?';
    db.run(sql, [pageId], function (err) {
      if (err) {
        reject(err);
      }
    });
  });

}

exports.deleteBlocksById=(blockId)=>{
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Block WHERE id_b=?';
    db.run(sql, [blockId], function (err) {
      if (err) {
        reject(err);
      }
    });
  });
}

exports.deleteBlocksByContent=(block)=>{
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Block WHERE page_id=? AND type=? AND content=?';
    db.run(sql, [block.page_id,block.type,block.content], function (err) {
      if (err) {
        reject(err);
      }
    });
  });
}

//update block
exports.updateBlock=(block,blockId)=>{
  return new Promise ((resolve, reject) => {
    const sql = 'UPDATE Block SET content=? WHERE id_b=?';
    db.run(sql, [block.content, blockId], function(err) {
      if(err) {
        console.log(err);
        reject(err);
      }
      else resolve(this.lastID);
    });
  });

}

//update position block in page
exports.updatePositionBlock=(block,blockId)=>{
  return new Promise ((resolve, reject) => {
    const sql = 'UPDATE Block SET pos=? WHERE id_b=?';
    db.run(sql, [block.pos, blockId], function(err) {
      if(err) {
        console.log(err);
        reject(err);
      }
      else resolve(this.lastID);
    });
  });
}
//get title of website
exports.getTitle=()=>{
  return new Promise ((resolve, reject) => {
    const sql1 = 'SELECT * FROM Title';
      db.all(sql1, [], (err, row) => {
        if (err) {
          reject(err);
        }
        let title =new Title(row[0].id,row[0].titleAdmin,row[0].titleDefault)
        resolve(title)
      })
      });
}

//update title
exports.editTitle=(title,id)=>{
  return new Promise ((resolve, reject) => {
    const sql1 = 'UPDATE Title SET titleAdmin=? WHERE id=?';
      db.run(sql1, [title.titleAdmin,1], (err, row) => {
        if (err) {
          reject(err);
        }
        else
        resolve(1)
      })
      });
}
