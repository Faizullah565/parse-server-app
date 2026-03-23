
import {
  getOrdersController,
  placeOrderController,
} from "../controllers/order.controller.js";


// PLACE ORDER
Parse.Cloud.define("placeOrder", async (request) => {
  const user = request.user;
  if (!user) throw "Unauthorized";

  const { shippingAddress, paymentMethod } = request.params;

  if (!shippingAddress) {
    throw new Error("Shipping address required");
  }

  return await placeOrderController(
    user,
    shippingAddress,
    paymentMethod
  );
});


// GET USER ORDERS
Parse.Cloud.define("getOrders", async (request) => {
  const user = request.user;
  if (!user) throw "Unauthorized";

  return await getOrdersController(user);
});