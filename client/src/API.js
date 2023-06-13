import {Page} from './Page'
const SERVER_URL = 'http://localhost:3001';

const getPages = async ()=>{
    const response=await fetch(SERVER_URL+'/api/pages');
    if(response.ok){
        const pagesJson=await response.json();  
        return pagesJson.map(p=>new Page(p.id,p.title,p.author,p.creationDate,p.publicationDate));
    }else
        throw new Error('Internal server error');
}

const API={getPages}
export default API;
