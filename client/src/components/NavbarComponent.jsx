import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Nav, Form,Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';
import { useState,useContext } from 'react'
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect} from 'react'
import context from 'react-bootstrap/esm/AccordionContext';
// import TitleContext from "./ContextComponent";
import { TitleContext } from './ContextComponent';

function NavBar(props) {
  
  const title = useContext(TitleContext);

  

  return (
    
    <Navbar id="color-nav" expand="sm" variant="light" fixed="top" className="navbar-padding">
    <Navbar.Brand href="index.html">
    <Link class="my-own-color" to="/">
    <i className="bi bi-file-earmark"></i><i>{title}</i>
    </Link>
    </Navbar.Brand>
    <Nav className="justify-content-end" style={{ width: "100%" }}>
    <Nav.Item>
    <Container fluid>
    <Row>
    <Col md="auto">
    {props.loggedIn && props?.user?.role=='admin'? <Link to={`pages/admin/title`} className='btn btn-outline-light' ><i class="bi bi-pencil-square"></i></Link>:<></>}
   
    </Col>
    <Col xs lg="2">
    {!props.loggedIn ?  <Link to='/login' className='btn btn-outline-light'>Login</Link>:
        <LogoutButton logout={props.handleLogout} /> 
         }
    </Col>
    </Row>
         </Container>
    </Nav.Item>
    </Nav>
</Navbar>

  );
}


export default NavBar;
