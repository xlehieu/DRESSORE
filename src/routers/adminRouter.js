import express from 'express';
import * as Dashboard from '../app/Controller/Admin/DashboardController.js';
import * as AdminOrder from '../app/Controller/Admin/AdminOrderController.js';
import * as AdminCategory from '../app/Controller/Admin/AdminCategoryController.js';
import * as AdminProduct from '../app/Controller/Admin/AdminProductController.js';
import * as AdminNews from '../app/Controller/Admin/AdminNewsController.js';
import * as AdminBanner from '../app/Controller/Admin/AdminBannerController.js';
import multer from 'multer';
const adminRouter = express.Router();
const upload = multer({ imageDB: multer.memoryStorage() });

//Dashboard
adminRouter.get('/dashboard_data', Dashboard.dashboard_data);
adminRouter.route('/hoa-don/:id').get(AdminOrder.detailAndUpdateOrder_UI).patch(AdminOrder.updateOrderStatus);
adminRouter.get('/', Dashboard.dashboard_UI);
//DANH MUC
adminRouter.get('/danh-muc', AdminCategory.getAllCategory);
adminRouter.get('/danh-muc/create', AdminCategory.createUICategory);
adminRouter.post('/danh-muc/create', upload.single('thumb'), AdminCategory.createCategory);
adminRouter.get('/danh-muc/detail/:slug', AdminCategory.detailCategory);
adminRouter.get('/danh-muc/edit/:id', AdminCategory.editCategory);
adminRouter.put('/danh-muc/edit/:id', upload.single('thumb'), AdminCategory.updateCategory);
adminRouter.delete('/danh-muc/delete/:id', AdminCategory.deleteCategory);

//SAN PHAM
adminRouter.get('/san-pham', AdminProduct.getAllProduct);
//có thể dùng 2 cách router để cho ngắn gọn
adminRouter
    .route('/san-pham/create')
    .get(AdminProduct.createUIProduct)
    .post(upload.single('thumb'), AdminProduct.createProduct);
// adminRouter.get('/san-pham/create', AdminProduct.createUIProduct);
// adminRouter.post('/san-pham/create', upload.single('thumb'), AdminProduct.createProduct);
adminRouter.get('/san-pham/detail/:slug', AdminProduct.detailProduct);
adminRouter.get('/san-pham/edit/:id', AdminProduct.editProduct);
adminRouter.put('/san-pham/edit', upload.single('thumb'), AdminProduct.updateProduct);
adminRouter.delete('/san-pham/delete/:id', AdminProduct.deleteProduct);

//TIN TUC
adminRouter.get('/tin-tuc', AdminNews.getAllCategory);
adminRouter.get('/tin-tuc/create', AdminNews.createUINews);
adminRouter.post('/tin-tuc/create', upload.single('thumb'), AdminNews.createNews);
adminRouter.get('/tin-tuc/detail/:slug', AdminNews.detailNews);
adminRouter.get('/tin-tuc/edit/:id', AdminNews.editNews);
adminRouter.put('/tin-tuc/edit', upload.single('thumb'), AdminNews.updateNews);
adminRouter.delete('/tin-tuc/delete/:id', AdminNews.deleteNews);

//BANNER

adminRouter.get('/banner', AdminBanner.getAll);
adminRouter.route('/banner/create').get(AdminBanner.uiCreate);
export default adminRouter;
