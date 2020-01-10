
var httpurl = httpurlActiviti;

var vm = new Vue({
	el: '#app',
	
	data:{
		ID_: '',		//流程ID
		ASSIGNEE_: ''	//代理人
    },
    
	methods: {
		
        //初始执行
        init() {
        	var ID_ = this.getUrlKey('ID_');	//链接参数
        	if(null != ID_){
        		this.ID_ = ID_;
        	}
        },
        
        //去保存
    	save: function (){
    		
    		if(this.ASSIGNEE_  == ''){
    			$("#ASSIGNEE_").tips({
    				side:3,
    				msg:'请选择委派对象',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.ASSIGNEE_ = '';
    			this.$refs.ASSIGNEE_.focus();
    		return false;
    		}

    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'ruprocdef/delegate',
			    	data: {ID_:this.ID_,ASSIGNEE_:this.ASSIGNEE_,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	top.vm.fhtaskmsg(data.ASSIGNEE_); //websocket即时通讯用于给待办人发送新任务消息 ，fhtaskmsg()函数 在 WebRoot\assets\js-v\index.js
                        	$("#ASSIGNEE_").tips({
                				side:3,
                				msg:'保存成功',
                	            bg:'#AE81FF',
                	            time:2
                	        });
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	alert("委任异常"+data.exception);//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }
                    }
				}).done().fail(function(){
                   alert("登录失效!请求服务器无响应,稍后再试");
                   $("#showform").show();
           		   $("#jiazai").hide();
                });
    	},
    	
    	//选择办理人
    	getUser: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="选择办理人";
    		 diag.URL = '../user/window_user_list.html';
    		 diag.Width = 800;
    		 diag.Height = 600;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮
    		 diag.CancelEvent = function(){ //关闭事件
    			 var USERNAME = diag.innerFrame.contentWindow.document.getElementById('USERNAME').value;
    			 if("" != USERNAME){
    				 vm.ASSIGNEE_ = USERNAME;
    			 }
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//选择角色
    	getRole: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="选择角色";
    		 diag.URL = '../role/window_role_list.html';
    		 diag.Width = 700;
    		 diag.Height = 545;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮
    		 diag.CancelEvent = function(){ //关闭事件
    			 var RNUMBER = diag.innerFrame.contentWindow.document.getElementById('RNUMBER').value;
    			 if("" != RNUMBER){
    				 vm.ASSIGNEE_ = RNUMBER;
    			 }
    			diag.close();
    		 };
    		 diag.show();
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