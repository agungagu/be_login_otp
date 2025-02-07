import { request } from "express";
import db from "../utils/db";

export const logLoginActivity = async (userId, req = request) => {
  try {
    await db.loginActivity.create({
      data: {
        userId: userId,
        ipAddress: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
