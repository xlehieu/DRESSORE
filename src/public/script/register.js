function isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
document.addEventListener('DOMContentLoaded', function () {
    $(document).ready(function () {
        var registerButton = $('#register-button');
        registerButton.click(function (e) {
            var name = $('#user-name-register').val();
            var phone = $('#user-phone-register').val();
            var email = $('#user-email-register').val();
            var address = $('#user-address-register').val();
            var password = $('#user-password-register').val();
            var retypePassword = $('#user-retype-password-register').val();

            e.preventDefault();
            if (!name || !phone || !email || !address || !password || !retypePassword) {
                return alert('Quý khách vui lòng nhập đủ dữ liệu!');
            }
            if (!isEmail(email)) return alert('Email không đúng định dạng');
            $.ajax({
                url: '/dang-ky',
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: name,
                    phone: phone,
                    email: email,
                    address: address,
                    password: password,
                    retypePassword: retypePassword,
                }),
                success: function (response) {
                    if (response.ok) {
                        $('#message-box-success-register').removeClass('d-none');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        let countDown = 3;
                        $('.count-down').html(countDown.toString());
                        var intervalCountDown = setInterval(function () {
                            $('.count-down').html(countDown.toString());
                            countDown--;
                            if (countDown < 0) {
                                clearInterval(intervalCountDown);
                                window.location.href = '/dang-nhap';
                            }
                        }, 1000);
                    }
                },
                error: function (xhr, status, error) {
                    var errorMessage = JSON.parse(xhr.responseText);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    $('#message-box-error-register').removeClass('d-none');
                    $('.error-message-register').html(errorMessage.error);
                },
            });
        });
    });
});
