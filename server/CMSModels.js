'use strict'

const dayjs=require('dayjs')


function Block(id_b,type,content,id_page){
    this.id_b=id_b;
    this.type=type;
    this.content=content;
    this.id_page=id_page;
}
function Page(id_p,title,author,creationDate,publicationDate,blocks){
    this.id_p=id_p;
    this.title=title;
    this.author=author;
    this.creationDate=dayjs(creationDate);
    this.publicationDate=dayjs(publicationDate);
    this.blocks=blocks;
}

module.exports={Page,Block};