import { createError } from "../utils/errorhandler.js";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // simple authentication since I'm building for just for the hackathon demo at this stage
    if (username === "admin" && password === "hackathon") {
      return res.json({ token: "mock-jwt-token", user: { id: 1, username } });
    }
    throw createError(401, "Invalid credentials");
  } catch (error) {
    next(error);
  }
};
