
var httpurl = httpurlActiviti;

var vm = new Vue({
	el: '#app',
	
	data:{
		modelname: '',			//模型名称
		category: '',			//模型分类
		description: '',		//模型描述
		name: '',				//流程名称
		process_id: '',			//流程标识
		process_author: ''		//流程作者
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.getAuthor();
        	this.getDic();
        },
        
    	//调用数据字典
    	getDic: function(){
    		//流程分类
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurlSystem+'dictionaries/getLevels?tm='+new Date().getTime(),
    	    	data: {DICTIONARIES_ID:'act001'},//act001 为工作流分类
    			dataType:'json',
    			success: function(data){
    				$("#category").html('<option value="" >请选择分类</option>');
    				 $.each(data.list, function(i, dvar){
    						$("#category").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
    				 });
    			}
    		});
    		//流程标识
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurlSystem+'dictionaries/getLevels?tm='+new Date().getTime(),
    	    	data: {DICTIONARIES_ID:'act002'},//act002为流程标识
    			dataType:'json',
    			success: function(data){
    				$("#process_id").html('<option value="" >请选择流程标识</option>');
    				 $.each(data.list, function(i, dvar){
    						$("#process_id").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"("+dvar.BIANMA+")"+"</option>");
    				 });
    			}
    		});
    	},
    	
    	//获取当前用户
    	getAuthor: function(){
    		//流程标识
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'fhmodel/getAuthor',
    	    	data: {tm:new Date().getTime()},
    			dataType:'json',
    			success: function(data){
    				if("success" == data.result){
                    	vm.process_author = data.process_author;
                    }else if ("exception" == data.result){
                    	showException("新增流程",data.exception);//显示异常
                    }
    			}
    		}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
             });
    	},
    	
    	//保存
    	goAdd: function (){
    		if(this.modelname  == ''){
    			$("#modelname").tips({
    				side:3,
    	            msg:'请输入模型名称',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.modelname = '';
    			this.$refs.modelname.focus();
    		return false;
    		}
    		if(this.category  == ''){
    			$("#category").tips({
    				side:3,
    	            msg:'请输入模型分类',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.category = '';
    			this.$refs.category.focus();
    		return false;
    		}
    		if(this.description  == ''){
    			$("#description").tips({
    				side:3,
    	            msg:'请输入模型描述',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.description = '';
    			this.$refs.description.focus();
    		return false;
    		}
    		if(this.name  == ''){
    			$("#name").tips({
    				side:3,
    	            msg:'请输入流程名称',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.name = '';
    			this.$refs.name.focus();
    		return false;
    		}
    		if(this.process_id  == ''){
    			$("#process_id").tips({
    				side:3,
    	            msg:'请选择流程标识',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.process_id = '';
    			this.$refs.process_id.focus();
    		return false;
    		}
    		if(this.process_author  == ''){
    			$("#process_author").tips({
    				side:3,
    	            msg:'请输入流程作者',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.process_author = '';
    			this.$refs.process_author.focus();
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
					url: httpurl+'fhmodel/add',
			    	data: {modelname:this.modelname,category:this.category,description:this.description,name:this.name,process_id:this.process_id,process_author:this.process_author,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	$("#sunval").val(data.sunval);
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("新增流程模型",data.exception);//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                   $("#showform").show();
           		   $("#jiazai").hide();
                });
    	}

	},
	
	mounted(){
        this.init();
    }
})
