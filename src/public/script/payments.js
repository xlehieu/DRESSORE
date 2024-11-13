function toVND(money) {
    const vnd = Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return vnd.format(Number(money));
}
function errorMessage(message) {
    $('#error-message-content').html(message);
    $('#error-message').addClass('show');
    const time = setTimeout(function () {
        $('#error-message').removeClass('show');
        clearTimeout(time);
    }, 3000);
}
function successMessage(message) {
    $('#success-message-content').html(message);
    $('#success-message').addClass('show');
    const time = setTimeout(function () {
        $('#success-message').removeClass('show');
        clearTimeout(time);
    }, 3000);
}
function active(jQueryElement) {
    jQueryElement.addClass('active');
    jQueryElement.children('.icon-check').removeClass('d-none');
}
function inactive(jQueryElement) {
    jQueryElement.removeClass('active');
    jQueryElement.children('.icon-check').addClass('d-none');
}
document.addEventListener('DOMContentLoaded', function () {
    const checkoutInformationForm = $('form[name="checkout-information"]');
    const progressInformation = $('.giao-hang');
    const progressPayments = $('.thanh-toan');
    const progressConfirm = $('.xac-nhan');
    const btnContinuePayments = $('#continue-payments');
    const btnConfirm = $('#confirm-payments');
    var shippingFee;
    btnContinuePayments.click(function (e) {
        e.preventDefault();
        if ($('#tinh').val() == 0 || $('#quan').val() == 0 || $('#phuong').val() == 0) {
            errorMessage('QUÝ KHÁCH VUI LÒNG ĐIỀN ĐẦY ĐỦ THÔNG TIN');
            return;
        }
        if ($('#tinh').val() === '01') {
            shippingFee = 25000;
            $('#cart-shipping-fee').html(toVND(shippingFee));
            $('#fee-ship').val(shippingFee); //gán vào thẻ input
        } else {
            shippingFee = 30000;
            $('#cart-shipping-fee').html(toVND(shippingFee));
            $('#fee-ship').val(shippingFee); //gán vào thẻ input
        }
        const priceTotalCart = $('#price-total-cart-val').val(); // giá tiền tổng các mặt hàng trong giỏ hàng
        const discountVal = $('#discount-val').val(); // giảm giá => tiền không phải phần trăm
        const grandTotalVal = Number(priceTotalCart) - Number(discountVal) + Number(shippingFee); // sau khi cộng trừ các chi phí
        $('#cart-grand-total').html(toVND(grandTotalVal));
        $('#grand-total-val').val(grandTotalVal);
        $('#payments-tab').click();
        active(progressInformation);
    });
    // BTN QUAY LẠI TAB THANH TOÁN
    const btnBackToInformation = $('#back-to-information');
    btnBackToInformation.click(function (e) {
        e.preventDefault();
        $('#information-tab').click();
        inactive(progressInformation);
    });
    //BTN XÁC NHẬN TAB THANH TOÁN
    btnConfirm.click(function (e) {
        e.preventDefault();
        const priceTotalVal = $('#price-total-cart-val').val();
        const discountVal = $('#discount-val').val();
        const feeShip = $('#fee-ship').val();
        const grandTotalVal = $('#grand-total-val').val();
        if (!priceTotalVal || !discountVal || !feeShip || !grandTotalVal) {
            errorMessage('ĐẶT HÀNG KHÔNG THÀNH CÔNG');
            return;
        }
        const formData = {};
        checkoutInformationForm.serializeArray().forEach(function (item) {
            formData[item.name] = item.value;
        });
        $.ajax({
            ulr: '/thanh-toan',
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                successMessage(response.successMessage);
                active(progressPayments);
                $('#confirm-tab').click();
            },
            error: function (xhr) {
                const errorMessage = JSON.parse(xhr.errorMessage);
                errorMessage(errorMessage);
            },
        });
    });
    //CALL API lấy tỉnh thành
    $(document).ready(function () {
        //Lấy tỉnh thành
        $.getJSON('https://esgoo.net/api-tinhthanh/1/0.htm', function (data_tinh) {
            if (data_tinh.error == 0) {
                $.each(data_tinh.data, function (key_tinh, val_tinh) {
                    $('#tinh').append('<option value="' + val_tinh.id + '">' + val_tinh.full_name + '</option>');
                });
                $('#tinh').change(function (e) {
                    var idtinh = $(this).val();
                    //Lấy quận huyện
                    $.getJSON('https://esgoo.net/api-tinhthanh/2/' + idtinh + '.htm', function (data_quan) {
                        if (data_quan.error == 0) {
                            $('#quan').html('<option value="0">Quận Huyện</option>');
                            $('#phuong').html('<option value="0">Phường Xã</option>');
                            $.each(data_quan.data, function (key_quan, val_quan) {
                                $('#quan').append(
                                    '<option value="' + val_quan.id + '">' + val_quan.full_name + '</option>',
                                );
                            });
                            //Lấy phường xã
                            $('#quan').change(function (e) {
                                var idquan = $(this).val();
                                $.getJSON(
                                    'https://esgoo.net/api-tinhthanh/3/' + idquan + '.htm',
                                    function (data_phuong) {
                                        if (data_phuong.error == 0) {
                                            $('#phuong').html('<option value="0">Phường Xã</option>');
                                            $.each(data_phuong.data, function (key_phuong, val_phuong) {
                                                $('#phuong').append(
                                                    '<option value="' +
                                                        val_phuong.id +
                                                        '">' +
                                                        val_phuong.full_name +
                                                        '</option>',
                                                );
                                            });
                                        }
                                    },
                                );
                            });
                        }
                    });
                });
            }
        });
    });
});
