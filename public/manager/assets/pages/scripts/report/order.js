/**
 * Created by Administrator on 2019/12/04.
 */
var artList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        OrderTable.init();
    });
}

var OrderTable = function () {
    var initTable = function () {
        var table = $('#art_table');
        pageLengthInit(table);
        table.dataTable({
            "language": TableLanguage,
            "bStateSave": false, // save datatable state(pagination, sort, etc) in cookie.
            "lengthMenu": TableLengthMenu,
            "destroy": true,
            "pageLength": PageLength,
            "serverSide": true,
            "pagingType": "bootstrap_extended",
            "processing": true,
            "searching": false,
            "ordering": false,
            "autoWidth": false,
            "ajax":function (data, callback, settings) {
                var formData = $(".inquiry-form").getFormData();
                var da = {
                    title: formData.title,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                orderDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": null},
                { "data": "id", visible: false },
                { "data": "checktype" },
                { "data": "orderid" },
                { "data": "phonenumber" },
                { "data": "updtime" },
                { "data": "fullname" },
                { "data": "title" },
                { "data": "filename" },
                { "data": "status" },
                { "data": null },
                { "data": null }
            ],
            columnDefs: [
                {
                    "targets": [0],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return meta.settings._iDisplayStart + meta.row + 1;  //行号
                    }
                },
                {
                    "targets":[1],
                    "render":function(data, type, row, meta){
                        return '<input type="checkbox" class="checkboxes" value="1" />';
                    }
                },{
                    "targets":[6],
                    "render": function(data, type, row, meta) {
                        return dateTimeFormat(data);
                    }
                },{
                    "targets":[11],
                    "render": function(data, type, row, meta) {
                        var text = '<a href=\"javascript:;\" id=\"op_pre\">PDF报告</a>';
                        if(makeEdit(menu,loginSucc.functionlist,"#op_edit")){
                            text += ' | <a href="javascript:;" id="op_edit">HTML报告</a>'
                        }
                        return text;
                    }
                },{
                    "targets":[12],
                    "render": function(data, type, row, meta) {
                        var text = '<a href=\"javascript:;\" id=\"op_pre\">人工上传报告</a>';
                        if(makeEdit(menu,loginSucc.functionlist,"#op_edit")){
                            text += ' | <a href="javascript:;" id="op_edit">编辑</a>'
                        }
                        return text;
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td', nRow).attr('style', 'vertical-align: middle; padding-left: 20px');
                $('td:eq(0), td:eq(1), td:eq(4), td:eq(5), td:eq(6)', nRow).attr('style', 'text-align: center; vertical-align: middle;');
            }
        });
        table.find('.group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).prop("checked", true);
                    $(this).parents('tr').addClass("active");
                } else {
                    $(this).prop("checked", false);
                    $(this).parents('tr').removeClass("active");
                }
            });
        });

        table.on('change', 'tbody tr .checkboxes', function () {
            $(this).parents('tr').toggleClass("active");
        });


    };
    return {
        init: function (data) {
            if (!jQuery().dataTable) {
                return;
            }
            initTable(data);
        }
    };
}();

function getOrderDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            orderList = res.orderlist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.orderlist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        tableDataSet(0, 0, 0, [], callback);
        alertDialog("订单获取失败！");
    }
}

function artInfoEditEnd(flg, result, type){
    var res = "失败";
    var text = "";
    var alert = "";
    switch (type){
        case ARTICLEADD:
            text = "新增";
            break;
        case ARTDELETE:
            text = "删除";
            break;
        case ARTEDIT:
            text = "编辑";
            break;
    }
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            res = "成功";
            ArtTable.init();
            $('#edit_art').modal('hide');
        }
    }
    if(alert == "") alert = text + "文章" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

$("#art_inquiry").on("click", function(){
    //用户查询
    ArtTable.init();
});


$("#cover").change(function(){
    var file = $(this).get(0).files[0];
    var inputObj = $(this).siblings("input[name=coverimage]");
    var imgObj = $(this).siblings("img");
    inputObj.val(file);
    if(file == undefined){
        imgObj.attr("src", "/public/manager/assets/pages/img/default.jpg");
        inputObj.val("");
        return;
    }
    var myimg = URL.createObjectURL(file);
    var img = new Image();
    img.src = myimg;
    img.onload = function(){
        if(img.width === 170 && img.height === 170){
            imgObj.attr("src", myimg);
        }else{
            imgObj.attr("src", "/public/manager/assets/pages/img/default.jpg");
            inputObj.val("");
            $("#cover").val("");
            alertDialog("只能上传尺寸为170x170的图片！");
        }

    };
});


function getArticleContentEnd(flg, result, temp){
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var art = result.response;
            art.artid = temp.artid;
            var exclude = ["article"];
            var options = { jsonValue: art, exclude:exclude, isDebug: false};
            $(".article-form").initForm(options);
            //LOGO框赋值
            $("#cover").siblings("img").attr("src", temp.coverimage);
            $("#cover").siblings("input[name=coverimage], input[name=oldimage]").val(temp.coverimage);
            $("#article").summernote("code", art.content);
            $("input[name=edittype]").val(ARTEDIT);
            $('#edit_art').modal('show');
        }else{
            alertDialog("获取文章内容失败！");
        }
    }else{
        alertDialog("获取文章内容失败！");
    }
}