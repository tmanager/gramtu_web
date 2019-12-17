/**
 * Created by Administrator on 2019/2/21.
 */
/**
 * Created by Administrator on 2019/2/19.
 */
var servList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        ServTable.init();
        ServEdit.init();
    });
}

var ServTable = function () {
    var initTable = function () {
        var table = $('#serv_table');
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
                    servname: formData.servname,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                servDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": null},
                { "data": "servid", visible: false },
                { "data": "servname" },
                { "data": "servlogo" },
                { "data": "servlink" },
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
                    "targets":[4],
                    "render": function(data, type, row, meta) {
                        return "<img src='" + data + "' style='width: 100px; height:100px'>";
                    }
                },
                {
                    "targets":[5],
                    "render": function(data, type, row, meta) {
                        return "<a href='" + data + "'>";
                    }
                },{
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

var ServEdit = function() {
    var handleRegister = function() {
        var validator = $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                servname: {
                    required: true
                },
                servlink: {
                    required: true
                },
                sort: {
                    required: true
                },
                image: {
                    required: true
                }
            },

            messages: {
                servname: {
                    required: "服务名必须输入"
                },
                servlink: {
                    required: "链接地址必须输入"
                },
                sort: {
                    required: "排序号必须输入"
                },
                image: {
                    required: "服务LOGO必须上传"
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
        $('#serv-add-confirm').click(function() {
            btnDisable($('#serv-add-confirm'));
            if ($('.register-form').validate().form()) {
                //先上传LOGO
                var serv = $('.register-form').getFormData();
                //如果头像发生了变化，先上传头像
                //获取原来的头像
                var oldimage = $("input[name=oldimage]").val();
                if(serv.image != oldimage) {
                    var formData = new FormData();
                    formData.append('photo', $("#servlogo").get(0).files[0]);
                    $.ajax({
                        type: 'POST',
                        url: webUrl,
                        data: formData,
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        success: function (result) {
                            if (result.ret) {
                                serv.image = result.url;
                                if($("input[name=edittype]").val() == SERVADD){
                                    servAdd(serv);
                                }else{
                                    servEdit(serv);
                                }
                            } else {
                                alertDialog("上传LOGO失败！" + result.msg);
                            }
                        },
                        error: function () {
                            alertDialog("上传LOGO失败！");
                        }
                    });
                }else {
                    if ($("input[name=edittype]").val() == SERVADD) {
                        servAdd(serv);
                    } else {
                        servEdit(serv);
                    }
                }
            }
        });
        //新增角色
        $('#op_add').click(function() {
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("新增特色服务");
            $(":input",".register-form").not(":button,:reset,:submit,:radio").val("")
                .removeAttr("checked")
                .removeAttr("selected");
            //清空LOGO显示
            $("#servlogo").siblings("img").attr("src", "");
            $("input[name=edittype]").val(SERVADD);
            $('#edit_serv').modal('show');
        });
        //编辑特色服务
        $("#serv_table").on('click', '#op_edit', function (e) {
            e.preventDefault();
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("编辑特色服务");
            var exclude = [""];
            var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
            var servid = $("#serv_table").dataTable().fnGetData(row).servid;
            var serv = new Object();
            for(var i=0; i < servList.length; i++){
                if(servid == servList[i].servid){
                    serv = servList[i];
                }
            }
            var options = { jsonValue: serv, exclude:exclude, isDebug: false};
            $(".register-form").initForm(options);
            //LOGO框赋值
            $("#servlogo").siblings("img").attr("src", serv.servlogo);
            $("#servlogo").siblings("input[name=image], input[name=oldimage]").val(serv.servlogo);
            $("input[name=edittype]").val(SERVEDIT);
            $('#edit_serv').modal('show');
        });
    };

    return {
        init: function() {
            handleRegister();
        }
    };
}();

var ServDelete = function() {
    $('#op_del').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = 1;
            confirmDialog("数据删除后将不可恢复，您确定要删除吗？", ServDelete.deleteServ, para)
        }
    });
    return{
        deleteServ: function(){
            var servlist = {servidlist:[]};
            $(".checkboxes:checked").parents("td").each(function () {
                var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
                var servid = $("#serv_table").dataTable().fnGetData(row).servid;
                servlist.servidlist.push(servid);
            });
            servDelete(servlist);
        }
    }
}();

function getServDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            servList = res.servlist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.servlist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        tableDataSet(0, 0, 0, [], callback);
        alertDialog("特色服务信息获取失败！");
    }
}

function servInfoEditEnd(flg, result, type){
    var res = "失败";
    var text = "";
    var alert = "";
    switch (type){
        case SERVADD:
            text = "新增";
            break;
        case SERVEDIT:
            text = "编辑";
            break;
        case SERVDELETE:
            text = "删除";
            break;
    }
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            res = "成功";
            ServTable.init();
            $('#edit_serv').modal('hide');
        }
    }
    if(alert == "") alert = text + "特色服务" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

$("#serv_inquiry").on("click", function(){
    //用户查询
    ServTable.init();
});

$("#servlogo").change(function(){
    var file = $(this).get(0).files[0];
    var inputObj = $(this).siblings("input[name=image]");
    var imgObj = $(this).siblings("img");
    inputObj.val(file);
    if(file == undefined){
        imgObj.attr("src", "");
        inputObj.val("");
        return;
    }
    var render = new FileReader();
    render.readAsDataURL(file);
    render.onload = function(e) {
        imgObj.attr("src", e.target.result);
    }
});