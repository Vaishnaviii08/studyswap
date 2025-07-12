import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const NavbarComponent = () => {

  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand className="fw-bold mx-3" href="/">Studyswap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse className="basic-navbar-nav">
            <Nav className="me-auto d-flex gap-4">
              <Nav.Link href="/">Home</Nav.Link>

              {user && (
              <>
                <Nav.Link href="/upload">Upload</Nav.Link>
              </>
            )}

              <Nav.Link href="/contact">Contact</Nav.Link>
            </Nav>

            <div className="d-flex gap-4 me-3">
              {!user ? (
              <>
                <Button variant="outline-light" href="/login">Login</Button>
                <Button variant="primary" href="/register">Signup</Button>
              </>
            ) : (
              <NavDropdown
                title={user.username || "Account"}
                align="end"
                menuVariant="dark"
                className="text-light"
              >
                <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
