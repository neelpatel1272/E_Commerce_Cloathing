import React from "react";
import LogoWhite from "../../assets/images/logo-white.png";

const Footer = () => {
  return (
    <footer className="footer py-5 text-white">
      <div className="container">
        {/* Main Footer */}
        <div className="row g-4">
          {/* About */}
          <div className="col-lg-3 col-md-6 ">
            <img src={LogoWhite} alt="Logo" className="logo-white mb-3" />

            <p className="footer-description pe-lg-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
              amet corporis. Necessitatibus assumenda, velit quod ducimus est
              reiciendis repellat.
            </p>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-6">
            <h2 className="footer-title mb-3">Categories</h2>

            <ul className="footer-links">
              <li>
                <a href="#">Mens</a>
              </li>
              <li>
                <a href="#">Womens</a>
              </li>
              <li>
                <a href="#">Kids</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6">
            <h2 className="footer-title mb-3">Quick Links</h2>

            <ul className="footer-links">
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="#">Register</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h2 className="footer-title mb-3">Get In Touch</h2>

            <ul className="footer-links">
              <li>
                <a href="tel:+919999999999">+91 99999 99999</a>
              </li>

              <li>
                <a href="mailto:info@example.com">info@example.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Spotlight */}
        <div className="row spotlight mt-5 py-4">
          <div className="col-md-4">
            <div className="spotlight-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-truck"
                viewBox="0 0 16 16"
              >
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"></path>
              </svg>

              <h3>Free Delivery</h3>
              <p>On orders above ₹999</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="spotlight-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-cash"
                viewBox="0 0 16 16"
              >
                <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"></path>
                <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z"></path>
              </svg>

              <h3>Money Back Guarantee</h3>
              <p>Easy returns within 7 days</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="spotlight-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-credit-card-2-back"
                viewBox="0 0 16 16"
              >
                <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5z"></path>
                <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1m-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1"></path>
              </svg>

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
