import crypto from "crypto";

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex"); // Hash OTP
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expired in 10 mins

  return { otp, otpHash, otpExpires };
};

export default generateOTP;
