import Order from '../../Model/OrderModel.js';
import { arrToObj, toObj } from '../../../utils/index.js';
import Product from '../../Model/ProductModel.js';
import User from '../../Model/UserModel.js';
import constants from '../../../constants/index.js';
export const detailAndUpdateOrder_UI = async (req, res) => {
    const orderId = req.params.id;
    const orderInfo = await Order.findById(orderId);
    const user = await User.findById(orderInfo.user);
    const orderItems = [];
    await Promise.all(
        orderInfo.orderItems.map(async (order) => {
            if (!order.thumb) {
                const productInfo = await Product.findById(order.product);
                const newOrder = Object.assign(toObj(order), { thumb: productInfo?.thumb, ms: productInfo?.ms });
                orderItems.push(newOrder);
            } else {
                orderItems.push(toObj(order));
            }
        }),
    );
    if (orderInfo) {
        return res.render('admin/order/detail', {
            layout: 'admin',
            orderDetail: toObj(orderInfo),
            orderItems,
            userName: user?.name,
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { status, id } = req.body;
    if (!status || !id) {
        return res.status(400).json({
            errorMessage: 'Lỗi',
        });
    }
    const orderInfo = await Order.findByIdAndUpdate(id, { status: status }, { new: true });
    return res.status(200).json({
        successMessage: 'Cập nhật thành công',
    });
};
