import React, { useEffect, useState, useContext } from "react";
import { apiurl, usertoken } from "../common/Http";
import { toast } from "react-toastify";
import Loader from "../common/Loader";

import { Link, useParams } from "react-router-dom";
import Layout from "../common/Layout";
import { CartContext } from "../context/Cart";

const Confirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const { clearCart } = useContext(CartContext);

  const params = useParams();

  const fetchorder = async () => {
    try {
      const response = await fetch(`${apiurl}get-order-details/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${usertoken()}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.data) {
        setOrder(result.data);
        setItems(result.data.items || []);
        clearCart();
      } else {
        setOrder(null);
        setItems([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
      setOrder(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchorder();
  }, [params.id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <Loader />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center py-5">
            <h1 className="fw-bold text-danger mb-3">Order Not Found</h1>

            <p className="text-muted mb-4">
              Sorry, we couldn't find the order you're looking for.
            </p>

            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        <div className="row">
          <h1 className="text-center fw-bold text-success">Thank You!</h1>

          <p className="text-muted text-center">
            Your Order Has Been Successfully Placed.
          </p>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h3 className="fw-bold">Order Summary</h3>

            <hr />

            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Order Id: </strong> #{order.id}
                </p>

                <p>
                  <strong>Date: </strong> {order.created_at}
                </p>

                <p>
                  <strong>Status: </strong>{" "}
                  {order.status === "pending" && (
                    <span className="badge bg-warning text-dark">Pending</span>
                  )}
                  {order.status === "shipped" && (
                    <span className="badge bg-warning text-dark">Shipped</span>
                  )}
                  {order.status === "delivered" && (
                    <span className="badge bg-success">Delivered</span>
                  )}
                  {order.status === "cancelled" && (
                    <span className="badge bg-danger">Cancelled</span>
                  )}
                </p>

                <p>
                  <strong>Payment Method: </strong>{" "}
                  {order.payment_method || "-"}
                </p>
              </div>

              <div className="col-md-6">
                <p>
                  <strong>Customer: </strong> {order.name || "-"}
                </p>

                <p>
                  <strong>Address: </strong> {order.address || "-"},{" "}
                  {order.city || "-"}, {order.state || "-"}, {order.zip || "-"}
                </p>

                <p>
                  <strong>Contact: </strong> {order.mobile || "-"}
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th width="150">Price</th>
                        <th width="150">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.length > 0 ? (
                        items.map((item) => (
                          <tr key={item.id}>
                            <td>
                                   <div className="fw-semibold">
                                        {item.name || "-"}
                                    </div>
                                {item.size && (
                                <small className="text-muted">
                                    Size: {item.size}
                                </small>
                            )}
                            </td>

                            <td>{item.qty || 0}</td>

                            <td>
                              ₹
                              {Number(item.unit_price || 0).toLocaleString(
                                "en-IN",
                              )}
                            </td>

                            <td>
                              ₹{Number(item.price || 0).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>

                    <tfoot>
                      <tr>
                        <td className="text-end fw-bold" colSpan={3}>
                          Sub Total
                        </td>

                        <td>
                          ₹
                          {Number(order.sub_total || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>

                      <tr>
                        <td className="text-end fw-bold" colSpan={3}>
                          Shipping
                        </td>

                        <td>
                          {Number(order.shipping || 0) === 0
                            ? "FREE"
                            : `₹${Number(order.shipping).toLocaleString(
                                "en-IN",
                              )}`}
                        </td>
                      </tr>

                      <tr>
                        <td className="text-end fw-bold" colSpan={3}>
                          Grand Total
                        </td>

                        <td className="fw-bold text-success">
                          ₹
                          {Number(order.grand_total || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="text-center mt-3">
                <Link to={`/orders/${order.id}`} className="btn btn-primary">
                  View Order Details
                </Link>

                <Link to="/" className="btn btn-outline-secondary ms-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Confirmation;
