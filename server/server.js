import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import usersRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Database
connectDB();

// Home route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Routes
app.use("/products", productRoutes);
app.use("/users", usersRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});