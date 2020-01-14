var vm = new Vue({
	el: '#app',
	
	data:{
		hasTask: false,  //是否有代办任务
		hasInform: false,  //是否有系统消息
		show: true,  //没有消息显示
		taskCount:0,   //代办任务条数
		informCount:0,   //系统通知条数
		taskList:[],		//代办任务集合
		informList:[],    //通知公告集合
		menu:[],  //通过后台查询的菜单对象
		MENU_NAME:MENU_NAME,   //需要打开的通知页面名
		majorNum:0,  //专业个数|
		postNum:0,  //岗位数量
		teacherNum:0,  //教师总人数
		isUser:true,
		exUserNum:0,  //合同即将到期的用户人数
		orNum:0, //机构总数
    },
	
	methods: {
		
        //初始执行
        init() {
        	setTimeout(function(){
        		vm.topTask();
        		vm.topInform();
        		vm.mainEch();
        		vm.getDetailData();
            },800);
        	
        },
		//主页中数据统计
		getDetailData:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'/scuser/getDetailData?tm='+new Date().getTime(), //待办任务
				data: encodeURI(""),
				dataType:'json',
				success: function(data){
					if("success"==data.result){
						vm.majorNum=data.majorNum;  //专业个数|
						vm.orNum=data.orNum;  //专业个数|
						vm.postNum=data.postNum;  //专业个数|
						vm.teacherNum=data.teacherNum;  //专业个数|
						vm.exUserNum=data.exUserNum;  //专业个数|
						vm.isUser=data.isUser;  //专业个数|
					}
					if ("exception" == data.result){
					     //showException("统计信息",data.exception);//显示异常
					 }	
				}
			});
		},
		//待办任务
		topTask: function(){
			$.ajax({
				xhrFields: {
		            withCredentials: true
		        },
				type: "POST",
				url: httpurlActiviti+'/rutask/getList?tm='+new Date().getTime(), //待办任务
		    	data: encodeURI(""),
				dataType:'json',
				success: function(data){
					var taskCount = Number(data.taskCount);
					vm.taskCount=taskCount;
					if (taskCount > 0) {
					    vm.show = false;
					    vm.hasTask = true;
					    // $("#taskCount").html(Number($("#taskCount").html()) + Number(informCount)); //待办任务总数
					    // $("#taskCount").html(Number(vm.taskCount+vm.informCount)); //待办任务总数
						vm.taskList=data.list;
					}
					 if ("exception" == data.result){
				       //   showException("待办任务",data.exception);//显示异常
						 // layer.msg("待办任务程序异常,稍后再试.");
						 //alert("待办任务程序异常,稍后再试.");
				      }
				}
			});
		},
		topInform: function() {
		    $.ajax({
		        xhrFields: {
		            withCredentials: true
		        },
		        type: "POST",
		        url: httpurl + '/inform/getNoInformList?tm=' + new Date().getTime(), //待办任务
		        data: encodeURI(""),
		        dataType: 'json',
		        success: function(data) {
		            var informCount = Number(data.informCount);
		            vm.informCount=informCount;
		            if (informCount > 0) {
		                vm.show = false;
		                vm.hasInform = true;
						vm.informList=data.list;

		            }
		        
		            if ("exception" == data.result) {
		                //layer.msg("待办任务程序异常,稍后再试." + data.exception); //显示异常
		            } 
		        }
		    });
		},
		
		//打开我的待办任务列表
		rutasklist: function (){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="我的待办任务";
			 diag.URL = '../../act/rutask/rutask_list.html';
			 diag.Width = 1100;
			 diag.Height = 600;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
			 diag.ShowMinButton = true;		//最小化按钮
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
		openInform:function(){
			$.ajax({
			    xhrFields: {
			        withCredentials: true
			    },
			    type: "POST",
			    url: httpurl + '/menu/findByMenuName?tm=' + new Date().getTime(), //待办任务
			    data: {
					MENU_NAME:this.MENU_NAME,
				},
			    dataType: 'json',
			    success: function(data) {
					if("success"==data.result){
						vm.menu=data.menu;
						top.vm.siMenu('z'+vm.menu.menu_ID,'lm'+vm.menu.parent_ID,vm.menu.menu_NAME,vm.menu.menu_URL);
					}
			        if ("exception" == data.result) {
			            //layer.msg("待办任务程序异常,稍后再试." + data.exception); //显示异常
			        } 
			    }
			});
			
		},
		mainEch:function(){
			$.ajax({
			    xhrFields: {
			        withCredentials: true
			    },
			    type: "POST",
			    url: httpurl+'statistics/xlList',//待办任务 
			    data: {
					MENU_NAME:this.MENU_NAME,
					tm:new Date().getTime()
				},
			    dataType: 'json',
			    success: function(data) {
					if("success"==data.result){
						//console.info(data);
						var myChart = echarts.init(document.getElementById('main'));
						// 指定图表的配置项和数据
						var option = {
						    title: {
						    },
						    color : ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed"],
						    tooltip: {},
						    legend: {
						        data:['普通教师','专职教师']
						    },
							toolbox: {
							                    show: true,
							                    feature: {
							                        mark: {show: true},
							                        dataView: {show: true, readOnly: false},
							                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
							                        restore: {show: true},
							                        saveAsImage: {show: true}
							                    }
							                },
						    xAxis: {
						        data: data.xAxis 
						    },
						    yAxis: {},
						    series: [{
						        name: '普通教师',
						        type: 'bar',
						        data: data.yAxis1 
						    },
							{
							    name: '专职教师',
							    type: 'bar',
							    data: data.yAxis2
							}
							]
						};
						
						// 使用刚指定的配置项和数据显示图表。
						myChart.setOption(option);
						
						
					}
			        if ("exception" == data.result) {
			           // layer.msg("首页程序异常,稍后再试."); //显示异常
			        } 
			    }
			});
			
		}
		},
	mounted(){
		this.init();
	},
	});