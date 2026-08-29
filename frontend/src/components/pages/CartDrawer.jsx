import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,

  Truck,
} from "lucide-react";

import { CartContext } from "../context/Cart";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartData, updateCartQuantity, removeFromCart } =
    useContext(CartContext);

  const cartCount = cartData.reduce(
    (total, item) => total + Number(item.qty || 0),
    0,
  );

  const subtotal = cartData.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 0),
    0,
  );

  const delivery = subtotal >= 999 || subtotal === 0 ? 0 : 99;

  const total = subtotal + delivery;

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "cart-overlay-show" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div>
            <h2>Your Cart</h2>

            <span>
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
          </div>

          <button type="button" className="cart-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Empty Cart */}
        {cartData.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={38} />
            </div>

            <h3>Your cart is empty</h3>

            <p>You haven't added any products to your cart yet.</p>
          </div>
        ) : (
          <>
            {/* Products */}
            <div className="cart-drawer-body">
              {cartData.map((item) => (
                <div className="cart-item" key={item.id}>
                  {/* Image */}
                  <div className="cart-item-image">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} />
                    ) : (
                      <ShoppingBag size={25} />
                    )}
                  </div>

                  {/* Information */}
                  <div className="cart-item-info">
                    <Link
                      to={`/product/${item.product_id}`}
                      className="cart-item-title"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>

                    {item.size !== null &&
                      item.size !== undefined &&
                      item.size !== "" && (
                        <div className="cart-item-size">Size: {item.size}</div>
                      )}

                    <div className="cart-item-price">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </div>

                    {/* Quantity */}
                    <div className="cart-item-bottom">
                      <div className="cart-quantity">
                        <button
                          type="button"
                          disabled={item.qty <= 1}
                          onClick={() =>
                            updateCartQuantity(item.id, item.qty - 1)
                          }
                        >
                          <Minus size={13} />
                        </button>

                        <span>{item.qty}</span>

                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.id, item.qty + 1)
                          }
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <strong>
                        ₹
                        {(Number(item.price) * Number(item.qty)).toLocaleString(
                          "en-IN",
                        )}
                      </strong>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-drawer-footer">
              {/* Delivery Message */}
              {delivery > 0 && (
                <div className="cart-delivery-message">
                  <Truck size={16} />

                  <span>
                    Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for{" "}
                    <strong>FREE delivery</strong>
                  </span>
                </div>
              )}

              {delivery === 0 && subtotal > 0 && (
                <div className="cart-delivery-message success">
                  <Truck size={16} />

                  <span>
                    🎉 You have unlocked <strong>FREE delivery</strong>
                  </span>
                </div>
              )}

              {/* Subtotal */}
              <div className="cart-summary-row">
                <span>Subtotal</span>

                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              {/* Delivery */}
              <div className="cart-summary-row">
                <span>Delivery</span>

                <strong>{delivery === 0 ? "FREE" : `₹${delivery}`}</strong>
              </div>

              {/* Total */}
              <div className="cart-total-row">
                <span>Total</span>

                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>

              {/* Checkout */}
              <Link
                to="/checkout"
                className="cart-checkout-btn"
                onClick={onClose}
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link to='/cart'
                className="cart-continue-btn"
                onClick={onClose}
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
