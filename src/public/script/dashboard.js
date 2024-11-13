function toVND(money) {
    const moneyFormat = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return moneyFormat.format(Number(money));
}
function renderStatus(statusCode) {
    statusCode = Number(statusCode);
    if (statusCode === 1) {
        return 'Chờ xác nhận';
    } else if (statusCode === 2) {
        return 'Đang chuẩn bị hàng';
    } else if (statusCode === 3) {
        return 'Đang giao hàng';
    } else if (statusCode === 4) {
        return 'Giao thành công';
    } else if (statusCode === 5) {
        return 'Đơn hàng bị hủy';
    } else {
        return 'Chờ xác nhận';
    }
}
function renderOrders(orders) {
    let content;
    orders.forEach((order, index) => {
        content += `<tr>
                    <td>
                        ${index + 1}
                    </td>
                    <td>
                        ${order.userName}
                    </td>
                    <td>
                        <div class='d-flex flex-column'>
                            <p>Tên: ${order.shippingAddress.fullName}</p>
                            <p>Địa chỉ: ${order.shippingAddress.address}</p>
                            <p>Số điện thoại: ${order.shippingAddress.phone}</p>
                        </div>
                    </td>
                    <td>
                        ${toVND(order.totalPrice)}
                    </td>
                    <td>
                        ${renderStatus(order.status)}
                    </td>
                    <td class='text-center'>
                        <a
                            class='btn btn-outline-warning rounded'
                            href="/tui-la-admin/hoa-don/${order._id}"
                        >
                            <i class='fa-regular fa-pen-to-square'></i>
                        </a>
                    </td>
                </tr>`;
    });
    $('#orders-table').html(content);
}
function renderPagination(currentPage) {
    currentPage = Number(currentPage) + 1;
    if (currentPage === 1) {
        var pagination = `
                <li class="page-item active" aria-current="page" ><span class="page-link ">${currentPage}</span></li>
                <li class="page-item"><button class="page-link paginationLink"  data-page="${currentPage + 1}">${
            currentPage + 1
        }</button></li>
        `;
    } else {
        pagination = `
                <li class="page-item"><button class="page-link paginationLink"  data-page="${currentPage - 1}">${
            currentPage - 1
        }</button></li>
                <li class="page-item active" aria-current="page" ><span class="page-link">${currentPage}</span></li>
                <li class="page-item"><button class="page-link paginationLink"  data-page="${currentPage + 1}">${
            currentPage + 1
        }</button></li>
           `;
    }
    $('#pagination').html(pagination);
    pageClick();
}
function pageClick() {
    const pageLink = $('.paginationLink');
    pageLink.click(function () {
        const page = $(this).data('page');
        $.ajax({
            url: '/tui-la-admin/dashboard_data',
            method: 'get',
            contentType: 'application/json',
            data: { page },
            success: function (response) {
                if (response.orders.length > 0) {
                    renderOrders(response.orders);
                    renderPagination(response.page);
                }
            },
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    pageClick();
});
