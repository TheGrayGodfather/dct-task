const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Model(
  {
    name: String,
    description: String,
    price: Number,
    image: String,
    isAdminApproved: Boolean,
    isDeleted: Boolean,
    cataloguerId: mongoose.Schema.Types.ObjectId,
  },
  { new: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;