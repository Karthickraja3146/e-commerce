import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const decodeUserId = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  const userId = token ? decodeUserId(token) : null;

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backend_url}/api/cart/add`,
          { userId, itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartData));
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      if (cartData[itemId] && cartData[itemId][size]) delete cartData[itemId][size];
      if (cartData[itemId] && Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backend_url}/api/cart/update`,
          { userId, itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartData));
    }
  };

  const getCartCount = () => {
    let totalcount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) totalcount += cartItems[items][item];
      }
    }
    return totalcount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const size in cartItems[items]) {
        totalAmount += itemInfo.price * cartItems[items][size];
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/product/list`);
      if (response.data.success) setProducts(response.data.products);
      else toast.error(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    const userId = decodeUserId(token);
    if (!userId) return;

    try {
      const response = await axios.post(
        `${backend_url}/api/cart/get`,
        { userId },
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
        localStorage.setItem("cartItems", JSON.stringify(response.data.cartData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductsData();

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    } else {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    setCartItems,
    updateQuantity,
    removeFromCart: (itemId, size) => updateQuantity(itemId, size, 0),
    getCartCount,
    getCartAmount,
    navigate,
    backend_url,
    setToken,
    token,
    userId
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
