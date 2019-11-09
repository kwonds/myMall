var express = require('express')
var router = express.Router()
var ProductsModel = require('../models/ProductsModel')
var CommentsModel = require('../models/CommentsModel')
var paginate = require('express-paginate')

// csrf 셋팅
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

// 이미지 저장되는 위치 설정
var path = require('path')
var uploadDir = path.join(__dirname, '../uploads') // 루트의 uploads위치에 저장한다.
var fs = require('fs')

// multer 셋팅
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, callback) { // 이미지가 저장되는 도착지 지정
    callback(null, uploadDir)
  },
  filename: function (req, file, callback) { // products-날짜.jpg(png) 저장
    callback(null, 'products-' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})
var upload = multer({ storage: storage })
router.use(express.static('public'))

router.get('/products', paginate.middleware(3, 50), async (req,res) => {
  // ProductsModel.find(function (err, products) {
  //   res.render('admin/products', { products: products, title: '상품목록', bodyId: 'products', js: '' })
  //   // res.render( 'admin/products' ,
  //   //     { products : products } // DB에서 받은 products를 products변수명으로 내보냄
  //   // )
  // })
     try{
        const [ results, itemCount ] = await Promise.all([
            ProductsModel.find().sort('-created_at').limit(req.query.limit).skip(req.skip).exec(),//-내림차순
            ProductsModel.count({})
        ]);
        const pageCount = Math.ceil(itemCount / req.query.limit);
        
        const pages = paginate.getArrayPages(req)( 4 , pageCount, req.query.page);
    
        /*
            var b = a(10)(1,2,3)
            function a(num){
                return function(aa,bb,cc){
                    console.log('hello')
                }
            }
        */
        res.render('admin/products', { 
            products : results , 
            pages: pages,
            pageCount : pageCount,
            title: '상품목록',
            bodyId: 'products',
            js: ''
        });
    }catch(error){
        throw(error)
        // await에서 에러나면 잡아줌
    }
})

router.get('/products/write', csrfProtection, function (req, res) {
  // edit에서도 같은 form을 사용하므로 빈 변수( product )를 넣어서 에러를 피해준다
  res.render('admin/form', { product: '', csrfToken: req.csrfToken(), title: '상품등록', bodyId: 'updateItem', js: '../../js/form.js' })
})

router.post('/products/write', upload.single('thumbnail'), csrfProtection, function (req, res) {
  var product = new ProductsModel({
    name: req.body.name,
    price: req.body.price,
    thumbnail: (req.file) ? req.file.filename : '',
    description: req.body.description,
    username: req.user.username
  })

  if (!product.validateSync()) {
    product.save(function (err) {
      res.redirect('/admin/products')
    })
  }
})

router.get('/products/detail/:id', function (req, res) {
  router.use('/products', express.static('public'))
  // url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
  var getData = async() => {
    return {
      product: await ProductsModel.findOne({ 'id': req.params.id }).exec(),
      comments: await CommentsModel.find({ product_id: req.params.id }).exec()
    }
  }
  getData().then(function (result) { 
    res.render('admin/productsDetail', { product: result.product, comments: result.comments, title: '상품등록', bodyId: 'detailItem', js: '../../../js/detail.js' })
   })
  // ProductsModel.findOne({ 'id': req.params.id }, function (err, product) {
  //   // 제품정보를 받고 그안에서 댓글을 받아온다.
  //   CommentsModel.find({ product_id: req.params.id }, function (err, comments) {
  //     res.render('admin/productsDetail', { product: product, comments: comments, title: '상품등록', bodyId: 'detailItem', js: '../../../js/dtail.js' })
  //     // res.render('admin/productsDetail', { product: product , comments : comments })
  //   })
  // })
})

router.get('/products/edit/:id', csrfProtection, function (req, res) {
  ProductsModel.findOne({ id: req.params.id }, function (err, product) {
    res.render('admin/form', { product: product, csrfToken: req.csrfToken(), title: '상품수정', bodyId: 'editItem', js: '../../../js/edit.js' })
  })
})

// 파일 여러개면 upload.array
router.post('/products/edit/:id', upload.single('thumbnail'), csrfProtection, function (req, res) {
  // 이전 이미지 유지할때 전에 있던 파일명을 찾아옴
  ProductsModel.findOne({ id: req.params.id }, function (err, product) {
    if (req.file && product.thumbnail) { // 요청중에 파일이 존재 할시 이전이미지 지운다.
      fs.unlinkSync(uploadDir + '/' + product.thumbnail)
    }

    // 넣을 변수 값을 셋팅한다
    var query = {
      name: req.body.name,
      thumbnail: (req.file) ? req.file.filename : product.thumbnail,
      price: req.body.price,
      description: req.body.description
    }

    // update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
    // $set바뀌는부분만 바꾸고 나머지는 고정 $set없으면 나머지필드 지워짐
    ProductsModel.update({ id: req.params.id }, { $set: query }, function (err) {
      res.redirect('/admin/products/detail/' + req.params.id) // 수정후 본래보던 상세페이지로 이동
    })
  })
})

router.get('/products/delete/:id', function (req, res) {
  ProductsModel.remove({ id: req.params.id }, function (err) {
    res.redirect('/admin/products')
  })
})

router.post('/products/ajax_comment/insert', function (req, res) {
  var comment = new CommentsModel({
    content: req.body.content,
    product_id: parseInt(req.body.product_id)
  })
  comment.save(function (err, comment) {
    res.json({
      id: comment.id,
      content: comment.content,
      message: 'success'
    })
  })
})


router.post('/products/ajax_comment/delete', function (req, res) {
  CommentsModel.remove({ id: req.body.comment_id }, function (err) {
    res.json({ message: 'success' })
  })
})

router.post('/products/ajax_summernote', upload.single('thumbnail'), function(req,res){
  res.send( '/uploads/' + req.file.filename);
});

module.exports = router
