import Handlebars from 'handlebars';
import { FindCatById } from '../app/Controller/Admin/AdminCategoryController.js';
import constants from '../constants/index.js';
function check(cat1, cat2) {
    if (cat1 === cat2) {
        return 'selected';
    }
    return '';
}
const ToVND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});
export const helpers = {
    orderUp: (order) => {
        return Number(order + 1);
    },
    toVND: (money) => {
        return ToVND.format(money);
    },
    renderStatus: (statusCode) => {
        if (statusCode === 1) {
            return new Handlebars.SafeString('Chờ xác nhận');
        } else if (statusCode === 2) {
            return new Handlebars.SafeString('Chờ lấy hàng');
        } else if (statusCode === 3) {
            return new Handlebars.SafeString('Đang giao hàng');
        } else if (statusCode === 4) {
            return new Handlebars.SafeString('Giao thành công');
        } else if (statusCode === 5) {
            return new Handlebars.SafeString('Đơn hàng bị hủy');
        } else {
            return new Handlebars.SafeString('Chờ xác nhận');
        }
    },
    renderSelectStatus: (status) => {
        const selectContent = `
            <option value="" disabled>Cập nhật trạng thái đơn hàng</option>
            <option ${status === 1 ? 'selected' : ''} value="1">${constants.statusOrder[1]}</option>
            <option ${status === 2 ? 'selected' : ''} value="2">${constants.statusOrder[2]}</option>
            <option ${status === 3 ? 'selected' : ''} value="3">${constants.statusOrder[3]}</option>
            <option ${status === 4 ? 'selected' : ''} value="4">${constants.statusOrder[4]}</option>
            <option ${status === 5 ? 'selected' : ''} value="4">${constants.statusOrder[5]}hủy</option>
        `;
        return new Handlebars.SafeString(selectContent);
    },
    renderPagination: (currentPage) => {
        currentPage = Number(currentPage) + 1;
        if (currentPage === 1) {
            var pagination = `
                <li class="page-item active" aria-current="page" ><span class="page-link">${currentPage}</span></li>
                <li class="page-item"><button class="page-link paginationLink"  data-page="${currentPage + 1}">${
                currentPage + 1
            }</button></li>
            `;
        } else {
            pagination = `
                <li class="page-item"><button class="page-lin paginationLink"  data-page="${currentPage - 1}">${
                currentPage - 1
            }</button></li>
                <li class="page-item active" aria-current="page" ><span class="page-link">${currentPage}</span></li>
                <li class="page-item"><button class="page-link paginationLink"  data-page="${currentPage + 1}">${
                currentPage + 1
            }</button></li>
            `;
        }

        return new Handlebars.SafeString(pagination);
    },
    formatNumber: (number) => {
        return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : number;
    },
    renderCheckboxCategory: (categories, catId) => {
        try {
            let renderContent = '';
            categories.forEach((category) => {
                renderContent += `<option value='${category._id}' ${check(String(category._id), String(catId))} >${
                    category.name
                }</option>`;
            });
            return new Handlebars.SafeString(renderContent); // sử dụng safestring để hỗ trợ render ra html
        } catch {
            return new Handlebars.SafeString('LỖI');
        }
    },
    isFirstElement: (index) => {
        return index == 0;
    },
    jsonData: (data) => {
        return JSON.stringify(data);
    },
};
