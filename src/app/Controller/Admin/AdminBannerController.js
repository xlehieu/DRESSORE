import { arrToObj, toObj } from '../../../utils/index.js';
import Banner from '../../Model/BannerModel.js';

export const getAll = async (req, res) => {
    const banners = await Banner.find().sort({ updatedAt: 'desc' });
    if (banners) {
        return res.render('admin/banner/list', { layout: 'admin', banners: arrToObj(banners) });
    } else {
        return res.redirect('/tui-la-admin');
    }
};
export const uiCreate = async (req, res) => {
    return res.render('admin/banner/create', { layout: 'admin' });
};
