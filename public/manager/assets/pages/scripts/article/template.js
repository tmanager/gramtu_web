
/**
 * Created by Jianggy on 2019/2/19.
 */
var loginSucc = {
    token: "",
    userid: ""
};

jQuery(document).ready(function() {
    //获取文章内容
    if(artid === "pre"){
        var tmpdata = window.opener.tmpdata;
        tmpdata.time = getNowFormatDate() + " " + getNowFormatTime();
        tmpdata.editor = "xxx";
        articleDataSet(tmpdata);
    }else{
        var data = {artid: artid};
        getArticleContent(data);
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

function articleDataSet(data){
    if(data != null){
        $("#xian-title").html(data.title);
        $("#time").html(data.time);
        $("#editor").html(data.editor);
        $("#xian-body").html(data.content);
    }
}