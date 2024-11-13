document.addEventListener('DOMContentLoaded', function () {
    //xử lý chọn size

    // lấy ra những thằng chooseSize và lặp qua từng thằng span,
    // mỗi thằng sẽ lấy ra data size của thằng nào active
    // và thêm sự kiện click vào mỗi thằng span đó
    // khi click thì removeClass active những thằng anh chị em của thằng span đó
    // và gán lại size cho biến size thông qua data size
    const chooseSize = $('.choose-size');
    chooseSize.each(function () {
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
            alert(size);
        });
    });
});
