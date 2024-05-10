import connectToMongoDB from "./mongo.js";

async function find(collectionName, query = {}, options = {}) {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);

    const cursor = collection.find(query, options);
    return await cursor.toArray();
  } catch (err) {
    console.error("Error in find function: ", err);
    throw err;
  }
}

export default find;
