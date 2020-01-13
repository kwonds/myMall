console.log("성공")
$(document).ready(function() {
    $.ajax({
        url: "/getCart/init"
      }).done(function(cnt) {
        $('.cart_cart a').append(`<style>.cart_cart a:before { content:'${cnt}'; }</style>`);
      });
    

    $( ".search_icon" ).click(function() {
        console.log(this)
    });
});
