
var httpurl = httpurlActiviti;

var vm = new Vue({
	el: '#app',
	
	data:{
		ID_: '',			//主键ID
		category: ''		//分分类
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('ID_');	//链接参数
        	if(null != FID){
        		this.ID_ = FID;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (){
    		if(this.category  == ''){
    			$("#category").tips({
    				side:3,
    	            msg:'请选择分类',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.category = '';
    			this.$refs.category.focus();
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
					url: httpurl+'fhmodel/edit',
			    	data: {ID_:this.ID_,category:this.category,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	$("#category").tips({
                				side:3,
                	            msg:'保存成功',
                	            bg:'#AE81FF',
                	            time:2
                	        });
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	alert("流程分类"+data.exception);			//显示异常
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
				url: httpurl+'fhmodel/goEdit',
		    	data: {ID_:this.ID_,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.category = data.pd.CATEGORY_;	
                     }else if ("exception" == data.result){
                    	alert("流程分类"+data.exception);			//显示异常
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
    	
    	//获取数据字典
    	getDict: function (){
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurlSystem+'dictionaries/getLevels?tm='+new Date().getTime(),
    			data: {DICTIONARIES_ID:'act001'},//act001 为工作流分类
    			dataType:'json',
    			success: function(data){
    				 $("#category").append("<option value=''>请选择分类</option>");
    				 $.each(data.list, function(i, dvar){
    					 if(vm.category == dvar.BIANMA){
    						 $("#category").append("<option value="+dvar.BIANMA+" selected='selected'>"+dvar.NAME+"</option>");
    					 }else{
    	    				$("#category").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
    					 }
    				 });
    			}
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