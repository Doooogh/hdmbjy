var vm = new Vue({
	el: '#app',
	
	data:{
		CONTRACT_ID: '',	//主键ID
		pd: [],						//存放字段参数
		TYPE: '',
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.CONTRACT_ID = FID;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (){
    		
			if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				$("#TITLE").tips({
					side:3,
		            msg:'请输入合同标题',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITLE = '';
				this.$refs.TITLE.focus();
			return false;
			}
			if(this.TYPE == ''){
				$("#TYPE").tips({
					side:3,
		            msg:'请输入合同类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}
			if(this.pd.CONTRACT_NUMBER == '' || this.pd.CONTRACT_NUMBER == undefined){
				$("#CONTRACT_NUMBER").tips({
					side:3,
		            msg:'请输入合同编号',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.CONTRACT_NUMBER = '';
				this.$refs.CONTRACT_NUMBER.focus();
			return false;
			}
			this.pd.START_TIME = $("#START_TIME").val();
			if(this.pd.START_TIME == '' || this.pd.START_TIME == undefined){
				$("#START_TIME").tips({
					side:3,
		            msg:'请输入起聘日期',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.START_TIME = '';
				this.$refs.START_TIME.focus();
			return false;
			}
			this.pd.END_TIME = $("#END_TIME").val();
			if(this.pd.END_TIME == '' || this.pd.END_TIME == undefined){
				$("#END_TIME").tips({
					side:3,
		            msg:'请输入终聘日期',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.END_TIME = '';
				this.$refs.END_TIME.focus();
			return false;
			}
			if(this.pd.CONTRACT_PATH == '' || this.pd.CONTRACT_PATH == undefined){
				$("#CONTRACT_PATH").tips({
					side:3,
		            msg:'请输入上传',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.CONTRACT_PATH = '';
				this.$refs.CONTRACT_PATH.focus();
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
					url: httpurl+'contract/'+this.msg,
			    	data: {CONTRACT_ID:this.CONTRACT_ID,
				    TITLE:this.pd.TITLE,
					TYPE:this.TYPE,
				    CONTRACT_NUMBER:this.pd.CONTRACT_NUMBER,
				    START_TIME:this.pd.START_TIME,
				    END_TIME:this.pd.END_TIME,
				    CONTRACT_PATH:this.pd.CONTRACT_PATH,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("合同管理",data.exception);//显示异常
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
				url: httpurl+'contract/goEdit',
		    	data: {CONTRACT_ID:this.CONTRACT_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.TYPE = data.pd.TYPE;
						$("#START_TIME").val(data.pd.START_TIME);
						$("#END_TIME").val(data.pd.END_TIME);
                     }else if ("exception" == data.result){
                     	showException("合同管理",data.exception);	//显示异常
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
					url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
			    	data: {DICTIONARIES_ID:'4aac84c1bba1414aa48473d1fcda9e5e'},
					dataType:'json',
					success: function(data){
						 $("#TYPE").append("<option value=''>请选择合同类型</option>");
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
				