import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Lock,
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  User,
  ShoppingBag,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiurl, usertoken } from "../common/Http";
import { CartContext } from "../context/Cart";
import CheckoutHeader from "../common/CheckoutHeader";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartData, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);

        setValue("name", user.name || "");
        setValue("email", user.email || "");
        setValue("mobile", user.mobile || "");
      } catch (error) {
        console.error("User info error:", error);
      }
    }
  }, [setValue]);

  const cartCount = cartData.reduce(
    (total, item) => total + Number(item.qty || 0),
    0,
  );

  const subtotal = cartData.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 0),
    0,
  );

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const processorder = (data) => {
    if (cartData.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (paymentMethod === "cod") {
      saveorder(data, "not paid");
    } else {
      saveorder(data, "paid");
    }
  };

  const saveorder = async (formData, paymentstatus) => {
    setLoading(true);

    try {
      const cart = cartData.map((item) => ({
        product_id: item.product_id,
        name: item.title,
        size: item.size || "",
        price: Number(item.price || 0),
        qty: Number(item.qty || 1),
      }));

      const newformData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        grand_total: total,
        sub_total: subtotal,
        shipping: shipping,
        discount: discount,
        payment_status: paymentstatus,
        status: "pending",
        cart: cart,
      };

      const response = await fetch(`${apiurl}save-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${usertoken()}`,
        },
        body: JSON.stringify(newformData),
      });

      const result = await response.json();

      if (!response.ok || result.status !== true) {
        toast.error(result.message || "Unable to place order");
        return;
      }

      toast.success(
        result.message || "You have successfully placed your order.",
      );

      
      clearCart();

      navigate(`/order/confirmation/${result.id}`);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CheckoutHeader />

      <main className="checkout-page py-5">
        <div className="container">
          <form onSubmit={handleSubmit(processorder)}>
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="fw-bold mb-1">Delivery</h5>
                        <p className="text-muted small mb-0">
                          Enter your delivery details
                        </p>
                      </div>

                      <MapPin size={20} />
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Full Name <span className="text-danger">*</span>
                        </label>

                        <div className="input-with-icon">
                          <User size={17} />

                          <input
                            type="text"
                            className={`form-control ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            placeholder="Enter your full name"
                            {...register("name", {
                              required: "Full name is required",
                              minLength: {
                                value: 3,
                                message: "Name must be at least 3 characters",
                              },
                            })}
                            readOnly
                          />
                        </div>

                        {errors.name && (
                          <div className="invalid-feedback d-block">
                            {errors.name.message}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Mobile Number <span className="text-danger">*</span>
                        </label>

                        <div className="input-with-icon">
                          <Phone size={17} />

                          <input
                            type="tel"
                            maxLength={10}
                            className={`form-control ${
                              errors.mobile ? "is-invalid" : ""
                            }`}
                            placeholder="Enter mobile number"
                            {...register("mobile", {
                              required: "Mobile number is required",
                              pattern: {
                                value: /^[6-9]\d{9}$/,
                                message: "Enter a valid 10 digit mobile number",
                              },
                            })}
                          />
                        </div>

                        {errors.mobile && (
                          <div className="invalid-feedback d-block">
                            {errors.mobile.message}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label">
                          Email Address <span className="text-danger">*</span>
                        </label>

                        <div className="input-with-icon">
                          <Mail size={17} />

                          <input
                            type="email"
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            placeholder="you@example.com"
                            {...register("email", {
                              required: "Email address is required",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Enter a valid email address",
                              },
                            })}
                            readOnly
                          />
                        </div>

                        {errors.email && (
                          <div className="invalid-feedback d-block">
                            {errors.email.message}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label">
                          Address <span className="text-danger">*</span>
                        </label>

                        <textarea
                          rows="3"
                          className={`form-control ${
                            errors.address ? "is-invalid" : ""
                          }`}
                          placeholder="House no, street, area"
                          {...register("address", {
                            required: "Address is required",
                          })}
                        />

                        {errors.address && (
                          <div className="invalid-feedback">
                            {errors.address.message}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          City <span className="text-danger">*</span>
                        </label>

                        <input
                          type="text"
                          className={`form-control ${
                            errors.city ? "is-invalid" : ""
                          }`}
                          placeholder="Ahmedabad"
                          {...register("city", {
                            required: "City is required",
                          })}
                        />

                        {errors.city && (
                          <div className="invalid-feedback">
                            {errors.city.message}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          State <span className="text-danger">*</span>
                        </label>

                        <input
                          type="text"
                          className={`form-control ${
                            errors.state ? "is-invalid" : ""
                          }`}
                          placeholder="Gujarat"
                          {...register("state", {
                            required: "State is required",
                          })}
                        />

                        {errors.state && (
                          <div className="invalid-feedback">
                            {errors.state.message}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Postal Code <span className="text-danger">*</span>
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          className={`form-control ${
                            errors.zip ? "is-invalid" : ""
                          }`}
                          placeholder="380001"
                          {...register("zip", {
                            required: "Postal code is required",
                            pattern: {
                              value: /^\d{6}$/,
                              message: "Enter a valid 6 digit postal code",
                            },
                          })}
                        />

                        {errors.zip && (
                          <div className="invalid-feedback">
                            {errors.zip.message}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Country</label>

                        <input
                          type="text"
                          className="form-control"
                          value="India"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="fw-bold mb-1">Payment Method</h5>

                        <p className="text-muted small mb-0">
                          Choose your preferred payment method.
                        </p>
                      </div>

                      <CreditCard size={20} />
                    </div>

                    <div className="row g-3">
                      <div className="col-12">
                        <label
                          className={`payment-card d-flex align-items-center gap-3 p-3 rounded-3 ${
                            paymentMethod === "online" ? "active" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="online"
                            checked={paymentMethod === "online"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="form-check-input m-0"
                          />

                          <CreditCard size={20} />

                          <div className="flex-grow-1">
                            <strong className="d-block">Online Payment</strong>

                            <small className="text-muted">
                              UPI, Credit Card, Debit Card & Net Banking
                            </small>
                          </div>

                          {paymentMethod === "online" && (
                            <CheckCircle2 size={20} />
                          )}
                        </label>
                      </div>

                      <div className="col-12">
                        <label
                          className={`payment-card d-flex align-items-center gap-3 p-3 rounded-3 ${
                            paymentMethod === "cod" ? "active" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="form-check-input m-0"
                          />

                          <Truck size={20} />

                          <div className="flex-grow-1">
                            <strong className="d-block">
                              Cash on Delivery
                            </strong>

                            <small className="text-muted">
                              Pay when your order arrives
                            </small>
                          </div>

                          {paymentMethod === "cod" && (
                            <CheckCircle2 size={20} />
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-3 d-flex justify-content-center align-items-center gap-2"
                  disabled={loading || cartData.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Lock size={17} />

                      {paymentMethod === "cod"
                        ? `Place Order · ₹${total.toLocaleString("en-IN")}`
                        : `Continue to Payment · ₹${total.toLocaleString(
                            "en-IN",
                          )}`}
                    </>
                  )}
                </button>
              </div>

              <div className="col-lg-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div>
                        <small className="text-muted">Your Order</small>

                        <h4 className="fw-bold mb-0 mt-1">Order Summary</h4>
                      </div>

                      <span className="badge bg-dark">
                        {cartCount} {cartCount === 1 ? "Item" : "Items"}
                      </span>
                    </div>

                    <div className="mb-4">
                      {cartData.length === 0 ? (
                        <div className="text-center py-4">
                          <ShoppingBag size={28} />

                          <h6 className="fw-bold mt-3">Your cart is empty</h6>

                          <Link to="/" className="btn btn-dark btn-sm mt-2">
                            Continue Shopping
                          </Link>
                        </div>
                      ) : (
                        cartData.map((item) => {
                          const price = Number(item.price || 0);

                          const qty = Number(item.qty || 1);

                          return (
                            <div
                              key={item.id}
                              className="d-flex gap-3 pb-3 mb-3 border-bottom"
                            >
                              <div
                                className="position-relative flex-shrink-0"
                                style={{
                                  width: "70px",
                                  height: "80px",
                                }}
                              >
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-100 h-100 rounded"
                                    style={{
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <ShoppingBag size={24} />
                                )}

                                <span className="position-absolute top-0 end-0 badge bg-dark">
                                  {qty}
                                </span>
                              </div>

                              <div className="flex-grow-1">
                                <h6 className="fw-semibold mb-1">
                                  {item.title}
                                </h6>

                                {item.size && (
                                  <small className="text-muted d-block">
                                    Size: {item.size}
                                  </small>
                                )}

                                <small className="text-muted">
                                  ₹{price.toLocaleString("en-IN")} × {qty}
                                </small>
                              </div>

                              <strong>
                                ₹{(price * qty).toLocaleString("en-IN")}
                              </strong>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="pt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Subtotal</span>

                        <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Delivery</span>

                        <strong
                          className={shipping === 0 ? "text-success" : ""}
                        >
                          {shipping === 0 ? "FREE" : `₹${shipping}`}
                        </strong>
                      </div>

                      {shipping > 0 && (
                        <div className="small text-muted mb-3">
                          Add ₹{(999 - subtotal).toLocaleString("en-IN")} more
                          for free delivery.
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                        <span className="fw-bold fs-5">Total</span>

                        <strong className="fs-4">
                          ₹{total.toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center align-items-center gap-2 text-muted small mt-3">
                      <ShieldCheck size={17} />

                      <span>Your information is secure and protected.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Checkout;
