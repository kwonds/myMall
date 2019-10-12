var express = require('express')
var router = express.Router()
	
var ContactsModel = require('../models/ContactsModel')

router.get('/contacts', function(req,res){ //글리스트
    // ProductsModel.find(function(err,products){
    //     res.render( 'admin/products' , 
    //         { products : products } // DB에서 받은 products를 products변수명으로 내보냄
    //     )
    // })
})

router.get('/contacts/write', function(req,res){//글작성
    // res.render('admin/form',{product:""})
})
 
router.post('/contacts/write', function(req,res){
    // var product = new ProductsModel({
    //     name : req.body.name,
    //     price : req.body.price,
    //     description : req.body.description,
    // })
    // product.save(function(err){
    //     res.redirect('/admin/products')
    // })
})

router.get('/contacts/detail/:id' , function(req, res){//상세글보기
    //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    // ProductsModel.findOne( { 'id' :  req.params.id } , function(err ,product){
    //     res.render('admin/productsDetail', { product: product })  
    // })
})

router.get('/contacts/edit/:id' ,function(req, res){//글수정하기
    //기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    // ProductsModel.findOne({ id : req.params.id } , function(err, product){
    //     res.render('admin/form', { product : product })
    // })
})

router.post('/contacts/edit/:id', function(req, res){
    //넣을 변수 값을 셋팅한다
    // var query = {
    //     name : req.body.name,
    //     price : req.body.price,
    //     description : req.body.description,
    // }

    // //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
    // //$바뀌는부분만 바꾸고 나머지는 고정 $없으면 나머지필드 지워짐
    // ProductsModel.update({ id : req.params.id }, { $set : query }, function(err){
    //     res.redirect('/admin/products/detail/' + req.params.id ) //수정후 본래보던 상세페이지로 이동
    // })
})

router.get('/contacts/delete/:id', function(req, res){//글삭제하기
    // ProductsModel.remove({ id : req.params.id }, function(err){
    //     res.redirect('/admin/products');
    // });
});

module.exports = router