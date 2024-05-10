import connectToMongoDB from "./mongo.js";

async function deleteOne(collectionName, query) {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);
    return collection.deleteOne(query);
  } catch (error) {
    console.error("Error in deleteOne function: ", error);
    throw error;
  }
}

export default deleteOne;
