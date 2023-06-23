'use strict'

const dayjs=require('dayjs')


function Block(id_b,type,content,id_page,pos){
    this.id_b=id_b;
    this.type=type;
    this.content=content;
    this.id_page=id_page;
    this.pos=pos;
}
function Page(id_p,title,author,creationDate,publicationDate,blocks,editBlocks=0,deleteBlocks=0,newBlocks=0){
    this.id_p=id_p;
    this.title=title;
    this.author=author;
    this.creationDate=dayjs(creationDate);
    this.publicationDate=dayjs(publicationDate);
    this.blocks=blocks;
    this.editBlocks=editBlocks
    this.deleteBlocks=deleteBlocks;
    this.newBlocks=newBlocks;
}

module.exports={Page,Block};