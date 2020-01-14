
var httpurl = httpurlActiviti;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS: '',	//检索条件
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		Delegate:false,	//委派按钮权限
		Abolish:false,	//作废按钮权限
		edit:false,		//编辑权限(激活or挂起)
		cha: false,
		loading:false	//加载状态
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
        		url: httpurl+'ruprocdef/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,STRARTTIME:STRARTTIME,ENDTIME:ENDTIME,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("运行中的流程",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
    	
    	//激活 or 挂起
    	onoff: function (ID_,STATUS,ofid,VSID){
    		this.loading = true;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'ruprocdef/onoffTask?tm='+new Date().getTime(),
    	    	data: {ID_:ID_,STATUS:STATUS},
    			dataType:'json',
    			success: function(data){
    				vm.loading = false;
    				if("success" == data.result){
    					 if(STATUS == '1'){
    						 $("#"+ofid).tips({
    								side:3,
    					            msg:'激活成功',
    					            bg:'#AE81FF',
    					            time:2
    					        });
    						 $("#offing1"+VSID).hide();
    						 $("#oning1"+VSID).show();
    						 $("#STATUS"+VSID).html('<font color="#87B87F">正在运行</font><div class="spinner-grow spinner-grow-sm" style="padding-top:-2px;" role="status"><span class="sr-only">..</span></div>');
    					 }else{
    						 $("#"+ofid).tips({
    								side:3,
    					            msg:'已经挂起',
    					            bg:'#AE81FF',
    					            time:2
    					        });
    						 $("#offing1"+VSID).show();
    						 $("#oning1"+VSID).hide();
    						 $("#STATUS"+VSID).html('<font color="red">已挂起</font>');
    					 }
    				 }
    			}
    		});
    	},
    	
    	//是否作废
    	isDel: function (Id){
    		$("#recipient-id").val(Id);
    	},
    	
    	//提交作废
    	goDel: function (){
    		var Id = $("#recipient-id").val();
    		var reason = $("#message-text").val();
    		if('' == reason){
    			swal("", "还未写作废缘由!", "warning");
    			return false;
    		}
    		this.loading = true;
    		$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'ruprocdef/delete?',
        		data: {PROC_INST_ID_:Id,reason:encodeURI(encodeURI(reason)),tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 swal("", "已经作废!", "success");
        			 vm.getList();
        			 $("#aclose").click();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("作废流程",data.exception);//显示异常
                 }
        		}
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
    	
    	//流程信息
    	view: function (PROC_INST_ID_,ID_,FILENAME){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="流程信息";
    		 diag.URL = '../../act/rutask/rutask_handle.html?PROC_INST_ID_='+PROC_INST_ID_+'&ID_='+ID_+'&msg=admin'+'&FILENAME='+encodeURI(encodeURI(FILENAME));
    		 diag.Width = 1200;
    		 diag.Height = 599;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    			diag.close();
    		 };
    		 diag.show();
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
        	var keys = 'ruprocdef:edit,ruprocdef:cha,Delegate,Abolish';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurlSystem+'head/hasButton',
        		data: {keys:keys,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.cha = data.ruprocdeffhadmincha;
        			vm.edit = data.ruprocdeffhadminedit;	//编辑权限(激活or挂起)
        			vm.Delegate = data.Delegate;			//委派按钮权限
        			vm.Abolish = data.Abolish;				//作废按钮权限
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },
        
        //下载
        downloadModel: function (DEPLOYMENT_ID_){
        	window.location.href = httpurl + 'procdef/download?DEPLOYMENT_ID_='+DEPLOYMENT_ID_;
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