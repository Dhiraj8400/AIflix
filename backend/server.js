import express from "express";
import { connectToDB } from "./config/db.js";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// 1. UPDATED MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
// Hardcoded origin to 5173 to match your browser screenshot and added credentials: true
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
}));

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// 2. UPDATED ROUTE PATHS TO MATCH FRONTEND (Added /v1/auth)

app.post("/api/v1/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw new Error("All fields are required!");
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is taken, try another name." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const userDoc = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (userDoc) {
      const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed to lax to help with localhost cross-origin
      });
    }

    return res.status(200).json({ success: true, user: userDoc, message: "User created successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post("/api/v1/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcryptjs.compareSync(password, userDoc.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    if (userDoc) {
      const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return res.status(200).json({ success: true, user: userDoc, message: "Logged in successfully." });
  } catch (error) {
    console.log("Error Logging in: ", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get("/api/v1/auth/fetch-user", async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userDoc = await User.findById(decoded.id).select("-password");
    if (!userDoc) {
      return res.status(400).json({ success: false, message: "No user found." });
    }

    res.status(200).json({ success: true, user: userDoc });
  } catch (error) {
    console.log("Error in fetching user: ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
});

app.post("/api/v1/auth/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});