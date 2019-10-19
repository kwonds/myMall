var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');
var co = require('co');

router.get('/:id' , function(req, res){

    var getData = co(function* (){
        return {
            product : yield ProductsModel.findOne( { 'id' :  req.params.id }).exec(),
            comments : yield CommentsModel.find( { 'product_id' :  req.params.id }).exec()
        };
    });
    getData.then( result =>{
        res.render('products/detail', {  title:'상품상세', bodyId:'product', js:'../../js/product.js', product: result.product , comments : result.comments });
    });
});


module.exports = router;