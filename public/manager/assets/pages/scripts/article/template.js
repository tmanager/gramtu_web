
/**
 * Created by Jianggy on 2019/2/19.
 */
var loginSucc = {
    token: "",
    userid: ""
};

jQuery(document).ready(function() {
    //获取文章内容
    if(artid != ""){
        document.title = "推荐阅读";
        var data = {artid: artid};
        getArticleContent(data);
    }
    if(adid != ""){
        document.title = "推荐阅读";
        var data = {adid: adid};
        getAdContent(data);
    }
    if(servid != ""){
        document.title = "特色服务";
        var data = {servid: servid};
        getServContent(data);
    }
    if(abroadid != ""){
        document.title = "海外招募";
        var data = {abroadid: abroadid};
        getAbroadContent(data);
    }
    if(newbornid != ""){
        document.title = "新人专区";
        var data = {newbornid: newbornid};
        getNewbornContent(data);
    }
    if(manmadeid != ""){
        document.title = "人工服务";
        var data = {manmadeid: manmadeid};
        getManmadeContent(data);
    }
});

function getArticleContentEnd(flg, result){
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            articleDataSet(res);
        }else{
            articleDataSet(null);
            //alertDialog(result.retmsg);
        }
    }else{
        articleDataSet(null);
        //alertDialog("特色服务信息获取失败！");
    }
}


function getAdContentEnd(flg, result){
    getArticleContentEnd(flg, result)
}

function getServContentEnd(flg, result){
    getArticleContentEnd(flg, result)
}

function getAbroadContentEnd(flg, result){
    getArticleContentEnd(flg, result)
}

function getNewbornContentEnd(flg, result){
    getArticleContentEnd(flg, result)
}

function getManmadeContentEnd(flg, result){
    getArticleContentEnd(flg, result)
}

function articleDataSet(data){
    if(data != null){
        if(artid != "" || adid != "" || abroadid != "" ||
            newbornid != "" || manmadeid != ""){
            $("#xian-title").html(data.title);
        }
        if(servid != ""){
            $("#xian-title").html(data.servname);
        }
        $("#time").html(dateTimeFormat(data.time));
        $("#editor").html(data.editor);
        $("#xian-body").html(data.content);
    }
}