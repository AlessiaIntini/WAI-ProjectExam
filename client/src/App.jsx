// Import Boostrap and CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { useEffect, useState } from 'react'
import NavBar from "./components/NavbarComponent";
import PageTable from "./components/PageComponent";
import { Container, Row, Col, Button,Alert } from 'react-bootstrap'
import {Routes,Route, BrowserRouter,Outlet,Navigate } from 'react-router-dom'
import SinglePage from "./components/SinglePageComponent";
import API from './API'
import NotFound from './components/NotFoundComponent';
import { LoginForm } from './components/AuthComponents';
import PageForm from "./components/PageFormComponents";
function App() {
  const [pages,setPages]=useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser]=useState('')

  useEffect(()=>{
    //get all the pages from API
    const getPages=async()=>{
     const pages= await API.getPages();
    // console.log(pages)
    setPages(pages);

    }
    //call function that just create now
    getPages();
  },[]);

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
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
  };

  return (
  <BrowserRouter>
      <Routes>
        <Route element={
          <>
          
           <NavBar loggedIn={loggedIn} handleLogout={handleLogout}/>
           <Container fluid className='App'>
           {message && <Row>
                  <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                </Row> }
                <Outlet/>
           </Container>
           </>}>

        <Route index 
          element={ <PageTable pages={pages} loggedIn={loggedIn} user={user}/> } />
        <Route path='/pages' 
              element={<PageForm user={user} />} />
        <Route path='pages/:pageId' 
          element={<PageForm  user={user}/> } />
        
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
