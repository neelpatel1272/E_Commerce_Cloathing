import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cart";
import Logo from "../../assets/images/logo.png";
import { ArrowLeft, LockKeyhole, ShoppingBag } from "lucide-react";

const CheckoutHeader = () => {
  const { cartData } = useContext(CartContext);

  const cartCount = cartData.reduce(
    (total, item) => total + Number(item.qty || 0),
    0,
  );

  return (
    <header className="bg-white border-bottom shadow-sm">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-3">
          <Link
            to="/"
            className="d-inline-flex align-items-center text-decoration-none"
          >
            <img
              src={Logo}
              alt="Fashion Partner"
              width="150"
              className="img-fluid"
            />
          </Link>

          <Link
            to="/cart"
            className="position-relative d-inline-flex align-items-center gap-2 text-dark text-decoration-none border rounded-3 px-3 py-2"
          >
            <ShoppingBag size={22} strokeWidth={1.7} />

            <span className="fw-semibold d-none d-sm-inline">Cart</span>

            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
