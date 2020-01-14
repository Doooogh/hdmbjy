var isok = false;

/*Vue.component('treeselect', VueTreeselect.Treeselect);*/

var vm = new Vue({
	el: '#app',
	
	data:{
		USER_ID: '',		//主键ID
		ROLE_IDS: '',		//副职角色ID
		PASSWORD: '',		//密码
		chkpwd:	'',			//确认密码
		DEP_ID:	'',			
		roleList: [],		//角色列表
		pd: [],				//存放字段参数
		fx: 'user',			//来路
		msg:'saveUser',
		USERNAME: '',
		value: null,
        valueConsistsOf: 'LEAF_PRIORITY',
        // define options
//        options1: [ {
//            id: 'a',
//            label: 'a',
//            children: [ {
//              id: 'aa',
//              label: 'aa',
//            }, {
//              id: 'ab',
//              label: 'ab',
//            } ],
//          }, {
//            id: 'b',
//            label: 'b',
//          }, {
//            id: 'c',
//            label: 'c',
//          } ]
        options1:[],
        DEPARTMENT_ID:''    //部门id
    },
    
    
    
    
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('USER_ID');			//当接收过来的FID不为null时,表示此页面是修改进来的
        	var USERNAME = this.getUrlKey('USERNAME');		//当不为空时，是从在线管理里面进入
        	if(null != FID){
        		this.msg = 'editUser';
        		this.USER_ID = FID;
        		this.getData();
        		//添加两行代码,1.填充部门id;2.填充部门名称,
        		//this.setDepartmentIdAndName(this.DEPARTMENT_ID,"1212");
        		setTimeout(function(){
        			$("#USERNAME").attr("readonly","readonly"); //用户名禁止修改
                },1000);
        	}else if(null != this.getUrlKey('fx')){			//从个人资料中进
        		this.fx = 'head';
        		this.msg = 'editUserOwn';
        		this.getEditMyInfo();
        		setTimeout(function(){
        			$("#USERNAME").attr("readonly","readonly"); //用户名禁止修改
                },1000);
        	}else if(null != USERNAME){						//从在线管理处进
        		this.msg = 'editUser';
        		this.USERNAME = USERNAME;
        		this.getDataFromOnline();
        		setTimeout(function(){
        			$("#USERNAME").attr("readonly","readonly"); //用户名禁止修改
                },1000);
        	}else{	//新增进
        		this.getRoleList();
        	}
        	this.getDepartmentList();
        },
      //后台返回的数据如果和VueTreeselect要求的数据结构不同，需要进行转换
        normalizer(node){
            //去掉children=[]的children属性
            if(node.children && !node.children.length){
                delete node.children;
            }
            return {
                id: node.id,
                label:node.label,
                children:node.children
            }
        },
        //获取结构列表
        getDepartmentList: function () {
//            this.$http.post("/department/listTree").then(function (response) {
//                this.options1 = response.zTreeNodes;
//            })
        	
             $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'department/listTreeForUser?msg='+this.msg,
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.options1 = eval(data.zTreeNodes);				//机构列表
                     	vm.msg = data.msg;
                     }
                  }
			})
        },
        
        
        
        
        //去保存
    	save: function (){
    		if(this.fx != 'head'){
    			this.pd.ROLE_ID = $("#ROLE_ID").val();
        		this.ROLE_IDS = $("#ZROLE_IDS").val()+'';
        		if('saveUser' != this.msg){
        			this.pd.DEPARTMENT_ID = vm.DEP_ID;
        		}else{
        			this.pd.DEPARTMENT_ID = $('input[name="DEPARTMENT_ID"]').val();
        		}
        		
        		if(null == this.pd.ROLE_ID)this.pd.ROLE_ID = '';
        		if('null' == this.ROLE_IDS)this.ROLE_IDS = '';
    		}
    		/*if(this.pd.DEPARTMENT_ID != '-1'){
    			if(this.pd.DEPARTMENT_ID == '' || this.pd.DEPARTMENT_ID == undefined){
        			$("#DEPARTMENT_IDDIV").tips({
        				side:3,
        	            msg:'选择部门',
        	            bg:'#AE81FF',
        	            time:2
        	        });
        			return false;
        		}
    		}*/
    		
    	/* 	if(this.pd.ROLE_ID == ''){
    			$("#ROLE_IDts").tips({
    				side:3,
    	            msg:'选择主职角色',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			return false;
    		} */
    		if(this.pd.USERNAME == '' || this.pd.USERNAME == undefined || this.pd.USERNAME == '此用户名已存在!'){
    			$("#USERNAME").tips({
    				side:3,
    	            msg:'输入用户名',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.USERNAME = '';
    			this.$refs.USERNAME.focus();
    			return false;
    		}
    	/* 	if(this.pd.NUMBER == '' || this.pd.NUMBER == undefined){
    			$("#NUMBER").tips({
    				side:3,
    	            msg:'输入编号',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.pd.NUMBER = '';
    			this.$refs.NUMBER.focus();
    			return false;
    		} */
    		if(this.USER_ID == '' && this.PASSWORD == ''){
    			$("#PASSWORD").tips({
    				side:3,
    	            msg:'输入密码',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.USER_ID = '';
    			this.$refs.PASSWORD.focus();
    			return false;
    		}
    		if(this.PASSWORD != this.chkpwd){
    			$("#chkpwd").tips({
    				side:3,
    	            msg:'两次密码不相同',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.chkpwd.focus();
    			return false;
    		}
    		if(this.pd.NAME == '' || this.pd.NAME == undefined){
    			$("#NAME").tips({
    				side:3,
    	            msg:'输入姓名',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.pd.NAME = '';
    			this.$refs.NAME.focus();
    			return false;
    		}
    		var myreg = /^(((13[0-9]{1})|159)+\d{8})$/;
    		if(this.pd.PHONE == '' || this.pd.PHONE == undefined){
    			$("#PHONE").tips({
    				side:3,
    	            msg:'输入手机号',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.pd.PHONE = '';
    			this.$refs.PHONE.focus();
    			return false;
    		}else if(this.pd.PHONE.length != 11 && !myreg.test(this.pd.PHONE)){
    			$("#PHONE").tips({
    				side:3,
    	            msg:'手机号格式不正确',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.PHONE.focus();
    			return false;
    		}
    		if(this.pd.EMAIL == '' || this.pd.EMAIL == undefined){
    			$("#EMAIL").tips({
    				side:3,
    	            msg:'输入邮箱',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.pd.EMAIL = '';
    			this.$refs.EMAIL.focus();
    			return false;
    		}else if(!this.ismail(this.pd.EMAIL)){
    			$("#EMAIL").tips({
    				side:3,
    	            msg:'邮箱格式不正确',
    	            bg:'#AE81FF',
    	            time:3
    	        });
    			this.$refs.EMAIL.focus();
    			return false;
    		}
    		
    		if(this.USER_ID == ''){
    			this.hasUser();	//判断用户名是否存在，只在新增的时候判断
    		}else{
    			isok = true;
    		}
			
    		if(!isok)return;
    		
    		$("#showform").hide();
    		$("#jiazai").show();
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'user/'+this.msg,
			    	data: {
			    		USER_ID:this.USER_ID,
			    		ROLE_ID:this.pd.ROLE_ID,
			    		ROLE_IDS:this.ROLE_IDS,
			    		USERNAME:this.pd.USERNAME,
			    		NUMBER:this.pd.NUMBER,
			    		PASSWORD:this.PASSWORD,
			    		NAME:this.pd.NAME,
			    		PHONE:this.pd.PHONE,
			    		EMAIL:this.pd.EMAIL,
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
                        	showException("系统用户",data.exception);//显示异常
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
    	
    	//判断用户名是否存在
    	hasUser: function (){
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'user/hasUser',
    	    	data: {USERNAME:this.pd.USERNAME,tm:new Date().getTime()},
    			dataType:'json',
    			async: false,	//加这句，ajax为同步
    			success: function(data){
    				 if("success" == data.result){
    					 isok = true;
    				 }else{
    					$("#USERNAME").tips({
    						side:3,
    			            msg:'此用户名已存在',
    			            bg:'#AE81FF',
    			            time:2
    			        });
    					setTimeout(function(){
    						vm.pd.USERNAME = '此用户名已存在!'
    						vm.$refs.USERNAME.focus();
                        },500);
    				 }
    			}
    		});
    	},
    	
    	//判断邮箱是否存在
    	hasEmail: function (){
    		if(this.pd.EMAIL == '')return false;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'user/hasEmail',
    	    	data: {EMAIL:this.pd.EMAIL,USERNAME:this.pd.USERNAME,tm:new Date().getTime()},
    			dataType:'json',
    			success: function(data){
    				 if("success" != data.result){
    					 $("#EMAIL").tips({
    							side:3,
    				            msg:'邮箱 '+vm.pd.EMAIL+' 已存在',
    				            bg:'#AE81FF',
    				            time:3
    				        });
    					 vm.pd.EMAIL = '';
    					 vm.$refs.EMAIL.focus();
    				 }
    			}
    		});
    	},
    	
    	//判断编码是否存在
    	hasNumber: function (){
    		if(this.pd.NUMBER == '')return false;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'user/hasNumber',
    	    	data: {NUMBER:this.pd.NUMBER,USERNAME:this.pd.USERNAME,tm:new Date().getTime()},
    			dataType:'json',
    			success: function(data){
    				 if("success" != data.result){
    					 $("#NUMBER").tips({
    							side:3,
    				            msg:'编号 '+vm.pd.NUMBER+' 已存在',
    				            bg:'#AE81FF',
    				            time:3
    				        });
    					 vm.pd.NUMBER = '';
    					 vm.$refs.NUMBER.focus();
    				 }
    			}
    		});
    	},
    	
    	ismail: function(mail){
    		return(new RegExp(/^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/).test(mail));
    	},
    	
    	//新增时获取角色列表
    	getRoleList: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'user/goAddUser',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.roleList = data.roleList;				//角色列表
                     }else if ("exception" == data.result){
                     	showException("系统用户",data.exception);	//显示异常
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
				url: httpurl+'user/goEditUser',
		    	data: {USER_ID:this.USER_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	vm.roleList = data.roleList;				//角色列表
                    	vm.USER_ID = data.pd.USER_ID;				//主职角色ID
                    	vm.ROLE_IDS = data.pd.ROLE_IDS;				//副职角色ID
                    	vm.DEPARTMENT_ID = data.pd.DEPARTMENT_ID;	//部门id
                    	if (data.pd.DEPARTMENT_ID != null && data.pd.DEPARTMENT_ID !='') {
                    		vm.value = data.pd.DEPARTMENT_ID;
                    		vm.DEP_ID = data.pd.DEPARTMENT_ID;
						}
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("系统用户",data.exception);	//显示异常
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
    	
    	/*//添加两行代码,设置值,1.填充部门id;2.填充部门名称,
    	setDepartmentIdAndName: function(deptid,deptname){
    		var idhtml="<input type='hidden' name='DEPARTMENT_ID' value='"+deptid+"'/>";
    		$(".vue-treeselect--single").append(idhtml);
    		var namehtml="<div class='vue-treeselect__single-value'>"+deptname+"</div>";
    		$(".vue-treeselect__value-container").append(namehtml);
    	},*/
    	
    	//从修改个人资料
    	getEditMyInfo: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'user/goEditMyInfo',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	vm.roleList = data.roleList;				//角色列表
                    	vm.USER_ID = data.pd.USER_ID;				//主职角色ID
                    	vm.ROLE_IDS = data.pd.ROLE_IDS;				//副职角色ID
                     	vm.pd = data.pd;							//参数map
                     	if (data.pd.DEPARTMENT_ID  != '-1') {
                    		vm.value = data.pd.DEPARTMENT_ID;
                    		vm.DEP_ID = data.pd.DEPARTMENT_ID;
						}
                     }else if ("exception" == data.result){
                     	showException("系统用户",data.exception);	//显示异常
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
    	
    	//根据用户名获取数据
    	getDataFromOnline: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'user/goEditUfromOnline',
		    	data: {USERNAME:this.USERNAME,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	vm.roleList = data.roleList;				//角色列表
                    	vm.USER_ID = data.pd.USER_ID;				//主职角色ID
                    	vm.ROLE_IDS = data.pd.ROLE_IDS;				//副职角色ID
                     	vm.pd = data.pd;							//参数map
                     	if (data.pd.DEPARTMENT_ID != null && data.pd.DEPARTMENT_ID !='') {
                    		vm.value = data.pd.DEPARTMENT_ID;
                    		vm.DEP_ID = data.pd.DEPARTMENT_ID;
						}
                     }else if ("exception" == data.result){
                     	showException("系统用户",data.exception);	//显示异常
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
    	
    	//判断机构是否已选择
         hasValue: function(){
    		var DEPARTMENT_ID = vm.value
    		if(vm.value == '' || vm.value == undefined)return;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'user/hasValue',
    	    	data: {DEPARTMENT_ID:DEPARTMENT_ID,tm:new Date().getTime()},
    			dataType:'json',
    			async: false,	//加这句，ajax为同步
    			success: function(data){
    				 if("success" == data.result){
    					 isok = true;
    				 }else{
    					$("#DEPARTMENT_IDDIV").tips({
    						side:3,
    			            msg:'此机构已有负责人',
    			            bg:'#AE81FF',
    			            time:2
    			        });
    					 vm.value = null;
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