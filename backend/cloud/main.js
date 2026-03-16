import '../routes/auth.routes.js'
import '../routes/product.routes.js'
import '../middleware/upload.files.js'
import '../routes/cart.routes.js'
import '../config/webPushConfig.js'
import createCartSchema from '../models/Cart.js'

createCartSchema()