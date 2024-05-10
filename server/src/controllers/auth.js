import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import insert from "../mongodb/insert.js";
import findOne from "../mongodb/findone.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt); // Encrypting password  with random salt

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      friends,
      location,
      occupation,
      isAdmin: false,
      isApproved: false,
      viewedProfile: 0,
      impressions: 0,
    });

    newUser.validate(); // TODO: Checking credentials
    const isNewUserExist = await findOne("users", { email: email });
    if (isNewUserExist) {
      throw new Error("Email already exists");
    }
    const result = await insert("users", newUser); // Inserting into "users"
    console.log(result);

    if (result.insertedId) {
      newUser._id = result.insertedId; // Ensuring the ID is attached to the newUser object
      res.status(201).json(newUser);
    } else {
      throw new Error("User registration failed");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
const jwt_secret = process.env.JWT_SECRET || "technowebrocks";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findOne("users", { email: email });
    if (!user) {
      throw new Error("User does not exist");
    }
    console.log(user.isApproved);
    if (!user.isApproved) {
      throw new Error("User not approved");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Wrong password");
    }

    const userForToken = {
      id: user._id, // Add id to the token
      isAdmin: user.isAdmin, // Add isAdmin to the token
    };
    const token = jwt.sign(userForToken, jwt_secret /*, { expiresIn: "1h" }*/);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* CREATE ADMIN */
export const createAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      friends,
      location,
      occupation,
      isAdmin: true,
      isApproved: true,
      viewedProfile: 0,
      impressions: 0,
    });

    newUser.validate(); // Call the validate function

    const result = await insert("users", newUser);

    if (result.insertedId) {
      newUser._id = result.insertedId;
      res.status(201).json(newUser);
    } else {
      throw new Error("Admin creation failed");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
