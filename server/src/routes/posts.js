import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  addComment,
  searchPosts,
  searchPostsByAuthor,
  deletePost,
} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/search", verifyToken, searchPosts);
router.get("/search/author", verifyToken, searchPostsByAuthor);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:postId/comment", verifyToken, addComment);

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

export default router;
