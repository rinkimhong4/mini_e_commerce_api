const CartItem = require("../models/carditem.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");

/**
 * ADD TO CART
 */
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "user_id, product_id, and positive quantity are required" });
    }

    // Validate user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if item already in cart
    const existingItem = await CartItem.findOne({
      where: { user_id, product_id }
    });

    if (existingItem) {
      // Update quantity
      await existingItem.update({ quantity: existingItem.quantity + quantity });
      res.status(200).json({
        statusCode: 200,
        message: "Cart item quantity updated",
        data: existingItem,
      });
    } else {
      // Create new cart item
      const cartItem = await CartItem.create({
        user_id,
        product_id,
        quantity,
      });
      res.status(201).json({
        statusCode: 201,
        message: "Item added to cart",
        data: cartItem,
      });
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * GET USER CART
 */
exports.getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!Number.isInteger(Number(userId)) || userId <= 0) {
      return res.status(400).json({ message: "User ID must be a positive integer" });
    }

    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "Product",
          include: [{ model: Category, as: "Category" }]
        }
      ]
    });

    // Calculate total
    let total = 0;
    cartItems.forEach(item => {
      total += item.Product.price * item.quantity;
    });

    res.status(200).json({
      statusCode: 200,
      message: `Found ${cartItems.length} items in cart`,
      data: {
        items: cartItems,
        total: total.toFixed(2)
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * UPDATE CART ITEM
 */
exports.updateCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { quantity } = req.body;

    if (!Number.isInteger(Number(id)) || id <= 0) {
      return res.status(400).json({ message: "Cart item ID must be a positive integer" });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Positive quantity is required" });
    }

    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.update({ quantity });

    res.status(200).json({
      statusCode: 200,
      message: "Cart item updated successfully",
      data: cartItem,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * REMOVE CART ITEM
 */
exports.removeCartItem = async (req, res) => {
  try {
    const id = req.params.id;

    if (!Number.isInteger(Number(id)) || id <= 0) {
      return res.status(400).json({ message: "Cart item ID must be a positive integer" });
    }

    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await CartItem.destroy({ where: { cart_item_id: id } });

    res.status(200).json({
      statusCode: 200,
      message: "Cart item removed successfully",
      data: cartItem,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * CLEAR USER CART
 */
exports.clearUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!Number.isInteger(Number(userId)) || userId <= 0) {
      return res.status(400).json({ message: "User ID must be a positive integer" });
    }

    const deletedCount = await CartItem.destroy({
      where: { user_id: userId }
    });

    res.status(200).json({
      statusCode: 200,
      message: `Cleared ${deletedCount} items from cart`,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};