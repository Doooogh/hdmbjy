
var httpurl = httpurlOa;

var vm = new Vue({
	el: '#app',
	
	data:{
		pd: [],	//存放字段参数
		TYPE: ''
    },
	
	methods: {
		
        //初始执行
        init() {
        	setTimeout(function(){
        		vm.getDic();
            },200);
        },
        
        //去保存
    	save: function (){
    		
    		this.pd.STARTTIME = $("#STARTTIME").val();
    		if(this.pd.STARTTIME  == '' || this.pd.STARTTIME == undefined){
    			$("#STARTTIME").tips({
    				side:3,
    				msg:'请输入开始时间',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.STARTTIME = '';
    			this.$refs.STARTTIME.focus();
    		return false;
    		}
    		this.pd.ENDTIME = $("#ENDTIME").val();
    		if(this.pd.ENDTIME  == '' || this.pd.ENDTIME == undefined){
    			$("#ENDTIME").tips({
    				side:3,
    				msg:'请输入结束时间',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.ENDTIME = '';
    			this.$refs.ENDTIME.focus();
    		return false;
    		}
    		if(this.TYPE  == ''){
    			$("#TYPE").tips({
    				side:3,
    				msg:'请选择请假类型',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.TYPE = '';
    			this.$refs.TYPE.focus();
    		return false;
    		}
    		if(this.pd.WHENLONG  == '' || this.pd.WHENLONG == undefined){
    			$("#WHENLONG").tips({
    				side:3,
    				msg:'请输入时长',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.WHENLONG = '';
    			this.$refs.WHENLONG.focus();
    		return false;
    		}
    		if(this.pd.REASON  == '' || this.pd.REASON == undefined){
    			$("#REASON").tips({
    				side:3,
    				msg:'请输入事由',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.REASON = '';
    			this.$refs.REASON.focus();
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
					url: httpurl+'myleave/add',
			    	data: {STARTTIME:this.pd.STARTTIME,
			    		ENDTIME:this.pd.ENDTIME,
			    		TYPE:this.TYPE,
			    		WHENLONG:this.pd.WHENLONG,
			    		REASON:this.pd.REASON,
			    		tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	top.vm.fhtaskmsg(data.ASSIGNEE_); //websocket即时通讯用于给待办人发送新任务消息 ，fhtaskmsg()函数 在 WebRoot\assets\js-v\index.js
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("errer" == data.result){
                        	swal("审批流启动失败!", "请联系管理员部署相应业务流程!", "warning");//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }else if ("exception" == data.result){
                        	showException("添加请假单",data.exception);//显示异常
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
    	
    	//调用数据字典(请假类型)
    	getDic: function(){
    		$.ajax({
    			xhrFields: {
    	            withCredentials: true
    	        },
    			type: "POST",
    			url: httpurlSystem+'dictionaries/getLevels',
    	    	data: {DICTIONARIES_ID:'6d30b170d4e348e585f113d14a4dd96d',tm:new Date().getTime()},//请假类型
    			dataType:'json',
    			success: function(data){
    				$("#TYPE").html('<option value="">请假类型</option>');
    				 $.each(data.list, function(i, dvar){
    					 $("#TYPE").append("<option value="+dvar.NAME+">"+dvar.NAME+"</option>");
    				 });
    			}
    		});
    	}
    	
	},
	
	mounted(){
        this.init();
    }
})