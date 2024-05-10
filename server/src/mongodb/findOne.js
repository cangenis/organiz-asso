import connectToMongoDB from "./mongo.js";

async function findOne(collectionName, doc) {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);

    return await collection.findOne(doc); // findOne(collectionName, { _id: new ObjectId(id) }) for seacrh by _id
  } catch (err) {
    console.error("Error in findOne function :", err);
    throw err;
  }
}

export default findOne;
