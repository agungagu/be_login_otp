import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

export const jwt_sign = (data) => {
  const result = jwt.sign(data, process.env.SECRET_KEY);
  return result;
};

export const jwt_verify = (data) => {
  const result = jwt.verify(data, process.env.SECRET_KEY);
  return result;
};
