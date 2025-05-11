// src/routes/postRoutes.js
import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // Multer for S3

const router = express.Router();

// Apply auth middleware to all post routes that require authentication
router.post("/", authMiddleware, upload.single("postImage"), createPost); // 'postImage' is the field name for the file
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, updatePost); // Image update could be a separate endpoint or handled here
router.delete("/:id", authMiddleware, deletePost);

export default router;
