import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Users from "../models/User.js";

 

export const getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;

   

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }


    // -------------------------
    // Get Products
    // -------------------------

    const products = await Product.find(filter);


    // -------------------------
    // Calculate Ratings
    // -------------------------

    const ratings = await Review.aggregate([
      {
        $group: {
          _id: "$product",

          averageRating: {
            $avg: "$rating",
          },

          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);


    // -------------------------
    // Rating Map
    // -------------------------

    const ratingMap = new Map(
      ratings.map((item) => [
        Number(item._id),

        {
          averageRating: Number(
            item.averageRating.toFixed(1)
          ),

          totalReviews: item.totalReviews,
        },
      ])
    );


    // -------------------------
    // Merge Product + Rating
    // -------------------------

    let productsWithRatings = products.map(
      (product) => {
        const ratingData = ratingMap.get(
          Number(product._id)
        );

        return {
          ...product.toObject(),

          averageRating:
            ratingData?.averageRating ?? 0,

          totalReviews:
            ratingData?.totalReviews ?? 0,
        };
      }
    );


    // -------------------------
    // Sort
    // -------------------------

    if (sort === "price-asc") {
      productsWithRatings.sort(
        (a, b) => a.price - b.price
      );
    }

    else if (sort === "price-desc") {
      productsWithRatings.sort(
        (a, b) => b.price - a.price
      );
    }

    else if (sort === "rating-desc") {
      productsWithRatings.sort(
        (a, b) =>
          b.averageRating - a.averageRating
      );
    }


    // -------------------------
    // Response
    // -------------------------

    res.status(200).json(productsWithRatings);

  } catch (error) {

    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ========================================
// GET PRODUCT BY ID
// ========================================

export const getProductById = async (
  req,
  res
) => {
  try {

    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }


    const product = await Product.findById(
      productId
    );


    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }


    // -------------------------
    // Rating for this Product
    // -------------------------

    const ratingData = await Review.aggregate([
      {
        $match: {
          product: productId,
        },
      },

      {
        $group: {
          _id: "$product",

          averageRating: {
            $avg: "$rating",
          },

          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);


    const rating = ratingData[0];


    res.status(200).json({
      ...product.toObject(),

      averageRating: rating
        ? Number(
          rating.averageRating.toFixed(1)
        )
        : 0,

      totalReviews:
        rating?.totalReviews ?? 0,
    });

  } catch (error) {

    console.error(
      "GET PRODUCT BY ID ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      price,
      stock,
      category,
    } = req.body;

    const lastProduct = await Product.findOne().sort({ _id: -1 });

    const newId = lastProduct ? lastProduct._id + 1 : 1;

    const product = await Product.create({
      _id: newId,
      name,
      description,
      image,
      price,
      stock,
      category,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      image,
      price,
      stock,
      category,
    } = req.body;

    product.name = name;
    product.description = description;
    product.image = image;
    product.price = price;
    product.stock = stock;
    product.category = category;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete related reviews
    await Review.deleteMany({
      product: productId,
    });

    // Remove product from all users' wishlists
    await Users.updateMany(
      {
        wishlist: productId,
      },
      {
        $pull: {
          wishlist: productId,
        },
      }
    );

    // Delete product
    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message:
        "Product, related reviews, and wishlist references deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};