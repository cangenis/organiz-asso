import { MongoClient } from "mongodb";

class Post {
  constructor({ userId, firstName, lastName, location, content }) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.location = location || "";
    this.content = content;
    this.likes = new Map();
    this.comments = [];
    this.createdAt = new Date();
  }

  validate() {
    const errors = [];
    if (!this.userId) errors.push("User ID is required.");
    if (!this.firstName) errors.push("First name is required.");
    if (!this.lastName) errors.push("Last name is required.");
    return errors;
  }

  async save() {
    const errors = this.validate();
    if (errors.length) {
      throw new Error(errors.join(" "));
    }
    /*
    const db = getDB();
    const posts = db.collection("posts");

    // Set timestamps
    if (!this._id) {
      this.createdAt = new Date();
    }
    this.updatedAt = new Date();

    try {
      const result = await posts.insertOne(this);
      console.log(`Post created with id ${result.insertedId}`);
      return result.insertedId;
    } catch (error) {
      console.error("Error saving post to MongoDB:", error);
      throw error;
    }*/
  }
}

export default Post;
