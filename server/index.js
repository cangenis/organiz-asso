import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectToMongoDB from "./src/mongodb/mongo.js";
import { register } from "./src/controllers/auth.js";
import { createPost } from "./src/controllers/post.js";
import { createAdmin } from "./src/controllers/auth.js";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/users.js";
import postRoutes from "./src/routes/posts.js";
import adminRoutes from "./src/routes/admin.js";
import { verifyToken } from "./src/middleware/auth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extenden: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // local storage

/* ROUTES WITH POST */
app.post("/auth/register", register);
app.post("/auth/admin/create-admin", createAdmin);
app.post("/posts", verifyToken, createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);

/* MONGODB SETUP */
const PORT = process.env.PORT || 5001;
connectToMongoDB()
  .catch(console.log)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
