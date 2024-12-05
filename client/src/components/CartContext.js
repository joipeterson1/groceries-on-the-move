import React, { createContext, useContext, useState } from "react";

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use Cart Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("useCart must be used within a CartProvider");
    }
    return context;
  };

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);

  // Add item to the cart
  const addToCart = (product) => {
    setCartData((prevCart) => {
      const existingProduct = prevCart.find(item => item.product.id === product.id);
      if (existingProduct) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // Remove item from the cart
  const removeFromCart = (productId) => {
    setCartData((prevCart) => prevCart.filter(item => item.product.id !== productId));
  };

  // Calculate the total number of items in the cart
  const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartData, addToCart, removeFromCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

