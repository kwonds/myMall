$(document).ready(function(){
    $('#commentForm').submit(function(){
         var $contentVal = $(this).children('textarea[name=content]').val()
              if($contentVal){
                $.ajax({
                    url: '/admin/products/ajax_comment/insert',
                    type: 'POST',
                    data: $(this).serialize(),//모든 데이터가 넘어감
                })
                .done(function(args) {
                    if(args.message==="success"){
                        $('#comment_area').append(
                            '<div>' + args.content + 
                            " ( <a class='comment_delete' comment_id='"+ args.id +"'>삭제</a> ) </div>" 
                        )
                        $('#commentForm textarea[name=content]').val("")
                    }
                })
                .fail(function(args) {
                    console.log(args)
                })
                
            }else{
                alert('댓글 내용을 입력해주세요.')
            }
            return false //form action이 안일어남 (refresh 막음) preventdefault
    })


})

$(document).on('click' , '.comment_delete' , function(){
    if(confirm('삭제하시겠습니까?')){ //확인창 예 눌렀을 시만 진행
        var $self = $(this);
        $.ajax({
            url: '/admin/products/ajax_comment/delete',
            type: 'POST',
            data: { comment_id : $self.attr('comment_id') },
        })
        .done(function() {
            $self.parent().remove();
            alert("삭제가 완료되었습니다.");
        })
        .fail(function(args) {
            console.log(args);
        });
    }
});

function increaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('number').value = value;
  }
  
  function decreaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById('number').value = value;
  }