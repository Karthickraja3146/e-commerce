import User from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = { ...user.cartData };

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    user.cartData = cartData;
    await user.save();

    res.json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = { ...user.cartData };

    if (quantity === 0) {
      // Remove the size
      if (cartData[itemId] && cartData[itemId][size]) delete cartData[itemId][size];
      // Remove the item if no sizes left
      if (cartData[itemId] && Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    user.cartData = cartData;
    await user.save();

    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, cartData: user.cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
