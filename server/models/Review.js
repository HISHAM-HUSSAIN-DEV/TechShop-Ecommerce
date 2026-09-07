import mongoose from "mongoose";

const reviewSchema =
  new mongoose.Schema(
    {
      product: {
        type: Number,
        ref: "Product",
        required: true,
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },

      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },

      comment: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

reviewSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Review",
  reviewSchema
);