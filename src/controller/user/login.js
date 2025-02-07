import db from "../../utils/db";
import { request, response } from "express";
import { password_verify } from "../../utils/hasher";
import generateOTP from "../../utils/generateOtp";
import transporter from "../../config/configNodemailer";

const login_user = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "email dan password harus di isi",
      });
    }

    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message:
          "User belum terdaftar, silahkan lakukan registrasi terlebih dahulu",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        status: false,
        message: "email belum terverifikasi",
      });
    }

    const isPasswordValid = password_verify(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Pasword tidak sesuai!",
      });
    }

    const { otp, otpHash, otpExpires } = generateOTP();

    await db.user.update({
      where: {
        email: email,
      },
      data: {
        otpHash,
        otpExpires,
      },
    });

    // await db.loginActivity.create({
    //   data: {
    //     userId: user.id,
    //     action: "login-atemp",
    //     ipAddress: req.ip,
    //     userAgent: req.headers["user-agent"],
    //   },
    // });

    // Kirim OTP ke email
    await transporter.sendMail({
      from: `"Admin Verification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Kode OTP Login",
      text: `Kode OTP Anda: ${otp}`,
    });

    return res.status(200).json({
      status: true,
      message:
        "OTP sudah dikirim ke email anda, silahkan masukan otp untuk login",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export default login_user;
