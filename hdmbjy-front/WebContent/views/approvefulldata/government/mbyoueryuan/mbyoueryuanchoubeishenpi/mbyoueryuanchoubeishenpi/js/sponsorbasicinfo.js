
var vm = new Vue({
	el: '#app',
	data:{
        SPONSORBASICINFO_ID: '',	//主键ID
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
        		this.SPONSORBASICINFO_ID = FDID;
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
			
            if(this.pd.SPONSOR_NAME == '' || this.pd.SPONSOR_NAME == undefined){
                    $("#SPONSOR_NAME").tips({
                        side:3,
                        msg:'请输入举办单位名称',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SPONSOR_NAME = '';
                    this.$refs.SPONSOR_NAME.focus();
                return false;
                }
            if(this.pd.SPONSOR_TELEFACSIMILE == '' || this.pd.SPONSOR_TELEFACSIMILE == undefined){
                    $("#SPONSOR_TELEFACSIMILE").tips({
                        side:3,
                        msg:'请输入电话传真',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SPONSOR_TELEFACSIMILE = '';
                    this.$refs.SPONSOR_TELEFACSIMILE.focus();
                return false;
                }
            if(this.pd.NAME_ADDRESS == '' || this.pd.NAME_ADDRESS == undefined){
                    $("#NAME_ADDRESS").tips({
                        side:3,
                        msg:'请输入举办单位地址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.NAME_ADDRESS = '';
                    this.$refs.NAME_ADDRESS.focus();
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
            if(this.pd.LEGAL_PERSON == '' || this.pd.LEGAL_PERSON == undefined){
                    $("#LEGAL_PERSON").tips({
                        side:3,
                        msg:'请输入举办单位法定代表人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_PERSON = '';
                    this.$refs.LEGAL_PERSON.focus();
                return false;
                }
            if(this.pd.LEGAL_PERSON_TYPE == '' || this.pd.LEGAL_PERSON_TYPE == undefined){
                    $("#LEGAL_PERSON_TYPE").tips({
                        side:3,
                        msg:'请输入举办单位法人类型',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_PERSON_TYPE = '';
                    this.$refs.LEGAL_PERSON_TYPE.focus();
                return false;
                }
            if(this.pd.REGISTERED_FUND == '' || this.pd.REGISTERED_FUND == undefined){
                    $("#REGISTERED_FUND").tips({
                        side:3,
                        msg:'请输入举办单位注册资金',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.REGISTERED_FUND = '';
                    this.$refs.REGISTERED_FUND.focus();
                return false;
                }
            if(this.pd.EXISTING_FUNDS == '' || this.pd.EXISTING_FUNDS == undefined){
                    $("#EXISTING_FUNDS").tips({
                        side:3,
                        msg:'请输入举办单位现有总资金',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.EXISTING_FUNDS = '';
                    this.$refs.EXISTING_FUNDS.focus();
                return false;
                }
            if(this.pd.DEPOSIT_BANK == '' || this.pd.DEPOSIT_BANK == undefined){
                    $("#DEPOSIT_BANK").tips({
                        side:3,
                        msg:'请输入举办单位开户银行',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DEPOSIT_BANK = '';
                    this.$refs.DEPOSIT_BANK.focus();
                return false;
                }
            if(this.pd.BANK_ACCOUNT == '' || this.pd.BANK_ACCOUNT == undefined){
                    $("#BANK_ACCOUNT").tips({
                        side:3,
                        msg:'请输入举办单位银行账号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BANK_ACCOUNT = '';
                    this.$refs.BANK_ACCOUNT.focus();
                return false;
                }
            if(this.pd.FUNDS_FOR_SCHOOL == '' || this.pd.FUNDS_FOR_SCHOOL == undefined){
                    $("#FUNDS_FOR_SCHOOL").tips({
                        side:3,
                        msg:'请输入举办者提供办学资金',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FUNDS_FOR_SCHOOL = '';
                    this.$refs.FUNDS_FOR_SCHOOL.focus();
                return false;
                }
            if(this.pd.RUN_SCHOOL_ADDRESS == '' || this.pd.RUN_SCHOOL_ADDRESS == undefined){
                    $("#RUN_SCHOOL_ADDRESS").tips({
                        side:3,
                        msg:'请输入举办者提供办学地址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.RUN_SCHOOL_ADDRESS = '';
                    this.$refs.RUN_SCHOOL_ADDRESS.focus();
                return false;
                }
            if(this.pd.EQUIPMENT == '' || this.pd.EQUIPMENT == undefined){
                    $("#EQUIPMENT").tips({
                        side:3,
                        msg:'请输入举办单位提供办学设备',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.EQUIPMENT = '';
                    this.$refs.EQUIPMENT.focus();
                return false;
                }
            if(this.pd.OPINION == '' || this.pd.OPINION == undefined){
                    $("#OPINION").tips({
                        side:3,
                        msg:'请输入举办单位意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.OPINION = '';
                    this.$refs.OPINION.focus();
                return false;
                }
           /* if((this.pd.YEAR1==''||this.pd.MONTH1==''||this.pd.DAY1=='')&&(this.pd.OPINION_DATE != ''&&this.pd.OPINION_DATE != undefined)){
				 
				var dateAll=this.pd.OPINION_DATE.split("/");
				var isTrue=true;
				$.each(dateAll,function(i,date){
					if(date==''||undefined==date){
						isTrue=false;
					}
				});
				if(!isTrue){
					$("#OPINION_DATE").tips({
						side:3,
						msg:'请输入正确的举办单位法人签字时间',
						bg:'#AE81FF',
						time:2
					});
					this.pd.OPINION_DATE = '';
					this.pd.YEAR1=this.pd.MONTH1=this.pd.DAY1='';
					this.$refs.OPINION_DATE.focus();
					 return false;
				}
				} */
			var result=vm.verifyDate(this.pd.OPINION_DATE);	
			if(!result.isNull){
				if(!result.isTrue){
					$("#OPINION_DATE").tips({
						side:3,
						msg:result.msg,
						bg:'#AE81FF',
						time:2
					});
					vm.pd.OPINION_DATE = '';
					vm.pd.YEAR1=vm.pd.MONTH1=vm.pd.DAY1='';
					return false;
				}
			}
            if(this.pd.SUPERIOR_OPINION == '' || this.pd.SUPERIOR_OPINION == undefined){
                    $("#SUPERIOR_OPINION").tips({
                        side:3,
                        msg:'请输入举办单位上级部门意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SUPERIOR_OPINION = '';
                    this.$refs.SUPERIOR_OPINION.focus();
                return false;
                }
			
			var result=vm.verifyDate(this.pd.SUPERIOR_OPINION_DATE);
			if(!result.isNull){
				if(!result.isTrue){
					$("#SUPERIOR_OPINION_DATE").tips({
						side:3,
						msg:result.msg,
						bg:'#AE81FF',
						time:2
					});
					vm.pd.SUPERIOR_OPINION_DATE = '';
					vm.pd.YEAR2=vm.pd.MONTH2=vm.pd.DAY2='';
					return false;
				}
			}
            /* if((this.pd.YEAR2==''||this.pd.MONTH2==''||this.pd.DAY2=='')&&(this.pd.SUPERIOR_OPINION_DATE != ''&& this.pd.SUPERIOR_OPINION_DATE != undefined)){
				var dateAll=this.pd.SUPERIOR_OPINION_DATE.split("/");
				var isTrue=true;
				$.each(dateAll,function(i,date){
					if(date==''||undefined==date){
						isTrue=false;
					}
				});
				if(!isTrue){
					$("#SUPERIOR_OPINION_DATE").tips({
						side:3,
						msg:'请输入正确的上级部门法人签字时间',
						bg:'#AE81FF',
						time:2
					});
					this.pd.SUPERIOR_OPINION_DATE = '';
					this.pd.YEAR2=this.pd.MONTH2=this.pd.DAY2='';
					this.$refs.SUPERIOR_OPINION_DATE.focus();
					 return false;
				}
				
				
                } */
			}	

            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'sponsorbasicinfo/'+this.msg,
			    	data: {
						
                        SPONSORBASICINFO_ID:this.SPONSORBASICINFO_ID,

						APPROVE_ID:this.APPROVE_ID,   //审批id
						
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id	
						
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						SUB_STATUS:status,
						
                        SPONSOR_NAME:this.pd.SPONSOR_NAME,

                        SPONSOR_TELEFACSIMILE:this.pd.SPONSOR_TELEFACSIMILE,

                        NAME_ADDRESS:this.pd.NAME_ADDRESS,

                        POSTCODE:this.pd.POSTCODE,

                        LEGAL_PERSON:this.pd.LEGAL_PERSON,

                        LEGAL_PERSON_TYPE:this.pd.LEGAL_PERSON_TYPE,

                        REGISTERED_FUND:this.pd.REGISTERED_FUND,

                        EXISTING_FUNDS:this.pd.EXISTING_FUNDS,

                        DEPOSIT_BANK:this.pd.DEPOSIT_BANK,

                        BANK_ACCOUNT:this.pd.BANK_ACCOUNT,

                        FUNDS_FOR_SCHOOL:this.pd.FUNDS_FOR_SCHOOL,

                        RUN_SCHOOL_ADDRESS:this.pd.RUN_SCHOOL_ADDRESS,

                        EQUIPMENT:this.pd.EQUIPMENT,

                        OPINION:this.pd.OPINION,

                        OPINION_DATE:this.pd.OPINION_DATE,

                        SUPERIOR_OPINION:this.pd.SUPERIOR_OPINION,

                        SUPERIOR_OPINION_DATE:this.pd.SUPERIOR_OPINION_DATE,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.SPONSORBASICINFO_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("幼儿园举办单位基本情况表",data.exception);//显示异常
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
				url: httpurl+'sponsorbasicinfo/goEdit',
		    	data: {
                    SPONSORBASICINFO_ID:this.SPONSORBASICINFO_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						if(data.pd.OPINION_DATE!=''&&null!=data.pd.OPINION_DATE&&undefined!=data.pd.OPINION_DATE){
							var OPINION_DATE=data.pd.OPINION_DATE.split("/");
							vm.pd.YEAR1=OPINION_DATE[0];
							vm.pd.MONTH1=OPINION_DATE[1];
							vm.pd.DAY1=OPINION_DATE[2];
						}
					
						if(data.pd.SUPERIOR_OPINION_DATE!=''&&null!=data.pd.SUPERIOR_OPINION_DATE&&undefined!=data.pd.SUPERIOR_OPINION_DATE){
							var SUPERIOR_OPINION_DATE=data.pd.SUPERIOR_OPINION_DATE.split("/");
							vm.pd.YEAR2=SUPERIOR_OPINION_DATE[0];
							vm.pd.MONTH2=SUPERIOR_OPINION_DATE[1];
							vm.pd.DAY2=SUPERIOR_OPINION_DATE[2];
						}
						
						
                     }else if ("exception" == data.result){
                     	showException("幼儿园举办单位基本情况表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                   
                    var SPONSOR_NAME=$("#SPONSOR_NAME").text();
                    if(null!=SPONSOR_NAME&&undefined!=SPONSOR_NAME&&''!=SPONSOR_NAME){
                        vm.pd.SPONSOR_NAME=SPONSOR_NAME;
                    }
                    var SPONSOR_TELEFACSIMILE=$("#SPONSOR_TELEFACSIMILE").text();
                    if(null!=SPONSOR_TELEFACSIMILE&&undefined!=SPONSOR_TELEFACSIMILE&&''!=SPONSOR_TELEFACSIMILE){
                        vm.pd.SPONSOR_TELEFACSIMILE=SPONSOR_TELEFACSIMILE;
                    }
                    var NAME_ADDRESS=$("#NAME_ADDRESS").text();
                    if(null!=NAME_ADDRESS&&undefined!=NAME_ADDRESS&&''!=NAME_ADDRESS){
                        vm.pd.NAME_ADDRESS=NAME_ADDRESS;
                    }
                    var POSTCODE=$("#POSTCODE").text();
                    if(null!=POSTCODE&&undefined!=POSTCODE&&''!=POSTCODE){
                        vm.pd.POSTCODE=POSTCODE;
                    }
                    var LEGAL_PERSON=$("#LEGAL_PERSON").text();
                    if(null!=LEGAL_PERSON&&undefined!=LEGAL_PERSON&&''!=LEGAL_PERSON){
                        vm.pd.LEGAL_PERSON=LEGAL_PERSON;
                    }
                    var LEGAL_PERSON_TYPE=$("#LEGAL_PERSON_TYPE").text();
                    if(null!=LEGAL_PERSON_TYPE&&undefined!=LEGAL_PERSON_TYPE&&''!=LEGAL_PERSON_TYPE){
                        vm.pd.LEGAL_PERSON_TYPE=LEGAL_PERSON_TYPE;
                    }
                    var REGISTERED_FUND=$("#REGISTERED_FUND").text();
                    if(null!=REGISTERED_FUND&&undefined!=REGISTERED_FUND&&''!=REGISTERED_FUND){
                        vm.pd.REGISTERED_FUND=REGISTERED_FUND;
                    }
                    var EXISTING_FUNDS=$("#EXISTING_FUNDS").text();
                    if(null!=EXISTING_FUNDS&&undefined!=EXISTING_FUNDS&&''!=EXISTING_FUNDS){
                        vm.pd.EXISTING_FUNDS=EXISTING_FUNDS;
                    }
                    var DEPOSIT_BANK=$("#DEPOSIT_BANK").text();
                    if(null!=DEPOSIT_BANK&&undefined!=DEPOSIT_BANK&&''!=DEPOSIT_BANK){
                        vm.pd.DEPOSIT_BANK=DEPOSIT_BANK;
                    }
                    var BANK_ACCOUNT=$("#BANK_ACCOUNT").text();
                    if(null!=BANK_ACCOUNT&&undefined!=BANK_ACCOUNT&&''!=BANK_ACCOUNT){
                        vm.pd.BANK_ACCOUNT=BANK_ACCOUNT;
                    }
                    var FUNDS_FOR_SCHOOL=$("#FUNDS_FOR_SCHOOL").text();
                    if(null!=FUNDS_FOR_SCHOOL&&undefined!=FUNDS_FOR_SCHOOL&&''!=FUNDS_FOR_SCHOOL){
                        vm.pd.FUNDS_FOR_SCHOOL=FUNDS_FOR_SCHOOL;
                    }
                    var RUN_SCHOOL_ADDRESS=$("#RUN_SCHOOL_ADDRESS").text();
                    if(null!=RUN_SCHOOL_ADDRESS&&undefined!=RUN_SCHOOL_ADDRESS&&''!=RUN_SCHOOL_ADDRESS){
                        vm.pd.RUN_SCHOOL_ADDRESS=RUN_SCHOOL_ADDRESS;
                    }
                    var EQUIPMENT=$("#EQUIPMENT").text();
                    if(null!=EQUIPMENT&&undefined!=EQUIPMENT&&''!=EQUIPMENT){
                        vm.pd.EQUIPMENT=EQUIPMENT;
                    }
                    var OPINION=$("#OPINION").text();
                    if(null!=OPINION&&undefined!=OPINION&&''!=OPINION){
                        vm.pd.OPINION=OPINION;
                    }
					
					var YEAR1=$("#YEAR1").text();
					if(null!=YEAR1&&undefined!=YEAR1&&''!=YEAR1){
						vm.pd.YEAR1=YEAR1;
					}else{
						vm.pd.YEAR1="";	
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
					
					vm.pd.OPINION_DATE=vm.pd.YEAR1+"/"+vm.pd.MONTH1+"/"+vm.pd.DAY1;
					
					
					var YEAR2=$("#YEAR2").text();
					if(null!=YEAR2&&undefined!=YEAR2&&''!=YEAR2){
						vm.pd.YEAR2=YEAR2;
					}else{
						vm.pd.YEAR2="";
					}
					var MONTH2=$("#MONTH2").text();
					if(null!=MONTH2&&undefined!=MONTH2&&''!=MONTH2){
						if(MONTH2<10&&MONTH2.length==1){
							MONTH2=("0"+MONTH2)
						}
						vm.pd.MONTH2=MONTH2;
					}else{
						vm.pd.MONTH2="";
					}
					var DAY2=$("#DAY2").text();
					if(null!=DAY2&&undefined!=DAY2&&''!=DAY2){
						if(DAY2<10&&DAY2.length==1){
							DAY2=("0"+DAY2)
						}
						vm.pd.DAY2=DAY2;
					}else{
						vm.pd.DAY2="";
					}
					
					vm.pd.SUPERIOR_OPINION_DATE=vm.pd.YEAR2+"/"+vm.pd.MONTH2+"/"+vm.pd.DAY2;
					
					
                    /* var OPINION_DATE=$("#OPINION_DATE").text();
                    if(null!=OPINION_DATE&&undefined!=OPINION_DATE&&''!=OPINION_DATE){
                        vm.pd.OPINION_DATE=OPINION_DATE;
                    } */
                    var SUPERIOR_OPINION=$("#SUPERIOR_OPINION").text();
                    if(null!=SUPERIOR_OPINION&&undefined!=SUPERIOR_OPINION&&''!=SUPERIOR_OPINION){
                        vm.pd.SUPERIOR_OPINION=SUPERIOR_OPINION;
                    }
                    /* var SUPERIOR_OPINION_DATE=$("#SUPERIOR_OPINION_DATE").text();
                    if(null!=SUPERIOR_OPINION_DATE&&undefined!=SUPERIOR_OPINION_DATE&&''!=SUPERIOR_OPINION_DATE){
                        vm.pd.SUPERIOR_OPINION_DATE=SUPERIOR_OPINION_DATE;
                    } */
               
        },
    	
		//对日期进行检验
		verifyDate:function(allDate){
			var result={      	//返回值
				isNull:false,   //是否为isNull
				isTrue:true,      //格式是否正确
				msg:"",
			};
			if(allDate.length==2){
				result.isNull=true;
				result.msg="日期不能为空!";
				return result;
			}
			var dateArr =allDate.split("/");
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