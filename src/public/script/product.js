function ToVND(number) {
    const vnd = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    number = Number(number);
    return vnd.format(number);
}

function renderListItem(productList, priceTotal) {
    let productLiItem = '';
    const miniCartListProduct = $('#minicart-list-product');
    if (productList.length > 0) {
        productList.forEach((productItem) => {
            productLiItem += `<li>
                                <div class="minicart-product-wrap">
                                <div class="minicart-product-thumb">
                                <img alt="" src="${productItem.thumb}">
                                </div>
                                    <div class="minicart-product-info">
                                    <p class="minicart-product-name">${productItem.name}</p>
                                    <p class="minicart-product-name">Size: ${productItem.size}</p>
                                    <p class="minicart-product-quantity">${productItem.sl} × ${productItem.price}</p>
                                    </div>
                                    <i class="fa fa-times btn-remove-item btn-remove-cart-item" data-id="${productItem.id}" data-size="${productItem.size}"></i>
                                    </div>
                                    </li>`;
        });
        const listProductElement = `<ul>${productLiItem}</ul>`;
        const priceTotalElement = `
        <div>
            <p class="minicart-subtotal">
                <b>Tổng đơn hàng:</b>
                <strong>${ToVND(priceTotal)}</strong>
            </p>
            <div>
                <a class="btn-mnc btn-view-cart " href="/gio-hang">XEM GIỎ HÀNG</a>
                <a href='/thanh-toan' class="btn-mnc btn-checkout">
                    ĐẶT HÀNG
                </a>
            </div>
        </div>`;
        miniCartListProduct.empty();
        miniCartListProduct.html(`${listProductElement} ${priceTotalElement}`);
        $('.btn-remove-item').click(function () {
            const productIdRemove = $(this).data('id');
            const productSizeRemove = $(this).data('size');
            $.ajax({
                url: '/san-pham/remove-cart-item',
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: productIdRemove,
                    size: productSizeRemove,
                }),
                success: function (res) {
                    //call ajax và lấy kết quả trả về là ok thì add vào list
                    const ulProduct = res.response.data.productList;
                    const priceTotal = res.response.data.priceTotal;
                    renderListItem(ulProduct, priceTotal);
                    $('#count-cart-item').html(`(${ulProduct.length})`);
                    if (ulProduct.length === 0) $('#count-cart-item').html('');
                },
            });
        });
    } else {
        miniCartListProduct.html('<ul><li><p>Chưa có sản phẩm nào trong giỏ hàng</p></li></ul>');
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var ulProduct = [];
    $(document).ready(function () {
        $.ajax({
            url: '/san-pham/get-cart',
            method: 'get',
            contentType: 'application/json',
            success: function (res) {
                ulProduct = res.response.data.productList;
                const priceTotal = res.response.data.priceTotal;
                renderListItem(ulProduct, priceTotal);
                if (ulProduct.length > 0) $('#count-cart-item').html(`(${ulProduct.length})`);
            },
        });
    });
    //xử lý chọn size

    // lấy ra những thằng chooseSize và lặp qua từng thằng span,
    // mỗi thằng sẽ lấy ra data size của thằng nào active
    // và thêm sự kiện click vào mỗi thằng span đó
    // khi click thì removeClass active những thằng anh chị em của thằng span đó
    // và gán lại size cho biến size thông qua data size
    const chooseSize = $('.choose-size');
    chooseSize.each(function () {
        let id;
        let size = $(this).find('span.active').data('size');
        const productFeature = $(this).find('.product-feature-size');
        productFeature.click(function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            size = $(this).data('size');
        });
        //button thêm giỏ hàng là anh em với thằng chooseSize nên dùng siblings()
        const addToCartBtn = $(this).siblings();
        addToCartBtn.click(function () {
            try {
                id = $(this).data('id');
                const product = $(this).data('product');
                // JQuery tự parse luôn nha
                if (product) {
                    $.ajax({
                        url: '/san-pham/add-to-cart',
                        method: 'post',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            size: size,
                            id: id,
                            name: product.name,
                            price: product.price,
                            ms: product.ms,
                            thumb: product.thumb,
                        }),
                        success: function (res) {
                            //call ajax và lấy kết quả trả về là ok thì add vào list
                            ulProduct = res.response.data.productList;
                            const priceTotal = res.response.data.priceTotal;
                            renderListItem(ulProduct, priceTotal);
                            if (ulProduct.length > 0) $('#count-cart-item').html(`(${ulProduct.length})`);
                        },
                    });
                }
            } catch (err) {
                console.log(err);
            }
        });
    });
});
