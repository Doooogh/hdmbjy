var vm = new Vue({
	el: '#app',
	
	data:{
		GBSLFORMDATA_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		SCHOOL_NAME:'',
		APPROVE_ID:''  ,//审批的id  ,
		APPROVE_TYPE:'',   //审批的类型
		FORM_ID:'',   //表单的id
		isPreview:false,   //是否是从审批预览页面查看预览
		SUB_STATUS:'',  //是否为暂存状态   1 是   0 否
		APPROVEFORM_ID:'',  
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//为该表单的id 
        	var FDID = this.getUrlKey('FDID');	//为该表单存储的id   如果为null 就是添加  否则为编辑
        	var AFT = this.getUrlKey('AFT');	//为该表单存储的审批类型
        	var AID = this.getUrlKey('AID');	//为该表单存储的审批id
        	var isPre = this.getUrlKey('isPre');	//为该表单存储的审批id
			var AF_ID = this.getUrlKey('AFID');	//为该表单存储的id
			
        	if(null != FDID){
        		this.msg = 'edit';
        		this.GBSLFORMDATA_ID = FDID;
        		this.getData();   //获取数据
        	}
			if(null != FID){
				this.FORM_ID=FID;
			}
			if(null != AF_ID){
				this.APPROVEFORM_ID=AF_ID;
			}
			if(null != AFT){  
				this.APPROVE_TYPE=AFT;
			}
			if(null != AID){
				this.APPROVE_ID=AID;
			}
			if(null!=isPre){
				this.isPreview=true;
			}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (status){
			vm.getValue();
			// console.log(vm.pd);
			vm.SUB_STATUS=status;
			if(status==0){
				if(this.pd.SCHOOL_NAME == '' || this.pd.SCHOOL_NAME == undefined){
					$("#SCHOOL_NAME").tips({
						side:3,
				        msg:'请输入举办单位名称',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.SCHOOL_NAME = '';
					this.$refs.SCHOOL_NAME.focus();
				return false;
				}
				if(this.pd.PHONE == '' || this.pd.PHONE == undefined){
					$("#PHONE").tips({
						side:3,
				        msg:'请输入电话',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.PHONE = '';
					this.$refs.PHONE.focus();
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
				if(this.pd.POSTCODE == '' || this.pd.POSTCODE == undefined){
					$("#POSTCODE").tips({
						side:3,
				        msg:'请输入邮政编码',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.POSTCODE = '';
					this.$refs.POSTCODE.focus();
				return false;
				}
				if(this.pd.LEGALPERSON == '' || this.pd.LEGALPERSON == undefined){
					$("#LEGALPERSON").tips({
						side:3,
				        msg:'请输入法人',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.LEGALPERSON = '';
					this.$refs.LEGALPERSON.focus();
				return false;
				}
				if(this.pd.LEGALPERSON_TYPE == '' || this.pd.LEGALPERSON_TYPE == undefined){
					$("#LEGALPERSON_TYPE").tips({
						side:3,
				        msg:'请输入法人类型',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.LEGALPERSON_TYPE = '';
					this.$refs.LEGALPERSON_TYPE.focus();
				return false;
				}
				if(this.pd.REGISTERED_FUND == '' || this.pd.REGISTERED_FUND == undefined){
					$("#REGISTERED_FUND").tips({
						side:3,
				        msg:'请输入注册资金',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.REGISTERED_FUND = '';
					this.$refs.REGISTERED_FUND.focus();
				return false;
				}
				if(this.pd.TOTAL_EXISTING_FUNDS == '' || this.pd.TOTAL_EXISTING_FUNDS == undefined){
					$("#TOTAL_EXISTING_FUNDS").tips({
						side:3,
				        msg:'请输入现有总资金',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.TOTAL_EXISTING_FUNDS = '';
					this.$refs.TOTAL_EXISTING_FUNDS.focus();
				return false;
				}
				if(this.pd.DEPOSIT_BANK == '' || this.pd.DEPOSIT_BANK == undefined){
					$("#DEPOSIT_BANK").tips({
						side:3,
				        msg:'请输入开户银行',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.DEPOSIT_BANK = '';
					this.$refs.DEPOSIT_BANK.focus();
				return false;
				}
				if(this.pd.FUNDING_FOR_SCHOOL == '' || this.pd.FUNDING_FOR_SCHOOL == undefined){
					$("#FUNDING_FOR_SCHOOL").tips({
						side:3,
				        msg:'请输入提供办学资金',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.FUNDING_FOR_SCHOOL = '';
					this.$refs.FUNDING_FOR_SCHOOL.focus();
				return false;
				}
				if(this.pd.BANK_ACCOUNT == '' || this.pd.BANK_ACCOUNT == undefined){
					$("#BANK_ACCOUNT").tips({
						side:3,
				        msg:'请输入银行账户',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.BANK_ACCOUNT = '';
					this.$refs.BANK_ACCOUNT.focus();
				return false;
				}
				
			}
			
    		/* $("#showform").hide();
    		$("#jiazai").show(); */
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'gbslformdata/'+this.msg,
			    	data: {
						GBSLFORMDATA_ID:this.GBSLFORMDATA_ID,   //id
						// GBSLFORMDATA_ID:this.pd.GBSLFORMDATA_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						SUB_STATUS:status,
						SCHOOL_NAME:this.pd.SCHOOL_NAME,
						PHONE:this.pd.PHONE,
						ADDRESS:this.pd.ADDRESS,
						POSTCODE:this.pd.POSTCODE,
						LEGALPERSON:this.pd.LEGALPERSON,
						LEGALPERSON_TYPE:this.pd.LEGALPERSON_TYPE,
						REGISTERED_FUND:this.pd.REGISTERED_FUND,
						TOTAL_EXISTING_FUNDS:this.pd.TOTAL_EXISTING_FUNDS,
						DEPOSIT_BANK:this.pd.DEPOSIT_BANK,
						FUNDING_FOR_SCHOOL:this.pd.FUNDING_FOR_SCHOOL,
						BANK_ACCOUNT:this.pd.BANK_ACCOUNT,
						
						tm:new Date().getTime()
					},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
							vm.GBSLFORMDATA_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
							swal("", "保存成功", "success");
							setTimeout(function(){
								top.Dialog.close();//关闭弹窗
							},1000);
                        }else if ("exception" == data.result){
                        	showException("审批表单填报(公办幼儿园设立举办者基本信息)",data.exception);//显示异常
                      /*  	$("#showform").show();
                    		$("#jiazai").hide(); */
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
				url: httpurl+'gbslformdata/goEdit',
		    	data: {
					GBSLFORMDATA_ID:this.GBSLFORMDATA_ID,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("审批表单填报(公办幼儿园设立举办者基本信息)",data.exception);	//显示异常
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
        },
		
	
		getValue:function(){
			
			var SCHOOL_NAME=$("#SCHOOL_NAME").text();
			if(null!=SCHOOL_NAME&&undefined!=SCHOOL_NAME&&''!=SCHOOL_NAME){
				vm.pd.SCHOOL_NAME=SCHOOL_NAME;
			}
			var PHONE=$("#PHONE").text();
			if(null!=PHONE&&undefined!=PHONE&&''!=PHONE){
				vm.pd.PHONE=PHONE;
			}
			var ADDRESS=$("#ADDRESS").text();
			if(null!=ADDRESS&&undefined!=ADDRESS&&''!=ADDRESS){
				vm.pd.ADDRESS=ADDRESS;
			}
			var POSTCODE=$("#POSTCODE").text();
			if(null!=POSTCODE&&undefined!=POSTCODE&&''!=POSTCODE){
				vm.pd.POSTCODE=POSTCODE;
			}
			var LEGALPERSON=$("#LEGALPERSON").text();
			if(null!=LEGALPERSON&&undefined!=LEGALPERSON&&''!=LEGALPERSON){
				vm.pd.LEGALPERSON=LEGALPERSON;
			}
			var LEGALPERSON_TYPE=$("#LEGALPERSON_TYPE").text();
			if(null!=LEGALPERSON_TYPE&&undefined!=LEGALPERSON_TYPE&&''!=LEGALPERSON_TYPE){
				vm.pd.LEGALPERSON_TYPE=LEGALPERSON_TYPE;
			}
			var REGISTERED_FUND=$("#REGISTERED_FUND").text();
			if(null!=REGISTERED_FUND&&undefined!=REGISTERED_FUND&&''!=REGISTERED_FUND){
				vm.pd.REGISTERED_FUND=REGISTERED_FUND;
			}
			var TOTAL_EXISTING_FUNDS=$("#TOTAL_EXISTING_FUNDS").text();
			if(null!=TOTAL_EXISTING_FUNDS&&undefined!=TOTAL_EXISTING_FUNDS&&''!=TOTAL_EXISTING_FUNDS){
				vm.pd.TOTAL_EXISTING_FUNDS=TOTAL_EXISTING_FUNDS;
			}
			var DEPOSIT_BANK=$("#DEPOSIT_BANK").text();
			if(null!=DEPOSIT_BANK&&undefined!=DEPOSIT_BANK&&''!=DEPOSIT_BANK){
				vm.pd.DEPOSIT_BANK=DEPOSIT_BANK;
			}
			var FUNDING_FOR_SCHOOL=$("#FUNDING_FOR_SCHOOL").text();
			if(null!=FUNDING_FOR_SCHOOL&&undefined!=FUNDING_FOR_SCHOOL&&''!=FUNDING_FOR_SCHOOL){
				vm.pd.FUNDING_FOR_SCHOOL=FUNDING_FOR_SCHOOL;
			}
			var BANK_ACCOUNT=$("#BANK_ACCOUNT").text();
			if(null!=BANK_ACCOUNT&&undefined!=BANK_ACCOUNT&&''!=BANK_ACCOUNT){
				vm.pd.BANK_ACCOUNT=BANK_ACCOUNT;
			}
		}
        
	},
	watch:{
		pd:function(oldVal,newOld){
			console.log(newOld);
		},
		SCHOOL_NAME:function(oldVal,newOld){
			console.log(SCHOOL_NAME);
		},
		
	},
	
	mounted(){
        this.init();
    }
})