import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import Users from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const adminEmail = "admin@admin.com";

    const existingAdmin = await Users.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists");

      await mongoose.disconnect();
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "Admin123!",
      10
    );

    await Users.create({
      firstName: "Admin",
      lastName: "User",

      email: adminEmail,

      phone: "+966500000000",

      password: hashedPassword,

      address: "Admin",
      address2: "",

      city: "Madinah",
      state: "Madinah",

      postCode: "42311",

      marketingConsent: false,

      role: "admin",
    });

    console.log("Admin created successfully");
    console.log("Email:", adminEmail);

    await mongoose.disconnect();

    process.exit();

  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

createAdmin();