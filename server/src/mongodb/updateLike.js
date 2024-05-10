import connectToMongoDB from "./mongo.js";
import { ObjectId } from "bson";

async function updateLike(collectionName, postId, userId, like = true) {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);

    let updatedResult;

    if (!like) {
      updatedResult = await collection.updateOne(
        { _id: new ObjectId(postId) },
        { $unset: { [`likes.${userId}`]: "" } }
      );
    } else {
      updatedResult = await collection.updateOne(
        { _id: new ObjectId(postId) },
        { $set: { [`likes.${userId}`]: true } }
      );
    }

    return updatedResult;
  } catch (err) {
    console.error("Error in updateLike function: ", err);
    throw err;
  }
}

export default updateLike;
