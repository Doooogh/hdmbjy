var vm = new Vue({
	el: '#app',
	
	data:{
		SUPERVISE_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.SUPERVISE_ID = FID;
        		this.getData();
        	}
        },
        
        //去保存
    	save: function (){
			if(this.pd.SORT == '' || this.pd.SORT == undefined){
				$("#SORT").tips({
					side:3,
		            msg:'请输入排序',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.SORT = '';
				this.$refs.SORT.focus();
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
					url: httpurl+'supervise/editSort',
			    	data: {SUPERVISE_ID:this.SUPERVISE_ID,
			    	SORT:this.pd.SORT,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	$("#SORT").tips({
                				side:3,
                	            msg:'保存成功',
                	            bg:'#AE81FF',
                	            time:2
                	        });
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("日常监管",data.exception);//显示异常
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
    	
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'supervise/goEdit',
		    	data: {SUPERVISE_ID:this.SUPERVISE_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("日常监管",data.exception);	//显示异常
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