const createOrderSchema = async () => {
  const orderSchema = new Parse.Schema("Order");

  try {
    // Check if schema already exists
    await orderSchema.get();
    console.log("Order schema already exists");

  } catch (error) {
    if (error.code === 103) {

      // Relations
      orderSchema.addPointer("user", "_User", { required: true });

      // Order Data
      orderSchema.addArray("items"); // [{ productId, title, price, quantity, image }]
      
      // Pricing
      orderSchema.addNumber("totalAmount", { required: true, defaultValue: 0 });

      // Order Status
      orderSchema.addString("status", {
        required: true,
        defaultValue: "pending", // pending | confirmed | shipped | delivered
      });

      // Shipping Info
      orderSchema.addObject("shippingAddress"); // { name, phone, address, city }

      // Payment
      orderSchema.addString("paymentMethod", {
        defaultValue: "COD", // COD | Card | JazzCash
      });

      orderSchema.addBoolean("isPaid", { defaultValue: false });

      // Extra
      orderSchema.addString("orderId"); // custom readable ID (optional)

      await orderSchema.save();
      console.log("Order schema created successfully");

    } else {
      console.error("Schema error:", error);
    }
  }
};

export default createOrderSchema; 