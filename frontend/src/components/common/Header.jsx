import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Logo from "../../assets/images/logo.png";
import { apiurl } from "./Http";

const Header = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiurl}get-categories`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (result.status && Array.isArray(result.data)) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Category Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <header className="shadow">
      <div className="bg-dark text-center py-3">
        <span className="text-white">
          Your fashion Partner
        </span>
      </div>

      <Navbar expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              src={Logo}
              alt="Fashion Partner"
              width={170}
            />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="navbarScroll"
            aria-label="Toggle navigation"
          />

          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
              {categories.map((category) => (
                <Nav.Link
                  key={category.id}
                  href={`/collections/${category.slug}`}
                >
                  {category.name}
                </Nav.Link>
              ))}
            </Nav>

            <div className="nav-right d-flex">
              <a
                href="/login"
                className="ms-3"
                aria-label="Account"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="currentColor"
                  className="bi bi-person"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1 0 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332C3.154 12.01 3.002 12.75 3 12.996z" />
                </svg>
              </a>

              <a
                href="/cart"
                className="ms-3"
                aria-label="Shopping cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="28"
                  fill="currentColor"
                  className="bi bi-bag"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A3.5 3.5 0 1 0 5.5 4h-3v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V4h-3v-.5A2.5 2.5 0 0 0 8 1m-3.5 3v-.5a3.5 3.5 0 1 1 7 0V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                </svg>
              </a>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;