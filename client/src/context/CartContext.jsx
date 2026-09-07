import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem("cartItems");

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  function addToCart(product) {
    if (!product || product.stock <= 0) {
      return false;
    }

    const existingItem = cartItems.find(
      (item) => item._id === product._id
    );

    if (
      existingItem &&
      existingItem.quantity >= product.stock
    ) {
      return false;
    }

    setCartItems((prev) => {
      const exist = prev.find(
        (item) => item._id === product._id
      );

      if (exist) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                stock: product.stock,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock
                ),
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    return true;
  }

  function addQuantity(id) {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== id) {
          return item;
        }

        if (item.quantity >= item.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  }

  function subQuantity(id) {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity - 1
              ),
            }
          : item
      )
    );
  }

  function removeFromCart(id) {
    setCartItems((prev) =>
      prev.filter(
        (item) => item._id !== id
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addQuantity,
        subQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}