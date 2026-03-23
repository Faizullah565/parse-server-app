import '../routes/auth.routes.js'
import '../routes/product.routes.js'
import '../middleware/upload.files.js'
import '../routes/cart.routes.js'
import '../config/webPushConfig.js'
import '../routes/notification.routes.js'
import '../routes/order.routes.js'
import createCartSchema from '../models/Cart.js'
import createOrderSchema from '../models/Order.js'
import { createPaymentIntent, verifyPayment } from '../controllers/payment.controller.js'

createCartSchema()
createOrderSchema()


// ================= CREATE PAYMENT INTENT =================
Parse.Cloud.define("createPaymentIntent", async (request) => {
  try {
    const result = await createPaymentIntent(request.params);
    return result;
  } catch (error) {
    throw new Parse.Error(400, error.message);
  }
});

// ================= VERIFY PAYMENT =================
Parse.Cloud.define("verifyPayment", async (request) => {
  try {
    const result = await verifyPayment(request.params);
    return result;
  } catch (error) {
    throw new Parse.Error(400, error.message);
  }
});