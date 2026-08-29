import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const addTocart = (product, size = null, quantity = 1) => {
    const updatedCart = [...cartData];
     const sizeId = typeof size === "object" ? size?.id : size;
  const sizeName =
    typeof size === "object"
      ? size?.name ?? size?.title
      : size;

    const existingIndex = updatedCart.findIndex(
      (item) =>
        String(item.product_id) === String(product.id) &&
        String(item.size ?? "") === String(size ?? "")
    );

    if (existingIndex !== -1) {
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        qty: updatedCart[existingIndex].qty + quantity,
      };
    } else {
      updatedCart.push({
        id: `${product.id}-${size ?? "nosize"}-${Date.now()}`,
        product_id: product.id,
        size_id: sizeId ?? null,
        size: sizeName ?? null,
        title: product.title,
        price: product.price,
        qty: quantity,
        image_url: product.image_url,
      });
    }

    setCartData(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success('Product Added To Cart')
  };

  const updateCartQuantity = (id, quantity) => {
    const updatedCart = cartData.map((item) =>
      item.id === id
        ? {
            ...item,
            qty: Math.max(1, quantity),
          }
        : item
    );

    setCartData(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartData.filter(
      (item) => item.id !== id
    );

    setCartData(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartData([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartData,
        setCartData,
        addTocart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};