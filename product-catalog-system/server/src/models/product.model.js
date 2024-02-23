const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Model(
  {
    name: String,
    description: String,
    price: Number,
    image: String,
    isAdminApproved: Boolean,
    isDeleted: Boolean,
    cataloguerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;