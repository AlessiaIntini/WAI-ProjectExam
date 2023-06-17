import {Page} from './Page'
const SERVER_URL = 'http://localhost:3001';

const getPages = async ()=>{
    const response=await fetch(SERVER_URL+'/api/pages');
    if(response.ok){
        const pagesJson=await response.json();  
        return pagesJson.map(p=>new Page(p.id,p.title,p.author,p.creationDate,p.publicationDate,p.blocks));
    }else
        throw new Error('Internal server error');
}

const updatePage = async (page) => {
    const response = await fetch(`${SERVER_URL}/api/pages/${page.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text: page.text, author: answer.name, score: answer.score, date: answer.date.format('YYYY-MM-DD')})
    });
  
    if(!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
    }
    else return null;
  }
  const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  };
  
  const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
  };
  
  const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
  }
const API={getPages,updatePage,logIn,getUserInfo,logOut}
export default API;
