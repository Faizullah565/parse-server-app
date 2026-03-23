export const placeOrderController = async (user, shippingAddress, paymentMethod = "COD") => {
  const Cart = Parse.Object.extend("Cart");
  const Order = Parse.Object.extend("Order");

  // 1. Get Cart Items
  const cartQuery = new Parse.Query(Cart);
  cartQuery.equalTo("user", user);

  const cartItems = await cartQuery.find({ useMasterKey: true });

  if (!cartItems.length) {
    throw new Error("Cart is empty");
  }

  // 2. Convert Cart → Order Items
  let totalAmount = 0;

  const items = cartItems.map(item => {
    const price = item.get("price");
    const quantity = item.get("quantity");

    totalAmount += price * quantity;

    return {
      productId: item.get("product"),
      title: item.get("title"),
      price,
      quantity,
      image: item.get("image"),
    };
  });

  //  3. Create Order
  const order = new Order();

  order.set("user", user);
  order.set("items", items);
  order.set("totalAmount", totalAmount);
  order.set("status", "pending");
  order.set("shippingAddress", shippingAddress);
  order.set("paymentMethod", paymentMethod);
  order.set("isPaid", false);

  // Optional readable ID
  order.set("orderId", `ORD-${Date.now()}`);

  await order.save(null, { useMasterKey: true });

  // 4. Clear Cart after order
  await Parse.Object.destroyAll(cartItems, { useMasterKey: true });

  return {
    success: true,
    message: "Order placed successfully",
    orderId: order.get("orderId"),
  };
};



export const getOrdersController = async (user) => {
  const Order = Parse.Object.extend("Order");

  const query = new Parse.Query(Order);
  query.equalTo("user", user);
  query.descending("createdAt");

  const orders = await query.find({ useMasterKey: true });

  return orders;
};