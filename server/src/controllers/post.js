import Post from "../models/Post.js";
import findOne from "../mongodb/findone.js";
import insert from "../mongodb/insert.js";
import find from "../mongodb/find.js";
import updateLike from "../mongodb/updateLike.js";
import update from "../mongodb/update.js";
import deleteOne from "../mongodb/deleteOne.js";
import { ObjectId } from "bson";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const user = await findOne("users", { _id: new ObjectId(userId) }); // Works only with ObjectId(id)

    if (!user.isApproved) {
      return res.status(401).json({ message: "User is not approved" });
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      content,
      likes: {},
      comments: [],
    });
    console.log(newPost);
    const result = await insert("posts", newPost);

    if (result.insertedId) {
      newPost._id = result.insertedId; // Ensuring the ID is attached to the newUser object
      res.status(201).json(newPost);
    } else {
      throw new Error("Post creation failed");
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* UPDATE */
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;

    // Find the user who is commenting to retrieve their name for the comment
    const user = await findOne("users", { _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (!user.isApproved) {
      return res.status(401).json({ message: "User is not approved" });
    }

    // Construct a new comment object
    const newComment = {
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      content,
      createdAt: new Date(),
    };

    // Update the post with the new comment
    const updateResult = await update(
      "posts",
      { _id: new ObjectId(postId) },
      { $push: { comments: newComment } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Adding comment failed");
    }

    // Retrieve the updated post to send back
    const updatedPost = await findOne("posts", { _id: new ObjectId(postId) });
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Failed to add comment:", err);
    res.status(500).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const feed = await find("posts");
    res.status(200).json(feed);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await find("posts", { userId: userId });

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { query } = req.query;
    const posts = await find("posts", {
      content: { $regex: query, $options: "i" },
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const searchPostsByAuthor = async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, "i"); // Case-insensitive search
    const posts = await find("posts", {
      $or: [{ firstName: regex }, { lastName: regex }],
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await findOne("posts", { _id: new ObjectId(id) });

    const likes = await find("posts", { _id: new ObjectId(id) }, { likes: 1 }); // Returning likes of the post
    console.log(likes);
    const user = await findOne("users", { _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (!user.isApproved) {
      return res.status(401).json({ message: "User is not approved" });
    }

    const isLiked = likes && post.likes[userId] !== undefined; // Cheking if userId is in likes of the post
    console.log(`BEFORE: Did userId:${userId} like postId:${id} ?`, isLiked);

    if (isLiked) {
      await updateLike("posts", id, userId, false); // unlike if already liked
    } else {
      await updateLike("posts", id, userId); // like
    }

    const updatedLikes = await findOne("posts", { _id: new ObjectId(id) });
    res.status(200).json(updatedLikes);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await deleteOne("posts", { _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 1) {
      res.status(200).json({ message: "Post successfully deleted" });
    } else {
      throw new Error("Post deletion failed");
    }
  } catch (err) {
    console.error("Failed to delete post:", err);
    res.status(500).json({ message: err.message });
  }
};
