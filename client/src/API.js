import {Page} from './Page'
const SERVER_URL = 'http://localhost:3001';
import dayjs from 'dayjs';

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

const getPages = async ()=>{
    const response=await fetch(`${SERVER_URL}/api/pages`, {
      method: 'GET',
      credentials: 'include'
    });
    if(response.ok){
        const pagesJson=await response.json();  
        let pages=pagesJson.map(page=>new Page(page.id_p,page.title,page.author, dayjs(page.creationDate).format('YYYY-MM-DD'), dayjs(page.publicationDate).format('YYYY-MM-DD'),page.blocks));
        return pages
    }else
        throw new Error('Internal server error');
}

const updatePage = async (page) => {
    const response = await fetch(`${SERVER_URL}/api/pages/${page.id_p}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({id_p:page.id_p,title: page.title, author: page.author, creationDate: dayjs(page.creationDate).format('YYYY-MM-DD'), publicationDate: dayjs(page.publicationDate).format('YYYY-MM-DD'),blocks:page.blocks})
    });
  
    if(!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
    }
    else return null;
};

  const addPage = async (page) => {
    const response = await fetch(`${SERVER_URL}/api/pages`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({id_p:page.id_p,title: page.title, author: page.author, creationDate: dayjs(page.creationDate).format('YYYY-MM-DD'), publicationDate: dayjs(page.publicationDate).format('YYYY-MM-DD'), blocks:page.blocks})
    });
  
    if(!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
    }
    else{

      // const r=response.json().then(function (result){
      // console.log(res.result)
      let r=await response.json()
      r=r+1;
      return r
    } 
  }
const API={getPages,updatePage,logIn,getUserInfo,logOut,addPage}
export default API;
