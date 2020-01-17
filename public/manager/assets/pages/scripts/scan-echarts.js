/**
 * Created by zxm on 2019/9/2.
 */

var queryCounty_list = [];
var queryDay_list = [];
if(App.isAngularJsApp() === false){
    jQuery(document).ready(function(){
        //判断密码是否是原始密码
        Password.init();
        line_display([]);
        pie_display([]);
        // 取订单及人数统计
        orderStatisticsQuery();
        //按日期获取扫描次数（日）
        getOderStatisticsOfDay();
        //不分页取所有订单
        orderDataGet(null, null);
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

function getOderStatisticsOfDay(){
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
    };
    oderStatisticsOfDay(data);
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

function pie_display(list){
    //整理返回的数据
    var legend = ["待支付", "检测中", "报告下载中","检测完成", "已退款"];
    var value = [0, 0, 0, 0, 0];
    for(var i in list){
        for(var j in legend){
            if(list[i].status == legend[j]){
                value[j] ++
            }
        }
    }
    var barCharts = echarts.init(document.getElementById("echarts_pie"));
    var option = {
        //绘制网格
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: legend,
        },
        series: [
            {
                name: '订单分布',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: [
                    {name: "待支付", value: value[0]},
                    {name: "检测中", value: value[1]},
                    {name: "报告下载中", value: value[2]},
                    {name: "检测完成", value: value[3]},
                    {name: "已退款", value: value[4]}
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    barCharts.setOption(option);

}

function line_display(list){
    //整理数据
    var date = [];
    var turnincount = [], gramcount = [], turninamount = [], gramamount = [];
    for(var i in list){
        date.push(formatDate(list[i].date));
        turnincount.push(list[i].turnincount);
        gramcount.push(list[i].gramcount);
        turninamount.push(list[i].turninamount);
        gramamount.push(list[i].gramamount);
    }
    var lineCharts = echarts.init(document.getElementById("echarts_line"));
    var option = {
        tooltip:{
            trigger:'axis'
        },
        legend:{
            data: ['Turnin订单数', 'Gram订单数', 'Turnin订单金额', 'Gram订单金额']
        },
        grid:{
            top:'20%',
            bottom:'20%'
        },
        calculable:true,
        xAxis:{
            name:'日期',
            type:'category',
            data:date       //["20200117","20200118","20200119","20200120","20200121","20200122"]
        },
        yAxis:[
            {
                name:'订单数',
                type:'value',
                scale:true,
                position: 'left',
                splitLine:{
                    show:false
                }
            },
            {
                name:'订单金额',
                type:'value',
                scale:true,
                position: 'right',
                splitLine:{
                    show:false
                }
            }
        ],
        series:[{
            name:'Turnin订单数',
            data:turnincount,//[1,1,3,0,1,3],
            smooth:false,
            yAxisIndex: 0,
            type:'line'
        },{
            name:'Gram订单数',
            data:gramcount,//[2,1,3,0,4,3],
            smooth:false,
            yAxisIndex: 0,
            type:'line'
        },{
            name:'Turnin订单金额',
            data:turninamount,//[10.00,1.00,0.00,50.00,400.00,100.00],
            yAxisIndex: 1,
            type:'bar'
        },{
            name:'Gram订单金额',
            data:gramamount,//[20.00,3.00,1.00,0.00,200.00,400.00],
            yAxisIndex: 1,
            type:'bar'
        }]
    };
    lineCharts.setOption(option);
}

function getOrderStatisticsEnd(flg,result,type){
    if(flg){
        if (result && result.retcode == SUCCESS) {
            //将返回结果显示
            $("#todayUser").html(formatNumber(result.response.todayuser));
            $("#totalUser").html(formatNumber(result.response.totaluser));
            $("#totalCount").html(formatNumber(result.response.totalcount));
            $("#totalAmount").html(formatCurrency(result.response.totalamount / 100));
            $("#todayTurninCount").html(formatNumber(result.response.todayturnincount));
            $("#todayTurninAmount").html(formatCurrency(result.response.todayturninamount / 100));
            $("#totalTurninCount").html(formatNumber(result.response.totalturnincount));
            $("#totalTurninAmount").html(formatCurrency(result.response.totalturninamount / 100));
            $("#todayGramCount").html(formatNumber(result.response.todaygramcount));
            $("#todayGramAmount").html(formatCurrency(result.response.todaygramamount / 100));
            $("#totalGramCount").html(formatNumber(result.response.totalgramcount));
            $("#totalGramAmount").html(formatCurrency(result.response.totalgramamount / 100));
        }
    }
    App.unblockUI('#lay-out');
}

function getOrderStatisticsOfDayEnd(flg,result,type){
    if(flg){
        if (result && result.retcode == SUCCESS) {
            //显示柱状图
            /**
             * orderlist结构如下
             * [
             *      {
             *          date:YYYYMMDD,
             *          turnincount:XX, //当日turnin订单数
             *          turninamount:XX, //当日turnin订单金额
             *          gramcount:XX, //当日gram订单数
             *          gramamount:XX, //当日gram订单金额
             *      }
             * ]
             */

            line_display(result.response.orderlist);
        }
    }
    App.unblockUI('#lay-out');
}

function getOrderDataEnd(flg, result, callback){
    App.unblockUI('#lay-out');
    if(flg){
        if (result && result.retcode == SUCCESS) {
            var res = result.response;
            pie_display(res.orderlist);
        }
    }
}

//将日期格式化
function formatDate(value){
    return value.substring(0,4)+"/"+value.substring(4,6)+"/"+value.substring(6,8);
}