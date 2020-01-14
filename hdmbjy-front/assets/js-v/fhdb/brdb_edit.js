
var httpurl = httpurlDbmanage;

var vm = new Vue({
	el: '#app',
	
	data:{
		FHDB_ID: '',	//主键ID
		pd: []			//存放字段参数
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FHDB_ID = this.getUrlKey('FHDB_ID');	//链接参数
        	if(null != FHDB_ID){
        		this.FHDB_ID = FHDB_ID;
        		this.getData();
        	}
        },
        
        //去保存
    	save: function (){
    		if(this.pd.BZ  == '' || this.pd.BZ == undefined){
    			$("#BZ").tips({
    				side:3,
    	            msg:'请输入备注',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.BZ = '';
    			this.$refs.BZ.focus();
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
					url: httpurl+'brdb/edit',
			    	data: {FHDB_ID:this.FHDB_ID,BZ:this.pd.BZ,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	$("#BZ").tips({
                				side:3,
                	            msg:'保存成功',
                	            bg:'#AE81FF',
                	            time:2
                	        });
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	alert("数据库还原模块"+data.exception);		//显示异常
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
				url: httpurl+'brdb/goEdit',
		    	data: {FHDB_ID:this.FHDB_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                    	alert("数据库还原模块"+data.exception);		//显示异常
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