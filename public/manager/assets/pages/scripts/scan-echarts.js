/**
 * Created by zxm on 2019/9/2.
 */

var queryCounty_list = [];
var queryDay_list = [];
if(App.isAngularJsApp() === false){
    jQuery(document).ready(function(){
        //判断密码是否是原始密码
        Password.init();
        // 取扫描次数
        //scanQueryOfCounty();
        //按日期获取扫描次数（日）
        //getScanQueryOfDay();
        if(localStorage.getItem("repassword") == 0){
            updatePasswordAlert();
        }
    });
}
var Password = function() {
    var handlePassword = function() {
        $('.password-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            keyboard:'false',
            rules: {
                opassword: {
                    required: true,
                    minlength: 6,
                    maxlength: 12
                },
                npassword: {
                    required: true,
                    simple: true,
                    same: true,
                    minlength: 6,
                    maxlength: 12
                },
                rpassword: {
                    equalTo: "#npassword"
                }
            },
            messages: {
                opassword: {
                    required: "原密码必须输入"
                },
                npassword: {
                    required: "新密码必须输入"
                },
                rpassword: {
                    equalTo: "确认密码必须与新密码一致"
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
        jQuery.validator.addMethod("simple", function(value, element) {
            return passwordCheck(value);
        }, "新密码过于简单");
        jQuery.validator.addMethod("same", function(value, element) {
            return value != $("#oldpassword").val();
        }, "新密码不能与旧密码相同");
        $('#password_modify').click(function() {
            if ($('.password-form').validate().form()) {
                var data = $('.password-form').getFormData();
                var user = {
                    oldpassword: data.opassword,
                    newpassword: data.npassword
                };
                passwordModify(user);
            }
        });
    };
    return {
        //main function to initiate the module
        init: function() {
            handlePassword();
        }
    };
}();
function updatePasswordAlert(){
    var user = {opassword:"", npassword:"", rpassword:""};
    var options = { jsonValue: user, exclude:[""],isDebug: false};
    $(".password-form").initForm(options);
    $('#edit_main').modal({keyboard: false});
    $('#edit_main').modal('show');
}
function passwordModifyEnd(flg, result){
    var res = "失败！";
    var alert = "";
    if(flg && result && result.retcode == SUCCESS){
        if(alert == "") alert = "密码修改成功！";
        localStorage.setItem("repassword", "1");
        $('#edit_main').modal('hide');
        App.unblockUI('#lay-out');
        alertDialog(alert);
    }else{
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
        }
        if(alert == "") alert = "密码修改" + res;
        App.unblockUI('#lay-out');
        alertDialog(alert);
    }
}

function getScanQueryOfDay(){
    //获取本地时间
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1) >=10? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
    var day = date.getDate() >=10 ? date.getDate() : "0" + date.getDate();
    var endDate = year + "" + month + "" + day;
    //获取本地时间前一月日期
    var startDate = getLastMonthDay(date);
    var data = {
        "startDate":startDate,
        "endDate":endDate
    }
    scanQueryOfDay(data);
}

function bar_display(){
    //整理返回的数据
    var county = [];//县域表
    var todayCount = []; //今日扫描次数列表
    var totalCount = []; //累计扫描次数列表
    for(var i in queryCounty_list){
        county.push(queryCounty_list[i].countyname);
        todayCount.push(queryCounty_list[i].todayCount);
        totalCount.push(queryCounty_list[i].totalCount);
    }
    var barCharts = echarts.init(document.getElementById("echarts_bar"));
    var option = {
        //绘制网格
        grid:{
            x:'15%',
            y:'15%'
        },
        xAxis:{
            //是否显示x轴
            show:true,
            //类型：类目轴
            type:'category',
            //坐标轴刻度显示
            axisTick:{
                //设置刻度线与标签对齐
                alignWithLabel:true
            },
            axisLine:{
                show:true,
                lineStyle:{
                    //轴线颜色
                    color:'#92adce',
                    //线型
                    type:'solid'
                }
            },
            data:county
        },
        yAxis:{
            type:'value',
            //是否显示y轴
            show:true,
            axisLine:{
                show:true,
                lineStyle:{
                    //轴线颜色
                    color:'#92adce',
                    //线型
                    type:'solid'
                }
            }
        },
        series:[
            {
                name:'今日扫描次数',
                type:'bar',
                //柱体上显示对应数值
                label:{
                    normal:{
                        show:true,
                        //显示位置
                        position:'top',
                        //文本颜色
                        color:'black'
                    }
                },
                //柱体样式
                itemStyle:{
                    normal:{
                        //主体颜色
                        color:'#87CEFA',
                        //圆角设置
                        barBorderRadius: [5, 5, 0, 0]
                    }
                },
                data:todayCount
            },
            {
                name:'累计扫描次数',
                type:'bar',
                //柱体上显示对应数值
                label:{
                    normal:{
                        show:true,
                        //显示位置
                        position:'top',
                        //文本颜色
                        color:'black'
                    }
                },
                //柱体样式
                itemStyle:{
                    normal:{
                        //主体颜色
                        color:'	#9370DB',
                        //圆角设置
                        barBorderRadius: [5, 5, 0, 0]
                    }
                },
                data:totalCount
            }
        ],
        //图例组件
        legend:{
            data:['今日扫描次数','累计扫描次数'],
            textStyle:{
                fontSize:'12',
                color:'black'
            },
            //间距
            itemGap:50,
            itemWidth:15,
            itemHeight:15
        },
        //提示框组件
        tooltip:{
            trigger:'axis',
            axisPointer:{
                type:'shadow',
                axis:'x'
            }
        }
    };
    barCharts.setOption(option);

}

function line_display(){
    //整理数据
    var date = [];
    var totalCount = [];
    for(var i in queryDay_list){
        date.push(formatDate(queryDay_list[i].date));
        totalCount.push(queryDay_list[i].totalcount);
    }
    var lineCharts = echarts.init(document.getElementById("echarts_line"));
    var option = {
        tooltip:{
            trigger:'axis'
        },
        legend:{
            data:['累计扫描次数']
        },
        grid:{
            top:'20%',
            bottom:'20%'
        },
        calculable:true,
        xAxis:{
            name:'日期',
            type:'category',
            data:date
        },
        yAxis:{
            name:'累计扫描次数',
            type:'value',
            scale:true,
            splitLine:{
                show:false
            }
        },
        series:[{
            name:'累计扫描次数',
            data:totalCount,
            smooth:true,
            type:'line'
        }]
    };
    lineCharts.setOption(option);
}

function scanQueryOfCountyEnd(flg,result,type){
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
            var res = "失败";
            var text = "";
            var alert = "";
            if(alert == "") alert = text + "县域扫描次数" + res + "!";
            alertDialog(alert);
        }
        if (result && result.retcode == SUCCESS) {
            //将返回结果显示
            $("#todayCount").html(result.response.todayCount);
            $("#totalCount").html(result.response.totalcount);
            queryCounty_list = result.response.countyscanlist;
            //显示柱状图
            bar_display();
        }
    }
    App.unblockUI('#lay-out');
}

function scanQueryOfDayEnd(flg,result,type){
    if(flg){
        if(result && result.retcode != SUCCESS){
            alert = result.retmsg;
            var res = "失败";
            var text = "";
            var alert = "";
            if(alert == "") alert = text + "日扫描次数" + res + "!";
            alertDialog(alert);
        }
        if (result && result.retcode == SUCCESS) {
            //将返回结果显示
            queryDay_list = result.response.countyscanlist;
            //显示柱状图
            line_display();
        }
    }
    App.unblockUI('#lay-out');
}

//将日期格式化
function formatDate(value){
    return value.substring(0,4)+"/"+value.substring(4,6)+"/"+value.substring(6,8);
}