const createProductSchema = async () => {

  const productSchema = new Parse.Schema("Product");

  productSchema.addString("title", { required: true });
  productSchema.addString("description");
  productSchema.addNumber("price", { required: true, defaultValue: 0 });
  productSchema.addNumber("quantity", { required: true, defaultValue: 0 });
  productSchema.addArray("categories");
  productSchema.addArray("image"); 
  productSchema.addBoolean("isAvailable", { defaultValue: true });
  productSchema.addPointer("user", "_User");

  try {
    // await productSchema.save();
    console.log("Product schema created/updated");
    return productSchema
  } catch (error) {
    console.error("Error creating schema:", error);
  }
};

export default createProductSchema;