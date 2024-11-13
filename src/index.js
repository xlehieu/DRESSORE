import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import * as db from './config/db/index.js';
import routes from './routers/index.js';
import session from 'express-session';
import { helpers } from './helpers/index.js';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
db.connect();
const port = 8080;
const app = express();
//dùng để lấy data từ form khi post lên server
app.use(
    express.urlencoded({
        extended: true,
    }),
);
// cho phép truy cập từ trình duyệt vào những file tĩnh trong thư mục public
app.use(express.static(path.join(process.cwd(), 'src', 'public')));

//template engine
app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        helpers: helpers,
    }),
);
app.set('view engine', 'hbs');
//process.cwd() sẽ lấy thư mục gốc của dự án => NodeJS - learning
app.set('views', path.join(process.cwd(), 'src', 'resources', 'views'));

//Route init
app.use(express.json());
app.use(bodyParser.json());
app.use(
    session({
        secret: 'secret_key',
        resave: false, //Khi resave được đặt thành false, session sẽ không được lưu lại mỗi lần request được gửi đến server, trừ khi session có sự thay đổi
        saveUninitialized: true, //Khi saveUninitialized được đặt thành true, session sẽ được lưu trữ ngay cả khi chúng chưa được khởi tạo
        cookie: { maxAge: 7200000 }, // hết hạn sau 2 giờ
    }),
);
app.use(methodOverride('_method'));
routes(app);

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
