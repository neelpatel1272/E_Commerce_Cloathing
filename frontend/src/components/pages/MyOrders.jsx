import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, CalendarDays, CreditCard, ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react";
import Layout from "../common/Layout";
import Loader from "../common/Loader";
import { apiurl, usertoken } from "../common/Http";
import { toast } from "react-toastify";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${apiurl}get-orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${usertoken()}`
                }
            });

            const result = await res.json();

            if (res.ok && result.status === true) {
                setOrders(result.data || []);
            } else {
                toast.error(result.message || "Unable to fetch orders");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

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

    return (
        <Layout>
            <div className="my-orders-page">
                <div className="container">
                    <div className="details-top">
                        <Link to="/account" className="back-link" >
                            <ArrowLeft size={16} />
                            Back to Account
                        </Link>
                    </div>

                    <div className="orders-header">
                        <div>
                            <h1>My Orders</h1>
                            <p>Track and manage your recent orders.</p>
                        </div>
                        <div className="orders-count">
                            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                        </div>
                    </div>

                    {loading ? (
                        <div className="orders-loader">
                            <Loader />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="empty-orders">
                            <ShoppingBag size={45} />
                            <h3>No Orders Yet</h3>
                            <p>You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div className="orders-table-wrapper">
                            <div className="orders-table">
                                <div className="orders-table-head">
                                    <div>Order</div>
                                    <div>Date</div>
                                    <div>Total</div>
                                    <div>Payment</div>
                                    <div>Status</div>
                                    <div>Action</div>
                                </div>

                                {orders.map((order) => (
                                    <div className="orders-table-row" key={order.id}>
                                        <div className="order-number">
                                            <div className="order-icon">
                                                <Package size={17} />
                                            </div>
                                            <strong>#{order.id}</strong>
                                        </div>

                                        <div className="order-date">
                                            <CalendarDays size={15} />
                                            <span>{order.created_at || "-"}</span>
                                        </div>

                                        <div className="order-total">
                                            ₹{Number(order.grand_total || 0).toLocaleString("en-IN")}
                                        </div>

                                        <div>
                                            <span className={`payment-status ${order.payment_status === "paid" ? "paid" : "pending-payment"}`}>
                                                <CreditCard size={13} />
                                                {order.payment_status || "not paid"}
                                            </span>
                                        </div>

                                        <div>
                                            <span className={`order-status ${getStatusClass(order.status)}`}>
                                                {order.status || "pending"}
                                            </span>
                                        </div>

                                        <div>
                                            <Link to={`/orders/${order.id}`} className="view-order-btn">
                                                View Details
                                                <ChevronRight size={15} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MyOrders;
