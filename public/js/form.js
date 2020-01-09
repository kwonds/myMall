
$(document).ready(function() {
    $("input[type=text]").each(function(){
        if(this.value === 'undefined'){
            this.value = ""
        }
    })

    $('#editForm').submit(function(){
        $("input[name=files]").remove()
        
        var contentName = $("input[name='name']").val()
        var contentPrice = $("input[name='price']").val()
        if(!contentName){
            alert('제목을 입력해주세요.')
            return false
        }else if(!contentPrice){
            alert('가격을 입력해주세요.')
            return false
        }
    })
    
    $('#summernote').summernote({
        height: 300,
        callbacks : {
            onImageUpload: function(files) {
                sendFile(files[0]);
            }
        }
    });
    
    function sendFile(file, editor, welEditable) {
        data = new FormData();
        data.append("thumbnail", file);
        // data.append("name", $('input #').val())
        $.ajax({
            data: data,
            type: "POST",
            url: '/admin/products/ajax_summernote/',
            cache: false,
            contentType: false,
            processData: false,
            success: function(url) {
                $('#summernote').summernote("insertImage", url);
            }
        });
    }
})

