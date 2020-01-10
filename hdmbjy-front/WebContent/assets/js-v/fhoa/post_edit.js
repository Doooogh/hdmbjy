var vm = new Vue({
	el: '#app',
	
	data:{
		POST_ID: '',	//主键ID
		TYPE: '',          //岗位类型
		pd: [],						//存放字段参数
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.POST_ID = FID;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (){
    		
			if(this.pd.NAME == '' || this.pd.NAME == undefined){
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
			
			if(this.TYPE == ''){
				$("#TYPE").tips({
					side:3,
		            msg:'请输入岗位类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TYPE = '';
				this.$refs.TYPE.focus();
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
					url: httpurl+'post/'+this.msg,
			    	data: {POST_ID:this.POST_ID,
				    NAME:this.pd.NAME,
				    TYPE:this.TYPE,
				    BZ:this.pd.BZ,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("岗位",data.exception);//显示异常
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
				url: httpurl+'post/goEdit',
		    	data: {POST_ID:this.POST_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     	vm.TYPE = data.pd.TYPE;							//参数map
                     }else if ("exception" == data.result){
                     	showException("岗位",data.exception);	//显示异常
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
    	
    	//获取数据字典数据
		getDict: function (){
			$.ajax({
				xhrFields: {
                withCredentials: true
            	},
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn?tm='+new Date().getTime(),
		    	data: {NAME_EN:'post'},
				dataType:'json',
				success: function(data){
					 $("#TYPE").append("<option value=''>请选择岗位类型</option>");
					 $.each(data.list, function(i, dvar){
						 if(vm.TYPE == dvar.BIANMA){
						  	$("#TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
						 }else{
							$("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
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