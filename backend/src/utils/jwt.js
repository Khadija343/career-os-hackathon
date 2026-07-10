import jwt from "jsonwebtoken";

/**
 * Generate JWT Access Token
 */
export const generateAccessToken = (payload) => {
  console.log("JWT_EXPIRES_IN =", JSON.stringify(process.env.JWT_EXPIRES_IN));
  console.log("JWT_SECRET exists =", !!process.env.JWT_SECRET);
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};