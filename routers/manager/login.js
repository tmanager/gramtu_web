/**
 * Created by Administrator on 2019/2/18.
 */
var express = require('express');
var router = express.Router();


router.get('/',function(req,res,next){
    res.render('manager/login');
});

router.post('/login',function(req,res,next){
    var uname = req.body.username;
    req.session["ywtUname" + uname] = uname;
    req.session["ywtLogin" + uname] = req.body.loginsucc;
    //req.session["ywtUname" + uname] = req.body.username; // 登录成功，设置 session
    //req.session["ywtLogin" + uname] = req.body.loginsucc; // 登录成功，设置 session
    res.render('manager/main', {
        menu: 'main',
        loginsucc: req.session["ywtLogin" + uname]
    });
});

router.get('/logout',function(req,res){
    var uname = req.query.username;
    req.session["ywtUname" + uname] = "";
    req.session["ywtLogin" + uname] = "";
    //req.session.destroy();
    res.redirect('/');
});


router.get('/main',function(req,res,next){
   console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/main', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/user',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    console.info("usersession" + JSON.stringify(req.session));
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/user/user', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});


router.get('/userpower',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/power/userpower', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});


router.get('/rolepower',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/power/rolepower', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});



router.get('/role',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/user/role', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/password',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/user/password', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/organ',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/organ/organ', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/feature',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/service/feature', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/release',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/article/release', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});


router.get('/template',function(req,res,next){
    console.info(req.url);
    var artid = req.query.artid || '';
    var adid = req.query.adid || '';
    var servid = req.query.servid || '';
    var abroadid = req.query.abroadid || '';
    var newbornid = req.query.newbornid || '';
    res.render('manager/article/template', {
        artid: artid,
        adid: adid,
        servid: servid,
        abroadid: abroadid,
        newbornid: newbornid
    });
});


router.get('/artlist',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/article/artlist', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

router.get('/menu',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/power/menu', {
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//评价管理
router.get('/coupon',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){   ////判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('manager/service/coupon',{
            menu: req.url.substr(1),
            loginsucc: req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//用户评价查询
router.get('/price',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/service/price',{
            menu: req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//用户管理（个人信息）
router.get('/updateuser',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/user/updateuser',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//turnitin国际版参数
router.get('/turnitin',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/param/turnitin',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

//turnitinUK版参数
router.get('/turnitinuk',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/param/turnitinuk',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

// grammarian参数管理
router.get('/grammarian',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/param/grammarian',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});


// 广告管理
router.get('/adv',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/service/advertisement',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

// 海外招募
router.get('/abroad',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/service/abroad',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

// 新人专区
router.get('/newborn',function(req,res,next){
    console.info(req.url);
    var uname = req.query.username;
    if(req.session["ywtUname" + uname]){
        res.render('manager/service/newborn',{
            menu:req.url.substr(1),
            loginsucc:req.session["ywtLogin" + uname]
        });
    }else{
        res.redirect('/');
    }
});

module.exports = router;