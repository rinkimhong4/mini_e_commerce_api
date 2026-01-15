const Order = require("../models/order.model");
const OrderItem = require("../models/orderitem.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const { logError } = require("../service/logs.service");

/**
 * GET ALL ORDERS
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
    });
    res.status(200).json({
      statusCode: 200,
      message: "Get All Orders Successfully",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * GET ORDERS BY USER ID
 */
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    // Validate userId
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        message: "User ID must be a positive integer",
      });
    }

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: "User",
        },
        {
          model: OrderItem,
          as: "OrderItems",
          include: [
            {
              model: Product,
              as: "Product",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]], 
    });

    // If no orders found
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: `No orders found for user ${userId}`,
        data: [],
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: `Found ${orders.length} order(s) for user ${userId}`,
      data: orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * GET ORDER BY ID
 */
exports.getOrderById = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);

    // Validate order ID
    if (isNaN(orderId) || orderId <= 0) {
      return res.status(400).json({
        message: "Order ID must be a positive integer",
      });
    }

    const order = await Order.findByPk(orderId, {
    //   include: [
    //     {
    //       model: User,
    //       as: "User",
    //     },
    //     {
    //       model: OrderItem,
    //       as: "OrderItems",
    //       include: [
    //         {
    //           model: Product,
    //           as: "Product",
    //         },
    //       ],
    //     },
    //   ],
    });

    // Order not found
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Get Order Successfully",
      data: order,
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * CREATE ORDER
 */
exports.createOrder = async (req, res) => {
  try {
    const { user_id, address, items } = req.body; 

    if (!user_id || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "user_id, address, and items array are required" });
    }

    // Validate user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let total = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      const { product_id, quantity } = item;
      if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Each item must have product_id and positive quantity" });
      }

      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${product_id} not found` });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }

      const price = product.price;
      total += price * quantity;
      orderItems.push({ product_id, quantity, price });
    }

    // Create order
    const order = await Order.create({
      user_id,
      total,
      address,
      status: 'pending'
    });

    // Create order items
    const createdItems = await OrderItem.bulkCreate(
      orderItems.map(item => ({
        ...item,
        order_id: order.order_id
      }))
    );

    // Update product stock
    for (const item of items) {
      await Product.decrement('stock', { by: item.quantity, where: { product_id: item.product_id } });
    }

    res.status(201).json({
      statusCode: 201,
      message: "Order created successfully",
      data: {
        order,
        items: createdItems
      },
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * UPDATE ORDER STATUS
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!Number.isInteger(Number(id)) || id <= 0) {
      return res.status(400).json({ message: "Order ID must be a positive integer" });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Valid status is required (pending, confirmed, shipped, delivered)" });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ status });

    res.status(200).json({
      statusCode: 200,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * DELETE ORDER
 */
exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;

    if (!Number.isInteger(Number(id)) || id <= 0) {
      return res.status(400).json({ message: "Order ID must be a positive integer" });
    }

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'OrderItems' }]
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Restore product stock
    for (const item of order.OrderItems) {
      await Product.increment('stock', { by: item.quantity, where: { product_id: item.product_id } });
    }

    // Delete order items first (due to foreign key)
    await OrderItem.destroy({ where: { order_id: id } });

    // Delete order
    await Order.destroy({ where: { order_id: id } });

    res.status(200).json({
      statusCode: 200,
      message: "Order deleted successfully",
      data: order,
    });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};