// Import Boostrap and CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { useEffect, useState } from 'react'
import NavBar from "./components/NavbarComponent";
import PageTable from "./components/PageComponent";
import { Container, Row, Col, Button } from 'react-bootstrap'
import {Routes,Route, BrowserRouter} from 'react-router-dom'
import API from './API'
function App() {
  const [pages,setPages]=useState([]);
  
  useEffect(()=>{
    //get all the pages from API
    const getPages=async()=>{
     const pages= await API.getPages();
     setPages(pages);
    }
    //call function that just create now
    getPages();
  },[]);
  return (
    <BrowserRouter>
        <Routes>
        <Route element={
          
          <Container fluid className='App'>
           <NavBar/>
           <PageTable pages={pages}/>
           </Container>
           
        }>
        <Route index 
              element={ <PageTable pages={pages}/> } />
      {/* <Route path='pages' 
              element={<PageTable
        pages={pages}
      />} /> */}
      </Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App
