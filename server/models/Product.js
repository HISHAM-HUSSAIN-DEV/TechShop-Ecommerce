import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: Number,

  name: String,

  description: String,

  image: String,

  price: Number,

  stock: Number,

  category: String,

});

export default mongoose.model("Product", productSchema);