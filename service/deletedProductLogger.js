const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs/deleted");

// Ensure logs/deleted folder exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logDeletedProduct(product) {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const timestamp = now.getTime(); // unique timestamp

  // ✅ Full path to log inside logs/deleted
  const logFile = path.join(
    logDir,
    `deleted-product-${date}-${timestamp}.json`
  );

  const logData = {

    data: {
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    },
    deletedAt: now.toISOString(),
  };

  fs.writeFileSync(
    logFile,
    JSON.stringify(logData, null, 2),
    "utf8"
  );
}

module.exports = { logDeletedProduct };
