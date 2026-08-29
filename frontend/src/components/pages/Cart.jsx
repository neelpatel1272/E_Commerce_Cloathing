import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Tag,
  FileText,
  Truck,
} from "lucide-react";
import { CartContext } from "../context/Cart";
import Layout from "../common/Layout";

const Cart = () => {
  const {
    cartData,
    clearCart,
    updateCartQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const [activePanel, setActivePanel] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [note, setNote] = useState("");

  const cartCount = cartData.reduce(
    (total, item) => total + Number(item.qty || 0),
    0
  );

  const subtotal = cartData.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <Layout>
      <main className="cart-page">
        <div className="container">
          <div className="text-center py-4 mb-4">
            <h2 className="fw-semibold mb-2">Shopping Cart</h2>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center mb-0">
                <li className="breadcrumb-item">
                  <Link
                    to="/"
                    className="text-decoration-none text-secondary"
                  >
                    Home
                  </Link>
                </li>

                <li
                  className="breadcrumb-item active"
                  aria-current="page"
                >
                  Your Cart
                </li>
              </ol>
            </nav>
          </div>

          {cartData.length === 0 ? (
            <div className="cart-empty text-center py-5">
              <div className="cart-empty-icon mx-auto mb-4">
                <ShoppingBag size={42} strokeWidth={1.5} />
              </div>

              <h3>Your cart is empty</h3>

              <p>
                Looks like you haven't added anything to your cart yet.
              </p>

              <Link to="/" className="cart-dark-btn">
                Continue Shopping
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-content-stacked">
                <div className="cart-products-wrapper">
                  <div className="cart-table-header">
                    <div>Product</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Total</div>
                  </div>

                  {cartData.map((item) => {
                    const price = Number(item.price || 0);
                    const qty = Number(item.qty || 1);
                    const itemTotal = price * qty;

                    const hasSize =
                      item.size !== null &&
                      item.size !== undefined &&
                      item.size !== "";

                    return (
                      <div
                        className="cart-product-row"
                        key={item.id}
                      >
                        <div className="cart-product-info">
                          <div className="cart-product-image">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.title}
                              />
                            ) : (
                              <ShoppingBag size={30} />
                            )}
                          </div>

                          <div className="cart-product-details">
                            <h6>{item.title}</h6>

                            <div className="cart-size">
                              <strong>Size:</strong>{" "}
                              {hasSize ? (
                                <span className="text-success fw-semibold">
                                  {item.size}
                                </span>
                              ) : (
                                <span className="text-danger">
                                  Not selected
                                </span>
                              )}
                            </div>

                            <div className="small text-muted mb-2">
                              Product ID: {item.product_id}
                            </div>

                            <button
                              type="button"
                              className="cart-remove"
                              onClick={() =>
                                removeFromCart(item.id)
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="cart-price">
                          Rs. {price.toLocaleString("en-IN")}.00
                        </div>

                        <div className="cart-quantity-wrapper">
                          <div className="cart-quantity">
                            <button
                              type="button"
                              className="quantity-btn"
                              disabled={qty <= 1}
                              onClick={() =>
                                updateCartQuantity(
                                  item.id,
                                  qty - 1
                                )
                              }
                            >
                              <Minus size={14} />
                            </button>

                            <span>{qty}</span>

                            <button
                              type="button"
                              className="quantity-btn"
                              onClick={() =>
                                updateCartQuantity(
                                  item.id,
                                  qty + 1
                                )
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-total">
                          Rs. {itemTotal.toLocaleString("en-IN")}.00
                        </div>
                      </div>
                    );
                  })}

                  <div className="cart-clear-wrapper">
                    <button
                      type="button"
                      className="cart-clear"
                      onClick={clearCart}
                    >
                      <Trash2 size={15} />
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="cart-summary-wrapper">
                  <div className="cart-summary">
                    <div className="cart-actions">
                      <button
                        type="button"
                        className={`cart-action ${
                          activePanel === "note" ? "active" : ""
                        }`}
                        onClick={() => togglePanel("note")}
                      >
                        <FileText size={17} />
                        <span>Note</span>
                      </button>

                      <button
                        type="button"
                        className={`cart-action ${
                          activePanel === "shipping" ? "active" : ""
                        }`}
                        onClick={() => togglePanel("shipping")}
                      >
                        <Truck size={17} />
                        <span>Shipping</span>
                      </button>

                      <button
                        type="button"
                        className={`cart-action ${
                          activePanel === "coupon" ? "active" : ""
                        }`}
                        onClick={() => togglePanel("coupon")}
                      >
                        <Tag size={17} />
                        <span>Coupon</span>
                      </button>
                    </div>

                    {activePanel === "coupon" && (
                      <div className="cart-panel">
                        <div className="cart-panel-title">
                          <Tag size={17} />
                          <span>Add a discount code</span>
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter discount code here"
                          value={coupon}
                          onChange={(e) =>
                            setCoupon(e.target.value)
                          }
                        />

                        <div className="cart-panel-buttons">
                          <button
                            type="button"
                            className="panel-cancel"
                            onClick={() => setActivePanel(null)}
                          >
                            CANCEL
                          </button>

                          <button
                            type="button"
                            className="panel-save"
                            onClick={() => setActivePanel(null)}
                          >
                            SAVE
                          </button>
                        </div>
                      </div>
                    )}

                    {activePanel === "note" && (
                      <div className="cart-panel">
                        <div className="cart-panel-title">
                          <FileText size={17} />
                          <span>Add a note</span>
                        </div>

                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Special instructions for your order"
                          value={note}
                          onChange={(e) =>
                            setNote(e.target.value)
                          }
                        />

                        <div className="cart-panel-buttons">
                          <button
                            type="button"
                            className="panel-cancel"
                            onClick={() => setActivePanel(null)}
                          >
                            CANCEL
                          </button>

                          <button
                            type="button"
                            className="panel-save"
                            onClick={() => setActivePanel(null)}
                          >
                            SAVE
                          </button>
                        </div>
                      </div>
                    )}

                    {activePanel === "shipping" && (
                      <div className="cart-panel">
                        <div className="cart-panel-title">
                          <Truck size={17} />
                          <span>Shipping information</span>
                        </div>

                        <p className="shipping-panel-text">
                          Shipping charges will be calculated at
                          checkout based on your delivery address.
                        </p>

                        {shipping === 0 ? (
                          <div className="free-shipping-box">
                            Free shipping applied to your order.
                          </div>
                        ) : (
                          <div className="shipping-price-box">
                            Shipping: Rs. {shipping}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="cart-subtotal">
                      <div>
                        <span>Subtotal</span>

                        <small>
                          Tax included. Shipping calculated at
                          checkout.
                        </small>
                      </div>

                      <strong>
                        Rs. {subtotal.toLocaleString("en-IN")}.00
                      </strong>
                    </div>

                    {shipping > 0 && (
                      <div className="cart-shipping-info">
                        <Truck size={15} />

                        <span>
                          Add Rs.{" "}
                          {(999 - subtotal).toLocaleString(
                            "en-IN"
                          )}{" "}
                          more for free shipping.
                        </span>
                      </div>
                    )}

                    <div className="cart-summary-row">
                      <span>Shipping</span>

                      <strong>
                        {shipping === 0
                          ? "FREE"
                          : `Rs. ${shipping}`}
                      </strong>
                    </div>

                    <div className="cart-summary-row">
                      <span>Total</span>

                      <strong>
                        Rs. {total.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <Link
                      to="/checkout"
                      className="cart-checkout-btn"
                    >
                      CHECK OUT
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Cart;