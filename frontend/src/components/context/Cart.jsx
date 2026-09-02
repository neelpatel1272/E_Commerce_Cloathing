import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

const getSizeId = (size) => {
  if (size === null || size === undefined || size === "") {
    return null;
  }

  if (typeof size === "object") {
    return size?.id ?? null;
  }

  return size;
};

const getSizeName = (size) => {
  if (size === null || size === undefined || size === "") {
    return null;
  }

  if (typeof size === "object") {
    return size?.name ?? size?.title ?? null;
  }

  return size;
};

const getSizeStock = (size, product) => {
  if (size && typeof size === "object") {
    const sizeStock = Number(size.qty ?? size.stock ?? size.quantity ?? 0);

    if (size.qty !== undefined) return sizeStock;
    if (size.stock !== undefined) return sizeStock;
    if (size.quantity !== undefined) return sizeStock;
  }

  return Number(product?.qty ?? product?.stock ?? product?.quantity ?? 0);
};

const normalizeSizeId = (sizeId) => {
  if (sizeId === null || sizeId === undefined || sizeId === "") {
    return null;
  }

  return String(sizeId);
};

const getCartKey = (productId, sizeId) => {
  return `${String(productId)}-${normalizeSizeId(sizeId) ?? "nosize"}`;
};

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

      const mergedCart = [];

      savedCart.forEach((item) => {
        const sizeId = normalizeSizeId(item.size_id ?? null);

        const key = getCartKey(item.product_id, sizeId);

        const existingIndex = mergedCart.findIndex(
          (existingItem) =>
            getCartKey(
              existingItem.product_id,
              existingItem.size_id ?? null,
            ) === key,
        );

        if (existingIndex !== -1) {
          mergedCart[existingIndex] = {
            ...mergedCart[existingIndex],
            qty:
              Number(mergedCart[existingIndex].qty || 0) +
              Number(item.qty || 0),
          };
        } else {
          mergedCart.push({
            ...item,
            size_id: sizeId,
            qty: Number(item.qty || 1),
            stock: Number(item.stock || 0),
          });
        }
      });

      localStorage.setItem("cart", JSON.stringify(mergedCart));

      return mergedCart;
    } catch (error) {
      console.error("Cart loading error:", error);
      return [];
    }
  });

  const addTocart = (product, size = null, quantity = 1) => {
    setCartData((currentCart) => {
      const sizeId = normalizeSizeId(getSizeId(size));

      const sizeName = getSizeName(size);

      const productId = String(product.id);

      const stock = getSizeStock(size, product);

      const addQuantity = Math.max(1, Number(quantity || 1));

      const existingIndex = currentCart.findIndex(
        (item) =>
          String(item.product_id) === productId &&
          normalizeSizeId(item.size_id) === sizeId,
      );

      /*
       * SAME PRODUCT + SAME SIZE
       */
      if (existingIndex !== -1) {
        const existingItem = currentCart[existingIndex];

        const currentQty = Number(existingItem.qty || 0);

        const itemStock = Number(existingItem.stock || stock || 0);

        const newQty = currentQty + addQuantity;

        if (itemStock > 0 && newQty > itemStock) {
          toast.error(
            `Only ${itemStock} available for ${existingItem.title}${
              existingItem.size ? ` - ${existingItem.size}` : ""
            }.`,
          );

          return currentCart;
        }

        const updatedCart = [...currentCart];

        updatedCart[existingIndex] = {
          ...existingItem,
          qty: newQty,
          stock: itemStock,
        };

        localStorage.setItem("cart", JSON.stringify(updatedCart));

        return updatedCart;
      }

      /*
       * NEW PRODUCT + SIZE
       */
      if (stock > 0 && addQuantity > stock) {
        toast.error(
          `Only ${stock} available for ${product.title}${
            sizeName ? ` - ${sizeName}` : ""
          }.`,
        );

        return currentCart;
      }

      const updatedCart = [
        ...currentCart,
        {
          id: `${product.id}-${sizeId ?? "nosize"}-${Date.now()}`,
          product_id: product.id,
          size_id: sizeId,
          size: sizeName,
          title: product.title,
          price: product.price,
          qty: addQuantity,
          stock: stock,
          image_url: product.image_url,
        },
      ];

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      toast.success("Product added to cart", { toastId: `added-${product.id}-${sizeId}` });

      return updatedCart;
    });
  };

  const updateCartQuantity = (id, quantity) => {
    setCartData((currentCart) => {
      const item = currentCart.find((cartItem) => cartItem.id === id);

      if (!item) {
        return currentCart;
      }

      const newQuantity = Number(quantity);

      if (newQuantity < 1) {
        return currentCart;
      }

      const stock = Number(item.stock || 0);

      if (stock > 0 && newQuantity > stock) {
        toast.error(
          `Only ${stock} available for ${item.title}${
            item.size ? ` - ${item.size}` : ""
          }.`,
           { toastId: `stock-${productId}-${sizeId}` },
        );

        return currentCart;
      }

      const updatedCart = currentCart.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              qty: newQuantity,
            }
          : cartItem,
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCartData((currentCart) => {
      const updatedCart = currentCart.filter((item) => item.id !== id);

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return updatedCart;
    });
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
