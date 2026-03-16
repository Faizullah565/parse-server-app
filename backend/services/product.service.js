import notifier from 'node-notifier'
import path from 'path'

import { fileURLToPath } from 'url';
import webpush from '../config/webPushConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// =============== ADD PRODUCT SERVICE =================================
export const addProductService = async (title, price, quantity, image, categories, user) => {

  const Product = Parse.Object.extend("Product");
  const product = new Product();
  product.set("title", title);
  product.set("price", price / quantity);
  product.set("quantity", quantity);
  product.set("image", image)
  product.set("categories", categories)
  product.set("user", user)
  //   product.set("user", user);

  // ACL setup
  const acl = new Parse.ACL(user);

  acl.setPublicReadAccess(true);        // public read
  acl.setRoleWriteAccess("Admin", true); // admin update/delete
  acl.setWriteAccess(user, true);       // owner update/delete
  // acl.setWriteAccess(user, false);       // by default false
  product.setACL(acl);
  // ============== SEND NOTIFICATION USE NODE-NOTIFIER =======================

  notifier.notify({
    title: 'E-commerce store notification',
    message: 'New Product Added!',
    icon: path.join(__dirname, "..", "public", 'e-store-logo-icon.png'), // Absolute path (doesn't work on balloons)
    // sound: true, // Only Notification Center or Windows Toasters
    wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
  });
  
  // SEND WEB PUSH NOTIFICATION 

  const PushSubscription = Parse.Object.extend("PushSubscription")
  const query = new Parse.Query(PushSubscription)

  const users = await query.find({useMasterKey:true})
  for(let sub of users){
    await webpush.sendNotification(
      sub.get("subscription"),
      JSON.stringify({
        title: "E-commerce Store",
        message: "New Product Added!"
      })
    )
  }
  
  await product.save(null, { useMasterKey: true });
  return {
    success: true,
    message: "Product created",
    product: {
      id: product.id,
      title: product.get("title"),
      price: product.get("price"),
      quantity: product.get("quantity")
    }
  };
};

// ================== FETCH ALL PRODUCTS SERVICE =====================
export const fetchAllProductServices = async () => {
  const Product = Parse.Object.extend("Product");
  const query = new Parse.Query(Product);

  // Fetch all products
  try {
    const results = await query.find({useMasterKey:true});
    return results
  } catch (error) {
    console.error("Error retrieving products: " + error.code + " " + error.message);
  }

}

// ============== DELETE LOGIN USER PRODUCT SERVICE ======================
export const deleteProductService = async (user, productId) => {
  const Product = Parse.Object.extend("Product")
  const query = new Parse.Query(Product)

  try {
    query.equalTo("user", user)
    query.equalTo("objectId", productId)
    const product = await query.first({ useMasterKey: true });
    if (!product) {
      throw new Error("Product not found");
    }
    await product.destroy({ useMasterKey: true })
    return {
      message: "Product deleted successfully!"
    };
  } catch (error) {
    throw error;
  }
}

// ================== UPDATE LOGIN USER PRODUCT SERVICE =============================
export const updateProductService = async (title, price, quantity, image, user, productId) => {
  const Product = Parse.Object.extend("Product")
  const query = new Parse.Query(Product);

  try {
    query.equalTo("user", user)
    query.equalTo("objectId", productId)
    // Get single product item
    const product = await query.first({ useMasterKey: true });
    if (!product) {
      throw new Error("Product item not found");
    }
    product.set("title", title);
    product.set("quantity", quantity);
    product.set("price", price / quantity);
    image?.length > 0 ? product.set("image", image) : null;

    await product.save(null, { useMasterKey: true });
    return product;
  } catch (error) {
    throw error;
  }
}

// ========== FETCH LOGIN USER PRODUCT SERVICE =======================
export const fetchLoginUserProducService = async (user) => {
  const Product = Parse.Object.extend("Product");
  const query = new Parse.Query(Product);
  try {
    // Filter products by logged-in user
    query.equalTo("user", user);

    // Execute query
    const products = await query.find({ useMasterKey: true });
    if (!products?.length) {
      throw new Error("Product not found");
    }
    return products;
  } catch (error) {
    throw error;
  }
};