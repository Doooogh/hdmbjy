
var httpurl = httpurlSystem;

var vm = new Vue({
	el: '#app',
	
	data:{
		ROLE_ID: '',			//主键ID
		ROLE_NAME: '',			//名称
		PARENT_ID: '',			//上级ID
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('ROLE_ID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.ROLE_ID = FID;
        		this.getData();
        	}else{
        		this.PARENT_ID = this.getUrlKey('PARENT_ID');
        	}
        },
        
        //去保存
    	save: function (){
    		if(this.ROLE_NAME  == ""){
    			$("#ROLE_NAME").tips({
    				side:3,
    	            msg:'请输入名称',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.$refs.ROLE_NAME.focus();
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
					url: httpurl+'role/'+this.msg,
			    	data: {ROLE_ID:this.ROLE_ID,ROLE_NAME:this.ROLE_NAME,PARENT_ID:this.PARENT_ID,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	$("#fok").tips({
                				side:2,
                	            msg:'保存成功',
                	            bg:'#AE81FF',
                	            time:2
                	        });
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                         
                        }else if ("exception" == data.result){
                        	showException("按钮模块",data.exception);//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }
                    }
				}).done().fail(function(){
				   alert("登录失效!请求服务器无响应，稍后再试");
                   $("#showform").show();
           		   $("#jiazai").hide();
                });
    	},
    	
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'role/toEdit',
		    	data: {ROLE_ID:this.ROLE_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                       if("success" == data.result){
                       	vm.ROLE_NAME = data.pd.ROLE_NAME;			//名称
                       	vm.parent_id = data.pd.parent_id;			//上级ID
                       }else if ("exception" == data.result){
                    	   alert("角色模块异常"+data.exception);	 	//显示异常
                       	$("#showform").show();
                   		$("#jiazai").hide();
                       }
                   }
			}).done().fail(function(){
                  alert("登录失效!请求服务器无响应，稍后再试");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
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