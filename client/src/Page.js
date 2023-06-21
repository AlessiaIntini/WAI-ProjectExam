"use strict";
import dayjs from "dayjs";

export class Page {
  /**
   * Creates a new instance of StudyPlan
   * @param {number} id_p id to identificate page
   * @param {string} title title of page
   * @param {User} author author of the page that can be only a user
   * @param {Date} creationDate date when page is created 
   * @param {Date} publicationDate date when page is publicated
   * @param {Block[]} blocks blocks associated with the page
   */
  constructor(id_p,title, author, creationDate,publicationDate,blocks) {
    this.id_p=id_p;
    this.title = title;
    this.author = author;
    this.creationDate = dayjs(creationDate);
    this.publicationDate = dayjs(publicationDate);
    this.blocks=blocks;

    this.addBlock=(block)=>{
      this.blocks.push(block);
    }
    this.serialize = () => {
      return {id_p: this.id_p, title: this.title, author: this.author, creationDate: this.creationDate.format('YYYY-MM-DD'), publicationDate:this.publicationDate.format('YYYY-MM-DD'), blocks: this.blocks};
    }

  }
}

export class Block {
  /**
   * Creates a new instance of StudyPlan
   * @param {number} id id to identificate block
   * @param {string} type type of block
   */
  constructor(id, type,content,page_id,pos) {
    this.id=id;
    this.type=type;
    this.content=content;
    this.page_id=page_id;
    this.pos=pos;
  }
}


export default {Page,Block}
