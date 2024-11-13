import express from 'express';
import * as SiteController from '../app/Controller/SiteController.js';
const siteRouter = express.Router();

siteRouter.get('/dang-nhap', SiteController.login);
siteRouter.post('/dang-nhap', SiteController.loginUser);
siteRouter.route('/dang-ky').get(SiteController.register).post(SiteController.createUser);
siteRouter.get('/dang-xuat', SiteController.logoutUser);
siteRouter.get('/', SiteController.home);

export default siteRouter;
