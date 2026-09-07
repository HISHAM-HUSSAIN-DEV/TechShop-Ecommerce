import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    items: [
      {
        product: {
          type: Number,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },

    shippingAddress: {
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      postCode: {
        type: String,
        required: true,
      },
    },
    returnStatus: {
      type: String,
      enum: [
        "None",
        "Requested",
        "Approved",
        "Rejected",
        "Returned",
        "Refunded",
      ],
      default: "None",
    },
    returnReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;