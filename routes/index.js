var express = require('express')
var router = express.Router()
var ProductsModel = require('../models/ProductsModel')

router.get('/', function(req, res, next) {
  ProductsModel.find( function(err,products){ //첫번째 인자는 err, 두번째는 받을 변수명
    res.render('main',{products : products, title:'프로젝트', bodyId:'main', js:'main.js'})
    // DB에서 받은 products를 products변수명으로 내보냄
  })
})

module.exports = router