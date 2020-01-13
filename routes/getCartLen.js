var express = require('express');
var router = express.Router();

router.get('/' , function(req, res){
    var cartList = {}; 
    if( typeof(req.cookies.cartList) !== 'undefined'){
        var cartList = JSON.parse(unescape(req.cookies.cartList));
    }
    res.json(Object.keys(cartList).length)
});

router.get('/init' , function(req, res){
    console.log(req.cookies.cartList)
    // console.log(JSON.parse(unescape(req.cookies.cartList)))
    // var cartList = JSON.parse(unescape(req.cookies.cartList));
    // cartList = {}; 
    // if( typeof(req.cookies.cartList) !== 'undefined'){
    //     var cartList = JSON.parse(unescape(req.cookies.cartList));
    // }
    // res.json(Object.keys(cartList).length)
});


module.exports = router;