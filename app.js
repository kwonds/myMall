var express = require('express')
var ejsLocals = require('ejs-locals')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var loginRequired = require('./libs/loginRequired')

//flash  메시지 관련
var flash = require('connect-flash')
 
//passport 로그인 관련
var passport = require('passport')
var session = require('express-session')

var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var db = mongoose.connection
db.on('error',console.error)
db.once('open',function(){
    console.log('mongodb connect')
})

//MongoDB 접속
mongoose.connect('mongodb://127.0.0.1:27017/MyMallDB', { useMongoClient: true })
var admin = require('./routes/admin')
var accounts = require('./routes/accounts')
var auth = require('./routes/auth')
var index = require('./routes/index')
var needLogin = require('./routes/needLogin')
var products = require('./routes/products')
var cart = require('./routes/cart')
var getCart = require('./routes/getCartLen')
var checkout = require('./routes/checkout')


var app = express()
var port = 4000

//뷰 엔진 추가
app.engine('ejs',ejsLocals)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//미들웨어 세팅
// app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(__dirname + '/public'))

app.use(cookieParser())

//업로드 path 추가
app.use('/uploads', express.static('uploads'))

//static path 추가
app.use('/static', express.static('static'))

//session 관련 셋팅
var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(session);

var sessionMiddleWare = session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60
    })
});
app.use(sessionMiddleWare);
 
//passport 적용
app.use(passport.initialize())
app.use(passport.session())
 
//플래시 메시지 관련
app.use(flash())

//로그인 정보 뷰에서만 변수로 셋팅, 전체 미들웨어는 router위에 두어야 에러가 안난다
app.use(function(req, res, next) {
    app.locals.isLogin = req.isAuthenticated()//전역변수isLogin 템플릿 어디에서나 사용할수있다
    //app.locals.urlparameter = req.url //현재 url 정보를 보내고 싶으면 이와같이 셋팅
    //app.locals.userData = req.user //사용 정보를 보내고 싶으면 이와같이 셋팅
    next()
})

// app.get('/', function(req,res){
//     res.send('first app')
// })

// Routing
app.use('/admin', loginRequired, admin)
app.use('/accounts',accounts)
app.use('/auth',auth)
app.use('/', index)
app.use('/needLogin', needLogin)
app.use('/products', products)
app.use('/cart', cart)
app.use('/getCart', getCart)
app.use('/checkout',checkout)

app.listen( port, function(){
    console.log('Express listening on port', port)
})
