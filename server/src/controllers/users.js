import { ObjectId } from "bson";
import findOne from "../mongodb/findone.js";
import find from "../mongodb/find.js";
import update from "../mongodb/update.js";
import deleteOne from "../mongodb/deleteOne.js";
import updateFriend from "../mongodb/updateFriend.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findOne("users", { _id: new ObjectId(id) }); // Works only with ObjectId(id)
    if (!user) return res.status(400).json({ msg: "User does not exist." });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUnapprovedUsers = async (req, res) => {
  if (!req.user.isAdmin) return res.status(401).json({ msg: "Unauthorized" });
  try {
    const unapprovedUsers = await find("users", { isApproved: false });
    res.status(200).json(unapprovedUsers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await find("users");
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findOne("users", { _id: new ObjectId(id) });

    const friends = await Promise.all(
      user.friends.map((id) => findOne("users", { _id: new ObjectId(id) }))
    );
    console.log(friends);
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
        };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const approveUser = async (req, res) => {
  if (!req.user.isAdmin) return res.status(401).json({ msg: "Unauthorized" });
  try {
    const { id } = req.params;
    console.log(id);
    // Check if id is a valid hexadecimal string
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const user = await findOne("users", { _id: new ObjectId(id) }); // Assuming findOne is a function that fetches a single user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isApproved) {
      return res.status(409).json({ message: "User already approved" });
    }

    const result = await update(
      "users",
      { _id: new ObjectId(id) },
      { isApproved: true }
    );
    if (result.modifiedCount) {
      res.status(200).json({ message: "User approved successfully." });
    } else {
      throw new Error("User approval failed.");
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const setAdmin = async (req, res) => {
  if (!req.user.isAdmin) return res.status(401).json({ msg: "Unauthorized" });
  try {
    const { id } = req.params;
    const user = await findOne("users", { _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle admin status based on current status
    const newAdminStatus = !user.isAdmin;
    const result = await update(
      "users",
      { _id: new ObjectId(id) },
      { isAdmin: newAdminStatus }
    );

    if (result.modifiedCount === 0) {
      throw new Error("Failed to update admin status.");
    }
    res.status(200).json({
      message: `User admin status updated to: ${newAdminStatus}`,
      isAdmin: newAdminStatus, // Send back the new admin status for clarity
    });
  } catch (err) {
    console.error("Error in setAdmin:", err);
    res.status(500).json({ message: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await findOne("users", { _id: new ObjectId(id) });
    const friend = await findOne("users", { _id: new ObjectId(friendId) });

    if (!friend.isApproved) {
      return res
        .status(409)
        .json({ message: "User is not authorized to have friends." });
    }

    const friendsList = await Promise.all(
      user.friends.map((id) => findOne("users", { _id: new ObjectId(id) }))
    );
    console.log("Friend's list before:");
    console.log(friendsList);

    const isFriend = user.friends.indexOf(friendId) !== -1; // Checking if friendId exists in user's friends
    console.log("Is a friend?", isFriend);

    let isAdded;
    if (isFriend) {
      await updateFriend("users", id, friendId, false); // Remove from friends
      await updateFriend("users", friendId, id, false); // Remove also from friend's friends
      isAdded = false; // Setting isAdded to false since the friend is removed
    } else {
      await updateFriend("users", id, friendId, true); // Add to friends
      await updateFriend("users", friendId, id, true); // Add also to friend's friends
      isAdded = true; // Setting isAdded to true since the friend is added
    }

    const updatedFriends = await Promise.all(
      user.friends.map((id) => findOne("users", { _id: new ObjectId(id) }))
    ); // Fetching updated friends list
    const formattedFriends = updatedFriends.map(
      ({ _id, firstName, lastName, occupation, location }) => {
        return { _id, firstName, lastName, occupation, location };
      }
    ); // Formatting the friends list

    res.status(200).json({ friends: formattedFriends, isAdded });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const refuseUser = async (req, res) => {
  if (!req.user.isAdmin) return res.status(401).json({ msg: "Unauthorized" });
  try {
    const { id } = req.params;
    const user = await findOne("users", { _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const result = await deleteOne("users", { _id: new ObjectId(id) });
    if (result.deletedCount) {
      res.status(200).json({ message: "User refused successfully." });
    } else {
      throw new Error("User removal failed.");
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
