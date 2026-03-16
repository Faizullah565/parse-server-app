import { 
    addProduct, 
    fetchAllProduct,
    updateProduct,
    deleteProduct,
    fetchLoginUserProduct
} from "../controllers/product.controller.js";

Parse.Cloud.define("addProduct", addProduct)
Parse.Cloud.define("fetchAllProduct", fetchAllProduct)
Parse.Cloud.define("updateProduct", updateProduct)
Parse.Cloud.define("deleteProduct", deleteProduct)
Parse.Cloud.define("fetchLoginUserProduct",fetchLoginUserProduct)