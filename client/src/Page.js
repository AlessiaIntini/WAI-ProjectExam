"use strict";

export class Page {
  /**
   * Creates a new instance of StudyPlan
   * @param {number} id id to identificate page
   * @param {string} title title of page
   * @param {User} author author of the page that can be only a user
   * @param {Date} creationDate date when page is created 
   * @param {Date} publicationDate date when page is publicated
   * @param {Block[]} blocks blocks associated with the page
   */
  constructor(id,title, author, creationDate,publicationDate,blocks) {
    this.id=id
    this.title = title;
    this.author = author;
    this.creationDate = creationDate;
    this.publicationDate = publicationDate;
    this.blocks=blocks;

    this.addBlock=(block)=>{
      this.blocks.push(block);
    }

  }
}

export class Block {
  /**
   * Creates a new instance of StudyPlan
   * @param {number} id id to identificate block
   * @param {string} type type of block
   */
  constructor(id, type,content,page_id) {
    this.id=id;
    this.type=type;
    this.content=content;
    this.page_id=page_id;
  }
}


export default {Page,Block}
