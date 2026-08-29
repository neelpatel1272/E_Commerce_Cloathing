import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  ShoppingBag,
  Store,
  LogOut,
  Mail,
} from "lucide-react";
import Layout from "../common/Layout";
import { toast } from "react-toastify";

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error("User info error:", error);
        localStorage.removeItem("userInfo");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <Layout>
      <main className="account-page">
        <div className="container">
          <div className="account-wrapper">
            <div className="account-header">
              <div className="account-header-content">
                <div className="account-avatar">
                  {firstLetter}
                </div>

                <div>
                  <h1>My Account</h1>
                  <p>
                    Welcome back, <strong>{user.name}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="account-logout-btn"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>

            <div className="account-grid">
              <div className="account-card">
                <div className="account-card-icon">
                  <UserRound size={24} />
                </div>

                <div className="account-card-content">
                  <span>Personal Information</span>
                  <h3>{user.name}</h3>

                  <div className="account-email">
                    <Mail size={15} />
                    <span>{user.email || "Email not available"}</span>
                  </div>
                </div>
              </div>

              <Link
                to="http://localhost:5173/account/orders"
                className="account-card account-card-link"
              >
                <div className="account-card-icon">
                  <Store size={24} />
                </div>

                <div className="account-card-content">
                  <span>Orders</span>
                  <h3>My Orders</h3>
                  <p>
                    Click here to see order history.
                  </p>
                </div>
              </Link>

              <Link
                to="http://localhost:5173/"
                className="account-card account-card-link"
              >
                <div className="account-card-icon">
                  <Store size={24} />
                </div>

                <div className="account-card-content">
                  <span>Shopping</span>
                  <h3>Continue Shopping</h3>
                  <p>
                    Explore our latest products and collections.
                  </p>
                </div>
              </Link>
            </div>

            <div className="account-bottom">
              <div>
                <h4>Account Information</h4>
                <p>
                  You are currently logged in as{" "}
                  <strong>{user.email}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline-danger"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Account;