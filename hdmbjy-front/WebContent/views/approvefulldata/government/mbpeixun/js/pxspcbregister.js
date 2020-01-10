
var vm = new Vue({
	el: '#app',
	data:{
        PXSPCBREGISTER_ID: '',	//主键ID
		pd: [],						//存放字段参数
        msg:'add',
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
        		this.PXSPCBREGISTER_ID = FDID;
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
			vm.SUB_STATUS=status;
			if(status==0){
            if(this.pd.PROVIDE_FUNDS == '' || this.pd.PROVIDE_FUNDS == undefined){
                    $("#PROVIDE_FUNDS").tips({
                        side:3,
                        msg:'请输入举办者提供办学资金',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PROVIDE_FUNDS = '';
                    this.$refs.PROVIDE_FUNDS.focus();
                return false;
                }
            if(this.pd.LEGAL_PERSON_TYPE == '' || this.pd.LEGAL_PERSON_TYPE == undefined){
                    $("#LEGAL_PERSON_TYPE").tips({
                        side:3,
                        msg:'请输入举办单位法人代表类型',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_PERSON_TYPE = '';
                    this.$refs.LEGAL_PERSON_TYPE.focus();
                return false;
                }
            if(this.pd.LEGAL_PERSON_ADDRESS == '' || this.pd.LEGAL_PERSON_ADDRESS == undefined){
                    $("#LEGAL_PERSON_ADDRESS").tips({
                        side:3,
                        msg:'请输入举办单位法定代表人家庭住址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_PERSON_ADDRESS = '';
                    this.$refs.LEGAL_PERSON_ADDRESS.focus();
                return false;
                }
            if(this.pd.LEGAL_PERSON_PHONE == '' || this.pd.LEGAL_PERSON_PHONE == undefined){
                    $("#LEGAL_PERSON_PHONE").tips({
                        side:3,
                        msg:'请输入法定代表人电话手机',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_PERSON_PHONE = '';
                    this.$refs.LEGAL_PERSON_PHONE.focus();
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
            if(this.pd.BANK_NUMBER == '' || this.pd.BANK_NUMBER == undefined){
                    $("#BANK_NUMBER").tips({
                        side:3,
                        msg:'请输入举办单位银行账号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BANK_NUMBER = '';
                    this.$refs.BANK_NUMBER.focus();
                return false;
                }
            if(this.pd.ORGANIZER_OPINION == '' || this.pd.ORGANIZER_OPINION == undefined){
                    $("#ORGANIZER_OPINION").tips({
                        side:3,
                        msg:'请输入举办者意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_OPINION = '';
                    this.$refs.ORGANIZER_OPINION.focus();
                return false;
                }
          /*  if(this.pd.ORGANIZER_OPINION_DATE == '' || this.pd.ORGANIZER_OPINION_DATE == undefined){
                    $("#ORGANIZER_OPINION_DATE").tips({
                        side:3,
                        msg:'请输入举办者意见日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_OPINION_DATE = '';
                    this.$refs.ORGANIZER_OPINION_DATE.focus();
                return false;
                } */
				
				//可以全部为空的DATE
				var result=vm.verifyDate(this.pd.ORGANIZER_OPINION_DATE);	
				if(!result.isNull){
					if(!result.isTrue){
						$("#ORGANIZER_OPINION_DATE").tips({
							side:3,
							msg:result.msg,
							bg:'#AE81FF',
							time:2
						});
						vm.pd.ORGANIZER_OPINION_DATE = '';
						vm.pd.YEAR1=vm.pd.MONTH1=vm.pd.DAY1='';     //编号后的YEAR MONTH DAY
						return false;
					}
				}
				
				
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'pxspcbregister/'+this.msg,
			    	data: {
PXSPCBREGISTER_ID:this.PXSPCBREGISTER_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

						PROVIDE_FUNDS:this.pd.PROVIDE_FUNDS,

						LEGAL_PERSON_TYPE:this.pd.LEGAL_PERSON_TYPE,

						LEGAL_PERSON_ADDRESS:this.pd.LEGAL_PERSON_ADDRESS,

						LEGAL_PERSON_PHONE:this.pd.LEGAL_PERSON_PHONE,

						DEPOSIT_BANK:this.pd.DEPOSIT_BANK,

						BANK_NUMBER:this.pd.BANK_NUMBER,

						ORGANIZER_OPINION:this.pd.ORGANIZER_OPINION,

						ORGANIZER_OPINION_DATE:this.pd.ORGANIZER_OPINION_DATE,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.PXSPCBREGISTER_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "暂存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("海淀区民办教育培训机构审批备案登记表",data.exception);//显示异常
                        }
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
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
				url: httpurl+'pxspcbregister/goEdit',
		    	data: {
                    PXSPCBREGISTER_ID:this.PXSPCBREGISTER_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						
						if(data.pd.ORGANIZER_OPINION_DATE!=''&&null!=data.pd.ORGANIZER_OPINION_DATE&&undefined!=data.pd.ORGANIZER_OPINION_DATE){
							var ORGANIZER_OPINION_DATE=data.pd.ORGANIZER_OPINION_DATE.split("/");
							vm.pd.YEAR1=ORGANIZER_OPINION_DATE[0];
							vm.pd.MONTH1=ORGANIZER_OPINION_DATE[1];
							vm.pd.DAY1=ORGANIZER_OPINION_DATE[2];
						}
                     }else if ("exception" == data.result){
                     	showException("海淀区民办教育培训机构审批备案登记表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var PROVIDE_FUNDS=$("#PROVIDE_FUNDS").text();
                    if(null!=PROVIDE_FUNDS&&undefined!=PROVIDE_FUNDS&&''!=PROVIDE_FUNDS){
                        vm.pd.PROVIDE_FUNDS=PROVIDE_FUNDS;
                    }
                    var LEGAL_PERSON_TYPE=$("#LEGAL_PERSON_TYPE").text();
                    if(null!=LEGAL_PERSON_TYPE&&undefined!=LEGAL_PERSON_TYPE&&''!=LEGAL_PERSON_TYPE){
                        vm.pd.LEGAL_PERSON_TYPE=LEGAL_PERSON_TYPE;
                    }
                    var LEGAL_PERSON_ADDRESS=$("#LEGAL_PERSON_ADDRESS").text();
                    if(null!=LEGAL_PERSON_ADDRESS&&undefined!=LEGAL_PERSON_ADDRESS&&''!=LEGAL_PERSON_ADDRESS){
                        vm.pd.LEGAL_PERSON_ADDRESS=LEGAL_PERSON_ADDRESS;
                    }
                    var LEGAL_PERSON_PHONE=$("#LEGAL_PERSON_PHONE").text();
                    if(null!=LEGAL_PERSON_PHONE&&undefined!=LEGAL_PERSON_PHONE&&''!=LEGAL_PERSON_PHONE){
                        vm.pd.LEGAL_PERSON_PHONE=LEGAL_PERSON_PHONE;
                    }
                    var DEPOSIT_BANK=$("#DEPOSIT_BANK").text();
                    if(null!=DEPOSIT_BANK&&undefined!=DEPOSIT_BANK&&''!=DEPOSIT_BANK){
                        vm.pd.DEPOSIT_BANK=DEPOSIT_BANK;
                    }
                    var BANK_NUMBER=$("#BANK_NUMBER").text();
                    if(null!=BANK_NUMBER&&undefined!=BANK_NUMBER&&''!=BANK_NUMBER){
                        vm.pd.BANK_NUMBER=BANK_NUMBER;
                    }
                    var ORGANIZER_OPINION=$("#ORGANIZER_OPINION").text();
                    if(null!=ORGANIZER_OPINION&&undefined!=ORGANIZER_OPINION&&''!=ORGANIZER_OPINION){
                        vm.pd.ORGANIZER_OPINION=ORGANIZER_OPINION;
                    }
                   /* var ORGANIZER_OPINION_DATE=$("#ORGANIZER_OPINION_DATE").text();
                    if(null!=ORGANIZER_OPINION_DATE&&undefined!=ORGANIZER_OPINION_DATE&&''!=ORGANIZER_OPINION_DATE){
                        vm.pd.ORGANIZER_OPINION_DATE=ORGANIZER_OPINION_DATE;
                    } */
					
					var YEAR1=$("#YEAR1").text();
					if(null!=YEAR1&&undefined!=YEAR1&&''!=YEAR1){
						vm.pd.YEAR1=YEAR1;
					}else{
						vm.pd.YEAR1='';
					}
					var MONTH1=$("#MONTH1").text();
					if(null!=MONTH1&&undefined!=MONTH1&&''!=MONTH1){
						if(MONTH1<10&&MONTH1.length==1){
							MONTH1=("0"+MONTH1)
						}
						vm.pd.MONTH1=MONTH1;
					}else{
						vm.pd.MONTH1='';
					}
					var DAY1=$("#DAY1").text();
					if(null!=DAY1&&undefined!=DAY1&&''!=DAY1){
						if(DAY1<10&&DAY1.length==1){
							DAY1=("0"+DAY1)
						}
						vm.pd.DAY1=DAY1;
					}else{
						vm.pd.DAY1='';
					}
					vm.pd.ORGANIZER_OPINION_DATE=vm.pd.YEAR1+"/"+vm.pd.MONTH1+"/"+vm.pd.DAY1;
					
        },
    	//获取数据字典数据
		getDict: function (){
		},
		//验证日期是否正确  可以允许是否为''
		verifyDate:function(allDate){
					var result={      	//返回值
						isNull:false,   //是否为isNull
						isTrue:true,      //格式是否正确
						msg:"",
					};
					var dateArr =allDate.split("/");
						if(allDate.length==2){
							result.isNull=true;
							result.msg="日期不能为空!";
							return result;
						}
						var year=dateArr[0];
						if(year.length!=4||year>9999||year<1000){
							result.isTrue=false;
							result.msg="日期格式不正确!";
							return result
						}
						var month=dateArr[1];
						if(!(month<=12&&month>0)){
							result.isTrue=false;
							result.msg="日期格式不正确!";
							return result
						}
						var day=dateArr[2];
						if(!(day<=30&&day>0)){
							result.isTrue=false;
							result.msg="日期格式不正确!";
							return result
						}
						return result;

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