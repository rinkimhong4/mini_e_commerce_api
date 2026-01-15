const Sequelize = require("./configs/database");
const CartItem = require("./models/carditem.model");
const Category = require("./models/category.model");
const Order = require("./models/order.model");
const OrderItem = require("./models/orderitem.model");
const Product = require("./models/product.model");
const User = require("./models/user.model");
const Role = require("./models/role.model");
const bcrypt = require("bcryptjs");

// Load associations
const db = require("./models");

(async () => {
  try {
    await Sequelize.authenticate();
    console.log("Database connected for seeding");

    // Clear tables to reset data (in reverse dependency order)
    await CartItem.destroy({ where: {} });
    await OrderItem.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await db.UserRoles.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Role.destroy({ where: {} });
    console.log("Tables truncated");

    // Seed Roles
    const roles = await Role.bulkCreate([
      { name: "user" },
      { name: "moderator" },
      { name: "admin" }
    ]);
    console.log("Roles seeded");

    // Seed Users
    const users = await User.bulkCreate([
      { username: "johndoe", email: "john@example.com", password: bcrypt.hashSync("password123", 8) },
      { username: "janesmith", email: "jane@example.com", password: bcrypt.hashSync("password123", 8) },
      { username: "bobjohnson", email: "bob@example.com", password: bcrypt.hashSync("password123", 8) },
      { username: "alicebrown", email: "alice@example.com", password: bcrypt.hashSync("password123", 8) },
      { username: "charliew", email: "charlie@example.com", password: bcrypt.hashSync("password123", 8) }
    ]);

    // Assign roles to users
    await users[0].setRoles([roles[0].role_id]); // user role
    await users[1].setRoles([roles[0].role_id]);
    await users[2].setRoles([roles[1].role_id]); // moderator
    await users[3].setRoles([roles[0].role_id]);
    await users[4].setRoles([roles[2].role_id]); // admin

    console.log("Users seeded");

    // Seed Categories
    const categories = await Category.bulkCreate([
      { name: "Electronics", description: "Electronic devices and gadgets" },
      { name: "Clothing", description: "Apparel and fashion items" },
      { name: "Books", description: "Books and literature" }
    ]);
    console.log("Categories seeded");

    // Seed Products
    const products = await Product.bulkCreate([
      { name: "Laptop", price: 999.99, description: "High-performance laptop", image: "/images/laptop.png", category_id: categories[0].category_id, stock: 50 },
      { name: "T-Shirt", price: 19.99, description: "Cotton t-shirt", image: "/images/tshirt.png", category_id: categories[1].category_id, stock: 100 },
      { name: "Book: JavaScript Guide", price: 29.99, description: "Comprehensive JavaScript guide", image: "/images/book.png", category_id: categories[2].category_id, stock: 30 },
      { name: "Smartphone", price: 699.99, description: "Latest smartphone", image: "/images/phone.png", category_id: categories[0].category_id, stock: 20 },
      { name: "Jeans", price: 49.99, description: "Denim jeans", image: "/images/jeans.png", category_id: categories[1].category_id, stock: 75 },
      { name: "Headphones", price: 149.99, description: "Wireless headphones", image: "/images/headphones.png", category_id: categories[0].category_id, stock: 40 },
      { name: "Novel: Mystery", price: 14.99, description: "Thrilling mystery novel", image: "/images/novel.png", category_id: categories[2].category_id, stock: 60 },
      { name: "Tablet", price: 399.99, description: "10-inch tablet", image: "/images/tablet.png", category_id: categories[0].category_id, stock: 25 },
      { name: "Sneakers", price: 79.99, description: "Comfortable running shoes", image: "/images/sneakers.png", category_id: categories[1].category_id, stock: 80 },
      { name: "Cookbook", price: 24.99, description: "Recipes for beginners", image: "/images/cookbook.png", category_id: categories[2].category_id, stock: 45 }
    ]);
    console.log("Products seeded");

    // Seed Orders
    const orders = await Order.bulkCreate([
      { total: 1019.98, status: "pending", address: "123 Main St", user_id: users[0].user_id },
      { total: 49.99, status: "confirmed", address: "456 Oak Ave", user_id: users[1].user_id },
      { total: 849.98, status: "shipped", address: "789 Pine Rd", user_id: users[2].user_id },
      { total: 424.98, status: "delivered", address: "101 Elm St", user_id: users[3].user_id }
    ]);
    console.log("Orders seeded");

    // Seed Order Items
    await OrderItem.bulkCreate([
      { price: 999.99, quantity: 1, order_id: orders[0].order_id, product_id: products[0].product_id },
      { price: 19.99, quantity: 1, order_id: orders[0].order_id, product_id: products[1].product_id },
      { price: 49.99, quantity: 1, order_id: orders[1].order_id, product_id: products[4].product_id },
      { price: 699.99, quantity: 1, order_id: orders[2].order_id, product_id: products[3].product_id },
      { price: 149.99, quantity: 1, order_id: orders[2].order_id, product_id: products[5].product_id },
      { price: 399.99, quantity: 1, order_id: orders[3].order_id, product_id: products[7].product_id },
      { price: 24.99, quantity: 1, order_id: orders[3].order_id, product_id: products[9].product_id }
    ]);
    console.log("Order Items seeded");

    // Seed Cart Items
    await CartItem.bulkCreate([
      { quantity: 2, user_id: users[0].user_id, product_id: products[2].product_id },
      { quantity: 1, user_id: users[1].user_id, product_id: products[6].product_id },
      { quantity: 3, user_id: users[3].user_id, product_id: products[1].product_id },
      { quantity: 1, user_id: users[4].user_id, product_id: products[8].product_id }
    ]);
    console.log("Cart Items seeded");

    console.log("Seeding completed successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
})();