var url="";
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS: '',	//检索条件
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		Delegate:false,	//委派按钮权限
		edit:false,		//办理权限
		loading:false,	//加载状态
		urlType:'rutask_handle',  //办理页面跳转的url
	/* 	EXAMINATION_ID:'',   //年度审批id
		GOVERNMENT_ID:''  ,//行政审批id */
		ACT_TYPE:'',
		APPROVE_ID:''    //审批id
    },
    
    mixins: [formatDate],	//混入模块
    
	methods: {
		
        //初始执行
        init() {
    		this.getList();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	var STRARTTIME = $("#STRARTTIME").val();
        	var ENDTIME = $("#ENDTIME").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'rutask/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,STRARTTIME:STRARTTIME,ENDTIME:ENDTIME,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("待办任务",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
    	
    	//委派
    	setDelegate: function (ID_){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="委派对象";
    		 diag.URL = '../../act/ruprocdef/ruprocdef_delegate.html?ID_='+ID_;
    		 diag.Width = 439;
    		 diag.Height = 146;
    		 diag.CancelEvent = function(){ //关闭事件
    			var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList();
    			}
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
		
		getNodeInfo:function(ID,PROC_INST_ID){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'rutask/getNodeInfo',
				async:false,
				data: {
					ID_:ID,
					PROC_INST_ID_:PROC_INST_ID,
					tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
				 if("success" == data.result){
			/* 		 vm.EXAMINATION_ID=data.EXAMINATION_ID;
					 vm.GOVERNMENT_ID=data.GOVERNMENT_ID; */
					 vm.APPROVE_ID=data.APPROVE_ID;
					 vm.ACT_TYPE=data.ACT_TYPE;
					 vm.urlType=data.nodeName;
				 }else if ("exception" == data.result){
			     	showException("待办任务",data.exception);//显示异常
			     }
				}
			}).done().fail(function(){
			    swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
			    setTimeout(function () {
			    	window.location.href = "../../login.html";
			    }, 2000);
			});
		},
    	//办理任务
		
    	handle: function (PROC_INST_ID_,ID_,FILENAME){
					
					vm.getNodeInfo(ID_,PROC_INST_ID_);
					if(vm.ACT_TYPE=="examination"){
						if(vm.urlType=='offline_booking'){
							url="../../bookinguser/bookinguser/bookinguser_list.html?FID="+PROC_INST_ID_+"&EID="+vm.APPROVE_ID
						}else if(vm.urlType=='upload_scanning'){
							url="../../examination/examination/upload_scanning.html?EID="+vm.APPROVE_ID+"&PROC_INST_ID="+PROC_INST_ID_;
						}else if(vm.urlType=='submit'){
							url="../../examination/examination/examination_edit.html?FID="+vm.APPROVE_ID+"&ID_="+ID_+"&isE=1&isBack=1";
						}else if(vm.urlType=='apply_offline_booking'){
							url="../../bookinguser/bookinguser/bookinguser_edit.html?FID="+PROC_INST_ID_+"&EID="+vm.APPROVE_ID
						}else{
							url="../../act/rutask/rutask_handle.html?PROC_INST_ID_="+PROC_INST_ID_+"&ID_="+ID_+"&FILENAME="+encodeURI(encodeURI(FILENAME));
						}
						
					}else if(vm.ACT_TYPE=="government"){
						if(vm.urlType=='offline_booking'){
							url="../../bookinguser/bookinguser/bookinguser_list.html?FID="+PROC_INST_ID_+"&EID="+vm.APPROVE_ID;
						}else if(vm.urlType=='upload_scanning'){
							url="../../government/government/upload_scanning.html?EID="+vm.APPROVE_ID+"&PROC_INST_ID="+PROC_INST_ID_;
						}else if(vm.urlType=='submit'){
							url="../../government/government/government_edit.html?FID="+vm.APPROVE_ID+"&ID_="+ID_+"&isE=1&isBack=1";
						}else if(vm.urlType=='apply_offline_booking'){
							url="../../bookinguser/bookinguser/bookinguser_edit.html?FID="+PROC_INST_ID_+"&EID="+vm.APPROVE_ID
						}else{
							url="../../act/rutask/rutask_handle.html?PROC_INST_ID_="+PROC_INST_ID_+"&ID_="+ID_+"&FILENAME="+encodeURI(encodeURI(FILENAME));
						}
					}
					
					 var diag = new top.Dialog();
					 setTimeout(function(){
						 diag.Drag=true;
						 diag.Title ="办理任务";
						 diag.URL = url;
						 diag.Width = 1100;
						 diag.Height = 750;
						 diag.Modal = true;				//有无遮罩窗口
						 diag. ShowMaxButton = true;	//最大化按钮
						 diag.ShowMinButton = true;		//最小化按钮 
						 diag.CancelEvent = function(){ //关闭事件
							 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
							 if(varSon != null && varSon.style.display == 'none'){
								 $("#simple-table").tips({
										side:3,
										msg:'审批完毕',
										bg:'#AE81FF',
										time:6
								 });
								 // top.vm.topTask();//刷新顶部任务列表
                                 top.vm.tabMethod();
								 vm.getList();
							}
							diag.close();
						 };
						 diag.show();
									
					 },1000);
					
		
    		
    	},
    	
		//查看用户
		viewUser: function (USERNAME){
			if('admin' == USERNAME){
				swal("禁止查看!", "不能查看admin用户!", "warning");
				return;
			}
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="资料";
			 diag.URL = '../../sys/user/user_view.html?USERNAME='+USERNAME;
			 diag.Width = 600;
			 diag.Height = 319;
			 diag.Modal = false;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
    	
    	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'rutask:edit,Delegate';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'head/hasButton',
        		data: {keys:keys,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.edit = data.rutaskfhadminedit;		//办理权限
        			vm.Delegate = data.Delegate;			//委派按钮权限
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },
        
        formatDate: function (time){
        	let date = new Date(time);
        	return this.formatDateUtil(date, "yyyy-MM-dd hh:mm:ss");
        },
        
        //-----分页必用----start
        nextPage: function (page){
        	this.currentPage = page;
        	this.getList();
        },
        changeCount: function (value){
        	this.showCount = value;
        	this.getList();
        },
        toTZ: function (){
        	var toPaggeVlue = document.getElementById("toGoPage").value;
        	if(toPaggeVlue == ''){document.getElementById("toGoPage").value=1;return;}
        	if(isNaN(Number(toPaggeVlue))){document.getElementById("toGoPage").value=1;return;}
        	this.nextPage(toPaggeVlue);
        }
       //-----分页必用----end
		
	},
	
	mounted(){
        this.init();
    }
})