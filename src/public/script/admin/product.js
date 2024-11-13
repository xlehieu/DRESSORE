document.addEventListener('DOMContentLoaded', function () {
    var id;
    //form xóa
    var deleteProductForm = document.forms['deleteProductForm'];
    //button xóa
    var deleteProductBtn = $('#deleteProductBtn');
    //sự kiện khi click button xóa và hiển thị modal xác nhận xóa
    $('#confirmDeleteProduct').on('show.bs.modal', function (event) {
        //lấy thông tin từ nút xóa -- không phải nút xác nhận xóa
        const button = $(event.relatedTarget);
        id = button.data('id');
    });
    deleteProductBtn.click(() => {
        deleteProductForm.action = `/tui-la-admin/san-pham/delete/${id}?_method=DELETE`;
        deleteProductForm.submit();
    });
    $(document).ready(function () {
        $('#summernote').summernote({ minHeight: 400 });
    });
});
