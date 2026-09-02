import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/Cart";
import Checkout from "../pages/Checkout";

const ProtectedCheckout = () => {
  const { cartData } = useContext(CartContext);
  const location = useLocation();


  if (location.pathname === "/checkout") {
    if (!cartData || cartData.length === 0) {
      return <Navigate to="/cart" replace />;
    }
  }

  return <Checkout />;
};

export default ProtectedCheckout;
