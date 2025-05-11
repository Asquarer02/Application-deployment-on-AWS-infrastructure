// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PutCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import docClient from "../models/db.js";
import dotenv from "dotenv";

dotenv.config();

const USERS_TABLE = process.env.DYNAMODB_TABLE_USERS;
const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username, email, and password" });
  }

  try {
    // Check if user already exists (by email for simplicity)
    const getParams = {
      TableName: USERS_TABLE,
      FilterExpression: "email = :email_val",
      ExpressionAttributeValues: {
        ":email_val": email,
      },
    };
    const existingUsers = await docClient.send(new ScanCommand(getParams));
    if (existingUsers.Items && existingUsers.Items.length > 0) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const newUser = {
      userId,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const putParams = {
      TableName: USERS_TABLE,
      Item: newUser,
    };
    await docClient.send(new PutCommand(putParams));

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const scanParams = {
      // In a real app, query by GSI on email for efficiency
      TableName: USERS_TABLE,
      FilterExpression: "email = :email_val",
      ExpressionAttributeValues: {
        ":email_val": email,
      },
    };
    const { Items } = await docClient.send(new ScanCommand(scanParams));

    if (!Items || Items.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = Items[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { userId: user.userId, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
