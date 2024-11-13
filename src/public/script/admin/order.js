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

document.addEventListener('DOMContentLoaded', function () {
    $('#updateStatusButton').click(function () {
        const statusVal = $('#updateStatusSelect').val();
        const id = $(this).data('id');
        if (statusVal) {
            $.ajax({
                url: `/tui-la-admin/hoa-don/${id}`,
                method: 'patch',
                data: { status: statusVal, id: id },
                success: function (response) {
                    successMessage(response.successMessage);
                    setTimeout(function () {
                        window.location.href = '/tui-la-admin';
                    }, 3000);
                },
                error: function (xhr) {
                    const errorMessage = JSON.parse(xhr.errorMessage);
                },
            });
        }
    });
});
