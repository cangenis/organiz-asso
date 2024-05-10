import connectToMongoDB from "./mongo.js";
import { ObjectId } from "bson";

async function update(collectionName, filter, update) {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);

    // Convert string ID to ObjectId if necessary
    if (filter._id && typeof filter._id === "string") {
      filter._id = new ObjectId(filter._id);
    }

    // Use $set operator for updating fields
    const updateDocument = {
      $set: update,
    };
    if (update.$push) {
      updateDocument.$push = update.$push; // handle $push separately if present
      delete updateDocument.$set.$push; // remove $push from $set if it was mistakenly added
    }
    console.log("Updating with:", updateDocument);

    const updateResult = await collection.updateOne(filter, updateDocument);
    return updateResult;
  } catch (err) {
    console.error("Error in update function: ", err);
    throw err;
  }
}

export default update;
