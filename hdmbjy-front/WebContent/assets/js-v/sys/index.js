
var httpurl = httpurlSystem;

var ids = "";			//id中转
var fmid = "fhindex";	//菜单点中状态 
var mid = "fhindex";	//菜单点中状态 
var onlineAdress="";	//在线管理地址
var wimadress="";		//即时聊天地址
var user = "FH";		//用于即时通讯（ 当前登录用户）
var uname = "";			//姓名
var fhsmsSound = '1';	//站内信提示音效
var fwebsocket = null;


var vm = new Vue({
    el: '#app',

    data:{
    	sysName:'海淀区民办教育管理平台',	//系统名称
    	menuList:[],		//菜单List
    	SKIN:'pcoded-navbar navbar-image-3,navbar pcoded-header navbar-expand-lg navbar-light header-dark,',	//用户风格设置
    	systemset:false,	//隐藏系统设置
    	userPhoto:'../../../assets/images/user/avatar-2.jpg',	//用户头像
    	user_name:'',		//用户姓名
    	fhsmsCount:0,		//站内信总数
    	hdcontent: '',		//审批详情
    	iconColored:false,	//菜单图标颜色开关状态
    	menuFixed:true,		//菜单固定开关状态
    	boxlayouts:false,	//总体居中开关状态
		hasTask: false,  //是否有代办任务
		hasInform: false,  //是否有系统消息
		show: true,  //没有消息显示
		taskCount:0,   //代办任务条数
		informCount:0,   //系统通知条数
		taskList:[],		//代办任务集合
		informList:[],    //通知公告集合
		orgName:'',//机构名称
		isUser:true,  //是否为用户   做进入页面按钮权限管理
    },
    
    methods: {
		
        //浏览器窗口大小变化时调用
        cmainFrame: function(){
            var hmain = document.getElementById("mainFrame");
            var bheight = document.documentElement.clientHeight;
            hmain.style.width = '100%';
            hmain.style.height = (bheight-76) + 'px';
        },
        test:function(){
			alert("测试成功");
		},
        //打开标签
        siMenu: function(id,fid,MENU_NAME,MENU_URL){
        	ids.replace(id+',','');
        	ids += id+',';
        	if(id != mid){
        		$("#"+mid).attr("class","");
        		mid = id;
        	}
        	if(fid != fmid){
        		if(fmid != 'fhindex')$("#"+fmid).attr("class","nav-item pcoded-hasmenu");
        		fmid = fid;
        	}
        	$("#"+id).attr("class","active");
        	$("#"+fid).attr("class","nav-item pcoded-hasmenu active pcoded-trigger");
        	top.mainFrame.vm.tabAddHandler(id,MENU_NAME,MENU_URL);
        },
        
        //关闭标签
        indexTabClose: function(type){
        	if('all' == type && ids != ''){			//关闭所有
        		var arrid = ids.split(',');
        		for(var i=0;i<ids.length;i++){
        			top.mainFrame.vm.tabClose(arrid[i]);
        		}
        	}else if('own' == type && ids != ''){	//关闭自己
        		top.mainFrame.vm.tabClose(top.mainFrame.nowid);
        	}else if('other' == type && ids != ''){	//关闭其他
        		var arrid = ids.split(',');
        		for(var i=0;i<ids.length;i++){
        			if (arrid[i] == top.mainFrame.nowid) continue;
        			top.mainFrame.vm.tabClose(arrid[i]);
        		}
        	}
        },
		
        //调用tab 页面的方法
        tabMethod:function(){
        	var childWindow = $("#mainFrame")[0].contentWindow; //表示获取了嵌入在iframe中的子页面的window对象。  []将JQuery对象转成DOM对象，用DOM对象的contentWindow获取子页面window对象。
        	childWindow.vm.tabTopMethod();  //调用子页面中的subFunction方法。
        },
        index: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'main/index',
        		data: {tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.orgName = data.orgName;
        			vm.getInfo();					//基础资料
        			vm.menuList = data.menuList;	//菜单List
					vm.isUser=data.isUser;  //是否为用户
        			// vm.SKIN = data.SKIN;			//样式风格class
        			
        			if(vm.SKIN.split(',')[0].indexOf('icon-colored')>=0){ //菜单图标颜色开关状态
        				vm.iconColored = true;
        			}else{
        				vm.iconColored = false;
        			}
        			if(vm.SKIN.split(',')[0].indexOf('menupos-static')>=0){ //菜单固定开关状态
        				vm.menuFixed = false;
        			}else{
        				vm.menuFixed = true;
        			}
        			if(vm.SKIN.split(',')[2].indexOf('container box-layout')>=0){ //总体居中开关状态
        				vm.boxlayouts = true;
        			}else{
        				vm.boxlayouts = false;
        			}
        			
        			document.getElementsByTagName("body")[0].className=data.SKIN.split(',')[2];
        			setTimeout(function () {
        				 $("#pcoded").pcodedmenu({
         				    MenuTrigger: 'click',
         				    SubMenuTrigger: 'click',
         				});
        		    }, 0);
        		 }else if ("exception" == data.result){
                 	showException('初始',data.exception);//显示异常
                 }else{
        			 swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                     setTimeout(function () {
                    	 vm.goOut('0');
                     }, 2000);
        		 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	vm.goOut('0');
                }, 2000);
            });
        },
        
        getInfo: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'head/getInfo',
        		data: {tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 if('admin' == data.USERNAME)vm.systemset = true;	//非admin隐藏系统设置
        			 vm.updateUserPhoto(httpurl+data.userPhoto);		//用户头像
        			 vm.user_name = data.NAME;							//用户姓名
        			 vm.sysName= data.sysName							//系统名称
        			 onlineAdress = data.onlineAdress;					//在线管理地址
        			 wimadress= data.wimadress;							//即时聊天地址
        			 user = data.USERNAME;								//用户名
        			 uname = data.NAME;									//用户姓名
        			 vm.online();										//加入在线列表
        			 /* vm.topTask();										//刷新待办任务
					 vm.topInform(); */
					 vm.tabMethod();
        			 vm.fhsmsCount = Number(data.fhsmsCount);
        			 if(vm.fhsmsCount > 0){
        				 setTimeout(function () {
                          	vm.showNoreadNews();
                          }, 2000);
        			 }
        			 fhsmsSound = data.fhsmsSound;						//站内信提示音效
        			// vm.setDepSen();									//初始用户的组织机构权限
        		 }else if ("exception" == data.result){
                 	showException('基础信息',data.exception);			//显示异常
                 }
        		}
        	});
        },
        
        //初始用户的组织机构权限
       /* setDepSen: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurlOa+'datajur/setDepSen?tm='+new Date().getTime(),
            	data: encodeURI(""),
        		dataType:'json',
        		success: function(data){
        			if("exception" == data.result){
                    	showException("初始用户的组织机构权限",data.exception);	//显示异常
                    }
        		}
        	});
        },*/
        
        //刷新用户头像
        updateUserPhoto: function(value){
        	this.userPhoto = value;
        },
        
        //显示未读消息
        showNoreadNews: function(){
        	$("#fhsmsCount").tips({
        		side:3,
                msg:'您有 '+this.fhsmsCount+' 条未读消息',
                bg:'#AE81FF',
                time:10
            });
        },
        
        //去通知收信人有站内信接收
        fhsmsmsg: function(USERNAME){
        	var arrUSERNAME = USERNAME.split(';');
        	for(var i=0;i<arrUSERNAME.length;i++){
        		fwebsocket.send('[fhsms]'+arrUSERNAME[i]);//发送站内信通知
        	}
        },

        //读取站内信时减少未读总数
        readFhsms: function(){
        	this.fhsmsCount = Number(this.fhsmsCount)-1;
        	this.fhsmsCount = Number(this.fhsmsCount) <= 0 ?'0':this.fhsmsCount;
        	 if(Number(this.fhsmsCount) > 0){
        			$("#fhsmsCount").tips({
        				side:3,
        				msg:'您还有 '+this.fhsmsCount+' 条未读消息',
        		        bg:'#AE81FF',
        		        time:10
        		    });
        		 }
        },

        //获取站内信未读总数(在站内信删除未读新信件时调用此函数更新未读数)
        getFhsmsCount: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'fhsms/getFhsmsCount?tm='+new Date().getTime(),
            	data: encodeURI(""),
        		dataType:'json',
        		success: function(data){
        			if("exception" == data.result){
                    	showException("站内信",data.exception);//显示异常
                    }else{
                    	vm.fhsmsCount = Number(data.fhsmsCount);
           			 	if(vm.fhsmsCount > 0){
           			 		$("#fhsmsCount").tips({
           					side:3,
           					msg:'您还有 '+vm.fhsmsCount+' 条未读消息',
           			        bg:'#AE81FF',
           			        time:10
           			 		});
           			 	}
                    }
        		}
        	});
        },
        
        //加入在线列表
        online: function(){
        	if (window.WebSocket) {
        		fwebsocket = new WebSocket(encodeURI('ws://'+onlineAdress)); //oladress在main.jsp页面定义
        		fwebsocket.onopen = function() {
        			fwebsocket.send('[join]'+user); //连接成功
        		};
        		fwebsocket.onerror = function() {
        			//连接失败
        		};
        		fwebsocket.onclose = function() {
        			//连接断开
        		};
        		//消息接收
        		fwebsocket.onmessage = function(message) {
        			var message = JSON.parse(message.data);
        			if(message.type == 'goOut'){
        				$("body").html("");
        				vm.goOut("1");
        			}else if(message.type == 'thegoout'){
        				$("body").html("");
        				vm.goOut("2");
        			}else if(message.type == 'senFhsms'){
        				vm.fhsmsCount = Number(vm.fhsmsCount)+1;
        				if('0' != fhsmsSound){
        					$("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+fhsmsSound+'.mp3" autoplay controls></audio>');
        				}
        				$("#fhsmsCount").tips({
        					side:3,
        			        msg:'收到1条新消息,您还有 '+vm.fhsmsCount+' 条未读消息',
        			        bg:'#AE81FF',
        			        time:10
        			    });
        			}else if(message.type == 'fhtask'){
        				if(message.RNUMBER == 'no'){
        					$("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+fhsmsSound+'.mp3" autoplay controls></audio>');
        					/* vm.topTask();//刷新顶部待办任务列表
							vm.toInform(); */
							vm.tabMethod();
        				}else{
        					$.ajax({
        						xhrFields: {
        		                    withCredentials: true
        		                },
        						type: "POST",
        						url: httpurl+'/head/isNowRole',
        				    	data: {RNUMBER:message.RNUMBER,tm:new Date().getTime()},
        						dataType:'json',
        						success: function(data){
        							 if('yes' == data.msg){
        								$("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+fhsmsSound+'.mp3" autoplay controls></audio>');
        								/* vm.topTask();//刷新顶部待办任务列表
										vm.toInform(); */
										vm.tabMethod();
        							 }else if ("exception" == data.result){
        					            showException("待办任务",data.exception);//显示异常
        					         }
        						}
        					});
        				}
        			}
        		};
        	}
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
				          showException("待办任务",data.exception);//显示异常
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
		                // $("#taskCount").html(Number($("#taskCount").html()) + Number(informCount)); //待办任务总数
		                // $("#taskCount").html(Number(vm.taskCount+vm.informCount)); //待办任务总数
						vm.informList=data.list;
		            }
		        
		            if ("exception" == data.result) {
		                layer.msg("待办任务程序异常,稍后再试." + data.exception); //显示异常
		            } 
		        }
		    });
		},
        
        //退出系统
        logout: function(){
			swal({
            	title: '',
                text: '确定要退出系统吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
	            	this.goOut('0')
                }
            });
        },
        
        //下线
        goOut: function(msg){
        	for(var i=0;i<wsname.length;i++){ //循环清理各个微服务端session缓存
        		$.ajax({
	        		xhrFields: {
	                    withCredentials: true
	                },
	        		type: "POST",
	        		url: wsname[i]+'main/logout',
	        		data: {tm:new Date().getTime()},
	        		dataType:"json",
	        		async: false,
	        		success: function(data){}
	        	})
        	}
        	window.location.href="../../login.html?msg="+msg;
        },

        //去通知任务待办人有新任务
        fhtaskmsg: function(USERNAME){
			/* this.topTask(); //刷新待办任务列表
			this.topInform(); //刷新通知列 */
			this.tabMethod();
        	fwebsocket.send('[fhtask]'+USERNAME);//发送新任务通知
			
        },
        
        //修改头像
        editPhoto: function (){
        	 var diag = new top.Dialog();
        	 diag.Drag=true;
        	 diag.Title ="修改头像";
        	 diag.URL = '../photo/editPhoto.html';
        	 diag.Width = 669;
        	 diag.Height = 525;
        	 diag.Modal = true;				//有无遮罩窗口
        	 diag.CancelEvent = function(){ //关闭事件
        		diag.close();
        	 };
        	 diag.show();
        },
        
        //修改个人资料
        goEditMyInfo: function (){
        	 var diag = new top.Dialog();
        	 diag.Drag=true;
        	 diag.Title ="个人资料";
        	 diag.URL = '../user/user_edit.html?fx=head';
        	 diag.Width = 600;
        	 diag.Height = 339;
        	 diag.Modal = true;				//有无遮罩窗口
        	 diag. ShowMaxButton = true;	//最大化按钮
        	 diag.ShowMinButton = true;		//最小化按钮 
        	 diag.CancelEvent = function(){ //关闭事件
        		diag.close();
        	 };
        	 diag.show();
        },

        //系统设置
        sysSet: function (){
        	 var diag = new top.Dialog();
        	 diag.Drag=true;
        	 diag.Title ="系统设置";
        	 diag.URL = '../index/sysSet.html';
        	 diag.Width = 650;
        	 diag.Height = 481;
        	 diag.Modal = true;				//有无遮罩窗口
        	 diag. ShowMaxButton = true;	//最大化按钮
        	 diag.ShowMinButton = true;		//最小化按钮 
        	 diag.CancelEvent = function(){ //关闭事件
        		diag.close();
        	 };
        	 diag.show();
        },
        
        //站内信
        fhsms: function (){
        	 var diag = new top.Dialog();
        	 diag.Drag=true;
        	 diag.Title ="站内信";
        	 diag.URL = '../fhsms/fhsms_list.html';
        	 diag.Width = 900;
        	 diag.Height = 600;
        	 diag. ShowMaxButton = true;	//最大化按钮
             diag.ShowMinButton = true;		//最小化按钮 
        	 diag.CancelEvent = function(){ //关闭事件
        		diag.close();
        	 };
        	 diag.show();
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
        
        //用于子窗口获取父页面中的参数(应用于流程信息审批详情内容)
        
        handleDetails: function (value){
        	if(value != ''){
        		this.hdcontent = value;
        	}else{
        		return this.hdcontent;
        	}
        },

        //初始执行
        init() {
            this.cmainFrame();
            this.index();
            document.getElementsByTagName("title")[0].innerText = this.sysName;
        }
    },

    mounted(){
        this.init()
    }

})

//窗口宽度高度变化事件
window.onresize=function(){  
	vm.cmainFrame();
};

//保存用户皮肤风格
function saveSkin(){
	var SKIN1 = $("#FHSKIN1").attr('class');
	var SKIN2 = $("#FHSKIN2").attr('class');
	var SKIN3 = $("#FHSKIN3").attr('class');
	var SKIN = SKIN1+','+SKIN2+','+SKIN3
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurl+'head/saveSkin',
		data: {SKIN:SKIN,tm:new Date().getTime()},
		dataType:'json',
		success: function(data){
			if ("success" == data.result) {
			}else if ("exception" == data.result){
            	showException("风格设置",data.exception);//显示异常
            }
		}
	});
}

//默认风格风格
function saveSkindef(){
	$("#FHSKIN1").attr('class','pcoded-navbar');
	$("#FHSKIN2").attr('class','navbar pcoded-header navbar-expand-lg navbar-light');
	$("#FHSKIN3").attr('class','');
	var SKIN = 'pcoded-navbar,navbar pcoded-header navbar-expand-lg navbar-light,';
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurl+'head/saveSkin',
		data: {SKIN:SKIN,tm:new Date().getTime()},
		dataType:'json',
		success: function(data){
			if ("success" == data.result) {
			}else if ("exception" == data.result){
            	showException("风格设置",data.exception);//显示异常
            }
		}
	});
}
