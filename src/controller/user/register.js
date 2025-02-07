import { request, response } from "express";
import db from "../../utils/db";
import transporter from "../../config/configNodemailer";
import { password_hash } from "../../utils/hasher";
import crypto from "crypto";

const registerUser = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    // 🔹 Validasi input
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email dan password harus diisi!",
      });
    }

    // 🔹 Cek apakah user sudah ada
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email sudah digunakan.",
      });
    }

    // 🔹 Hash password
    const hashedPassword = await password_hash(password); // Pastikan password_hash mendukung async

    // 🔹 Generate token verifikasi
    const verifycationToken = crypto.randomBytes(32).toString("hex");

    // 🔹 Buat user di database
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        verifycationToken,
        isVerified: false, // Tambahkan status verifikasi
      },
    });

    // 🔹 Buat link verifikasi email
    const verificationLink = `http://localhost:3000/api/user/verify-email?token=${verifycationToken}`;

    // 🔹 Kirim email verifikasi
    try {
      await transporter.sendMail({
        from: `"Admin Verification" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verifikasi Email Anda",
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
        h2 {
            color: #007bff;
        }
        p {
            color: #333;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            font-size: 12px;
            color: #666;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Verifikasi Email Kamu</h2>
        <p>Hai, hanya beberapa langkah lagi sebelum kamu dapat menggunakan akunmu.</p>
        <p>Gunakan tombol di bawah ini untuk memverifikasi email kamu.</p>
        <a href=${verificationLink} class="button">Verifikasi Email Sekarang</a>
        <p class="footer">Jika tombol di atas tidak berfungsi, Anda juga bisa klik link berikut atau copy-paste pada browser Anda.</p>
        <p class="footer"><a href="#">https://example.com/verifikasi</a></p>
    </div>
</body>
</html>`,
      });
    } catch (emailError) {
      console.error("Gagal mengirim email:", emailError);
      return res.status(500).json({
        status: false,
        message: "Registrasi berhasil, tapi gagal mengirim email verifikasi.",
      });
    }

    return res.status(201).json({
      status: true,
      message: "Registrasi berhasil! Periksa email Anda untuk verifikasi.",
      userId: user.id, // Kirim ID user untuk referensi
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
};

export default registerUser;
