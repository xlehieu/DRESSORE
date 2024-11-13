document.addEventListener('DOMContentLoaded', function () {
    $(document).ready(function () {
        var loginForm = document.forms['login-form'];

        //Nếu sử dụng jQuey thì bắt sự kiện bằng cách VD: .change or .click
        var phone = $('#user-phone-login');
        var password = $('#user-password-login');
        var loginButton = $('#login-button');

        loginButton.click(function (e) {
            e.preventDefault();
            if (!phone.val() || !password.val()) {
                return alert('Quý khách vui lòng nhập đủ thông tin');
            }
            loginForm.submit();
        });
    });
});
