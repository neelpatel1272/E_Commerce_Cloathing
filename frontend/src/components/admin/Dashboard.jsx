import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  Package,
  Tags,
  FolderTree,
  Truck,
  CalendarDays,
} from "lucide-react";
import Sidebar from "../common/Sidebar";
import { admintoken, apiurl } from "../common/Http";

const Dashboard = () => {
  const [counts, setCounts] = useState({ users: 0, orders: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const authHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${admintoken()}`,
  };

  const fetchCount = async (endpoint) => {
    try {
      const res = await fetch(`${apiurl}${endpoint}`, {
        method: "GET",
        headers: authHeaders,
      });
      const result = await res.json();
      return result?.status === true && Array.isArray(result.data)
        ? result.data.length
        : 0;
    } catch (error) {
      console.error(`Failed to load ${endpoint}`, error);
      return 0;
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    const [users, orders, products] = await Promise.all([
      fetchCount("users"),
      fetchCount("orders"),
      fetchCount("products"),
    ]);
    setCounts({ users, orders, products });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    { label: "Users", value: counts.users, icon: Users, cls: "stat-users" },
    { label: "Orders", value: counts.orders, icon: ShoppingCart, cls: "stat-orders" },
    { label: "Products", value: counts.products, icon: Package, cls: "stat-products" },
  ];

  const quickActions = [
    { label: "Add Product", icon: Package, to: "/admin/products/create" },
    { label: "Add Category", icon: FolderTree, to: "/admin/categories/create" },
    { label: "Add Brand", icon: Tags, to: "/admin/brands/create" },
    { label: "View Shippings", icon: Truck, to: "/admin/shippings" },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <Sidebar />

        <div className="col-md-9">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="banner-text">
              <h2>Welcome back, Admin 👋</h2>
              <p>Here's what's happening in your store today.</p>
            </div>
            <div className="banner-date">
              <CalendarDays size={15} />
              {today}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="row g-4 mb-4">
            {stats.map(({ label, value, icon: Icon, cls }) => (
              <div className="col-md-4" key={label}>
                <div className={`stat-card ${cls}`}>
                  <div className="stat-icon">
                    <Icon size={26} />
                  </div>
                  <div className="stat-info">
                    <h2>{loading ? "—" : value}</h2>
                    <span>{label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h6 className="fw-bold mb-3">Quick Actions</h6>
          <div className="quick-actions">
            {quickActions.map(({ label, icon: Icon, to }) => (
              <Link className="quick-action-card" to={to} key={label}>
                <div className="qa-icon">
                  <Icon size={19} />
                </div>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;