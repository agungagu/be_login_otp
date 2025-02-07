import { request, response } from "express";
import db from "../../utils/db";

export const getLoginActivities = async (req = request, res = response) => {
  try {
    const activities = await db.loginActivity.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      status: true,
      data: activities,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
