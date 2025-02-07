import { Router } from "express";
import register_user from "./register";
import login_user from "./login";
import { getLoginActivities } from "./activity";
import verify_user_otp from "./verify_otp_user";
import verify_email from "./verify_email_user";

const user_routes = new Router();

user_routes.post("/user/register", register_user);
user_routes.get("/user/verify-email", verify_email);
user_routes.post("/user/login", login_user);
user_routes.get("/user/login-activities", getLoginActivities);
user_routes.put("/user/verify-otp", verify_user_otp);

export default user_routes;
