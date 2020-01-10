
var httpurl = httpurlIm;

var vm = new Vue({
	el: '#app',
	
	data:{
		FGROUP_ID: '',		//主键ID
		pd: [],				//存放字段参数
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FGROUP_ID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.FGROUP_ID = FID;
        		this.getData();
        	}
        },
        
        //去保存
    	save: function (){
    		if(this.pd.NAME  == '' || this.pd.NAME == undefined){
    			$("#NAME").tips({
    				side:3,
    	            msg:'请输入名称',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.NAME = '';
    			this.$refs.NAME.focus();
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
					url: httpurl+'fgroup/'+this.msg,
			    	data: {FGROUP_ID:this.FGROUP_ID,NAME:this.pd.NAME,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	$("#NAME").tips({
                				side:3,
                	            msg:'保存成功',
                	            bg:'#AE81FF',
                	            time:2
                	        });
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	alert("好友分组"+data.exception);//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }
                    }
				}).done().fail(function(){
					alert("登录失效! 请求服务器无响应，稍后再试");
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
				url: httpurl+'fgroup/goEdit',
		    	data: {FGROUP_ID:this.FGROUP_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                    	 alert("好友分组"+data.exception);//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
				  alert("登录失效! 请求服务器无响应，稍后再试");
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