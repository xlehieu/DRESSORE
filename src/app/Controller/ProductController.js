import Product from '../Model/ProductModel.js';
import { arrToObj, toObj } from '../../utils/index.js';
import localStorage from 'local-storage';
import constants from '../../constants/index.js';
export const getAll = async (req, res) => {
    const userId = req.session.userId;
    const products = await Product.find().sort({ createdAt: 'asc' });
    return res.render('products', { layout: 'sub', products: arrToObj(products), userId });
};
export const getCart = (req, res) => {
    try {
        let priceTotal = 0;
        const responseProductList = localStorage.get(constants.miniCartProductList);
        if (responseProductList) {
            priceTotal = responseProductList.reduce((accumulator, curItem) => {
                return accumulator + curItem.price * curItem.sl;
            }, 0);
        }
        return res.send({
            response: {
                ok: true,
                data: {
                    productList: responseProductList ? responseProductList : [],
                    priceTotal: priceTotal ? priceTotal : 0,
                },
            },
        });
    } catch (err) {
        console.log(err);
    }
};
export const addToCart = (req, res) => {
    try {
        const { id, name, size, price, ms, thumb } = req.body;
        const miniCartProductList = localStorage.get(constants.miniCartProductList);
        if (miniCartProductList) {
            let found = false;
            const newMiniCart = miniCartProductList.map((item) => {
                if (!found) {
                    if (item.id === id && item.size === size) {
                        item.sl += 1;
                        found = true;
                    }
                }
                return item;
            });
            if (found) localStorage.set(constants.miniCartProductList, [...newMiniCart]);
            else
                localStorage.set(constants.miniCartProductList, [
                    ...miniCartProductList,
                    { id, name, size, sl: 1, price, ms, thumb },
                ]);
        } else {
            localStorage.set(constants.miniCartProductList, [{ id, name, size, sl: 1, price, ms, thumb }]);
        }
        let priceTotal = 0;
        const responseProductList = localStorage.get(constants.miniCartProductList);
        // dùng reduce như này thì ban đầu khởi  tạo đối tượng có total:0,
        // khi lặp thì sẽ gán lại total của đối tượng đó , accumulator ban đầu có giá trị bằng init nên cũng là đối tượng có thuộc tính total
        priceTotal = responseProductList.reduce((accumulator, curItem) => {
            return accumulator + curItem.price * curItem.sl;
        }, 0);
        return res.send({
            response: {
                ok: true,
                data: {
                    productList: responseProductList,
                    priceTotal: priceTotal ? priceTotal : 0,
                },
            },
        });
    } catch (err) {
        console.log(err);
    }
};
export const removeCartItem = (req, res) => {
    try {
        const { id, size } = req.body;
        const miniCartProductList = localStorage.get(constants.miniCartProductList);
        var newMiniCart = miniCartProductList.filter((item) => {
            //dùng filter bắt buộc phải như này chứ không thể như này
            //return item.id !== id && item.size !== size);
            return !(item.id === id && item.size === size);
        });
        localStorage.set(constants.miniCartProductList, newMiniCart);
        let priceTotal;
        if (newMiniCart.length > 0) {
            priceTotal = newMiniCart.reduce((accumulator, curItem) => {
                return accumulator + curItem.price * curItem.sl;
            }, 0);
        }
        return res.send({
            response: {
                ok: true,
                data: {
                    productList: newMiniCart,
                    priceTotal: priceTotal ? priceTotal : 0,
                },
            },
        });
    } catch (err) {
        console.log(err);
    }
};
