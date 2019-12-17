/**
 * Created by Administrator on 2019/12/4.
 */
var coupList = [];
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        CoupTable.init();
        CoupEdit.init();
    });
}

var CoupTable = function () {
    var initTable = function () {
        var table = $('#coup_table');
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
                    couptype: formData.couptype,
                    coupname: formData.coupname,
                    currentpage: (data.start / data.length) + 1,
                    pagesize: data.length == -1 ? "": data.length,
                    startindex: data.start,
                    draw: data.draw
                };
                coupDataGet(da, callback);
            },
            columns: [//返回的json数据在这里填充，注意一定要与上面的<th>数量对应，否则排版出现扭曲
                { "data": null},
                { "data": null},
                { "data": "coupid", visible: false },
                { "data": "couptype" },
                { "data": "coupname" },
                { "data": "coupword" },
                { "data": "points" },
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
                        var cType;
                        switch (data) {
                            case "0":
                                cType = "Turnin查重";
                                break;
                            case "1":
                                cType = "Grammarian语法检测";
                                break;

                        }
                        return cType;
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

var CoupEdit = function() {
    var handleRegister = function() {
        var validator = $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                coupname: {
                    required: true
                },
                couptype: {
                    required: true
                },
                coupword: {
                    required: true,
                    number: true
                },
                points: {
                    required: true,
                    number: true
                }
            },

            messages: {
                coupname: {
                    required: "优惠码名称必须输入"
                },
                couptype: {
                    required: "优惠码类别必须输入"
                },
                coupword: {
                    required: "优惠字数必须输入"
                },
                points: {
                    required: "所需积分必须输入"
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
                var coup = $('.register-form').getFormData();
                if ($("input[name=edittype]").val() == COUPADD) {
                    coupAdd(coup);
                } else {
                    coupEdit(coup);
                }
            }
        });
        //新增角色
        $('#op_add').click(function() {
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("新增优惠码");
            $(":input",".register-form").not(":button,:reset,:submit,:radio").val("")
                .removeAttr("checked")
                .removeAttr("selected");
            $("input[name=edittype]").val(COUPADD);
            $('#edit_coup').modal('show');
        });
        //编辑优惠码
        $("#coup_table").on('click', '#op_edit', function (e) {
            e.preventDefault();
            validator.resetForm();
            $(".register-form").find(".has-error").removeClass("has-error");
            $(".modal-title").text("编辑优惠码");
            var exclude = [""];
            var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
            var coupid = $("#coup_table").dataTable().fnGetData(row).coupid;
            var coup = new Object();
            for(var i=0; i < coupList.length; i++){
                if(coupid == coupList[i].coupid){
                    coup = coupList[i];
                }
            }
            var options = { jsonValue: coup, exclude:exclude, isDebug: false};
            $(".register-form").initForm(options);
            $("input[name=edittype]").val(COUPEDIT);
            $('#edit_coup').modal('show');
        });
    };

    return {
        init: function() {
            handleRegister();
        }
    };
}();

var CoupDelete = function() {
    $('#op_del').click(function() {
        var len = $(".checkboxes:checked").length;
        if(len < 1){
            alertDialog("至少选中一项！");
        }else{
            var para = 1;
            confirmDialog("数据删除后将不可恢复，您确定要删除吗？", CoupDelete.deleteCoup, para)
        }
    });
    return{
        deleteCoup: function(){
            var couplist = {coupidlist:[]};
            $(".checkboxes:checked").parents("td").each(function () {
                var row = $(this).parents('tr')[0];     //通过获取该td所在的tr，即td的父级元素，取出第一列序号元素
                var coupid = $("#coup_table").dataTable().fnGetData(row).coupid;
                couplist.coupidlist.push(coupid);
            });
            coupDelete(couplist);
        }
    }
}();

function getCoupDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            coupList = res.couplist;
            tableDataSet(res.draw, res.totalcount, res.totalcount, res.couplist, callback);
        }else{
            tableDataSet(0, 0, 0, [], callback);
            alertDialog(result.retmsg);
        }
    }else{
        tableDataSet(0, 0, 0, [], callback);
        alertDialog("优惠码获取失败！");
    }
}

function coupInfoEditEnd(flg, result, type){
    var res = "失败";
    var text = "";
    var alert = "";
    switch (type){
        case COUPADD:
            text = "新增";
            break;
        case COUPEDIT:
            text = "编辑";
            break;
        case COUPDELETE:
            text = "删除";
            break;
    }
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            res = "成功";
            CoupTable.init();
            $('#edit_coup').modal('hide');
        }
    }
    if(alert == "") alert = text + "优惠码" + res + "！";
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

$("#coup_inquiry").on("click", function(){
    //用户查询
    CoupTable.init();
});
