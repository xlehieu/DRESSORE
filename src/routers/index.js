import siteRouter from './siteRouter.js';
import productRouter from './productRouter.js';
import paymentsRouter from './paymentsRouter.js';
import adminRouter from './adminRouter.js';
export default function routes(app) {
    app.use('/san-pham', productRouter);
    app.use('/tui-la-admin', adminRouter);
    app.use('/thanh-toan', paymentsRouter);
    app.use('/', siteRouter);
}
