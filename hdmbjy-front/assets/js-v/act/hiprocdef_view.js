
var httpurl = httpurlActiviti;

var vm = new Vue({
	el: '#app',
	
	data:{
		hitaskList: [],			//历史任务节点列表
		varList: [],			//流程变量列表
		PROC_INST_ID_: '',		//流程实例ID
		ID_: '',				//任务ID
		FILENAME: '',			//流程图文件名ID
		imgSrc: '',				//流程图base64数据
		loading:false			//加载状态
    },
    
    mixins: [formatDate],	//混入模块
    
	methods: {
		
        //初始执行
        init() {
        	this.PROC_INST_ID_ = this.getUrlKey('PROC_INST_ID_');	//链接参数
        	this.ID_ = this.getUrlKey('ID_');						//链接参数
        	this.FILENAME = this.getUrlKey('FILENAME');				//链接参数
       		this.getData();
        },
        
    	//进入页面获取数据
    	getData: function(){
    		this.loading = true;
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'hiprocdef/view',
		    	data: {PROC_INST_ID_:this.PROC_INST_ID_,ID_:this.ID_,FILENAME:this.FILENAME,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	 vm.hitaskList = data.hitaskList;
                    	 vm.varList = data.varList;
                    	 vm.imgSrc = data.imgSrc;
                    	 vm.loading = false;
                     }else if ("exception" == data.result){
                     	showException("流程信息",data.exception);	//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
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
        
      	//审批意见详情页
        details: function (htmlId){
        	 var content = $("#"+htmlId).val().split(',fh,');
        	 top.vm.handleDetails(content[1]);
        	 var diag = new top.Dialog();
        	 diag.Modal = false;			//有无遮罩窗口
        	 diag.Drag=true;
        	 diag.Title ="审批意见";
        	 diag. ShowMaxButton = true;	//最大化按钮
             diag.ShowMinButton = true;		//最小化按钮
        	 diag.URL = '../../act/rutask/handle_details.html';
        	 diag.Width = 760;
        	 diag.Height = 500;
        	 diag.CancelEvent = function(){ //关闭事件
        		diag.close();
        	 };
        	 diag.show();
        },

		//显示作废缘由
		showRe: function (ID){
			 $("#"+ID).show();
		},
		
		//隐藏作废缘由
		hideRe: function (ID){
			 $("#"+ID).hide();
		},
		
		formatDate: function (time){
        	let date = new Date(time);
        	return this.formatDateUtil(date, "yyyy-MM-dd hh:mm:ss");
        },
        
      	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }
		
	},
	
	mounted(){
        this.init();
    }
})
