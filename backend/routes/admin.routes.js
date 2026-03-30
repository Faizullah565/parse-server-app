import { AdminfetchAllOrders, AdminfetchAllUsers } from "../controllers/admin.controller.js";

Parse.Cloud.define("adminFetchAllUsers", AdminfetchAllUsers)
Parse.Cloud.define("adminFetchAllOrders", AdminfetchAllOrders)
