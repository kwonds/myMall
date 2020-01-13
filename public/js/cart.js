console.log("장바구니")
$(document).ready(function(){
    function setTotal(num){
        $('#totalAmount').text(num)
        $('[name="price"]').val(num)
    }
    function selectedItem(id){
        if($('[name="id"]').length>0){
            $('[name="id"]').remove()
        }

        id.forEach(function (elem, idx) { 
            let input = document.createElement('input')
            input.setAttribute('type','hidden')
            input.setAttribute('name','id')
            input.setAttribute('value',elem)
            $('#sendInfo').append(input)
         })

    }
    let itemArr = []
    let itemId = []
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    $("input:checkbox").each(function(idx,elem){
        if($(elem).is(":checked")){
            let cnt = Number($(`#cartList > tbody > tr:nth-child(${idx+2}) > td:nth-child(4)`)[0].textContent)
            let price = Number($(`#cartList > tbody > tr:nth-child(${idx+2}) > td:nth-child(5) > span`)[0].innerText)
            itemArr.push(cnt*price)
            itemId.push($(elem).val())
        }
    })
 
    $('input:checkbox').click(function(){
        let chkArr = []
        $("input:checkbox").each(function(idx,elem){
            chkArr.push($(elem).is(":checked"))
        })
        let status = false
        chkArr.forEach(function(elem,idx){
            if(elem == true){
                status = true
            }
        })
        if(status){
            itemArr = []
            itemId = []
            $("input:checkbox").each(function(idx,elem){
                if($(elem).is(":checked")){
                    let cnt = Number($(`#cartList > tbody > tr:nth-child(${idx+2}) > td:nth-child(4)`)[0].textContent)
                    let price = Number($(`#cartList > tbody > tr:nth-child(${idx+2}) > td:nth-child(5) > span`)[0].innerText)
                    itemArr.push(cnt*price)
                    itemId.push($(elem).val())
                }
            })
            setTotal(itemArr.reduce(reducer))
            selectedItem(itemId)
        }else{
            itemArr = 0
            itemId = []
            setTotal(itemArr)
            selectedItem(itemId)
        }
    })

    setTotal(itemArr.reduce(reducer))
    selectedItem(itemId)

    $('.deleteCart').click(function(event){
        event.preventDefault(); //href의 링크로 넘어가게 하지 않는다.
        if(confirm('삭제하시겠습니까?')){
            var productId = $(this).attr('productId'); //아이디를 받아온다
            //productId로 찾아서 delete로 날린다
            let cartList = {};
            if( getCookie('cartList') ){ //있으면 json 파싱함
                cartList = JSON.parse(getCookie('cartList'));
                delete cartList[productId];  //지우는 부분
            }
            //다시쿠키 설정
            setCookieHour( "cartList" , JSON.stringify(cartList) , 3 );

            //완료후 다시 cart 페이지로 이동
            document.location.href = "/cart";
        }

    });
});