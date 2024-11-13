import News from '../../Model/NewsModel.js';
import { arrToObj, toObj } from '../../../utils/index.js';
import { uploadAndGetLink } from '../../../utils/index.js';
import constants from '../../../constants/index.js';
//GET /tin-tuc
export const getAllCategory = async (req, res) => {
    const news = await News.find();
    return res.render('admin/news/list', { layout: 'admin', news: arrToObj(news) });
    // nếu không biến đổi thành object thì sẽ gây lỗi này
    // Handlebars: Access has been denied to resolve the property "name" because it is not an "own property" of its parent.
};
//GET /tin-tuc/create
export const createUINews = (req, res) => {
    return res.render('admin/news/create', { layout: 'admin' });
};
//POST /tin-tuc/create
export const createNews = async (req, res) => {
    try {
        const { title, content, shortContent } = req.body;
        //up load ảnh và lấy link ảnh từ firebase
        let thumb;
        if (req.file) thumb = await uploadAndGetLink(req, constants.newsThumb);
        const newNews = await News.create({
            title,
            content,
            shortContent,
            thumb: req.file ? thumb : undefined,
        });
        if (newNews) {
            return res.redirect('/tui-la-admin/tin-tuc');
        }
    } catch (err) {
        return res.redirect('/tui-la-admin/tin-tuc/create');
    }
};
//GET /category/detail/:id
export const detailNews = async (req, res) => {
    try {
        const slug = req.params.slug;
        const news = await News.findOne({ slug });
        return res.render('admin/news/detail', { layout: 'admin', news: toObj(news) });
    } catch (err) {
        return res.render('admin/news/list', { layout: 'admin' });
    }
};
//GET /tin-tuc/edit
export const editNews = async (req, res) => {
    const id = req.params.id;
    const news = await News.findById(id);
    return res.render('admin/news/edit', { layout: 'admin', news: toObj(news) });
};
//PUT /tin-tuc/edit/:id
export const updateNews = async (req, res) => {
    try {
        const { id, title, shortContent, content } = req.body;
        if (!id) return redirect('/tui-la-admin/tin-tuc');
        const news = await News.findById(id);
        if (news) {
            let urlThumbnail;
            if (req.file) {
                urlThumbnail = await uploadAndGetLink(req, constants.newsThumb);
            }
            const updateNews = await News.findByIdAndUpdate(id, {
                title,
                shortContent,
                content,
                thumb: req.file ? urlThumbnail : news.thumb,
            });
            if (updateNews) return res.redirect('/tui-la-admin/tin-tuc');
            return res.render('admin/news/edit', {
                layout: 'admin',
                news: toObj(news),
                updateErrorMessage: 'Sửa thông không tin thành công',
            });
        }
        return res.render('admin/news/edit', { layout: 'admin', updateErrorMessage: 'Sửa lỗi' });
    } catch (err) {
        console.log(err);
        return res.render('admin/news/edit', { layout: 'admin', updateErrorMessage: 'Sửa lỗi' });
    }
};
export const deleteNews = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteInfo = await News.delete({ _id: id });
        if (deleteInfo?.matchedCount > 0) {
            //sau khi xóa thì hiển thị danh sách mới =))))))
            return res.redirect('/tui-la-admin/tin-tuc');
        }
        return res.redirect('/tui-la-admin/tin-tuc');
    } catch (err) {
        return res.redirect('/tui-la-admin/tin-tuc');
    }
};
