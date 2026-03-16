
const createCartSchema = async () => {
  const cartSchema = new Parse.Schema("Cart");

  try {
    // Check if schema already exists
    await cartSchema.get();
    console.log("Cart schema already exists");

  } catch (error) {
    if (error.code === 103) {
      // Class does not exist → create it
      cartSchema.addPointer("user", "_User", { required: true });
      cartSchema.addPointer("product", "_Product", { required: true });
      cartSchema.addNumber("quantity", { required: true, defaultValue: 0 });
      cartSchema.addNumber("price", { required: true, defaultValue: 0 });
      cartSchema.addString("title", { required: true });
      
      await cartSchema.save();
      console.log("Cart schema created successfully");
    } else {
      console.error("Schema error:", error);
    }
  }
};

export default createCartSchema;