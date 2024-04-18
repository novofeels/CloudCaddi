
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export const NavBar = ({currentUser}) => {
    const navigate = useNavigate()



    const isLoggedIn = localStorage.getItem("Caddi_User")
  return (
    <Navbar bg="light" expand="lg">
    <Navbar.Brand href="/">Navbar</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link >New Round</Nav.Link>
     
        {isLoggedIn && (
            <Nav.Link onClick={() => {
                localStorage.removeItem("Caddi_User");
                navigate("/login", { replace: true });
              }}>LOGOUT</Nav.Link>
              
        )
    }
        
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  );
}

