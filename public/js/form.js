
$(document).ready(function() {
    $("input[type=text]").each(function(){
        if(this.value === 'undefined'){
            this.value = ""
        }
    })
})

