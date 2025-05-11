// src/controllers/postController.js
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import docClient from "../models/db.js";
import dotenv from "dotenv";

dotenv.config();

const POSTS_TABLE = process.env.DYNAMODB_TABLE_POSTS;

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { userId, username } = req.user; // From authMiddleware

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const postId = uuidv4();
  const newPost = {
    postId,
    userId,
    authorUsername: username,
    title,
    content,
    imageUrl: req.file ? req.file.location : null, // From multer-s3
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const params = {
      TableName: POSTS_TABLE,
      Item: newPost,
    };
    await docClient.send(new PutCommand(params));
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error creating post" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const params = {
      TableName: POSTS_TABLE,
      // Consider adding: Select: "ALL_ATTRIBUTES", // Default
      // Consider pagination for large datasets
    };
    const { Items } = await docClient.send(new ScanCommand(params));
    res.json(
      Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ); // Sort by newest
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const params = {
      TableName: POSTS_TABLE,
      Key: { postId: id },
    };
    const { Item } = await docClient.send(new GetCommand(params));
    if (Item) {
      res.json(Item);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).json({ message: "Server error fetching post" });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { userId } = req.user;

  if (!title && !content) {
    return res
      .status(400)
      .json({ message: "Nothing to update. Provide title or content." });
  }

  try {
    // First, verify the post exists and belongs to the user
    const getParams = { TableName: POSTS_TABLE, Key: { postId: id } };
    const { Item: existingPost } = await docClient.send(
      new GetCommand(getParams)
    );

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (existingPost.userId !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this post" });
    }

    let updateExpression = "SET updatedAt = :updatedAt";
    const expressionAttributeValues = {
      ":updatedAt": new Date().toISOString(),
    };
    const expressionAttributeNames = {};

    if (title) {
      updateExpression += ", #postTitle = :title";
      expressionAttributeValues[":title"] = title;
      expressionAttributeNames["#postTitle"] = "title"; // 'title' is a reserved keyword
    }
    if (content) {
      updateExpression += ", content = :content";
      expressionAttributeValues[":content"] = content;
    }
    // Image update would require deleting old S3 object and uploading new one, then updating imageUrl. Simplified here.

    const params = {
      TableName: POSTS_TABLE,
      Key: { postId: id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames:
        Object.keys(expressionAttributeNames).length > 0
          ? expressionAttributeNames
          : undefined,
      ReturnValues: "ALL_NEW",
    };

    const { Attributes } = await docClient.send(new UpdateCommand(params));
    res.json(Attributes);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error updating post" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    // Verify post exists and belongs to user
    const getParams = { TableName: POSTS_TABLE, Key: { postId: id } };
    const { Item: existingPost } = await docClient.send(
      new GetCommand(getParams)
    );

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (existingPost.userId !== userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this post" });
    }

    // TODO: Delete image from S3 if it exists (existingPost.imageUrl)
    // This requires S3 DeleteObjectCommand

    const params = {
      TableName: POSTS_TABLE,
      Key: { postId: id },
    };
    await docClient.send(new DeleteCommand(params));
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error deleting post" });
  }
};
