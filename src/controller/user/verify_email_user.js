import db from "../../utils/db";
import { request, response } from "express";

const verify_email = async (req = request, res = response) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        status: false,
        message: "token tidak valid",
      });
    }

    const user = await db.user.findUnique({
      where: {
        verifycationToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "token tidak valid",
      });
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        verifycationToken: null,
      },
    });

    return res.status(200).json({
      status: true,
      message: "email berhasil di verifikasi",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export default verify_email;
