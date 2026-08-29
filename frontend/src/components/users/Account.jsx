import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  ShoppingBag,
  Store,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Home,
  MapPinned,
} from "lucide-react";
import Layout from "../common/Layout";
import { apiurl, usertoken } from "../common/Http";
import { toast } from "react-toastify";

const Account = () => {
  const [user, setUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
     if (!/^[6-9]\d{9}$/.test(user.mobile || "")) {
    toast.error("Enter a valid 10 digit mobile number");
    return;
  }

  if (!/^\d{6}$/.test(user.zip || "")) {
    toast.error("Enter a valid 6 digit ZIP code");
    return;
  }

    setLoading(true);
    try {
      const res = await fetch(`${apiurl}update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${usertoken()}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          address: user.address,
          city: user.city,
          state: user.state,
          zip: user.zip,
          mobile: user.mobile,
        }),
      });

      const result = await res.json();

      if (res.ok && result.status === true) {
        localStorage.setItem("userInfo", JSON.stringify(user));
        toast.success(result.message || "Profile Updated Successfully");
        setShowEdit(false);
      } else {
        if (result.error) {
          const firstError = Object.values(result.error)[0];
          toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          toast.error(result.message || "Unable to update profile");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <Layout>
      <main className="account-page">
        <div className="container">
          <div className="account-wrapper">
            <div className="account-header">
              <div className="account-header-content">
                <div className="account-avatar">{firstLetter}</div>
                <div>
                  <span className="account-label">MY ACCOUNT</span>
                  <h1>Welcome, {user.name}</h1>
                  <p>Manage your profile, orders and account information.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="account-logout-btn"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>

            <div className="account-grid">
              <div className="account-card profile-card">
                <div className="account-card-top">
                  <div className="account-card-icon">
                    <UserRound size={22} />
                  </div>
                  <button
                    type="button"
                    className="profile-edit-btn"
                    onClick={() => setShowEdit(true)}
                  >
                    <Edit3 size={15} />
                    Edit Profile
                  </button>
                </div>
                <div className="account-card-content">
                  <span className="card-label">PERSONAL INFORMATION</span>
                  <h3>{user.name}</h3>
                  <div className="profile-info-list">
                    <div>
                      <Mail size={16} />
                      <span>{user.email || "Email not available"}</span>
                    </div>
                    <div>
                      <Phone size={16} />
                      <span>{user.mobile || "Mobile not available"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/account/orders"
                className="account-card account-card-link"
              >
                <div className="account-card-icon orders-icon">
                  <ShoppingBag size={22} />
                </div>
                <div className="account-card-content">
                  <span className="card-label">ORDERS</span>
                  <h3>My Orders</h3>
                  <p>View your order history and track your purchases.</p>
                  <strong className="account-card-action">View Orders →</strong>
                </div>
              </Link>

              <Link to="/" className="account-card account-card-link">
                <div className="account-card-icon shopping-icon">
                  <Store size={22} />
                </div>
                <div className="account-card-content">
                  <span className="card-label">SHOPPING</span>
                  <h3>Continue Shopping</h3>
                  <p>Explore our latest products and discover something new.</p>
                  <strong className="account-card-action">
                    Start Shopping →
                  </strong>
                </div>
              </Link>
            </div>

            <div className="account-details-section">
              <div className="section-heading">
                <div>
                  <span className="account-label">PROFILE</span>
                  <h2>Profile Details</h2>
                  <p>Your saved contact and delivery information.</p>
                </div>
                <button
                  type="button"
                  className="section-edit-btn"
                  onClick={() => setShowEdit(true)}
                >
                  <Edit3 size={15} />
                  Edit Details
                </button>
              </div>

              <div className="profile-details-grid">
                <div className="profile-detail-item">
                  <div className="detail-icon">
                    <UserRound size={17} />
                  </div>
                  <div>
                    <span>Full Name</span>
                    <strong>{user.name || "-"}</strong>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="detail-icon">
                    <Mail size={17} />
                  </div>
                  <div>
                    <span>Email Address</span>
                    <strong>{user.email || "-"}</strong>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="detail-icon">
                    <Phone size={17} />
                  </div>
                  <div>
                    <span>Mobile Number</span>
                    <strong>{user.mobile || "-"}</strong>
                  </div>
                </div>
                <div className="profile-detail-item profile-address">
                  <div className="detail-icon">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <span>Delivery Address</span>
                    <strong>{user.address || "-"}</strong>
                    <small>
                      {user.city || "-"}, {user.state || "-"} -{" "}
                      {user.zip || "-"}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="account-bottom">
              <div>
                <h4>Account Information</h4>
                <p>
                  You are currently logged in as <strong>{user.email}</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="account-bottom-logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>

      {showEdit && (
        <div
          className="profile-modal-overlay"
          onClick={() => setShowEdit(false)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div>
                <span className="account-label">ACCOUNT SETTINGS</span>
                <h2>Edit Profile</h2>
                <p>Update your personal and delivery information.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <UserRound size={17} />
                    <input
                      type="text"
                      name="name"
                      value={user.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={17} />
                   <input
                    type="email"
                    name="email"
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    value={user.email || ""}
                    onChange={handleChange}
                    required
                  />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Mobile Number</label>
                  <div className="input-with-icon">
                    <Phone size={17} />
                      <input 
                        type="tel" 
                        maxLength={10} 
                        name="mobile" 
                        pattern="^[6-9]\d{9}$" 
                        title="Enter a valid 10 digit mobile number"
                        value={user.mobile || ""} 
                        onChange={handleChange} 
                       onKeyDown={(e) => {
                                if (
                                  e.ctrlKey ||
                                  e.metaKey ||
                                  [
                                    "Backspace",
                                    "Delete",
                                    "Tab",
                                    "Escape",
                                    "Enter",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Home",
                                    "End",
                                  ].includes(e.key)
                                ) {
                                  return;
                                }

                                if (!/^[0-9]$/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                        required 
                      />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>ZIP Code</label>
                  <div className="input-with-icon">
                    <MapPinned size={17} />
                   <input
                    type="text"
                    name="zip"
                    maxLength={6}
                    inputMode="numeric"
                    value={user.zip || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setUser({ ...user, zip: value });
                    }}
                    required
                  />
                  </div>
                </div>

                <div className="profile-form-group full-width">
                  <label>Address</label>
                  <div className="input-with-icon textarea-icon">
                    <Home size={17} />
                    <textarea
                      name="address"
                      value={user.address || ""}
                      onChange={handleChange}
                      rows="3"
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={user.city || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={user.state || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="profile-modal-footer">
                <button
                  type="button"
                  className="cancel-profile-btn"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Account;
