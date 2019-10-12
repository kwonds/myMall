var express = require('express')
var router = express.Router()
var UserModel = require('../models/UserModel')
var secretConfig = require('../commons/secret')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var KakaoStrategy = require("passport-kakao").Strategy
var NaverStrategy = require('passport-naver').Strategy

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})

passport.use(new NaverStrategy({
        clientID: secretConfig.naver.clientID,
        clientSecret: secretConfig.naver.clientSecret,
        callbackURL: secretConfig.naver.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
        console.log('NAVER : ', secretConfig.naver)
        UserModel.findOne({
            username: "naver_" + profile.id
        }, function (err, user) {
            console.log("user", user)
            if (!user) { //없으면 회원가입 후 로그인 성공페이지 이동
                var regData = { //DB에 등록 및 세션에 등록될 데이터
                    username: "naver_" + profile.id,
                    password: "naver_login",
                    displayname: profile.displayName
                }
                console.log("regData", regData)
                var User = new UserModel(regData)
                User.save(function (err) { //DB저장
                    console.log("err--->", err)
                    done(null, regData) //세션 등록
                })
            } else { //있으면 DB에서 가져와서 세션등록
                done(null, user)
            }

        })
    }
));

passport.use(
    "kakao-login",
    new KakaoStrategy({
        clientID: secretConfig.kakao.clientID,
        clientSecret: secretConfig.kakao.clientSecret,
        callbackURL: secretConfig.kakao.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        console.log('kakao',profile)
        UserModel.findOne({
           username: "kakao_" + profile.id
        }, function (err, user) {
            console.log("user", user)
            if (!user) { //없으면 회원가입 후 로그인 성공페이지 이동
                var regData = { //DB에 등록 및 세션에 등록될 데이터
                    username: "kakao_" + profile.id,
                    password: "kakao_login",
                    displayname: profile.displayName
                }
                console.log("regData", regData)
                var User = new UserModel(regData)
                User.save(function (err) { //DB저장
                    console.log("err", err)
                    done(null, regData) //세션 등록
                })
            } else { //있으면 DB에서 가져와서 세션등록
                done(null, user)
            }

        })
    })
)

// letsencrypt
passport.use(new FacebookStrategy({
        // https://developers.facebook.com에서 appId 및 scretID 발급
        clientID: secretConfig.facebook.clientID, //입력하세요
        clientSecret: secretConfig.facebook.clientSecret, //입력하세요.
        callbackURL: secretConfig.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
    },
    function(accessToken, refreshToken, profile, done) {
        //아래 하나씩 찍어보면서 데이터를 참고해주세요.
        console.log(profile)
        //console.log(profile.displayName)
        //console.log(profile.emails[0].value)
        //console.log(profile._raw)
        //console.log(profile._json)
        UserModel.findOne({ username : "fb_" + profile.id }, function(err, user){
            console.log("user", user)
            if(!user){  //없으면 회원가입 후 로그인 성공페이지 이동
                var regData = { //DB에 등록 및 세션에 등록될 데이터
                    username :  "fb_" + profile.id,
                    password : "facebook_login",
                    displayname : profile.displayName
                }
                console.log("regData", regData)
                var User = new UserModel(regData)
                User.save(function(err){ //DB저장
                    console.log("err", err)
                    done(null,regData) //세션 등록
                })
            }else{ //있으면 DB에서 가져와서 세션등록
                done(null,user)
            }

        })
    }
))

router.get("/naver", passport.authenticate("naver"))

router.get("/kakao", passport.authenticate("kakao-login"))

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}) )

router.get('/naver/callback',
    passport.authenticate('naver', {
        successRedirect: '/',
        failureRedirect: '/auth/naver/fail'
    })
)

router.get('/kakao/callback',
    passport.authenticate('kakao-login', {
        successRedirect: '/',
        failureRedirect: '/auth/kakao/fail'
    })
)

//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
    passport.authenticate('facebook', 
        { 
            successRedirect: '/',
            failureRedirect: '/auth/facebook/fail' 
        }
    )
)

//로그인 성공시 이동할 주소
router.get('/facebook/success', function(req,res){
    res.send(req.user)
})

router.get('/naver/fail', function (req, res) {
    res.send('naver login fail')
})

router.get('/kakao/fail', function (req, res) {
    res.send('kakao login fail')
})

router.get('/facebook/fail', function(req,res){
    res.send('facebook login fail')
})



module.exports = router