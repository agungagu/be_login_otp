import db from "../../utils/db";
import { request, response } from "express";
import { otp_verify } from "../../utils/hasher";
const verifyOtp = async (req = request, res = response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ status: false, message: "Email dan OTP harus diisi!" });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.otpHash || !user.otpExpires) {
      return res
        .status(400)
        .json({ status: false, message: "OTP tidak valid." });
    }

    if (new Date() > user.otpExpires) {
      return res
        .status(400)
        .json({ status: false, message: "OTP sudah kadaluarsa." });
    }

    const isOtpValid = otp_verify(otp, user.otpHash);
    if (!isOtpValid) {
      return res.status(400).json({ status: false, message: "OTP salah." });
    }

    // 🔹 Hapus OTP setelah digunakan
    await db.user.update({
      where: { id: user.id },
      data: { otpHash: null, otpExpires: null },
    });

    // 🔹 Log aktivitas login success
    await db.loginActivity.create({
      data: {
        userId: user.id,
        action: "login_success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    return res.status(200).json({ status: true, message: "Login berhasil!" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
};

export default verifyOtp;
