import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Nav, Form,Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';
import { Container } from 'react-bootstrap';


function NavBar(props) {
  return (
    <Navbar id="color-nav" expand="sm" variant="light" fixed="top" className="navbar-padding">
    <Navbar.Brand href="index.html">
    <i className="bi bi-file-earmark"></i> CMSMALL
    </Navbar.Brand>
    <Nav className="justify-content-end" style={{ width: "100%" }}>
    <Nav.Item>
    <Container fluid>
    {!props.loggedIn && props.user==null ?  <Link to='/login' className='btn btn-outline-light'>Login</Link>:
        <LogoutButton logout={props.handleLogout} /> 
       
         }
         </Container>
    </Nav.Item>
    </Nav>
</Navbar>
  );
}


export default NavBar;
