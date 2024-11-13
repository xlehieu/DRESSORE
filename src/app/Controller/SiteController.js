import bcrypt from 'bcryptjs';
import session from 'express-session';
import User from '../Model/UserModel.js';
import Category from '../Model/CategoryModel.js';
import News from '../Model/NewsModel.js';
import { arrToObj } from '../../utils/index.js';
//[GET] /
const salt = bcrypt.genSaltSync(10);
export const home = async (req, res) => {
    //Lấy ra id người dùng lưu trong session
    const userId = req.session.userId;
    const banner = {
        url: 'https://static.dchic.vn/uploads/media/2024/10/web%20banner-596129851.png',
    };
    Promise.all([Category.find({ isShow: true }).sort({ updatedAt: 'asc' }).limit(4), News.find().limit(3)]).then(
        ([categoriesHome, newsHome]) => {
            return res.render('home', {
                layout: 'main',
                categoriesHome: arrToObj(categoriesHome),
                newsHome: arrToObj(newsHome),
                banner,
                userId,
            });
        },
    );
    // const categoriesHome = await Category.find({ isShow: true }).sort({ updatedAt: 'asc' }).limit(3);
    // const newsHome = await News.find().limit(3);
    //return res.render('home', { layout: 'main', categoriesHome: arrToObj(categoriesHome), banner, userId });
};
// GET /login
export const login = (req, res) => {
    return res.render('sites/login', { layout: 'sub' });
};

//POST /login
export const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) return res.redirect('/login');

        const userInfo = await User.findOne({ phone: phone });
        if (!userInfo) {
            return res.render('sites/login', {
                layout: 'sub',
                errorInfoLogin: { message: 'Tài khoản hoặc mật khẩu không đúng' },
            });
        }

        //So sánh password hash trong database và password đăng nhập vào
        const checkPass = await bcrypt.compare(password, userInfo.password);
        if (checkPass) {
            req.session.userId = userInfo._id;
            return res.redirect('/');
        } else {
            return res.render('sites/login', {
                layout: 'sub',
                errorInfoLogin: { message: 'Tài khoản hoặc mật khẩu không đúng' },
            });
        }
    } catch (err) {
        return res.render('sites/login', {
            layout: 'sub',
            errorInfoLogin: { message: 'Lỗi' },
        });
    }
};

// GET/register
export const register = (req, res) => {
    return res.render('sites/register', { layout: 'sub' });
};
// POST /register
export const createUser = async (req, res) => {
    try {
        const { name, phone, email, address, password, retypePassword } = req.body;

        if (!name || !phone || !email || !address || !password || !retypePassword) {
            return res.status(400).json({
                error: 'Quý khách vui lòng nhập đủ thông tin',
            });
        }
        if (password !== retypePassword) {
            return res.status(400).json({
                error: 'Mật khẩu và nhập lại mật khẩu phải giống nhau',
            });
        }
        const passwordHash = bcrypt.hashSync(password, salt);
        const newUser = await User.create({
            name,
            phone,
            email,
            address,
            password: passwordHash,
        });
        if (newUser)
            return res.status(200).json({
                ok: true,
                message: 'Đăng ký tài khoản thành công',
            });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: 'Có lỗi trong quá trình đăng ký',
        });
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy(function (err) {
        if (!err) {
            res.redirect('/');
        }
    });
};
