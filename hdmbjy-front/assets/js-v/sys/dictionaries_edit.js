
var httpurl = httpurlSystem;

var vm = new Vue({
	el: '#app',
	
	data:{
		PARENT_ID: '',		//上级ID
		DICTIONARIES_ID: '',//主键ID
		checked:false,
		msg:'add',
		pds: [],
		pd: []
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('DICTIONARIES_ID');
        	var P_ID = this.getUrlKey('PARENT_ID');
        	this.PARENT_ID = P_ID;
        	if(null != FID){
        		this.msg = 'edit';
        		this.DICTIONARIES_ID = FID;
        		this.getData();
        	}else{
        		this.getGoAdd();
        	}
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
			if(this.pd.NAME_EN == '' || this.pd.NAME_EN == undefined){
				$("#NAME_EN").tips({
					side:3,
		            msg:'请输入英文',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NAME_EN = '';
				this.$refs.NAME_EN.focus();
			return false;
			}
			if(this.pd.BIANMA == '' || this.pd.BIANMA == undefined){
				$("#BIANMA").tips({
					side:3,
		            msg:'请输入编码',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.BIANMA = '';
				this.$refs.BIANMA.focus();
			return false;
			}
			if(this.pd.ORDER_BY == '' || this.pd.ORDER_BY == undefined){
				$("#ORDER_BY").tips({
					side:3,
		            msg:'请输入数字',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.ORDER_BY = '';
				this.$refs.ORDER_BY.focus();
			return false;
			}
			
			if(this.checked){
				this.pd.YNDEL = 'yes';
			}else{
				this.pd.YNDEL = 'no';
			}

    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'dictionaries/'+this.msg,
			    	data: {PARENT_ID:this.PARENT_ID,DICTIONARIES_ID:this.DICTIONARIES_ID,NAME:this.pd.NAME,NAME_EN:this.pd.NAME_EN,BIANMA:this.pd.BIANMA,ORDER_BY:this.pd.ORDER_BY,BZ:this.pd.BZ,TBSNAME:this.pd.TBSNAME,TBFIELD:this.pd.TBFIELD,YNDEL:this.pd.YNDEL,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("数据字典",data.exception);//显示异常
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
    	
    	//根据主键ID获取数据(新增时)
    	getGoAdd: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'dictionaries/goAdd',
		    	data: {DICTIONARIES_ID:this.PARENT_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                       if("success" == data.result){
                       	 	vm.pds = data.pds;
                       }else if ("exception" == data.result){
	                       	showException("数据字典",data.exception);	//显示异常
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
    	
    	//根据主键ID获取数据(修改时)
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'dictionaries/goEdit',
		    	data: {DICTIONARIES_ID:this.DICTIONARIES_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	vm.pds = data.pds;
                     	vm.pd = data.pd;							
                     }else if ("exception" == data.result){
                     	showException("数据字典",data.exception);	//显示异常
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
    	
    	//判断编码是否存在
		hasBianma: function (){
			var BIANMA = this.pd.BIANMA;
			if("" == BIANMA)return;
			$.ajax({
				xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'dictionaries/hasBianma',
		    	data: {BIANMA:BIANMA,tm:new Date().getTime()},
				dataType:'json',
				success: function(data){
					 if("success" == data.result){
					 }else if ("exception" == data.result){
	                     	showException("数据字典",data.exception);	//显示异常
	                     	$("#showform").show();
	                 		$("#jiazai").hide();
	                 }else{
						$("#BIANMA").tips({
							side:1,
				            msg:'编码'+BIANMA+'已存在,重新输入',
				            bg:'#AE81FF',
				            time:5
				        });
						vm.pd.BIANMA = '';
					 }
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