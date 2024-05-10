async function init(db) {
  try {
    await db.createCollection("users");
    console.log("Collection 'users' has been created !");
  } catch (err) {
    console.log("Collection 'users' already exists, skipping...");
  }

  try {
    await db.createCollection("posts");
    console.log("Collection 'posts' has been created !");
  } catch (err) {
    console.log("Collection 'posts' already exists, skipping...");
  }
}

export default init;
