import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Logo from "../../assets/images/logo.png";
import { apiurl } from "./Http";
import { CartContext } from "../context/Cart";
import CartDrawer from "../pages/CartDrawer";
import { UserRound, ShoppingBag } from "lucide-react";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  const { cartData } = useContext(CartContext);

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

  const checkUser = () => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error("User info error:", error);
        localStorage.removeItem("userInfo");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchCategories();
    checkUser();
  }, []);

  const cartCount = cartData.reduce(
    (total, item) => total + Number(item.qty || 0),
    0,
  );

  return (
    <>
      <header className="shadow">
        <div className="bg-dark text-center py-3">
          <span className="text-white">Your fashion Partner</span>
        </div>

        <Navbar expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              <img src={Logo} alt="Fashion Partner" width={170} />
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
                <Link
                  to={user ? "/account" : "/login"}
                  className="ms-3"
                  aria-label={user ? "My Account" : "Login"}
                  title={user ? "My Account" : "Login"}
                >
                  <UserRound size={27} strokeWidth={1.7} />
                </Link>
                <button
                  type="button"
                  className="header-cart ms-3"
                  onClick={() => setCartOpen(true)}
                  aria-label="Shopping cart"
                >
                  <ShoppingBag size={27} strokeWidth={1.7} />

                  {cartCount > 0 && (
                    <span className="header-cart-count">{cartCount}</span>
                  )}
                </button>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
export default Header;
