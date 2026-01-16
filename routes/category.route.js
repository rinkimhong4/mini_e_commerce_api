const categoryController = require("../controller/category.controller");
const upload = require("../middleware/upload");
const categories = (app) => {
  // get
  app.get("/api/categories", categoryController.getCategory_hong);
  app.get("/api/categories/:id", categoryController.getCategoryByID_hong);

  app.post("/api/categories/",
      upload.single("categoryicon"),
    categoryController.createCategory_hong);

  app.put("/api/categories/:id",
    upload.single("categoryicon"),
    categoryController.updateCategory_hong);
  app.delete(
    "/api/categories/:category_id",
    categoryController.deleteCategory_hong
  );
};

module.exports = { categories };