'use strict';

const sqlite=require('sqlite3');

//open database
const db = new sqlite.Database('CMS.sqlite', (err) => {
    if (err) throw err;
  });
