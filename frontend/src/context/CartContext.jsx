import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

// This context's job used to be storing the cart in localStorage.
// Now it just tracks ONE thing: how many items are in the REAL
// backend cart, so the navbar badge (🛒) can show the correct number.
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0); // total quantity across all cart items

  // Ask the backend "what's really in my cart?" and add up the quantities.
  // useCallback just means this function doesn't get recreated on every
  // render - a small performance detail, not critical to understand deeply.
  const refreshCartCount = useCallback(() => {
    api
      .get('/cart/') // the REAL cart endpoint - same one the AI agent's add_to_cart tool uses
      .then((res) => {
        // res.data is an array of cart items, each with a quantity.
        // reduce() adds up all the quantities into one total number.
        const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      })
      .catch(() => {
        // If the user isn't logged in yet (401 error) or something else
        // goes wrong, just show 0 instead of crashing the whole navbar.
        setCartCount(0);
      });
  }, []);

  // As soon as the app loads, check what's really in the cart.
  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  // Add a product to the REAL backend cart.
  // productId = which product, quantity = how many.
  // Returns the request itself (a "promise") so whichever button called
  // this can react afterward - e.g. show "Added!" or a login prompt.
  const addToCart = (productId, quantity = 1) => {
    return api
      .post('/cart/', { product_id: productId, quantity })
      .then((res) => {
        refreshCartCount(); // update the badge immediately after adding
        return res;
      });
  };

  // Make cartCount, refreshCartCount, and addToCart available to
  // ANY component in the app that calls useCart() (see below).
  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

// A small helper so other files can just write:
//   const { cartCount, addToCart } = useCart();
// instead of dealing with useContext(CartContext) directly everywhere.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}