
var httpurl = httpurlSystem;

var vm = new Vue({
	el: '#app',
	
	data:{
		pd: []				//存放字段参数
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.getData();
        },
        
        //去保存
    	goSave: function (){
    		if(this.pd.sysName == ""){
    			$("#sysName").tips({
    				side:3,
    	            msg:'输入系统名称',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.sysName.focus();
    			return false;
    		}
    		if(this.pd.showCount == ""){
    			$("#showCount").tips({
    				side:3,
    	            msg:'输入每页条数',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.showCount.focus();
    			return false;
    		}else if(!(this.pd.showCount > 0)){
    			$("#showCount").tips({
    				side:3,
    	            msg:'每页条数不能小于1',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.showCount.focus();
    			return false;
    		}
    		if(this.pd.SMTP == ""){
    			$("#SMTP").tips({
    				side:3,
    	            msg:'输入SMTP',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.SMTP.focus();
    			return false;
    		}
    		if(this.pd.PORT == ""){
    			$("#PORT").tips({
    				side:3,
    	            msg:'输入端口',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.PORT.focus();
    			return false;
    		}else if(!(this.pd.PORT > 0)){
    			$("#PORT").tips({
    				side:3,
    	            msg:'端口不能小于1',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.PORT.focus();
    			return false;
    		}
    		if(this.pd.EMAIL == ""){
    			$("#EMAIL").tips({
    				side:3,
    	            msg:'输入邮箱',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.EMAIL.focus();
    			return false;
    		}
    		if(this.pd.PAW == ""){
    			$("#PAW").tips({
    				side:3,
    	            msg:'输入密码',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.PAW.focus();
    			return false;
    		}
    		if(this.pd.onlineIp == ""){
    			$("#onlineIp").tips({
    				side:3,
    	            msg:'输入IP地址',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.onlineIp.focus();
    			return false;
    		}
    		if(this.pd.onlinePort == ""){
    			$("#onlinePort").tips({
    				side:3,
    	            msg:'输入端口',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.onlinePort.focus();
    			return false;
    		}else if(!(this.pd.onlinePort > 0)){
    			$("#onlinePort").tips({
    				side:3,
    	            msg:'端口不能小于1',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.onlinePort.focus();
    			return false;
    		}
    		if(this.pd.imIp == ""){
    			$("#imIp").tips({
    				side:3,
    	            msg:'输入IP地址',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.imIp.focus();
    			return false;
    		}
    		if(this.pd.imPort == ""){
    			$("#imPort").tips({
    				side:3,
    	            msg:'输入端口',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.imPort.focus();
    			return false;
    		}else if(!(this.pd.imPort > 0)){
    			$("#imPort").tips({
    				side:3,
    	            msg:'端口不能小于1',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.imPort.focus();
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
					url: httpurl+'head/saveSysSet',
			    	data: {sysName:this.pd.sysName,
			    		showCount:this.pd.showCount,
			    		onlineIp:this.pd.onlineIp,
			    		onlinePort:this.pd.onlinePort,
			    		imIp:this.pd.imIp,
			    		imPort:this.pd.imPort,
			    		fhsmsSound:this.pd.fhsmsSound,
			    		SMTP:this.pd.SMTP,
			    		PORT:this.pd.PORT,
			    		EMAIL:this.pd.EMAIL,
			    		PAW:this.pd.PAW,
			    		tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
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
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                   $("#showform").show();
           		   $("#jiazai").hide();
                });
    	},
    	
    	//获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'head/sysSet',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("系统设置",data.exception);	//显示异常
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
    	
    	//设置站内信声音提示类型
    	setFhsmsSoundType: function (type){
    		if('m0' != type){
    			$("#fhsmsobjsys").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+type+'.mp3" autoplay controls></audio>');
    		}
    	}
        
	},
	
	mounted(){
        this.init();
    }
})



//QQ313596790