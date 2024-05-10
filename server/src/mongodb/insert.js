import connectToMongoDB from "./mongo.js";

async function insert(collectionName, doc) {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);

    if (doc._id) {
      const _id = typeof doc._id === "string" ? ObjectId(doc._id) : doc._id;
      return await collection.updateOne(
        { _id },
        { $set: doc },
        { upsert: true }
      );
    } else {
      return await collection.insertOne(doc);
    }
  } catch (err) {
    console.error("Error in insert function: ", err);
    throw err;
  }
}

export default insert;
