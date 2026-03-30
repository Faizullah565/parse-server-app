import '../routes/auth.routes.js'
import '../routes/product.routes.js'
import '../middleware/upload.files.js'
import '../routes/cart.routes.js'
import '../config/webPushConfig.js'
import '../routes/notification.routes.js'
import '../routes/order.routes.js'
import '../routes/admin.routes.js'
import createCartSchema from '../models/Cart.js'
import createOrderSchema from '../models/Order.js'
import { createPaymentIntent, verifyPayment } from '../controllers/payment.controller.js'
import webpush from '../config/webPushConfig.js'

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

Parse.Cloud.afterSave("Order", async (request) => {
  const order = request.object;

  const user = order.get("user");
  const status = order.get("status");

  // Send LiveQuery event automatically (Parse does this)
  // Send Push Notification to this user
  if (user) {
    // SEND WEB PUSH NOTIFICATION 
    
      const PushSubscription = Parse.Object.extend("PushSubscription")
      const query = new Parse.Query(PushSubscription)
      query.equalTo("active", true)
      query.equalTo("user", user)
      const users = await query.find({ useMasterKey: true })
      // console.log("🚀 ~ addProductService ~ users:", users)
      for (let sub of users) {
        const pushData = {
          endpoint: sub.get("endpoint"),
          keys: {
            p256dh: sub.get("p256dh"),
            auth: sub.get("auth"),
          },
        };
    
        const notifications = await webpush.sendNotification(
          pushData,
          JSON.stringify({
            title: "🛍️ Order Updated!",
            body: `Order updated and order stats is: ${status}`,
            icon: "/icon.png",
            badge: "badge.png",
            url: "/profile/orders",
          })
        );
      }
  }
});