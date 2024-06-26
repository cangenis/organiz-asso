import jwt from "jsonwebtoken";

const jwt_secret = process.env.JWT_SECRET || "technowebrocks";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, jwt_secret);
    req.user = verified;
    console.log(verified);
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
