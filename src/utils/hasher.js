import bcrypt from "bcryptjs";

export const password_hash = (pass) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
};

export const password_verify = async (pass, hash) => {
  return bcrypt.compareSync(pass, hash);
};

export const hash_otp = (otp) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(otp, salt);
};

export const otp_verify = async (otp, hash) => {
  return bcrypt.compareSync(otp, hash);
};
