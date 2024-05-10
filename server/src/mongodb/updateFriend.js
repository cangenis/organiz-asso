import connectToMongoDB from "./mongo.js";
import { ObjectId } from "bson";

async function updateFriend(collectionName, userId, friendId, add = true) {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);

    let updateResult;

    if (!add) {
      updateResult = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { friends: friendId } }
      );
    } else {
      updateResult = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { friends: friendId } }
      );
    }

    return updateResult;
  } catch (err) {
    console.error("Error in updateLike function: ", err);
    throw err;
  }
}

export default updateFriend;
