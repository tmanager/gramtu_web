/**
 * Created by Jianggy on 2019/8/12.
 */
var idOcrUrl = regulateSucc.idOcrUrl;
function idCardImageUpload(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: idOcrUrl + "idcardimgupload",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("idCardImageUpload:" + JSON.stringify(result));
            idCardImageUploadEnd(true, result, null);
        },
        error: function (errorMsg) {
            console.info("idCardImageUpload-error:" + JSON.stringify(errorMsg));
            idCardImageUploadEnd(false, "", null);
        }
    })
}

function imageResultDataGet(data, callback){
    App.blockUI({target:'#lay_out',boxed:true});
    if(data == null){
        data = {spid:"", startdate:"", enddate:"", pagesize: "", startindex: "0", draw: 1}
    }
    $.ajax({
        type:"post",
        contentType:"application/json",
        async:true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url:idOcrUrl + "imageresultquery",  //请求发送到TestServlet处
        data:sendMessageEdit(DEFAULT, data),
        dataType:"json",      //返回数据形式为json
        success:function(result){
            console.info("imageResultDataGet:"+JSON.stringify(result));
            getImageResultDataEnd(true,result,callback);
        },
        error:function(errorMsg){
            console.info("imageResultDataGet-error:"+ JSON.stringify(errorMsg));
            getImageResultDataEnd(false,"",callback);
        }
    });
}


function imageResultDelete(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: idOcrUrl + "imageresultdelete",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("imageResultDelete:" + JSON.stringify(result));
            imageResultInfoEditEnd(true, result, IMAGERESULTDELETE);
        },
        error: function (errorMsg) {
            console.info("imageResultDelete-error:" + JSON.stringify(errorMsg));
            imageResultInfoEditEnd(false, "", IMAGERESULTDELETE);
        }
    });
}

function imageResultEdit(data){
    App.blockUI({target:'#lay-out',boxed: true});
    $.ajax({
        type: "post",
        contentType: "application/json",
        async: true,           //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: idOcrUrl + "imageresultedit",    //请求发送到TestServlet处
        data: sendMessageEdit(DEFAULT, data),
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            console.info("imageResultEdit:" + JSON.stringify(result));
            imageResultInfoEditEnd(true, result, IMAGERESULTEDIT);
        },
        error: function (errorMsg) {
            console.info("imageResultEdit-error:" + JSON.stringify(errorMsg));
            imageResultInfoEditEnd(false, "", IMAGERESULTEDIT);
        }
    });
}