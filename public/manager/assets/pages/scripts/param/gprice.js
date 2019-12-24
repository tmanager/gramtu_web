/**
 * Created by Administrator on 2019/2/22.
 */
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        //获取参数信息
        gPriceParaGet({});
        //参数form初始化
        GPriceEdit.init();
    });
}

var GPriceEdit = function() {
    var handleGPrice = function() {
        $('.turnitin-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                price: {
                    required: true,
                    number: true
                },
                wordnum: {
                    required: true,
                    digits: true
                },
                discount: {
                    number: true,
                    range: [0, 1],
                    maxlength: 4
                }
            },

            messages: {
                price: {
                    required: "价格必须输入",
                },
                wordnum: {
                    required: "字数必须输入",
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


        $('#para_modify').click(function(e) {
            if ($('.turnitin-form').validate().form()) {
                e.preventDefault();
                var data = $('.turnitin-form').getFormData();
                gPriceParaModify(data);
            }
        });

        $('#para_pre').click(function(e) {
            if ($('.turnitin-form').validate().form()) {
                e.preventDefault();
                var data = $('.turnitin-form').getFormData();
                if(data.discount == "") data.discount = 1;
                var disPrice = Number((data.price * data.discount).toFixed(2));
                $("#price").html(data.price + "元/" + data.wordnum + "字");
                $("#discount").html(discountNumberChange(data.discount));
                $("#disprice").html(disPrice + "元/" + data.wordnum + "字");
                $('#price-pre').modal('show');
            }
        });
    };

    return {
        //main function to initiate the module
        init: function() {
            handleGPrice();
        }
    };
}();

/**
 * 参数编辑完成.
 */
function gPriceParaModifyEnd(flg, result, type){
    var res = "失败！";
    var alert = "";
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if (result && result.retcode == SUCCESS) {
            turnitinParaGet({});
            res = "成功！";
        }
    }
    if(alert == "") alert = "语法检测价格参数修改" + res;
    App.unblockUI('#lay-out');
    alertDialog(alert);
}

/**
 * 获取参数信息完成.
 */
function getGPriceParaEnd(flg, result){
    var exclude = [""];
    var para = result.response;
    var options = { jsonValue: para, exclude:exclude,isDebug: false};
    $(".turnitin-form").initForm(options);
}