import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Phone, Mail, CalendarDays, CreditCard, Truck, CheckCircle2, Clock3, XCircle } from "lucide-react";
import Layout from "../common/Layout";
import Loader from "../common/Loader";
import { apiurl, usertoken } from "../common/Http";
import { toast } from "react-toastify";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`${apiurl}get-order-details/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${usertoken()}`
                }
            });

            const result = await res.json();

            if (res.ok && result.status === true) {
                setOrder(result.data);
            } else {
                toast.error(result.message || "Order not found");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

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
            case "shipped":
                return <Truck size={16} />;
            case "delivered":
                return <CheckCircle2 size={16} />;
            case "cancelled":
                return <XCircle size={16} />;
            default:
                return <Clock3 size={16} />;
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="order-details-loader">
                    <Loader />
                </div>
            </Layout>
        );
    }

    if (!order) {
        return (
            <Layout>
                <div className="container">
                    <div className="order-not-found">
                        <Package size={45} />
                        <h3>Order Not Found</h3>
                        <p>We couldn't find the order you're looking for.</p>
                        <Link to="/account/orders" className="back-orders-btn">
                            <ArrowLeft size={16} />
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    const items = order.items || [];
    const isPaid = order.payment_status === "paid";

    return (
        <Layout>
            <div className="customer-order-details">
                <div className="container">
                    <div className="details-top">
                        <Link to="/account/orders" className="back-link">
                            <ArrowLeft size={16} />
                            Back to Orders
                        </Link>

                        <span className={`order-status ${getStatusClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                        </span>
                    </div>

                    <div className="details-header">
                        <div>
                            <span className="details-label">ORDER DETAILS</span>
                            <h1>Order #{order.id}</h1>

                            <div className="details-meta">
                                <span>
                                    <CalendarDays size={15} />
                                    {order.created_at || "-"}
                                </span>

                                <span>
                                    <Package size={15} />
                                    {items.length} {items.length === 1 ? "Item" : "Items"}
                                </span>

                                <span>
                                    <CreditCard size={15} />
                                    {order.payment_method || "N/A"}
                                </span>
                            </div>
                        </div>

                        <div className="details-total">
                            <span>Total</span>
                            <strong>₹{Number(order.grand_total || 0).toLocaleString("en-IN")}</strong>
                            <small>{isPaid ? "Payment received" : "Payment pending"}</small>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="customer-order-card">
                                <div className="card-title">
                                    <div className="title-icon">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <h3>Order Items</h3>
                                        <span>Products in your order</span>
                                    </div>
                                </div>

                                <div className="customer-products">
                                    {items.map((item) => {
                                        const price = Number(item.price || 0);
                                        const qty = Number(item.qty || 0);
                                        const total = price * qty;
                                        const image = item.image_url || (item.product?.image ? `${apiurl.replace("/api/", "/") }uploads/products/large/${item.product.image}` : null);

                                        return (
                                            <div className="customer-product" key={item.id}>
                                                <div className="customer-product-image">
                                                    {image ? (
                                                        <img src={image} alt={item.name || "Product"} />
                                                    ) : (
                                                        <Package size={25} />
                                                    )}
                                                </div>

                                                <div className="customer-product-info">
                                                    <strong>{item.name || item.product?.title || "-"}</strong>
                                                    {item.size && <span>Size: {item.size}</span>}
                                                    <small>Qty: {qty}</small>
                                                </div>

                                                <div className="customer-product-price">
                                                    <span>₹{price.toLocaleString("en-IN")}</span>
                                                    <strong>₹{total.toLocaleString("en-IN")}</strong>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="order-summary">
                                    <div>
                                        <span>Subtotal</span>
                                        <strong>₹{Number(order.sub_total || 0).toLocaleString("en-IN")}</strong>
                                    </div>

                                    <div>
                                        <span>Shipping</span>
                                        <strong>{Number(order.shipping || 0) === 0 ? "FREE" : `₹${Number(order.shipping).toLocaleString("en-IN")}`}</strong>
                                    </div>

                                    {Number(order.discount || 0) > 0 && (
                                        <div className="discount-row">
                                            <span>Discount</span>
                                            <strong>-₹{Number(order.discount).toLocaleString("en-IN")}</strong>
                                        </div>
                                    )}

                                    <div className="summary-total">
                                        <span>Grand Total</span>
                                        <strong>₹{Number(order.grand_total || 0).toLocaleString("en-IN")}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="customer-order-card">
                                <div className="card-title">
                                    <div className="title-icon">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h3>Delivery Address</h3>
                                        <span>Your shipping information</span>
                                    </div>
                                </div>

                                <div className="address-details">
                                    <strong>{order.name || "-"}</strong>

                                    <p>
                                        {order.address || "-"}
                                        <br />
                                        {order.city || "-"}, {order.state || "-"} - {order.zip || "-"}
                                    </p>

                                    {order.mobile && (
                                        <div>
                                            <Phone size={15} />
                                            <span>{order.mobile}</span>
                                        </div>
                                    )}

                                    {order.email && (
                                        <div>
                                            <Mail size={15} />
                                            <span>{order.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="customer-order-card payment-card">
                                <div className="card-title">
                                    <div className="title-icon">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <h3>Payment</h3>
                                        <span>Payment information</span>
                                    </div>
                                </div>

                                <div className="payment-info">
                                    <div>
                                        <span>Method</span>
                                        <strong>{order.payment_method || "N/A"}</strong>
                                    </div>

                                    <div>
                                        <span>Status</span>
                                        <strong className={isPaid ? "paid-text" : "pending-text"}>
                                            {order.payment_status || "not paid"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OrderDetails;
