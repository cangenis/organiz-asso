import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/organizasso");

const SALT_ROUNDS = 10;

class User {
  constructor({
    firstName,
    lastName,
    email,
    password,
    friends = [],
    location = "",
    occupation = "",
    isAdmin = false,
    isApproved = false,
    viewedProfile = 0, // haven't implemented yet
    impressions = 0, // haven't implemented yet
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.friends = friends;
    this.location = location;
    this.occupation = occupation;
    this.isAdmin = isAdmin;
    this.isApproved = isApproved;
    this.viewedProfile = viewedProfile;
    this.impressions = impressions;
    this.createdAt = new Date();
  }

  validate() {
    const errors = [];
    if (this.firstName.length < 2 || this.firstName.length > 50)
      errors.push("Invalid first name length");
    if (this.lastName.length < 2 || this.lastName.length > 50)
      errors.push("Invalid last name length");
    if (!this.email || this.email.length > 50) errors.push("Invalid email");
    if (this.password.length < 8)
      errors.push("Password must be at least 8 characters long");
    return errors;
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }
}

export default User;
