import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Nav, Form} from 'react-bootstrap';


function NavBar(props) {
  return (
    <Navbar id="color-nav" expand="sm" variant="light" fixed="top" className="navbar-padding">
    <Navbar.Brand href="index.html">
    <i class="bi bi-file-earmark"></i> CMSMALL
    </Navbar.Brand>
    <Nav className="justify-content-end" style={{ width: "100%" }}>
    <Nav.Item>
    {/* {props.loggedIn ? 
         <LogoutButton logout={props.handleLogout} /> :
            <Link to='/login'className='btn btn-outline-light'>Login</Link>
      } */}
        { <Nav.Link href="#">
        <i className="bi bi-person-circle icon-size"/>
        </Nav.Link> }
    </Nav.Item>
    </Nav>
</Navbar>
  );
}


export default NavBar;
