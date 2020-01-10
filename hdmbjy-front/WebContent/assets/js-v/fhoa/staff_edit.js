
var httpurl = httpurlOa;

var vm = new Vue({
	el: '#app',
	
	data:{
		STAFF_ID: '',		//主键ID
		pd: [],				//存放字段参数
		DEPARTMENT_ID:'',	//部门ID
		SEX: '男',
		MARITAL: '未婚',
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.STAFF_ID = FID;
        		this.getData();
        	}else{
        		this.goAdd();
        	}
        },
        
        //去保存
    	save: function (){
    		
			if(this.pd.NAME == '' || this.pd.NAME == undefined){
				$("#NAME").tips({
					side:3,
		            msg:'请输入姓名',
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
			if(this.DEPARTMENT_ID == '' || this.DEPARTMENT_ID == undefined){
				$("#selectTree").tips({
					side:3,
		            msg:'请选择部门',
		            bg:'#AE81FF',
		            time:2
		        });
				this.DEPARTMENT_ID = '';
				$("#st").focus();
			return false;
			}
			if(this.pd.FUNCTIONS == '' || this.pd.FUNCTIONS == undefined){
				$("#FUNCTIONS").tips({
					side:3,
		            msg:'请输入职责',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FUNCTIONS = '';
				this.$refs.FUNCTIONS.focus();
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
			if(this.pd.EMAIL == '' || this.pd.EMAIL == undefined){
				$("#EMAIL").tips({
					side:3,
		            msg:'请输入邮箱',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.EMAIL = '';
				this.$refs.EMAIL.focus();
			return false;
			}
			this.pd.BIRTHDAY = $("#BIRTHDAY").val();
			if(this.pd.BIRTHDAY == '' || this.pd.BIRTHDAY == undefined){
				$("#BIRTHDAY").tips({
					side:3,
		            msg:'请输入出生日期',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.BIRTHDAY = '';
				this.$refs.BIRTHDAY.focus();
			return false;
			}
			if(this.pd.NATION == '' || this.pd.NATION == undefined){
				$("#NATION").tips({
					side:3,
		            msg:'请输入民族',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NATION = '';
				this.$refs.NATION.focus();
			return false;
			}
			if(this.pd.JOBTYPE == '' || this.pd.JOBTYPE == undefined){
				$("#JOBTYPE").tips({
					side:3,
		            msg:'请输入岗位类别',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.JOBTYPE = '';
				this.$refs.JOBTYPE.focus();
			return false;
			}
			this.pd.JOBJOINTIME = $("#JOBJOINTIME").val();
			if(this.pd.JOBJOINTIME == '' || this.pd.JOBJOINTIME == undefined){
				$("#JOBJOINTIME").tips({
					side:3,
		            msg:'请输入参加工作时间',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.JOBJOINTIME = '';
				this.$refs.JOBJOINTIME.focus();
			return false;
			}
			if(this.pd.FADDRESS == '' || this.pd.FADDRESS == undefined){
				$("#FADDRESS").tips({
					side:3,
		            msg:'请输入籍贯',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FADDRESS = '';
				this.$refs.FADDRESS.focus();
			return false;
			}
			if(this.pd.POLITICAL == '' || this.pd.POLITICAL == undefined){
				$("#POLITICAL").tips({
					side:3,
		            msg:'请输入政治面貌',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.POLITICAL = '';
				this.$refs.POLITICAL.focus();
			return false;
			}
			this.pd.PJOINTIME = $("#PJOINTIME").val();
			if(this.pd.PJOINTIME == '' || this.pd.PJOINTIME == undefined){
				$("#PJOINTIME").tips({
					side:3,
		            msg:'请输入入团时间',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.PJOINTIME = '';
				this.$refs.PJOINTIME.focus();
			return false;
			}
			if(this.pd.SFID == '' || this.pd.SFID == undefined){
				$("#SFID").tips({
					side:3,
		            msg:'请输入身份证号',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.SFID = '';
				this.$refs.SFID.focus();
			return false;
			}
			this.pd.DJOINTIME = $("#DJOINTIME").val();
			if(this.pd.DJOINTIME == '' || this.pd.DJOINTIME == undefined){
				$("#DJOINTIME").tips({
					side:3,
		            msg:'请输入进本单位时间',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.DJOINTIME = '';
				this.$refs.DJOINTIME.focus();
			return false;
			}
			if(this.pd.POST == '' || this.pd.POST == undefined){
				$("#POST").tips({
					side:3,
		            msg:'请输入现岗位',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.POST = '';
				this.$refs.POST.focus();
			return false;
			}
			this.pd.POJOINTIME = $("#POJOINTIME").val();
			if(this.pd.POJOINTIME == '' || this.pd.POJOINTIME == undefined){
				$("#POJOINTIME").tips({
					side:3,
		            msg:'请输入上岗时间',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.POJOINTIME = '';
				this.$refs.POJOINTIME.focus();
			return false;
			}
			if(this.pd.EDUCATION == '' || this.pd.EDUCATION == undefined){
				$("#EDUCATION").tips({
					side:3,
		            msg:'请输入学历',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.EDUCATION = '';
				this.$refs.EDUCATION.focus();
			return false;
			}
			if(this.pd.SCHOOL == '' || this.pd.SCHOOL == undefined){
				$("#SCHOOL").tips({
					side:3,
		            msg:'请输入毕业学校',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.SCHOOL = '';
				this.$refs.SCHOOL.focus();
			return false;
			}
			if(this.pd.MAJOR == '' || this.pd.MAJOR == undefined){
				$("#MAJOR").tips({
					side:3,
		            msg:'请输入专业',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.MAJOR = '';
				this.$refs.MAJOR.focus();
			return false;
			}
			if(this.pd.FTITLE == '' || this.pd.FTITLE == undefined){
				$("#FTITLE").tips({
					side:3,
		            msg:'请输入职称',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FTITLE = '';
				this.$refs.FTITLE.focus();
			return false;
			}
			if(this.pd.CERTIFICATE == '' || this.pd.CERTIFICATE == undefined){
				$("#CERTIFICATE").tips({
					side:3,
		            msg:'请输入职业资格证',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.CERTIFICATE = '';
				this.$refs.CERTIFICATE.focus();
			return false;
			}
			if(this.pd.CONTRACTLENGTH == '' || this.pd.CONTRACTLENGTH == undefined){
				$("#CONTRACTLENGTH").tips({
					side:3,
		            msg:'请输入劳动合同时长',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.CONTRACTLENGTH = '';
				this.$refs.CONTRACTLENGTH.focus();
			return false;
			}
			this.pd.CSTARTTIME = $("#CSTARTTIME").val();
			if(this.pd.CSTARTTIME == '' || this.pd.CSTARTTIME == undefined){
				$("#CSTARTTIME").tips({
					side:3,
		            msg:'请输入签订日期',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.CSTARTTIME = '';
				this.$refs.CSTARTTIME.focus();
			return false;
			}
			this.pd.CENDTIME = $("#CENDTIME").val();
			if(this.pd.CENDTIME == '' || this.pd.CENDTIME == undefined){
				$("#CENDTIME").tips({
					side:3,
		            msg:'请输入终止日期',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.CENDTIME = '';
				this.$refs.CENDTIME.focus();
			return false;
			}
			if(this.pd.ADDRESS == '' || this.pd.ADDRESS == undefined){
				$("#ADDRESS").tips({
					side:3,
		            msg:'请输入现住址',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.ADDRESS = '';
				this.$refs.ADDRESS.focus();
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
    		
    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'staff/'+this.msg,
			    	data: {STAFF_ID:this.STAFF_ID,
				    NAME:this.pd.NAME,
				    NAME_EN:this.pd.NAME_EN,
				    BIANMA:this.pd.BIANMA,
				    DEPARTMENT_ID:this.DEPARTMENT_ID,
				    FUNCTIONS:this.pd.FUNCTIONS,
				    TEL:this.pd.TEL,
				    EMAIL:this.pd.EMAIL,
				    SEX:this.SEX,
				    BIRTHDAY:this.pd.BIRTHDAY,
				    NATION:this.pd.NATION,
				    JOBTYPE:this.pd.JOBTYPE,
				    JOBJOINTIME:this.pd.JOBJOINTIME,
				    FADDRESS:this.pd.FADDRESS,
				    POLITICAL:this.pd.POLITICAL,
				    PJOINTIME:this.pd.PJOINTIME,
				    SFID:this.pd.SFID,
				    MARITAL:this.MARITAL,
				    DJOINTIME:this.pd.DJOINTIME,
				    POST:this.pd.POST,
				    POJOINTIME:this.pd.POJOINTIME,
				    EDUCATION:this.pd.EDUCATION,
				    SCHOOL:this.pd.SCHOOL,
				    MAJOR:this.pd.MAJOR,
				    FTITLE:this.pd.FTITLE,
				    CERTIFICATE:this.pd.CERTIFICATE,
				    CONTRACTLENGTH:this.pd.CONTRACTLENGTH,
				    CSTARTTIME:this.pd.CSTARTTIME,
				    CENDTIME:this.pd.CENDTIME,
				    ADDRESS:this.pd.ADDRESS,
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
                        	showException("员工管理",data.exception);//显示异常
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
				url: httpurl+'staff/goEdit',
		    	data: {STAFF_ID:this.STAFF_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     	vm.SEX = data.pd.SEX;
                     	vm.MARITAL = data.pd.MARITAL;
                     	vm.DEPARTMENT_ID = data.pd.DEPARTMENT_ID
            			
            			//下拉树
    					var defaultNodes = JSON.parse(data.zTreeNodes);
    					//绑定change事件
    					$("#selectTree").bind("change",function(){
    						if($(this).attr("relValue")){
    							vm.DEPARTMENT_ID = $(this).attr("relValue")
    					    }
    					});
    					//赋给data属性
    					$("#selectTree").data("data",defaultNodes);  
    					$("#selectTree").render();
    					$("#selectTree2_input").val(data.depname);
                     	
						$("#BIRTHDAY").val(data.pd.BIRTHDAY);
						$("#JOBJOINTIME").val(data.pd.JOBJOINTIME);
						$("#PJOINTIME").val(data.pd.PJOINTIME);
						$("#DJOINTIME").val(data.pd.DJOINTIME);
						$("#POJOINTIME").val(data.pd.POJOINTIME);
						$("#CSTARTTIME").val(data.pd.CSTARTTIME);
						$("#CENDTIME").val(data.pd.CENDTIME);
                     }else if ("exception" == data.result){
                     	showException("员工管理",data.exception);	//显示异常
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
    	
        //新增时获取部门下拉树
        goAdd: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'staff/goAdd',
        		data: {tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
					//下拉树
					var defaultNodes = JSON.parse(data.zTreeNodes);
					//绑定change事件
					$("#selectTree").bind("change",function(){
						if($(this).attr("relValue")){
							vm.DEPARTMENT_ID = $(this).attr("relValue")
					    }
					});
					//赋给data属性
					$("#selectTree").data("data",defaultNodes);  
					$("#selectTree").render();
        		 }
        		}
        	})
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
	