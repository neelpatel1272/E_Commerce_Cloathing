import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  Save,
  Hash,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../common/Sidebar";
import Loader from "../../common/Loader";
import { admintoken, apiurl } from "../../common/Http";

const STATUSES = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock3,
    className: "pending",
    description: "Order is waiting to be processed",
  },
  {
    value: "shipped",
    label: "Shipped",
    icon: Truck,
    className: "shipped",
    description: "Order has been shipped",
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
    className: "delivered",
    description: "Order has been delivered",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    className: "cancelled",
    description: "Order has been cancelled",
  },
];

const PAYMENT_STATUSES = [
  { value: "paid", label: "Paid" },
  { value: "not paid", label: "Not Paid" },
];

const formatPrice = (price) => Number(price || 0).toLocaleString("en-IN");

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
      return "pending";
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return <CheckCircle2 size={17} />;
    case "shipped":
      return <Truck size={17} />;
    case "cancelled":
      return <XCircle size={17} />;
    default:
      return <Clock3 size={17} />;
  }
};

const getProgress = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    case "cancelled":
      return 0;
    default:
      return 1;
  }
};

const Details = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const params = useParams();

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${apiurl}orders/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${admintoken()}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.status === true && result.data) {
        setOrder(result.data);
        setItems(result.data.items || []);
        setSelectedStatus(result.data.status || "pending");
        setSelectedPaymentStatus(result.data.payment_status || "not paid");
      } else {
        toast.error(result.message || "Order not found");
        setOrder(null);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Unable to fetch order details");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const updateOrder = async () => {
    if (!selectedStatus) {
      toast.error("Please select an order status");
      return;
    }

    if (!selectedPaymentStatus) {
      toast.error("Please select a payment status");
      return;
    }

    if (
      selectedStatus === order.status &&
      selectedPaymentStatus === order.payment_status
    ) {
      toast.info("No changes to update");
      return;
    }

    setUpdatingStatus(true);

    try {
      const res = await fetch(`${apiurl}update-order/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${admintoken()}`,
        },
        body: JSON.stringify({
          status: selectedStatus,
          payment_status: selectedPaymentStatus,
        }),
      });

      const result = await res.json();

      if (res.ok && result.status === true) {
        toast.success(result.message || "Order updated successfully");
        setOrder((prev) => ({
          ...prev,
          status: selectedStatus,
          payment_status: selectedPaymentStatus,
        }));
      } else {
        toast.error(result.message || "Unable to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Something went wrong while updating order");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const progress = getProgress(order?.status);

  if (loading) {
    return (
      <div className="container-fluid order-details-page px-4 py-4">
        <div className="row">
          <Sidebar />
          <div className="col-md-9">
            <div className="order-loader">
              <Loader />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-fluid order-details-page px-4 py-4">
        <div className="row">
          <Sidebar />
          <div className="col-md-9">
            <div className="order-not-found">
              <div className="empty-icon">
                <Package size={42} />
              </div>
              <h3>Order Not Found</h3>
              <p>
                The order you are looking for doesn't exist or has been removed.
              </p>
              <Link to="/admin/orders" className="back-orders-btn">
                <ArrowLeft size={16} />
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCancelled = order.status?.toLowerCase() === "cancelled";
  const isPaid = order.payment_status === "paid";

  return (
    <div className="container-fluid order-details-page px-4 py-4">
      <div className="row">
        <Sidebar />
        <div className="col-md-9">
          <div className="order-hero">
            <div className="hero-top">
              <Link to="/admin/orders" className="hero-back">
                <ArrowLeft size={16} />
                <span>Back to Orders</span>
              </Link>
              <div className="hero-actions">
                <span className="order-id-badge">
                  <Hash size={13} />
                  {order.id}
                </span>
                <span className={`hero-status ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status || "Pending"}</span>
                </span>
              </div>
            </div>

            <div className="hero-content">
              <div className="hero-main">
                <div className="order-label">ORDER DETAILS</div>
                <h1>
                  Order <span>#{order.id}</span>
                </h1>
                <div className="hero-meta">
                  <span>
                    <Calendar size={14} />
                    {formatDate(order.created_at)}
                  </span>
                  <i></i>
                  <span>
                    <ShoppingBag size={14} />
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                  <i></i>
                  <span>
                    <CreditCard size={14} />
                    {order.payment_method || "N/A"}
                  </span>
                </div>
              </div>
              <div className="hero-total">
                <span>Order Total</span>
                <strong>₹{formatPrice(order.grand_total)}</strong>
                <small>{isPaid ? "Payment received" : "Payment pending"}</small>
              </div>
            </div>

            {!isCancelled ? (
              <div className="order-progress">
                <div className="progress-track">
                  <div
                    className="progress-filled"
                    style={{
                      width:
                        progress === 1 ? "0%" : progress === 2 ? "50%" : "100%",
                    }}
                  ></div>
                </div>

                <div
                  className={`progress-step ${progress >= 1 ? "active" : ""}`}
                >
                  <div className="step-circle">
                    {progress > 1 ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Clock3 size={16} />
                    )}
                  </div>
                  <div>
                    <strong>Pending</strong>
                    <span>Order placed</span>
                  </div>
                </div>

                <div
                  className={`progress-step ${progress >= 2 ? "active" : ""}`}
                >
                  <div className="step-circle">
                    {progress >= 3 ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Truck size={16} />
                    )}
                  </div>
                  <div>
                    <strong>Shipped</strong>
                    <span>On the way</span>
                  </div>
                </div>

                <div
                  className={`progress-step ${progress >= 3 ? "active" : ""}`}
                >
                  <div className="step-circle">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <strong>Delivered</strong>
                    <span>Order completed</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="cancelled-progress">
                <div className="cancelled-icon">
                  <XCircle size={18} />
                </div>
                <div>
                  <strong>Order Cancelled</strong>
                  <span>This order is no longer being processed.</span>
                </div>
              </div>
            )}
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="premium-card customer-card">
                <div className="card-heading">
                  <div className="heading-icon purple">
                    <User size={18} />
                  </div>
                  <div>
                    <h3>Customer Information</h3>
                    <span>Contact details of the customer</span>
                  </div>
                </div>

                <div className="customer-grid">
                  <div className="customer-item">
                    <div className="item-icon">
                      <User size={16} />
                    </div>
                    <div className="item-content">
                      <label>Full Name</label>
                      <strong>{order.name || "-"}</strong>
                    </div>
                  </div>

                  <div className="customer-item">
                    <div className="item-icon">
                      <Mail size={16} />
                    </div>
                    <div className="item-content">
                      <label>Email Address</label>
                      <strong>{order.email || "-"}</strong>
                    </div>
                  </div>

                  <div className="customer-item">
                    <div className="item-icon">
                      <Phone size={16} />
                    </div>
                    <div className="item-content">
                      <label>Phone Number</label>
                      <strong>{order.mobile || "-"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-card">
                <div className="card-heading">
                  <div className="heading-icon blue">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3>Shipping Address</h3>
                    <span>Delivery information</span>
                  </div>
                </div>

                <div className="shipping-content">
                  <div className="shipping-map-icon">
                    <MapPin size={22} />
                  </div>
                  <div className="shipping-details">
                    <div className="shipping-name">{order.name || "-"}</div>
                    <p>
                      {order.address || "-"}
                      <br />
                      {order.city || "-"}, {order.state || "-"} -{" "}
                      {order.zip || "-"}
                    </p>
                    {order.mobile && (
                      <div className="shipping-phone">
                        <Phone size={13} />
                        <span>{order.mobile}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="premium-card products-card">
                <div className="card-heading product-heading">
                  <div className="heading-left">
                    <div className="heading-icon orange">
                      <Package size={18} />
                    </div>
                    <div>
                      <h3>Order Items</h3>
                      <span>Products included in this order</span>
                    </div>
                  </div>

                  <span className="items-count">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                <div className="products-list">
                  {items.length > 0 ? (
                    <>
                      <div className="products-header">
                        <div>Product</div>
                        <div>Price</div>
                        <div>Qty</div>
                        <div>Total</div>
                      </div>

                      {items.map((item) => {
                        const price = Number(item.price || 0);
                        const qty = Number(item.qty || 0);
                        const itemTotal = price * qty;

                        // const imageUrl = item.product?.image || null;

                        return (
                          <div className="product-item" key={item.id}>
                            <div className="product-main">
                              <div className="product-image">
                                {item.product?.image_url ? (
                                  <img
                                    src={item.product.image_url}
                                    alt={item.name || item.product?.title || "Product"}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <Package size={24} />
                                )}
                              </div>

                              <div className="product-name">
                                <strong>{item.name || "-"}</strong>
                                {item.product_id && (
                                  <small>Product ID: {item.product_id}</small>
                                )}
                                {item.size && <span>Size: {item.size}</span>}
                              </div>
                            </div>

                            <div className="product-column product-price">
                              <span className="mobile-label">Price</span>
                              <strong>₹{formatPrice(price)}</strong>
                            </div>

                            <div className="product-column product-quantity">
                              <span className="mobile-label">Qty</span>
                              <strong>{qty}</strong>
                            </div>

                            <div className="product-column product-total">
                              <span className="mobile-label">Total</span>
                              <strong>₹{formatPrice(itemTotal)}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="no-products">
                      <Package size={35} />
                      <p>No products found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="status-update-card">
                <div className="status-update-header">
                  <div className="status-update-icon">
                    <Truck size={19} />
                  </div>
                  <div>
                    <h3>Update Order</h3>
                    <span>Manage order status</span>
                  </div>
                </div>

                <div className="status-section">
                  <div className="status-section-title">
                    <span>Order Status</span>
                  </div>

                  <div className="status-options">
                    {STATUSES.map((status) => {
                      const Icon = status.icon;
                      const isSelected = selectedStatus === status.value;

                      return (
                        <button
                          type="button"
                          key={status.value}
                          className={`status-option ${isSelected ? `selected ${status.className}` : ""}`}
                          onClick={() => setSelectedStatus(status.value)}
                          disabled={updatingStatus}
                        >
                          <div
                            className={`status-option-icon ${status.className}`}
                          >
                            <Icon size={17} />
                          </div>

                          <div className="status-option-content">
                            <strong>{status.label}</strong>
                            <small>{status.description}</small>
                          </div>

                          <div className="status-radio">
                            {isSelected ? (
                              <CheckCircle2 size={17} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="payment-status-section">
                  <div className="payment-status-title">
                    <CreditCard size={16} />
                    <span>Payment Status</span>
                  </div>

                  <div className="payment-select-wrapper">
                    <select
                      className="form-select payment-status-select"
                      value={selectedPaymentStatus}
                      onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                      disabled={updatingStatus}
                    >
                      {PAYMENT_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="update-status-btn"
                  onClick={updateOrder}
                  disabled={
                    updatingStatus ||
                    (selectedStatus === order.status &&
                      selectedPaymentStatus === order.payment_status)
                  }
                >
                  {updatingStatus ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="order-footer">
            <Link to="/admin/orders" className="footer-back">
              <ArrowLeft size={15} />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
