document.addEventListener('DOMContentLoaded', function () {
    var id;
    //form xóa
    var deleteCategoryForm = document.forms['deleteCategoryForm'];
    //button xóa
    var deleteCategoryBtn = $('#deleteCategoryBtn');
    //sự kiện khi click button xóa và hiển thị modal xác nhận xóa
    $('#confirmDeleteCategory').on('show.bs.modal', function (event) {
        //lấy thông tin từ nút xóa -- không phải nút xác nhận xóa
        const button = $(event.relatedTarget);
        id = button.data('id');
    });
    deleteCategoryBtn.click(() => {
        deleteCategoryForm.action = `/tui-la-admin/danh-muc/delete/${id}?_method=DELETE`;
        deleteCategoryForm.submit();
    });
    $(document).ready(function () {
        $('#summernote').summernote({ minHeight: 400 });
    });
});
