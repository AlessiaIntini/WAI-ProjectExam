'use strict'

const dayjs=require('dayjs')

function Page(id,title,author,creationDate,publicationDate){
    this.id=id;
    this.title=title;
    this.author=author;
    this.creationDate=dayjs(creationDate);
    this.publicationDate=dayjs(publicationDate);
}
function Block(id,type,content,id_page){
    this.id=id;
    this.type=type;
    this.content=content;
    this.id_page=id_page;
}

module.exports={Page,Block};