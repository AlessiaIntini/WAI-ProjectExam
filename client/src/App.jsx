// Import Boostrap and CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import dayjs from 'dayjs';

import { Component, useEffect, useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import NavBar from "./components/NavbarComponent";
import PageTable from "./components/PageComponent";
import { Container, Row, Col, Button,Alert } from 'react-bootstrap'
import {Routes,Route, BrowserRouter,Outlet,Navigate } from 'react-router-dom'
import TitleForm from './components/TitleFormComponent';
import API from './API'
import NotFound from './components/NotFoundComponent';
import { LoginForm } from './components/AuthComponents';
import PageForm from "./components/PageFormComponents";
import context from "react-bootstrap/esm/AccordionContext";
// import TitleContext from "./components/ContextComponent";

function App() {
  const [pages,setPages]=useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser]=useState(null)
  const [lastID,setLastId]=useState();
  const navigate=useNavigate;
  const title = useContext(context);

  // const [title,setTitle]=useState('')

  // useEffect(()=>{
  //   //get all the pages from API
  //   const getTitle=async()=>{
  //   let titleA= await API.getTitle().then(
  //   setTitle(titleA));
  //   }
  //   //call function that just create now
  //   getTitle();
  // },[]);

  useEffect(() => {
    const checkAuth = async () => {
      await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
   
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut().then(()=>{
    setLoggedIn(false);
    setUser(null)
    setMessage('');
  });
  };

  return (
  <BrowserRouter>
      <Routes>
        <Route element={
          <>
          
           <NavBar user={user} loggedIn={loggedIn} handleLogout={handleLogout}/>
           <Container fluid className='App'>
           {message && <Row>
                  <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                </Row> }
                <Outlet/>
           </Container>
           </>}>

        <Route index
          element={ <PageTable setPages={setPages} setLastId={setLastId} pages={pages} loggedIn={loggedIn} user={user}/> } />
        <Route path='/pages' 
              element={<PageForm setPages={setPages} user={user} />} />
        <Route path='/pages/:pageId' 
          element={<PageForm  user={user}/> } />
        <Route path='/pages/admin/title'
            element={ <TitleForm/> }
        />
        <Route path='*' element={ <NotFound/> } />
        <Route path='/login' element={
              loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
            } />
        </Route>
      </Routes>
  </BrowserRouter>
      )
}

export default App
