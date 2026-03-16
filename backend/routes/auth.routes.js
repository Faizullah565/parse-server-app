import { createUser, loginUser } from "../controllers/auth.controller.js";

Parse.Cloud.define("loginUser", loginUser)
Parse.Cloud.define("createUser", createUser)