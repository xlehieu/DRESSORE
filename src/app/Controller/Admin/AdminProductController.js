import Product from '../../Model/ProductModel.js';
import Category from '../../Model/CategoryModel.js';
import { arrToObj, toObj } from '../../../utils/index.js';
import { uploadAndGetLink } from '../../../utils/index.js';
import constants from '../../../constants/index.js';
export const getAllProduct = async (req, res) => {
    const categories = await Category.find();
    const products = await Product.find();
    const newProducts = [];
    products.map((product) => {
        let found = false;
        categories.forEach((category) => {
            if (found) return;
            if (category.products.includes(product._id)) {
                newProducts.push(Object.assign(toObj(product), { catName: category.name }));
                found = true;
            }
        });
        if (!found) newProducts.push(toObj(product));
    });
    // nếu không biến đổi thành object thì sẽ gây lỗi này
    return res.render('admin/product/list', { layout: 'admin', products: newProducts });
    // Handlebars: Access has been denied to resolve the property "name" because it is not an "own property" of its parent.
};
//GET /product/create
export const createUIProduct = async (req, res) => {
    const categories = await Category.find();
    return res.render('admin/product/create', { layout: 'admin', categories: arrToObj(categories) });
};
//POST /category/create
//tạo multer để bắt lấy ảnh tải lên
export const createProduct = async (req, res) => {
    try {
        const { name, ms, description, price, quantity, category } = req.body;
        //up load ảnh và lấy link ảnh từ firebase
        let thumbUpload;
        if (req.file) {
            thumbUpload = await uploadAndGetLink(req, constants.productThumb);
        }
        const newProduct = await Product.create({
            name,
            ms,
            description,
            price,
            quantity,
            category,
            thumb: req.file ? thumbUpload : undefined,
        });
        if (category) {
            const categoryInfo = await Category.findById(category);
            categoryInfo.products.push(newProduct?._id);
            categoryInfo.save();
        }
        if (newProduct) {
            return res.redirect('/tui-la-admin/san-pham');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('/tui-la-admin/san-pham/create');
    }
};
//GET /category/detail/:id
export const detailProduct = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({ slug });
        let catName;
        if (product.category) {
            const category = await Category.findById(product.category);
            if (category) {
                catName = {
                    catName: category.name,
                };
            }
        }
        return res.render('admin/product/detail', {
            layout: 'admin',
            product: Object.assign(toObj(product), catName),
        });
    } catch (err) {
        return res.redirect('/tui-la-admin/san-pham');
    }
};
//GET /san-pham/edit
export const editProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    const categories = await Category.find();
    return res.render('admin/product/edit', {
        layout: 'admin',
        product: toObj(product),
        categories: arrToObj(categories),
    });
};
//PUT /san-pham/edit
export const updateProduct = async (req, res) => {
    try {
        const { id, name, ms, description, price, quantity, category } = req.body;
        if (!id) return redirect('/tui-la-admin/san-pham');
        const product = await Product.findById(id);

        // trước khi update sản phẩm thì xóa sản phẩm đó khỏi danh mục, kiểm tra xem danh mục chỉnh sửa có khác gì không
        // nếu khác thì xóa
        const categoryBeforeUpdate = await Category.findById(product.category);
        if (category != categoryBeforeUpdate?._id) {
            const productIds = categoryBeforeUpdate.products.filter((productId) => {
                return productId != id;
            });
            categoryBeforeUpdate.products = productIds;
            await categoryBeforeUpdate.save();
        }
        //Nếu có thông tin sản phẩm thì cập nhật
        if (product) {
            let urlThumbnail;
            if (req.file) {
                urlThumbnail = await uploadAndGetLink(req, constants.productThumb);
            }
            const updateProduct = await Product.findByIdAndUpdate(id, {
                name,
                ms,
                description,
                price,
                quantity,
                category,
                thumb: req.file ? urlThumbnail : product?.thumb,
            });
            //nếu có category thì cập nhật
            if (category) {
                const categoryInfo = await Category.findById(category);
                //nếu trong thằng mảng productId của category đó có chứa rồi thì thôi không update nữa
                if (!categoryInfo.products.includes(updateProduct._id)) {
                    categoryInfo.products.push(updateProduct._id);
                    await categoryInfo.save();
                }
            }
            if (updateProduct) return res.redirect('/tui-la-admin/san-pham');
            //nếu không có thông tin cập nhật thì render lại trang edit
            return res.render('admin/product/edit', {
                layout: 'admin',
                category: toObj(category),
                updateErrorMessage: 'Sửa thông không tin thành công',
            });
        }
        return res.render('admin/product/edit', { layout: 'admin', updateErrorMessage: 'Sửa lỗi' });
    } catch (err) {
        console.log(err);
        return res.render('admin/product/edit', { layout: 'admin', updateErrorMessage: 'Sửa lỗi' });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteInfo = await Product.delete({ _id: id });
        if (deleteInfo?.matchedCount > 0) {
            //sau khi xóa thì hiển thị danh sách mới =))))))
            const categories = await Product.find();
            return res.redirect('/tui-la-admin/san-pham');
        }
        return res.redirect('/tui-la-admin/san-pham');
    } catch (err) {
        return res.redirect('/tui-la-admin/san-pham');
    }
};
