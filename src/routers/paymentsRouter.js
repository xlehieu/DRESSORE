import express from 'express';
import * as PaymentsController from '../app/Controller/PaymentsController.js';
const paymentsRouter = express.Router();
paymentsRouter.route('/').get(PaymentsController.payments_UI).post(PaymentsController.checkoutItem);
export default paymentsRouter;
