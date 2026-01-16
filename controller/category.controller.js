const Category = require("../models/category.model");
// GET ALL
exports.getCategory_hong = async (req, res) => {
  try {
    const data = await Category.findAll();
    let rs = {
      statusCode: 200,
      message: "Get Data Successfully",
      data: data,
    };

    res.status(200).json(rs);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// GET ONE DATA
exports.getCategoryByID_hong = async (req, res) => {
  try {
    const id = req.params.id;
    if (!Number.isInteger(Number(id))|| id <= 0 ) {
      return res.status(400).json({
        message: "ID must be a positive integer",
      });
    }
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Data not found"  });
    }

   
    res.json({
      statusCode: 200,
      message: "Get Data Successfully",
      "data": category,
      });
  } catch (err) {
    res.status(500).json({ message: "Server error:", err });
  }
};

// CREATE
exports.createCategory_hong = async (req, res) => {
  try {
    const { name } = req.body;

    let existingCategory = await Category.findOne({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category name already exists",
        data: existingCategory,
      });
    }

    // create category
    const category = await Category.create({
      name,
      categoryicon: req.file ? req.file.filename : null
    });

    res.status(201).json({
      statusCode: 201,
      message: "Category created",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// UPDATE
exports.updateCategory_hong = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,description } = req.body;

    if (!Number.isInteger(Number(id)) || id <= 0) {
      return res.status(400).json({
        message: "ID must be a positive integer",
      });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (name) {
      const existingCategory = await Category.findOne({
        where: {
          name,
        },
      });

      if (existingCategory) {
        return res.status(400).json({
          statusCode: 400,
          message: "Category name already exists",
          data: existingCategory,
        });
      }
    }

    await category.update({
      name: name ?? category.name,
      description : description ?? category.description,
      categoryicon: req.file ? req.file.filename : category.categoryicon,
    });
    res.status(200).json({
      statusCode: 200,
      message: "Category updated successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.deleteCategory_hong = async (req, res) => {
  try {
    console.log("PARAMS:", req.params);

    const { category_id } = req.params;
    console.log("CATEGORY ID:", category_id);

    const category = await Category.findByPk(category_id);
    console.log("FOUND CATEGORY:", category);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    console.log("CATEGORY DELETED");

    res.json({
      statusCode: 200,
      message: "Category deleted",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
