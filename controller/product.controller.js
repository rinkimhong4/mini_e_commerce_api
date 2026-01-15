const { Op } = require("sequelize");
const fs = require('fs');
const path = require('path');
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const upload = require("../middleware/upload");

const { logError } = require("../service/logs.service");
const { logDeletedProduct } = require("../service/deletedProductLogger");

/**
 * GET ALL PRODUCT
 */
exports.getAllProduct = async (req, res) => {
  try {
    const data = await Product.findAll({
      // include: [{ model: Category, as: 'Category' }]
    });
    res.status(200).json({
      statusCode: 200,
      message: "Get Data Successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * GET ONE PRODUCT BY ID 
 */
exports.getProductByID = async (req, res) => {
  try {
    const id = req.params.id;

    if (!Number.isInteger(Number(id)) || id <= 0) {
      return res.status(400).json({ message: "ID must be a positive integer" });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Get Data Successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


/**
 * CREATE PRODUCT
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category_id, stock } = req.body;

    // Validation: All fields required
    if (!name || !price || !description || !category_id || stock === undefined || stock === null) {
      // If file was uploaded, delete it
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete uploaded file:", err);
        });
      }

      const errorMsg = "All fields are required";
      await logError("ProductController", errorMsg); // log the error
      return res.status(400).json({ message: errorMsg });
      // return res.status(400).json({ message: "All fields are required" });
    }

    // Check if product name already exists
    const productExist = await Product.findOne({ where: { name } });
    if (productExist) {
      // Delete the uploaded image since we're rejecting the request
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete uploaded file:", err);
        });
      }
      return res.status(400).json({ message: "Product name already exists" });
    }

    // Create the product (only if all checks pass)
    const product = await Product.create({
      name,
      price,
      description,
      image: req.file ? req.file.filename : null,
      category_id,
      stock,
    });

    res.status(201).json({
      statusCode: 201,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    // Also clean up uploaded file on server error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete uploaded file on error:", err);
      });
    }

    console.error("Error creating product:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * UPDATE PRODUCT
 */
exports.updateProduct = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        logError(err);
        return res.status(400).json({ message: err.message });
      }

      const id = req.params.id;
      if (!Number.isInteger(Number(id)) || id <= 0) {
        return res.status(400).json({ message: "ID must be a positive integer" });
      }

      const product = await Product.findByPk(id, {
        // include: [{ model: Category, as: 'Category' }]
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const { name, price, description, category_id, stock } = req.body;
      const image = req.file ? req.file.filename : product.image;

      await product.update({
        name: name ?? product.name,
        price: price ?? product.price,
        description: description ?? product.description,
        category_id: category_id ?? product.category_id,
        stock: stock ?? product.stock,
        image,
      });

      res.status(200).json({
        statusCode: 200,
        message: "Product updated successfully",
        data: product,
      });
    });
  } catch (err) {
    logError(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


/**
 * DELETE PRODUCT
 */
exports.deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID must be a positive integer" });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // -------- IMAGE BACKUP --------
    if (product.image) {
      const imagePath = path.join(
        __dirname,
        "../public/images",
        product.image
      );

      const backupDir = path.join(
        __dirname,
        "../public/deleted-products"
      );

      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      if (fs.existsSync(imagePath)) {
        const backupFileName = `${Date.now()}_${product.image}`;
        fs.renameSync(
          imagePath,
          path.join(backupDir, backupFileName)
        );
      }
    }

    logDeletedProduct(product);

    await Product.destroy({
      where: { product_id: id }
    });

    res.status(200).json({
      statusCode: 200,
      message: "Product deleted successfully",
      data: product,
    });

  } catch (err) {
    logError(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * SEARCH PRODUCT BY NAME
 */
exports.searchProduct = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Name query is required" });
    }

    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%` 
        }
      },
      // include: [{ model: Category, as: 'Category' }]
    });

    res.status(200).json({
      statusCode: 200,
      message: `Found ${products.length} product(s) matching "${name}"`,
      data: products
    });
  } catch (err) {
    logError(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
