import express from 'express';
import * as ProductController from '../app/Controller/ProductController.js';
const productRouter = express.Router();

productRouter.get('/', ProductController.getAll);
productRouter.route('/add-to-cart').post(ProductController.addToCart);
productRouter.route('/remove-cart-item').post(ProductController.removeCartItem);
productRouter.route('/get-cart').get(ProductController.getCart);
export default productRouter;
