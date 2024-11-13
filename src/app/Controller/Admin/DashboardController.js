import Order from '../../Model/OrderModel.js';
import User from '../../Model/UserModel.js';
import { arrToObj, toObj } from '../../../utils/index.js';
export const dashboard_UI = async (req, res) => {
    const userId = req.session.userId;
    const page = req.page ? parseInt(req.page) : 0;
    const orders = await Order.find()
        .sort({ createdAt: 'desc' })
        .limit(1)
        .skip(1 * page);

    const newOrders = [];
    await Promise.all(
        orders.map(async (order) => {
            const userInfo = await User.findById(order.user);
            const orderToObject = Object.assign(toObj(order), {
                userName: userInfo ? userInfo.name : 'Khách hàng bí ẩn',
            });
            newOrders.push(orderToObject);
        }),
    );
    return res.render('admin/dashboard', { layout: 'admin', orders: newOrders, page });
};
export const dashboard_data = async (req, res) => {
    const userId = req.session.userId;
    const page = req.query.page ? parseInt(req.query.page) - 1 : 0; // Phía client đã tăng giá trị của page nên về server phải trừ đi vò trang tính từ 0
    const orders = await Order.find()
        .sort({ createdAt: 'desc' })
        .limit(1)
        .skip(1 * page);

    const newOrders = [];
    await Promise.all(
        orders.map(async (order) => {
            const userInfo = await User.findById(order.user);
            const orderToObject = Object.assign(toObj(order), {
                userName: userInfo ? userInfo.name : 'Khách hàng bí ẩn',
            });
            newOrders.push(orderToObject);
        }),
    );
    return res.status(200).json({
        orders: newOrders,
        page,
    });
};
