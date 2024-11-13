import Category from '../../Model/CategoryModel.js';
import { arrToObj, toObj } from '../../../utils/index.js';
import { uploadAndGetLink } from '../../../utils/index.js';
import constants from '../../../constants/index.js';
export const getAllCategory = async (req, res) => {
    const categories = await Category.find();
    return res.render('admin/category/list', { layout: 'admin', categories: arrToObj(categories) });
    // nếu không biến đổi thành object thì sẽ gây lỗi này
    // Handlebars: Access has been denied to resolve the property "name" because it is not an "own property" of its parent.
};
//GET /danh-muc/create
export const createUICategory = (req, res) => {
    return res.render('admin/category/create', { layout: 'admin' });
};
//POST /danh-muc/create
//tạo multer để bắt lấy ảnh tải lên
export const createCategory = async (req, res) => {
    try {
        const { name, description, isShow, isInMenu } = req.body;
        //up load ảnh và lấy link ảnh từ firebase
        const thumb = await uploadAndGetLink(req, constants.categoryThumb);
        const newCategory = await Category.create({
            name,
            description,
            isShow: isShow === 'on',
            isInMenu: isInMenu === 'on',
            thumb: thumb,
        });
        if (newCategory) {
            return res.redirect('/tui-la-admin/danh-muc');
        }
    } catch (err) {
        return res.redirect('/tui-la-admin/danh-muc/create');
    }
};
//GET /category/detail/:id
export const detailCategory = async (req, res) => {
    try {
        const slug = req.params.slug;
        const category = await Category.findOne({ slug });
        return res.render('admin/category/detail', { layout: 'admin', category: toObj(category) });
    } catch (err) {
        return res.render('admin/category/list', { layout: 'admin' });
    }
};
//GET /danh-muc/edit
export const editCategory = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findById(id);
    return res.render('admin/category/edit', { layout: 'admin', category: toObj(category) });
};
//PUT /danh-muc/edit/:id
export const updateCategory = async (req, res) => {
    try {
        const { id, name, description, isInMenu, isShow } = req.body;
        if (!id) return redirect('/tui-la-admin/danh-muc');
        const category = await Category.findById(id);
        if (category) {
            let urlThumbnail;
            if (req.file) {
                urlThumbnail = await uploadAndGetLink(req, constants.categoryThumb);
            }
            const updateCategory = await Category.findByIdAndUpdate(id, {
                name,
                description,
                isShow: isShow === 'on',
                isInMenu: isInMenu === 'on',
                thumb: req.file ? urlThumbnail : category.thumb,
            });
            if (updateCategory) return res.redirect('/tui-la-admin/danh-muc');
            return res.render('admin/category/edit', {
                layout: 'admin',
                category: toObj(category),
                updateErrorMessage: 'Sửa thông không tin thành công',
            });
        }
        return res.render('admin/category/edit', { layout: 'admin', updateErrorMessage: 'Sửa lỗi' });
    } catch (err) {
        console.log(err);
        return res.render('admin/category/edit', { layout: 'admin', updateErrorMessage: 'Sửa lỗi' });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteInfo = await Category.delete({ _id: id });
        if (deleteInfo?.matchedCount > 0) {
            //sau khi xóa thì hiển thị danh sách mới =))))))
            const categories = await Category.find();
            return res.redirect('/tui-la-admin/danh-muc');
        }
        return res.redirect('/tui-la-admin/danh-muc');
    } catch (err) {
        return res.redirect('/tui-la-admin/danh-muc');
    }
};

//HELPERS
export const FindCatById = async (catId) => {
    try {
        if (!catId) return;
        const category = await Category.findById(catId);
        if (category) return category?.name;
    } catch {
        return;
    }
};
