import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  Banknote,
  CreditCard,
  UserRound,
} from "lucide-react";
import LogoWhite from "../../assets/images/logo-white.png";
import { apiurl } from "./Http";
import { toast } from "react-toastify";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        localStorage.removeItem("userInfo");
        setUser(null);
      }
    }
  }, []);

  return (
    <footer className="footer py-5 text-white">
      <div className="container">
        <div className="row g-4">
          {/* About */}
          <div className="col-lg-3 col-md-6">
            <img
              src={LogoWhite}
              alt="Logo"
              className="logo-white mb-3"
            />

            <p className="footer-description pe-lg-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptas, amet corporis. Necessitatibus assumenda, velit
              quod ducimus est reiciendis repellat.
            </p>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-6">
            <h2 className="footer-title mb-3">Categories</h2>

            <ul className="footer-links">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/collections/${category.slug}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6">
            <h2 className="footer-title mb-3">Quick Links</h2>

            <ul className="footer-links">
              {user ? (
                <>
                  <li>
                    <Link to="/account">
                      <UserRound size={16} className="me-2" />
                      My Account
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>

                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h2 className="footer-title mb-3">Get In Touch</h2>

            <ul className="footer-links">
              <li>
                <a href="tel:+919999999999">
                  +91 99999 99999
                </a>
              </li>

              <li>
                <a href="mailto:info@example.com">
                  info@example.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Spotlight */}
        <div className="row spotlight mt-5 py-4">
          <div className="col-md-4">
            <div className="spotlight-item">
              <Truck size={24} />

              <h3>Free Delivery</h3>
              <p>On orders above ₹999</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="spotlight-item">
              <Banknote size={24} />

              <h3>Money Back Guarantee</h3>
              <p>Easy returns within 7 days</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="spotlight-item">
              <CreditCard size={24} />

              <h3>Secure Payment</h3>
              <p>100% secure checkout</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright text-center pt-4 mt-4">
          <p className="mb-0">
            © {new Date().getFullYear()} Your Store. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;