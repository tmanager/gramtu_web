/**
 * Created by Administrator on 2019/2/28.
 */
//var cardHostUrl = regulateSucc.cardHostUrl;
var userHostUrl = regulateSucc.userHostUrl;
var loginUrl = regulateSucc.loginUrl;
var webUrl = regulateSucc.gramtuWebUrl;

//登录检查
function loginCheck(data){
    App.blockUI({target:'.login-container',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: loginUrl + "login",    //请求发送到TestServlet处
        data: sendMessageEdit(LOGIN, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("loginCheck:" + JSON.stringify(result));
            loginCheckEnd(true, result);

        },
        error: function (errorMsg) {
            console.info("loginCheck-error:" + JSON.stringify(errorMsg));
            loginCheckEnd(false, "");
        }
    });
}

//系统退出
function logoutCheck(data){
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: loginUrl + "logout",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("logoutCheck:" + JSON.stringify(result));
            logOutEnd(true, result);

        },
        error: function (errorMsg) {
            console.info("logoutCheck-error:" + JSON.stringify(errorMsg));
            logOutEnd(false, "");
        }
    });
}

//获取广告信息
function getServContent(data,callback){
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:webUrl + "serv/servdetail",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("getServContent:"+JSON.stringify(result));
            getServContentEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("getServContent-error:"+ JSON.stringify(errorMsg));
            getServContentEnd(false,"",callback);
        }
    });
}

//特色服务获取
function servDataGet(data, callback){
    App.blockUI({target:'#lay_out',boxed:true});
    if(data == null){
        data = {servname:"", currentpage:"", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:webUrl + "feature/query",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("servDataGet:"+JSON.stringify(result));
            getServDataEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("servDataGet-error:"+ JSON.stringify(errorMsg));
            getServDataEnd(false,"",callback);
        }
    });
}

//特色服务删除
function servDelete(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "servdelete",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("servDelete:" + JSON.stringify(result));
            servInfoEditEnd(true, result, SERVDELETE);
        },
        error: function (errorMsg) {
            console.info("servDelete-error:" + JSON.stringify(errorMsg));
            servInfoEditEnd(false, "", SERVDELETE);
        }
    });
}

//特色服务增加
function servAdd(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "servadd",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("servAdd:" + JSON.stringify(result));
            servInfoEditEnd(true, result, SERVADD);
        },
        error: function (errorMsg) {
            console.info("servAdd-error:" + JSON.stringify(errorMsg));
            servInfoEditEnd(false, "", SERVADD);
        }
    });
}

//特色服务编辑
function servEdit(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "servedit",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("servEdit:" + JSON.stringify(result));
            servInfoEditEnd(true, result, SERVEDIT);
        },
        error: function (errorMsg) {
            console.info("servEdit-error:" + JSON.stringify(errorMsg));
            servInfoEditEnd(false, "", SERVEDIT);
        }
    });
}

//获取文章信息
function getArticleContent(data,callback){
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:webUrl + "article/artdetail",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("getArticleContent:"+JSON.stringify(result));
            getArticleContentEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("getArticleContent-error:"+ JSON.stringify(errorMsg));
            getArticleContentEnd(false,"",callback);
        }
    });
}

//获取文章列表
function artDataGet(data,callback){
    App.blockUI({target: '#lay-out',boxed: true});
    if(data == null){
        data = {title: "", currentpage: "", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "article/query",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("artDataGet:" + JSON.stringify(result));
            getArtDataEnd(true, result, callback);
        },
        error: function (errorMsg) {
            console.info("artDataGet-error:" + JSON.stringify(errorMsg));
            getArtDataEnd(false, "", callback);
        }
    });
}

//文章新增
function articleAdd(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "article/artadd",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("articleAdd:" + JSON.stringify(result));
            artInfoEditEnd(true, result, ARTICLEADD);
        },
        error: function (errorMsg) {
            console.info("articleAdd-error:" + JSON.stringify(errorMsg));
            artInfoEditEnd(false, "", ARTICLEADD);
        }
    });
}

//文章编辑
function articleEdit(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "article/edit",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("articleEdit:" + JSON.stringify(result));
            artInfoEditEnd(true, result, ARTEDIT);
        },
        error: function (errorMsg) {
            console.info("articleEdit-error:" + JSON.stringify(errorMsg));
            artInfoEditEnd(false, "", ARTEDIT);
        }
    });
}

//文章删除
function artDelete(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "article/delete",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("artDelete:" + JSON.stringify(result));
            artInfoEditEnd(true, result, ARTDELETE);
        },
        error: function (errorMsg) {
            console.info("artDelete-error:" + JSON.stringify(errorMsg));
            artInfoEditEnd(false, "", ARTDELETE);
        }
    });
}

//获取优惠券列表
function coupDataGet(data,callback){
    App.blockUI({target: '#lay-out',boxed: true});
    if(data == null){
        data = {couptype: "", coupname: "", currentpage: "", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "coupquery",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("coupDataGet:" + JSON.stringify(result));
            getCoupDataEnd(true, result, callback);
        },
        error: function (errorMsg) {
            console.info("coupDataGet-error:" + JSON.stringify(errorMsg));
            getCoupDataEnd(false, "", callback);
        }
    });
}

//新增优惠券
function coupAdd(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "coupadd",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("coupAdd:" + JSON.stringify(result));
            coupInfoEditEnd(true, result, COUPADD);
        },
        error: function (errorMsg) {
            console.info("coupAdd-error:" + JSON.stringify(errorMsg));
            coupInfoEditEnd(false, "", COUPADD);
        }
    });
}

//编辑优惠券
function coupEdit(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "coupedit",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("coupEdit:" + JSON.stringify(result));
            coupInfoEditEnd(true, result, COUPEDIT);
        },
        error: function (errorMsg) {
            console.info("coupEdit-error:" + JSON.stringify(errorMsg));
            coupInfoEditEnd(false, "", COUPEDIT);
        }
    });
}

//删除优惠券
function coupDelete(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "coupdelete",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("coupDelete:" + JSON.stringify(result));
            coupInfoEditEnd(true, result, COUPDELETE);
        },
        error: function (errorMsg) {
            console.info("coupDelete-error:" + JSON.stringify(errorMsg));
            coupInfoEditEnd(false, "", COUPDELETE);
        }
    });
}

//价格列表获取
function priceDataGet(data,callback){
    App.blockUI({target:'#lay_out',boxed:true});
    if(data == null){
        data = {protype:"", pagesize: "",currentpage:"", startindex: "0", draw: 1}
    }
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:userHostUrl + "pricequery",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("priceDataGet:"+JSON.stringify(result));
            getPriceDataEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("priceDataGet-error:"+ JSON.stringify(errorMsg));
            getPriceDataEnd(false,"",callback);
        }
    });
}

//价格新增
function priceAdd(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "priceadd",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("priceAdd:" + JSON.stringify(result));
            priceInfoEditEnd(true, result, PRICEADD);
        },
        error: function (errorMsg) {
            console.info("priceAdd-error:" + JSON.stringify(errorMsg));
            priceInfoEditEnd(false, "", PRICEADD);
        }
    });
}

//编辑价格
function priceEdit(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "priceedit",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("priceEdit:" + JSON.stringify(result));
            priceInfoEditEnd(true, result, PRICEEDIT);
        },
        error: function (errorMsg) {
            console.info("priceEdit-error:" + JSON.stringify(errorMsg));
            priceInfoEditEnd(false, "", PRICEEDIT);
        }
    });
}

//删除价格
function priceDelete(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: userHostUrl + "pricedelete",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("priceDelete:" + JSON.stringify(result));
            priceInfoEditEnd(true, result, PRICEDELETE);
        },
        error: function (errorMsg) {
            console.info("priceDelete-error:" + JSON.stringify(errorMsg));
            priceInfoEditEnd(false, "", PRICEDELETE);
        }
    });
}

/**
 * 国际版参数获取.
 */
function turnitinParaGet(data){
    App.blockUI({target:'#lay_out',boxed:true});
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "turnin/param/query",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("turnitinParaGet:"+JSON.stringify(result));
            getTurnitinParaEnd(true,result);
        },
        error:function(errorMsg){
            console.info("turnitinParaGet-error:"+ JSON.stringify(errorMsg));
            getTurnitinParaEnd(false,"");
        }
    });
}

/**
 * 国际版参数修改.
 */
function turnitinParaModify(data){
    App.blockUI({target:'#lay_out',boxed:true});
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:webUrl + "turnin/param/upd",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("turnitinParaModify:"+JSON.stringify(result));
            turnitinParaModifyEnd(true,result);
        },
        error:function(errorMsg){
            console.info("turnitinParaModify-error:"+ JSON.stringify(errorMsg));
            turnitinParaModifyEnd(false,"");
        }
    });
}

/**
 * UK版参数获取.
 */
function turnitinUKParaGet(data){
    App.blockUI({target:'#lay_out',boxed:true});
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "turninuk/param/query",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("turnitinParaGet:"+JSON.stringify(result));
            getTurnitinUKParaEnd(true,result);
        },
        error:function(errorMsg){
            console.info("turnitinParaGet-error:"+ JSON.stringify(errorMsg));
            getTurnitinUKParaEnd(false,"");
        }
    });
}

/**
 * UK版参数修改.
 */
function turnitinUKParaModify(data){
    App.blockUI({target:'#lay_out',boxed:true});
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:webUrl + "turninuk/param/upd",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("turnitinParaModify:"+JSON.stringify(result));
            turnitinUKParaModifyEnd(true,result);
        },
        error:function(errorMsg){
            console.info("turnitinParaModify-error:"+ JSON.stringify(errorMsg));
            turnitinUKParaModifyEnd(false,"");
        }
    });
}

/**
 * Grammarly参数获取.
 */
function grammarianParaGet(data){
    App.blockUI({target:'#lay_out',boxed:true});
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "grammarly/param/query",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("grammarianParaGet:"+JSON.stringify(result));
            getGrammarianParaEnd(true,result);
        },
        error:function(errorMsg){
            console.info("grammarianParaGet-error:"+ JSON.stringify(errorMsg));
            getGrammarianParaEnd(false,"");
        }
    });
}

/**
 * Grammarly参数修改.
 */
function grammarianParaModify(data){
    App.blockUI({target:'#lay_out',boxed:true});
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:webUrl + "grammarly/param/upd",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("grammarianParaModify:"+JSON.stringify(result));
            grammarianParaModifyEnd(true,result);
        },
        error:function(errorMsg){
            console.info("grammarianParaModify-error:"+ JSON.stringify(errorMsg));
            grammarianParaModifyEnd(false,"");
        }
    });
}

//获取广告信息
function getAdContent(data,callback){
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:webUrl + "advert/addetail",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("getAdContent:"+JSON.stringify(result));
            getAdContentEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("getAdContent-error:"+ JSON.stringify(errorMsg));
            getAdContentEnd(false,"",callback);
        }
    });
}

//获取广告图片列表
function adDataGet(data,callback){
    App.blockUI({target: '#lay-out',boxed: true});
    if(data == null){
        data = {title: "", currentpage: "", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "advert/query",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("adDataGet:" + JSON.stringify(result));
            getAdDataEnd(true, result, callback);
        },
        error: function (errorMsg) {
            console.info("adDataGet-error:" + JSON.stringify(errorMsg));
            getAdDataEnd(false, "", callback);
        }
    });
}

//新增广告图片
function adAdd(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "advert/advadd",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("adAdd:" + JSON.stringify(result));
            adInfoEditEnd(true, result, ADADD);
        },
        error: function (errorMsg) {
            console.info("adAdd-error:" + JSON.stringify(errorMsg));
            adInfoEditEnd(false, "", ADADD);
        }
    });
}

//编辑广告图片
function adEdit(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "advert/edit",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("adEdit:" + JSON.stringify(result));
            adInfoEditEnd(true, result, ADEDIT);
        },
        error: function (errorMsg) {
            console.info("adEdit-error:" + JSON.stringify(errorMsg));
            adInfoEditEnd(false, "", ADEDIT);
        }
    });
}

//删除广告图片
function adDelete(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "advert/delete",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("adDelete:" + JSON.stringify(result));
            adInfoEditEnd(true, result, ADDELETE);
        },
        error: function (errorMsg) {
            console.info("adDelete-error:" + JSON.stringify(errorMsg));
            adInfoEditEnd(false, "", ADDELETE);
        }
    });
}


//获取海外招募列表
function abroadDataGet(data,callback){
    App.blockUI({target: '#lay-out',boxed: true});
    if(data == null){
        data = {title: "", currentpage: "", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "abroad/query",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("abroadDataGet:" + JSON.stringify(result));
            getAbroadDataEnd(true, result, callback);
        },
        error: function (errorMsg) {
            console.info("abroadDataGet-error:" + JSON.stringify(errorMsg));
            getAbroadDataEnd(false, "", callback);
        }
    });
}

//新增海外招募
function abroadAdd(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "abroad/add",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("abroadAdd:" + JSON.stringify(result));
            abroadInfoEditEnd(true, result, ABROADADD);
        },
        error: function (errorMsg) {
            console.info("abroadAdd-error:" + JSON.stringify(errorMsg));
            abroadInfoEditEnd(false, "", ABROADADD);
        }
    });
}

//删除海外招募
function abroadDelete(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: webUrl + "abroad/delete",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("abroadDelete:" + JSON.stringify(result));
            abroadInfoEditEnd(true, result, ABROADDELETE);
        },
        error: function (errorMsg) {
            console.info("abroadDelete-error:" + JSON.stringify(errorMsg));
            abroadInfoEditEnd(false, "", ABROADDELETE);
        }
    });
}

