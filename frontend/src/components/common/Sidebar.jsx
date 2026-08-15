import React, { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Tags,
  FolderTree,
  Package,
  ShoppingCart,
  Truck,
  Users,
  LockKeyhole,
  LogOut,
  Plus,
  List,
  ChevronDown,
} from "lucide-react";
import { AdminAuthContext } from "../context/AdminAuth";

const Sidebar = () => {
  const { logout } = useContext(AdminAuthContext);
  const location = useLocation();

  const isBrandPage = location.pathname.startsWith("/admin/brands");
  const isCategoryPage = location.pathname.startsWith("/admin/categories");
  const isProductPage = location.pathname.startsWith("/admin/products");

  const [openMenu, setOpenMenu] = useState(() => {
    if (isBrandPage) return "brands";
    if (isCategoryPage) return "categories";
    if (isProductPage) return "products";
    return null;
  });

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <div className="col-md-3">
      <div className="card border-0 shadow-sm sidebar mb-4">
        <div className="card-body p-3">
          <ul className="sidebar-menu">

            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li className="sidebar-title">
              <span>Catalog</span>
            </li>

            <li
              className={`has-submenu ${
                openMenu === "brands" ? "open" : ""
              }`}
            >
              <button
                type="button"
                className={`sidebar-menu-link ${
                  isBrandPage ? "active" : ""
                }`}
                onClick={() => toggleMenu("brands")}
              >
                <Tags size={18} />
                <span>Brands</span>
                <ChevronDown
                  size={15}
                  className={`ms-auto chevron ${
                    openMenu === "brands" ? "rotate" : ""
                  }`}
                />
              </button>

              {openMenu === "brands" && (
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink to="/admin/brands" end>
                      <List size={14} />
                      All Brands
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/admin/brands/create">
                      <Plus size={14} />
                      Add Brand
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li
              className={`has-submenu ${
                openMenu === "categories" ? "open" : ""
              }`}
            >
              <button
                type="button"
                className={`sidebar-menu-link ${
                  isCategoryPage ? "active" : ""
                }`}
                onClick={() => toggleMenu("categories")}
              >
                <FolderTree size={18} />
                <span>Categories</span>
                <ChevronDown
                  size={15}
                  className={`ms-auto chevron ${
                    openMenu === "categories" ? "rotate" : ""
                  }`}
                />
              </button>

              {openMenu === "categories" && (
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink to="/admin/categories" end>
                      <List size={14} />
                      All Categories
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/admin/categories/create">
                      <Plus size={14} />
                      Add Category
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li
              className={`has-submenu ${
                openMenu === "products" ? "open" : ""
              }`}
            >
              <button
                type="button"
                className={`sidebar-menu-link ${
                  isProductPage ? "active" : ""
                }`}
                onClick={() => toggleMenu("products")}
              >
                <Package size={18} />
                <span>Products</span>
                <ChevronDown
                  size={15}
                  className={`ms-auto chevron ${
                    openMenu === "products" ? "rotate" : ""
                  }`}
                />
              </button>

              {openMenu === "products" && (
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink to="/admin/products" end>
                      <List size={14} />
                      All Products
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/admin/products/create">
                      <Plus size={14} />
                      Add Product
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li className="sidebar-title">
              <span>Orders</span>
            </li>

            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <ShoppingCart size={18} />
                <span>Orders</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/shippings"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Truck size={18} />
                <span>Shippings</span>
              </NavLink>
            </li>

            <li className="sidebar-title">
              <span>Users</span>
            </li>

            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Users size={18} />
                <span>Users</span>
              </NavLink>
            </li>

            <li className="sidebar-title">
              <span>Account</span>
            </li>

            <li>
              <NavLink
                to="/admin/change-password"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <LockKeyhole size={18} />
                <span>Change Password</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                className="logout-link"
                to="/admin/logout"
                onClick={logout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;