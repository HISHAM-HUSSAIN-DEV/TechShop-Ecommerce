import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Users from "../models/User.js";

const generateOrderNumber = () => {
  const year = new Date().getFullYear();

  const randomNumber = Math.floor(
    100000 + Math.random() * 900000
  );
 
  return `ORD-${year}-${randomNumber}`;
};

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let calculatedTotalPrice = 0;

    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({
          message: "Invalid product quantity",
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      calculatedTotalPrice += product.price * item.quantity;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      totalPrice: calculatedTotalPrice,
      status: "Processing",
    });

    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      order,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status !== "Processing") {
      return res.status(400).json({
        message: "Only processing orders can be cancelled",
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        }
      );
    }

    order.status = "Cancelled";

    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const requestReturn = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be returned",
      });
    }

    if (order.returnStatus !== "None") {
      return res.status(400).json({
        message: "A return request already exists for this order",
      });
    }

    if (!reason?.trim()) {
      return res.status(400).json({
        message: "Return reason is required",
      });
    }

    order.returnStatus = "Requested";
    order.returnReason = reason.trim();

    await order.save();

    res.status(200).json({
      message: "Return request submitted successfully",
      order,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const getAdminOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).populate("user", "firstName lastName email phone");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("GET ADMIN ORDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getReturnRequests = async (req, res) => {
  try {
    const orders = await Order.find({
      returnStatus: { $ne: "None" },
    })
      .populate("user", "firstName lastName email")
      .sort({ updatedAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET RETURN REQUESTS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateReturnStatus = async (req, res) => {
  try {
    const { returnStatus } = req.body;

    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const allowedTransitions = {
      Requested: ["Approved", "Rejected"],
      Approved: ["Returned"],
      Returned: ["Refunded"],
      Rejected: [],
      Refunded: [],
      None: [],
    };

    const currentStatus = order.returnStatus;

    const allowedNextStatuses =
      allowedTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(returnStatus)) {
      return res.status(400).json({
        message: `Cannot change return status from ${currentStatus} to ${returnStatus}`,
      });
    }

    // Restore stock only when the returned products
    // are actually received back.
    if (
      currentStatus === "Approved" &&
      returnStatus === "Returned"
    ) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,
            },
          }
        );
      }
    }

    order.returnStatus = returnStatus;

    await order.save();

    res.status(200).json({
      message: "Return status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "UPDATE RETURN STATUS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const processingOrders = await Order.countDocuments({
      status: "Processing",
    });

    const returnRequests = await Order.countDocuments({
      returnStatus: "Requested",
    });

    const totalUsers = await Users.countDocuments({
      role: "user",
    });

    res.status(200).json({
      totalProducts,
      totalOrders,
      processingOrders,
      returnRequests,
      totalUsers,
    });
  } catch (error) {
    console.error("GET ADMIN STATS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};