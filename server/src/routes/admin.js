import express from "express";
import {
  getUnapprovedUsers,
  approveUser,
  refuseUser,
  setAdmin,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/unapproved-users", verifyToken, getUnapprovedUsers);

/* UPDATE */
router.patch("/approve-user/:id", verifyToken, approveUser);
router.patch("/set-admin/:id", verifyToken, setAdmin);

/* DELETE */
router.delete("/refuse-user/:id", verifyToken, refuseUser);

export default router;
