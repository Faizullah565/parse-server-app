import { createUser, loginUser, updateProfile, getUserProfile, changePassword } from "../controllers/auth.controller.js";

Parse.Cloud.define("loginUser", loginUser)
Parse.Cloud.define("createUser", createUser)
Parse.Cloud.define("updateProfile", updateProfile)
Parse.Cloud.define("getUserProfile", getUserProfile)
Parse.Cloud.define("changePassword", changePassword)