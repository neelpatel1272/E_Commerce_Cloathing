import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../../common/Sidebar";
import Loader from "../../common/Loader";
import Nostate from "../../common/Nostate";
import { admintoken, apiurl } from "../../common/Http";

const Show = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiurl}orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${admintoken()}`,
        },
      });

      const result = await res.json();

      if (result.status === true) {
        setOrders(result.data || []);
      } else {
        toast.error(result.message || "Unable to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Unable to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((item) => {
    const searchValue = search.toLowerCase();

    return (
      String(item.id || "").includes(searchValue) ||
      item.name?.toLowerCase().includes(searchValue) ||
      item.email?.toLowerCase().includes(searchValue) ||
      item.mobile?.toLowerCase().includes(searchValue)
    );
  });

  const pendingOrders = orders.filter(
    (item) => item.status?.toLowerCase() === "pending",
  ).length;

  const shippedOrders = orders.filter(
    (item) => item.status?.toLowerCase() === "shipped",
  ).length;

  const deliveredOrders = orders.filter(
    (item) => item.status?.toLowerCase() === "delivered",
  ).length;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "pending";

      case "shipped":
        return "shipped";

      case "delivered":
        return "delivered";

      case "cancelled":
        return "cancelled";

      default:
        return "inactive";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Pending";

      case "shipped":
        return "Shipped";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return status || "Unknown";
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <Sidebar />

        <div className="col-md-9">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h1>Orders</h1>
              <p>Manage and monitor customer orders.</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="mini-stat-card tint-blue">
                <div className="icon-chip">
                  <ShoppingCart size={22} />
                </div>

                <div>
                  <span className="stat-label">Total Orders</span>
                  <span className="stat-value">{orders.length}</span>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="mini-stat-card tint-rose">
                <div className="icon-chip">
                  <Clock size={22} />
                </div>

                <div>
                  <span className="stat-label">Pending</span>
                  <span className="stat-value">{pendingOrders}</span>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="mini-stat-card tint-blue">
                <div className="icon-chip">
                  <Package size={22} />
                </div>

                <div>
                  <span className="stat-label">Shipped</span>
                  <span className="stat-value">{shippedOrders}</span>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="mini-stat-card tint-green">
                <div className="icon-chip">
                  <CheckCircle size={22} />
                </div>

                <div>
                  <span className="stat-label">Delivered</span>
                  <span className="stat-value">{deliveredOrders}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="data-card">
            <div className="data-card-header">
              <div>
                <h3>All Orders</h3>

                <span className="count">
                  {filteredOrders.length} orders found
                </span>
              </div>

              <div className="search-box">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search order, customer or mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="py-5">
                <Loader />
              </div>
            ) : filteredOrders.length === 0 ? (
              <Nostate
                text={
                  search ? "No orders match your search" : "No Orders Found"
                }
              />
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((item, index) => (
                      <tr key={item.id}>
                        {/* Serial Number */}
                        <td className="row-index">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        {/* Order */}
                        <td>
                          <div className="row-entity">
                            <div className="product-image">
                              <div className="product-image-placeholder">
                                <Package size={18} />
                              </div>
                            </div>

                            <div>
                              <span className="entity-name">#{item.id}</span>

                              <small className="d-block text-muted">
                                {item.items?.length || 0} Items
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td>
                          <div>
                            <div className="fw-semibold">
                              {item.name || "-"}
                            </div>

                            <small className="text-muted">
                              {item.email || item.mobile || "-"}
                            </small>
                          </div>
                        </td>

                        {/* Date */}
                        <td>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </td>

                        {/* Total */}
                        <td>
                          <span className="fw-semibold">
                            ₹
                            {Number(item.grand_total || 0).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        </td>

                        {/* Payment */}
                        <td>
                          <div className="text-capitalize">
                            {item.payment_method || "-"}
                          </div>

                          <small className="text-muted text-capitalize">
                            {item.payment_status || "-"}
                          </small>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`status-pill ${getStatusClass(
                              item.status,
                            )}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>

                        {/* View Only */}
                        <td>
                          <div className="row-actions">
                            <Link
                              to={`/admin/orders/show/${item.id}`}
                              title="View Order"
                            >
                              <Eye size={15} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;
