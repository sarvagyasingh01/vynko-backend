import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Config from "../../config.js";
const env = process.env.ENVIRONMENT || "development";

function encryptPassword(plainPassword, saltRounds = 12) {
  return bcrypt.hashSync(plainPassword, saltRounds);
}

function verifyPassword(plainPassword, hashedPassword) {
  return !!bcrypt.compareSync(plainPassword, hashedPassword);
}

function createJWT(obj) {
  return jwt.sign(obj, Config[env].jwt_secret, {
    expiresIn: "365d",
    algorithm: "HS512",
  });
}

function verifyJWT(token) {
  try {
    let decoded = jwt.verify(token, Config[env].jwt_secret);

    return { status: true, data: decoded };
  } catch (e) {
    return { status: false, message: e.message };
  }
}

export { encryptPassword, verifyPassword, createJWT, verifyJWT };
