import localStorage from 'local-storage';
import mongoose from 'mongoose';
import User from '../Model/UserModel.js';
import Order from '../Model/OrderModel.js';
import PromotionalEvent from '../Model/PromotionalEventModel.js';
import constants from '../../constants/index.js';
import { arrToObj, toObj } from '../../utils/index.js';
export const payments_UI = async (req, res) => {
    const userId = req.session.userId;
    const userInfo = await User.findById(userId);
    if (userInfo) {
        const products = localStorage.get(constants.miniCartProductList);
        if (products && products.length > 0) {
            const promotionalEvent = await PromotionalEvent.find({ isActive: true })
                .sort({ updatedAt: 'asc' })
                .limit(1);
            if (promotionalEvent) {
                var discount = promotionalEvent.percentDiscount;
            }
            const priceItems = products.reduce((accumulator, curItem) => {
                return accumulator + curItem.price * curItem.sl;
            }, 0);
            if (priceItems) {
                return res.render('payments', {
                    layout: 'sub',
                    user: toObj(userInfo),
                    productsInCart: products,
                    discount: discount ? (priceItems * discount) / 100 : 0,
                    priceTotalCart: priceItems,
                    userId,
                });
            }
        }
    } else return res.redirect('/dang-nhap');
};
export const checkoutItem = async (req, res) => {
    const infoCheckout = req.body;
    if (
        !infoCheckout.fullName ||
        !infoCheckout.phoneNumber ||
        !infoCheckout.email ||
        !infoCheckout.address ||
        !infoCheckout.province ||
        !infoCheckout.district ||
        !infoCheckout.ward ||
        !infoCheckout.paymentsMethod
    ) {
        return res.status(400).json({
            errorMessage: 'Đặt hàng không thành công',
        });
    }
    const userId = req.session.userId;
    const userInfo = await User.findById(userId);
    if (userInfo) {
        // { id, name, size, price, thumb } cấu trúc của product trong giỏ hàng lưu vào localStorage
        const productsCart = localStorage.get(constants.miniCartProductList);
        if (productsCart && productsCart.length > 0) {
            //Tính tổng tiền các sản phẩm trong giỏ hàng
            const priceItems = productsCart.reduce((accumulator, curItem) => {
                return accumulator + curItem.price * curItem.sl;
            }, 0);
            //Ha Noi
            if (infoCheckout?.province === '01') {
                var shippingFee = 25000;
            } else {
                shippingFee = 30000;
            }
            //lấy sự kiện khuyến mãi
            const promotionalEvent = await PromotionalEvent.find({ isActive: true })
                .sort({ updatedAt: 'asc' })
                .limit(1);
            if (promotionalEvent && promotionalEvent.length > 0) {
                var discount = promotionalEvent.percentDiscount;
            }
            var totalPrice = (priceItems * (100 - (discount ? discount : 0))) / 100 + shippingFee;
            const orderInfo = {
                orderItems: [],
                shippingAddress: {
                    fullName: infoCheckout.fullName,
                    address: infoCheckout.address,
                    phone: infoCheckout.phoneNumber,
                },
                paymentsMethod:
                    infoCheckout.paymentsMethod === '1' ? 'Thanh toán khi nhận hàng' : 'Tài khoản ngân hàng',
                itemsPrice: priceItems,
                discount: (priceItems * (discount ? discount : 0 * 100)) / 100,
                shippingFee: shippingFee,
                totalPrice: totalPrice,
                status: infoCheckout.paymentsMethod === '1' ? 1 : 2, //1 là chờ xác nhận // 2 là Đang chuẩn bị hàng
                user: userId,
            };
            // { id, name, size, price, thumb } cấu trúc của product trong giỏ hàng lưu vào localStorage
            productsCart.forEach((product) => {
                orderInfo.orderItems.push({
                    name: product.name,
                    amount: product.sl,
                    price: product.price,
                    size: product.size,
                    product: product.id,
                    ms: product.ms,
                    thumb: product.thumb,
                });
            });
            const orderCreate = await Order.create(orderInfo);
            if (orderCreate) {
                localStorage.remove(constants.miniCartProductList);
                return res.status(200).json({
                    successMessage: 'Đặt hàng thành công, DRESSORE sẽ liên hệ với quý khách sớm nhất có thể',
                });
            }
        }
    }
};
