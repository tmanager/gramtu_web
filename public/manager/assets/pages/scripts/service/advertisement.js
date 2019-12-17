/**
 * Created by Administrator on 2019/12/4.
 */
var adList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        AdTable.init();
        AdEdit.init();
    });
}

var AdTable = function () {
    var initTable = function () {
        var table = $('#ad_table');
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
                adDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": null},
                { "data": "adid", visible: false },
                { "data": "title" },
                { "data": "adurl" },
                { "data": "innerurl" },
                { "data": "sort" },
                { "data": null }
            ],
            columnDefs: [
                {
                    "targets":[1],
                    "render":function(data, type, row, meta){
                        return '<input type="checkbox" class="checkboxes" value="1" />';
                    }
                },
                {
                    "targets": [0],
                    "data": null,
                    "render": function (data, type, row, meta) {
                        return meta.settings._iDisplayStart + meta.row + 1;  //行号
                    }
                },
                {
                    "targets":[3],
                    "render": function(data, type, row, meta) {
                        return "<img src='" + data + "' style='width: 100px; height:120px'>";
                    }
                },
                {
                    "targets":[7],
                    "render": function(data, type, row, meta) {
                        if(!makeEdit(menu,loginSucc.functionlist,"#op_edit")) return '-';
                        return '<a href="javascript:;" id="op_edit">编辑</a>'
                    }
                }
            ],
            fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td:eq(1)', nRow).attr('style', 'text-align: center;');
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

var AdEdit = function() {
    var handleRegister = function() {
        var validator = $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                title: {
                    required: true
                },
                innerurl: {
                    required: true,
                    url: true
                },
                sort: {
                    required: true,
                    digits: true
                },
                image: {
                    required: true
                }
            },

            messages: {
                title: {
                    required: "图片必须输入"
                },
                innerurl: {
                    required: "图片链接必须输入",
                },
                sort: {
                    required: "排序号必须输入",
                },
                image: {
                    required: "广告图片必须上传",
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form) {
                form.submit();
            }
        });
        $('#register-btn').click(function() {
            btnDisable($('#register-btn'));
            if ($('.register-form').validate().form()) {
                //先上传LOGO
                var ad = $('.register-form').getFormData();
                //如果头像发生了变化，先上传头像
                //获取原来的头像
                var oldimage = $("input[name=oldimage]").val();
                if(ad.image != oldimage) {
                    var formData = new FormData();
                    formData.append('photo', $("#adurl").get(0).files[0]);
                    $.ajax({
                        type: 'POST',
                        url: webUrl,
                        data: formData,
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        success: function (result) {
                            if (result.ret) {
                                ad.adurl = result.url;
                                if($("input[name=edittype]").val() == ADADD){
                                    adAdd(ad);
                                }else{
                                    adEdit(ad);
                                }
                            } else {
                                alertDialog("上传广告图片失败！" + result.msg);
                            }
                        },
                        error: function () {
                            alertDialog("上传广告图片失败！");
                        }
                    });
                }else {
                    if ($("input[name=edittype]").val() == SERVADD) {
                        adAdd(ad);
                    } else {
                        adEdit(ad);
                    }
                }
            }
        });
        //新增角色
        $('#op_add').click(function() {
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("新增广告图片");
            $(":input",".register-form").not(":button,:reset,:submit,:radio").val("")
                .removeAttr("checked")
                .removeAttr("selected");
            //清空图片显示
            $("#adurl").siblings("img").attr("src", "");
            $("#adurl").siblings("input[name=image], input[name=oldimage]").val("");
            $("input[name=edittype]").val(ADADD);
            $('#edit_ad').modal('show');
        });
        //编辑广告图片
        $("#ad_table").on('click', '#op_edit', function (e) {
            e.preventDefault();
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("编辑广告图片");
            var exclude = [""];
            var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
            var adid = $("#ad_table").dataTable().fnGetData(row).adid;
            var ad = new Object();
            for(var i=0; i < adList.length; i++){
                if(adid == adList[i].adid){
                    ad = adList[i];
                }
            }
            var options = { jsonValue: ad, exclude:exclude, isDebug: false};
            $(".register-form").initForm(options);
            //LOGO框赋值
            $("#adurl").siblings("img").attr("src", ad.adurl);
            $("#adurl").siblings("input[name=image], input[name=oldimage]").val(ad.adurl);
            $("input[name=edittype]").val(ADEDIT);
            $('#edit_ad').modal('show');
        });
    };

    return {
        init: function() {
            handleRegister();
        }
    };
}();

var AdDelete = function() {
    $('#op_del').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = 1;
            confirmDialog("数据删除后将不可恢复，您确定要删除吗？", AdDelete.deleteAd, para)
        }
    });
    return{
        deleteAd: function(){
            var adlist = {adidlist:[]};
            $(".checkboxes:checked").parents("td").each(function () {
                var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
                var adid = $("#ad_table").dataTable().fnGetData(row).adid;
                adlist.adidlist.push(adid);
            });
            adDelete(adlist);
        }
    }
}();

function getAdDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            adList = res.adlist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.adlist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        tableDataSet(0, 0, 0, [], callback);
        alertDialog("广告图片获取失败！");
    }
}

function adInfoEditEnd(flg, result, type){
    var res = "失败";
    var text = "";
    var alert = "";
    switch (type){
        case ADADD:
            text = "新增";
            break;
        case ADEDIT:
            text = "编辑";
            break;
        case ADDELETE:
            text = "删除";
            break;
    }
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            res = "成功";
            AdTable.init();
            $('#edit_ad').modal('hide');
        }
    }
    if(alert == "") alert = text + "广告图片" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

$("#ad_inquiry").on("click", function(){
    //用户查询
    AdTable.init();
});


$("#adurl").change(function(){
    var file = $(this).get(0).files[0];
    var inputObj = $(this).siblings("input[name=image]");
    var imgObj = $(this).siblings("img");
    inputObj.val(file);
    if(file == undefined){
        imgObj.attr("src", "");
        inputObj.val("");
        return;
    }
    var myimg = URL.createObjectURL(file);
    var img = new Image();
    img.src = myimg;
    img.onload = function(){
        if(img.width === 720 && img.height === 250){
            imgObj.attr("src", myimg);
        }else{
            imgObj.attr("src", "");
            inputObj.val("");
            $("#adurl").val("");
            alertDialog("只能上传尺寸为720x250的图片！");
        }

    };

});

