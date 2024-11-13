document.addEventListener('DOMContentLoaded', function () {
    const miniCart = $('.mini-cart');
    const miniCartBtn = $('.mini-cart-btn');
    const closeBoxBtn = $('.close-box');
    miniCartBtn.click(function () {
        miniCart.css('right', '0');
    });
    closeBoxBtn.click(function () {
        miniCart.css('right', '-500px');
    });
});
