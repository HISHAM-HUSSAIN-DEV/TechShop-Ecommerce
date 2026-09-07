import Users from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";

// =========================
// Sign Up
// =========================
export const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      address2,
      city,
      postCode,
      marketingConsent,
    } = req.body;

    // التأكد من عدم وجود المستخدم
    const existingUser = await Users.findOne({
      email: email.trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // إنشاء المستخدم
    const user = await Users.create({
      firstName,
      lastName,
      email: email.trim(),
      phone,
      password: hashedPassword,
      address,
      address2,
      city,
      postCode,
      marketingConsent,

      // المستخدم العادي فقط
      // لا نأخذ role من req.body
      role: "user",
    });

    // إنشاء JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Account created successfully",

      token,

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        address: user.address,
        postCode: user.postCode,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Sign up error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Sign In
// =========================
export const signIn = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // البحث عن المستخدم
    const user = await Users.findOne({
      email: email.trim(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // التحقق من كلمة المرور
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    // إنشاء JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        address: user.address,
        postCode: user.postCode,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Sign in error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Update Profile
// =========================
export const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      city,
      postCode,
    } = req.body;

    const user = req.user;

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.address = address;
    user.city = city;
    user.postCode = postCode;

    await user.save();

    res.status(200).json({
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        address: user.address,
        postCode: user.postCode,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Toggle Wishlist
// =========================
export const toggleWishlist = async (
  req,
  res
) => {
  try {
    const productId = Number(
      req.params.productId
    );

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message:
          "Invalid product ID",
      });
    }

    const user = req.user;

    const exists =
      user.wishlist.includes(
        productId
      );

    if (exists) {
      user.wishlist =
        user.wishlist.filter(
          (id) =>
            id !== productId
        );
    } else {
      user.wishlist.push(
        productId
      );
    }

    await user.save();

    res.status(200).json({
      message: exists
        ? "Product removed from wishlist"
        : "Product added to wishlist",

      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(
      "Toggle wishlist error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Get Wishlist
// =========================
export const getWishlist = async (
  req,
  res
) => {
  try {
    const wishlistProducts =
      await Product.find({
        _id: {
          $in: req.user.wishlist,
        },
      });

    res.status(200).json({
      wishlist:
        wishlistProducts,
    });
  } catch (error) {
    console.error(
      "Get wishlist error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Change Password
// =========================
export const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user =
      await Users.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Current password is incorrect",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&]).{8,}$/;

    if (
      !passwordRegex.test(
        newPassword
      )
    ) {
      return res.status(400).json({
        message:
          "New password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from current password",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    res.status(200).json({
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// Admin - Get All Users
// =========================
export const getAllUsers = async (
  req,
  res
) => {
  try {
    const users = await Users.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(
      "Get all users error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load users",
    });
  }
};