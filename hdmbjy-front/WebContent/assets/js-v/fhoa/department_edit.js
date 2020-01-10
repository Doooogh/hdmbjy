
var httpurl = httpurlOa;

var vm = new Vue({
	el: '#app',
	
	data:{
		PARENT_ID: '',				//上级ID
		DEPARTMENT_ID: '',			//主键ID
		pd: [],						//存放字段参数
		pds: [],
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('DEPARTMENT_ID');	//链接参数
        	var P_ID = this.getUrlKey('PARENT_ID');
        	this.PARENT_ID = P_ID;
        	if(null != FID){
        		this.msg = 'edit';
        		this.DEPARTMENT_ID = FID;
        		setTimeout(function(){
        			$("#BIANMA").attr("disabled","disabled"); //禁止修改
                },1000);
        		this.getData();
        	}else{
        		this.getGoAdd();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (){
    		
			if(this.pd.NAME == '' | this.pd.NAME == undefined){
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
			if(this.pd.BZ == '' || this.pd.BZ == undefined){
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
			if(this.pd.HEADMAN == '' || this.pd.HEADMAN == undefined){
				$("#HEADMAN").tips({
					side:3,
		            msg:'请输入负责人',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.HEADMAN = '';
				this.$refs.HEADMAN.focus();
			return false;
			}
			if(this.pd.TEL == '' || this.pd.TEL == undefined){
				$("#TEL").tips({
					side:3,
		            msg:'请输入电话',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TEL = '';
				this.$refs.TEL.focus();
			return false;
			}
			if(this.pd.FUNCTIONS == '' || this.pd.FUNCTIONS == undefined){
				$("#FUNCTIONS").tips({
					side:3,
		            msg:'请输入部门职能',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FUNCTIONS = '';
				this.$refs.FUNCTIONS.focus();
			return false;
			}
			if(this.pd.ADDRESS == '' || this.pd.ADDRESS == undefined){
				$("#ADDRESS").tips({
					side:3,
		            msg:'请输入地址',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.ADDRESS = '';
				this.$refs.ADDRESS.focus();
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
					url: httpurl+'department/'+this.msg,
			    	data: {DEPARTMENT_ID:this.DEPARTMENT_ID,
			    	PARENT_ID:this.PARENT_ID,
			    	NAME:this.pd.NAME,
				    NAME_EN:this.pd.NAME_EN,
				    BIANMA:this.pd.BIANMA,
				    BZ:this.pd.BZ,
				    HEADMAN:this.pd.HEADMAN,
				    TEL:this.pd.TEL,
				    FUNCTIONS:this.pd.FUNCTIONS,
				    ADDRESS:this.pd.ADDRESS,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("组织机构",data.exception);//显示异常
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
			if(this.pd.BIANMA == '' || this.pd.BIANMA == undefined)return;
			$.ajax({
				xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'department/hasBianma',
		    	data: {BIANMA:this.pd.BIANMA,tm:new Date().getTime()},
				dataType:'json',
				success: function(data){
					 if("error" == data.result){
						 $("#BIANMA").tips({
								side:1,
					            msg:'编码'+vm.pd.BIANMA+'已存在,重新输入',
					            bg:'#AE81FF',
					            time:5
					        });
							vm.pd.BIANMA = '';
					 }
				}
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
				url: httpurl+'department/goEdit',
		    	data: {DEPARTMENT_ID:this.DEPARTMENT_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     	vm.pds = data.pds;
                     }else if ("exception" == data.result){
                     	showException("组织机构",data.exception);	//显示异常
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
				url: httpurl+'department/goAdd',
		    	data: {DEPARTMENT_ID:this.PARENT_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                       if("success" == data.result){
                       	 	vm.pds = data.pds;
                       }else if ("exception" == data.result){
	                       	showException("组织机构",data.exception);	//显示异常
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
