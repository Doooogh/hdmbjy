
var vm = new Vue({
	el: '#app',
	data:{
        TERMAPPROVE_ID: '',	//主键ID
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
        		this.TERMAPPROVE_ID = FDID;
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
            if(this.pd.NUMBER == '' || this.pd.NUMBER == undefined){
                    $("#NUMBER").tips({
                        side:3,
                        msg:'请输入海教社停号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.NUMBER = '';
                    this.$refs.NUMBER.focus();
                return false;
                }
            if(this.pd.SCHOOL_ALLNAME == '' || this.pd.SCHOOL_ALLNAME == undefined){
                    $("#SCHOOL_ALLNAME").tips({
                        side:3,
                        msg:'请输入学校全称',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SCHOOL_ALLNAME = '';
                    this.$refs.SCHOOL_ALLNAME.focus();
                return false;
                }
            if(this.pd.LICENSE == '' || this.pd.LICENSE == undefined){
                    $("#LICENSE").tips({
                        side:3,
                        msg:'请输入许可证号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LICENSE = '';
                    this.$refs.LICENSE.focus();
                return false;
                }
            if(this.pd.PRINCIPAL == '' || this.pd.PRINCIPAL == undefined){
                    $("#PRINCIPAL").tips({
                        side:3,
                        msg:'请输入校长',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL = '';
                    this.$refs.PRINCIPAL.focus();
                return false;
                }
            if(this.pd.PRINCIPAL_ID_NUMBER == '' || this.pd.PRINCIPAL_ID_NUMBER == undefined){
                    $("#PRINCIPAL_ID_NUMBER").tips({
                        side:3,
                        msg:'请输入校长身份证号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL_ID_NUMBER = '';
                    this.$refs.PRINCIPAL_ID_NUMBER.focus();
                return false;
                }
            if(this.pd.PRINCIPAL_ADDRESS == '' || this.pd.PRINCIPAL_ADDRESS == undefined){
                    $("#PRINCIPAL_ADDRESS").tips({
                        side:3,
                        msg:'请输入校长家庭住址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL_ADDRESS = '';
                    this.$refs.PRINCIPAL_ADDRESS.focus();
                return false;
                }
            if(this.pd.PRINCIPAL_PHONE == '' || this.pd.PRINCIPAL_PHONE == undefined){
                    $("#PRINCIPAL_PHONE").tips({
                        side:3,
                        msg:'请输入校长电话手机',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL_PHONE = '';
                    this.$refs.PRINCIPAL_PHONE.focus();
                return false;
                }
            if(this.pd.LEGAL_PERSON == '' || this.pd.LEGAL_PERSON == undefined){
                    $("#LEGAL_PERSON").tips({
                        side:3,
                        msg:'请输入法定代表人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_PERSON = '';
                    this.$refs.LEGAL_PERSON.focus();
                return false;
                }
            if(this.pd.LEGAL_PERSON_ID_NUMBER == '' || this.pd.LEGAL_PERSON_ID_NUMBER == undefined){
                    $("#LEGAL_PERSON_ID_NUMBER").tips({
                        side:3,
                        msg:'请输入法定代表人身份证号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_PERSON_ID_NUMBER = '';
                    this.$refs.LEGAL_PERSON_ID_NUMBER.focus();
                return false;
                }
            if(this.pd.LEGAL_PERSON_ADDRESS == '' || this.pd.LEGAL_PERSON_ADDRESS == undefined){
                    $("#LEGAL_PERSON_ADDRESS").tips({
                        side:3,
                        msg:'请输入法定代表人家庭住址',
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
            if(this.pd.ORGANIZER == '' || this.pd.ORGANIZER == undefined){
                    $("#ORGANIZER").tips({
                        side:3,
                        msg:'请输入举办者(个人)',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER = '';
                    this.$refs.ORGANIZER.focus();
                return false;
                }
            if(this.pd.ORGANIZER_ID_NUMBER == '' || this.pd.ORGANIZER_ID_NUMBER == undefined){
                    $("#ORGANIZER_ID_NUMBER").tips({
                        side:3,
                        msg:'请输入举办者(个人)身份证号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_ID_NUMBER = '';
                    this.$refs.ORGANIZER_ID_NUMBER.focus();
                return false;
                }
            if(this.pd.ORGANIZER_ADDRESS == '' || this.pd.ORGANIZER_ADDRESS == undefined){
                    $("#ORGANIZER_ADDRESS").tips({
                        side:3,
                        msg:'请输入举办者(个人)家庭住址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_ADDRESS = '';
                    this.$refs.ORGANIZER_ADDRESS.focus();
                return false;
                }
            if(this.pd.ORGANIZER_PHONE == '' || this.pd.ORGANIZER_PHONE == undefined){
                    $("#ORGANIZER_PHONE").tips({
                        side:3,
                        msg:'请输入举办者(个人)电话手机',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_PHONE = '';
                    this.$refs.ORGANIZER_PHONE.focus();
                return false;
                }
            if(this.pd.ORGANIZER_C_NAME == '' || this.pd.ORGANIZER_C_NAME == undefined){
                    $("#ORGANIZER_C_NAME").tips({
                        side:3,
                        msg:'请输入举办者单位名称',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_C_NAME = '';
                    this.$refs.ORGANIZER_C_NAME.focus();
                return false;
                }
            if(this.pd.ORGANIZER_C_PHONE == '' || this.pd.ORGANIZER_C_PHONE == undefined){
                    $("#ORGANIZER_C_PHONE").tips({
                        side:3,
                        msg:'请输入举办者单位电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_C_PHONE = '';
                    this.$refs.ORGANIZER_C_PHONE.focus();
                return false;
                }
            if(this.pd.ORGANIZER_C_ADDRESS == '' || this.pd.ORGANIZER_C_ADDRESS == undefined){
                    $("#ORGANIZER_C_ADDRESS").tips({
                        side:3,
                        msg:'请输入举办者单位地址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_C_ADDRESS = '';
                    this.$refs.ORGANIZER_C_ADDRESS.focus();
                return false;
                }
            if(this.pd.ORGANIZER_C_ADDRESS_PHONE == '' || this.pd.ORGANIZER_C_ADDRESS_PHONE == undefined){
                    $("#ORGANIZER_C_ADDRESS_PHONE").tips({
                        side:3,
                        msg:'请输入举办者单位地址电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_C_ADDRESS_PHONE = '';
                    this.$refs.ORGANIZER_C_ADDRESS_PHONE.focus();
                return false;
                }
            if(this.pd.ORGANIZER_C_ADDRESS_POST == '' || this.pd.ORGANIZER_C_ADDRESS_POST == undefined){
                    $("#ORGANIZER_C_ADDRESS_POST").tips({
                        side:3,
                        msg:'请输入举办者单位地址邮编',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORGANIZER_C_ADDRESS_POST = '';
                    this.$refs.ORGANIZER_C_ADDRESS_POST.focus();
                return false;
                }
            if(this.pd.TERM_REASON == '' || this.pd.TERM_REASON == undefined){
                    $("#TERM_REASON").tips({
                        side:3,
                        msg:'请输入终止办学理由',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.TERM_REASON = '';
                    this.$refs.TERM_REASON.focus();
                return false;
                }
            if(this.pd.HAND_RESULT == '' || this.pd.HAND_RESULT == undefined){
                    $("#HAND_RESULT").tips({
                        side:3,
                        msg:'请输入善后工作处理结果',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.HAND_RESULT = '';
                    this.$refs.HAND_RESULT.focus();
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
         /*   if(this.pd.ORGANIZER_OPINION_DATE == '' || this.pd.ORGANIZER_OPINION_DATE == undefined){
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
            if(this.pd.DEPT_OPINION == '' || this.pd.DEPT_OPINION == undefined){
                    $("#DEPT_OPINION").tips({
                        side:3,
                        msg:'请输入教育行政部门意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DEPT_OPINION = '';
                    this.$refs.DEPT_OPINION.focus();
                return false;
                }
           /* if(this.pd.DEPT_OPINION_DATE == '' || this.pd.DEPT_OPINION_DATE == undefined){
                    $("#DEPT_OPINION_DATE").tips({
                        side:3,
                        msg:'请输入教育行政部门意见日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DEPT_OPINION_DATE = '';
                    this.$refs.DEPT_OPINION_DATE.focus();
                return false;
                } */
				
				//可以全部为空的DATE
				var result=vm.verifyDate(this.pd.DEPT_OPINION_DATE);	
				if(!result.isNull){
					if(!result.isTrue){
						$("#this.pd.DEPT_OPINION_DATE").tips({
							side:3,
							msg:result.msg,
							bg:'#AE81FF',
							time:2
						});
						vm.pd.DEPT_OPINION_DATE = '';
						vm.pd.YEAR2=vm.pd.MONTH2=vm.pd.DAY2='';     //编号后的YEAR MONTH DAY
						return false;
					}
				}
				
            if(this.pd.SENDER == '' || this.pd.SENDER == undefined){
                    $("#SENDER").tips({
                        side:3,
                        msg:'请输入交件人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SENDER = '';
                    this.$refs.SENDER.focus();
                return false;
                }
            if(this.pd.SEND_DATE == '' || this.pd.SEND_DATE == undefined){
                    $("#SEND_DATE").tips({
                        side:3,
                        msg:'请输入交件日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SEND_DATE = '';
                    this.$refs.SEND_DATE.focus();
                return false;
                }
            if(this.pd.RECEIVER == '' || this.pd.RECEIVER == undefined){
                    $("#RECEIVER").tips({
                        side:3,
                        msg:'请输入受理人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.RECEIVER = '';
                    this.$refs.RECEIVER.focus();
                return false;
                }
            if(this.pd.RECEIVE_DATE == '' || this.pd.RECEIVE_DATE == undefined){
                    $("#RECEIVE_DATE").tips({
                        side:3,
                        msg:'请输入受理日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.RECEIVE_DATE = '';
                    this.$refs.RECEIVE_DATE.focus();
                return false;
                }
            if(this.pd.VERIFIER == '' || this.pd.VERIFIER == undefined){
                    $("#VERIFIER").tips({
                        side:3,
                        msg:'请输入审核人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.VERIFIER = '';
                    this.$refs.VERIFIER.focus();
                return false;
                }
            if(this.pd.VERIFIER_DATE == '' || this.pd.VERIFIER_DATE == undefined){
                    $("#VERIFIER_DATE").tips({
                        side:3,
                        msg:'请输入审核日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.VERIFIER_DATE = '';
                    this.$refs.VERIFIER_DATE.focus();
                return false;
                }
            if(this.pd.REHEARING_PERSON == '' || this.pd.REHEARING_PERSON == undefined){
                    $("#REHEARING_PERSON").tips({
                        side:3,
                        msg:'请输入复审人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.REHEARING_PERSON = '';
                    this.$refs.REHEARING_PERSON.focus();
                return false;
                }
            if(this.pd.REHEARING_PERSON_DATE == '' || this.pd.REHEARING_PERSON_DATE == undefined){
                    $("#REHEARING_PERSON_DATE").tips({
                        side:3,
                        msg:'请输入复审日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.REHEARING_PERSON_DATE = '';
                    this.$refs.REHEARING_PERSON_DATE.focus();
                return false;
                }
            if(this.pd.BEIZHU == '' || this.pd.BEIZHU == undefined){
                    $("#BEIZHU").tips({
                        side:3,
                        msg:'请输入备注',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BEIZHU = '';
                    this.$refs.BEIZHU.focus();
                return false;
                }
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'termapprove/'+this.msg,
			    	data: {
						TERMAPPROVE_ID:this.TERMAPPROVE_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

						NUMBER:this.pd.NUMBER,

						SCHOOL_ALLNAME:this.pd.SCHOOL_ALLNAME,

						LICENSE:this.pd.LICENSE,

						PRINCIPAL:this.pd.PRINCIPAL,

						PRINCIPAL_ID_NUMBER:this.pd.PRINCIPAL_ID_NUMBER,

						PRINCIPAL_ADDRESS:this.pd.PRINCIPAL_ADDRESS,

						PRINCIPAL_PHONE:this.pd.PRINCIPAL_PHONE,

						LEGAL_PERSON:this.pd.LEGAL_PERSON,

						LEGAL_PERSON_ID_NUMBER:this.pd.LEGAL_PERSON_ID_NUMBER,

						LEGAL_PERSON_ADDRESS:this.pd.LEGAL_PERSON_ADDRESS,

						LEGAL_PERSON_PHONE:this.pd.LEGAL_PERSON_PHONE,

						ORGANIZER:this.pd.ORGANIZER,

						ORGANIZER_ID_NUMBER:this.pd.ORGANIZER_ID_NUMBER,

						ORGANIZER_ADDRESS:this.pd.ORGANIZER_ADDRESS,

						ORGANIZER_PHONE:this.pd.ORGANIZER_PHONE,

						ORGANIZER_C_NAME:this.pd.ORGANIZER_C_NAME,

						ORGANIZER_C_PHONE:this.pd.ORGANIZER_C_PHONE,

						ORGANIZER_C_ADDRESS:this.pd.ORGANIZER_C_ADDRESS,

						ORGANIZER_C_ADDRESS_PHONE:this.pd.ORGANIZER_C_ADDRESS_PHONE,

						ORGANIZER_C_ADDRESS_POST:this.pd.ORGANIZER_C_ADDRESS_POST,

						TERM_REASON:this.pd.TERM_REASON,

						HAND_RESULT:this.pd.HAND_RESULT,

						ORGANIZER_OPINION:this.pd.ORGANIZER_OPINION,

						ORGANIZER_OPINION_DATE:this.pd.ORGANIZER_OPINION_DATE,

						DEPT_OPINION:this.pd.DEPT_OPINION,

						DEPT_OPINION_DATE:this.pd.DEPT_OPINION_DATE,

						SENDER:this.pd.SENDER,

						SEND_DATE:this.pd.SEND_DATE,

						RECEIVER:this.pd.RECEIVER,

						RECEIVE_DATE:this.pd.RECEIVE_DATE,

						VERIFIER:this.pd.VERIFIER,

						VERIFIER_DATE:this.pd.VERIFIER_DATE,

						REHEARING_PERSON:this.pd.REHEARING_PERSON,

						REHEARING_PERSON_DATE:this.pd.REHEARING_PERSON_DATE,

						BEIZHU:this.pd.BEIZHU,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.TERMAPPROVE_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("海淀区民办培训学校申请终止审批表",data.exception);//显示异常
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
				url: httpurl+'termapprove/goEdit',
		    	data: {
                    TERMAPPROVE_ID:this.TERMAPPROVE_ID,
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
						if(data.pd.DEPT_OPINION_DATE!=''&&null!=data.pd.DEPT_OPINION_DATE&&undefined!=data.pd.DEPT_OPINION_DATE){
									var DEPT_OPINION_DATE=data.pd.DEPT_OPINION_DATE.split("/");
									vm.pd.YEAR2=DEPT_OPINION_DATE[0];
									vm.pd.MONTH2=DEPT_OPINION_DATE[1];
									vm.pd.DAY2=DEPT_OPINION_DATE[2];
						}
                     }else if ("exception" == data.result){
                     	showException("海淀区民办培训学校申请终止审批表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var NUMBER=$("#NUMBER").text();
                    if(null!=NUMBER&&undefined!=NUMBER&&''!=NUMBER){
                        vm.pd.NUMBER=NUMBER;
                    }
                    var SCHOOL_ALLNAME=$("#SCHOOL_ALLNAME").text();
                    if(null!=SCHOOL_ALLNAME&&undefined!=SCHOOL_ALLNAME&&''!=SCHOOL_ALLNAME){
                        vm.pd.SCHOOL_ALLNAME=SCHOOL_ALLNAME;
                    }
                    var LICENSE=$("#LICENSE").text();
                    if(null!=LICENSE&&undefined!=LICENSE&&''!=LICENSE){
                        vm.pd.LICENSE=LICENSE;
                    }
                    var PRINCIPAL=$("#PRINCIPAL").text();
                    if(null!=PRINCIPAL&&undefined!=PRINCIPAL&&''!=PRINCIPAL){
                        vm.pd.PRINCIPAL=PRINCIPAL;
                    }
                    var PRINCIPAL_ID_NUMBER=$("#PRINCIPAL_ID_NUMBER").text();
                    if(null!=PRINCIPAL_ID_NUMBER&&undefined!=PRINCIPAL_ID_NUMBER&&''!=PRINCIPAL_ID_NUMBER){
                        vm.pd.PRINCIPAL_ID_NUMBER=PRINCIPAL_ID_NUMBER;
                    }
                    var PRINCIPAL_ADDRESS=$("#PRINCIPAL_ADDRESS").text();
                    if(null!=PRINCIPAL_ADDRESS&&undefined!=PRINCIPAL_ADDRESS&&''!=PRINCIPAL_ADDRESS){
                        vm.pd.PRINCIPAL_ADDRESS=PRINCIPAL_ADDRESS;
                    }
                    var PRINCIPAL_PHONE=$("#PRINCIPAL_PHONE").text();
                    if(null!=PRINCIPAL_PHONE&&undefined!=PRINCIPAL_PHONE&&''!=PRINCIPAL_PHONE){
                        vm.pd.PRINCIPAL_PHONE=PRINCIPAL_PHONE;
                    }
                    var LEGAL_PERSON=$("#LEGAL_PERSON").text();
                    if(null!=LEGAL_PERSON&&undefined!=LEGAL_PERSON&&''!=LEGAL_PERSON){
                        vm.pd.LEGAL_PERSON=LEGAL_PERSON;
                    }
                    var LEGAL_PERSON_ID_NUMBER=$("#LEGAL_PERSON_ID_NUMBER").text();
                    if(null!=LEGAL_PERSON_ID_NUMBER&&undefined!=LEGAL_PERSON_ID_NUMBER&&''!=LEGAL_PERSON_ID_NUMBER){
                        vm.pd.LEGAL_PERSON_ID_NUMBER=LEGAL_PERSON_ID_NUMBER;
                    }
                    var LEGAL_PERSON_ADDRESS=$("#LEGAL_PERSON_ADDRESS").text();
                    if(null!=LEGAL_PERSON_ADDRESS&&undefined!=LEGAL_PERSON_ADDRESS&&''!=LEGAL_PERSON_ADDRESS){
                        vm.pd.LEGAL_PERSON_ADDRESS=LEGAL_PERSON_ADDRESS;
                    }
                    var LEGAL_PERSON_PHONE=$("#LEGAL_PERSON_PHONE").text();
                    if(null!=LEGAL_PERSON_PHONE&&undefined!=LEGAL_PERSON_PHONE&&''!=LEGAL_PERSON_PHONE){
                        vm.pd.LEGAL_PERSON_PHONE=LEGAL_PERSON_PHONE;
                    }
                    var ORGANIZER=$("#ORGANIZER").text();
                    if(null!=ORGANIZER&&undefined!=ORGANIZER&&''!=ORGANIZER){
                        vm.pd.ORGANIZER=ORGANIZER;
                    }
                    var ORGANIZER_ID_NUMBER=$("#ORGANIZER_ID_NUMBER").text();
                    if(null!=ORGANIZER_ID_NUMBER&&undefined!=ORGANIZER_ID_NUMBER&&''!=ORGANIZER_ID_NUMBER){
                        vm.pd.ORGANIZER_ID_NUMBER=ORGANIZER_ID_NUMBER;
                    }
                    var ORGANIZER_ADDRESS=$("#ORGANIZER_ADDRESS").text();
                    if(null!=ORGANIZER_ADDRESS&&undefined!=ORGANIZER_ADDRESS&&''!=ORGANIZER_ADDRESS){
                        vm.pd.ORGANIZER_ADDRESS=ORGANIZER_ADDRESS;
                    }
                    var ORGANIZER_PHONE=$("#ORGANIZER_PHONE").text();
                    if(null!=ORGANIZER_PHONE&&undefined!=ORGANIZER_PHONE&&''!=ORGANIZER_PHONE){
                        vm.pd.ORGANIZER_PHONE=ORGANIZER_PHONE;
                    }
                    var ORGANIZER_C_NAME=$("#ORGANIZER_C_NAME").text();
                    if(null!=ORGANIZER_C_NAME&&undefined!=ORGANIZER_C_NAME&&''!=ORGANIZER_C_NAME){
                        vm.pd.ORGANIZER_C_NAME=ORGANIZER_C_NAME;
                    }
                    var ORGANIZER_C_PHONE=$("#ORGANIZER_C_PHONE").text();
                    if(null!=ORGANIZER_C_PHONE&&undefined!=ORGANIZER_C_PHONE&&''!=ORGANIZER_C_PHONE){
                        vm.pd.ORGANIZER_C_PHONE=ORGANIZER_C_PHONE;
                    }
                    var ORGANIZER_C_ADDRESS=$("#ORGANIZER_C_ADDRESS").text();
                    if(null!=ORGANIZER_C_ADDRESS&&undefined!=ORGANIZER_C_ADDRESS&&''!=ORGANIZER_C_ADDRESS){
                        vm.pd.ORGANIZER_C_ADDRESS=ORGANIZER_C_ADDRESS;
                    }
                    var ORGANIZER_C_ADDRESS_PHONE=$("#ORGANIZER_C_ADDRESS_PHONE").text();
                    if(null!=ORGANIZER_C_ADDRESS_PHONE&&undefined!=ORGANIZER_C_ADDRESS_PHONE&&''!=ORGANIZER_C_ADDRESS_PHONE){
                        vm.pd.ORGANIZER_C_ADDRESS_PHONE=ORGANIZER_C_ADDRESS_PHONE;
                    }
                    var ORGANIZER_C_ADDRESS_POST=$("#ORGANIZER_C_ADDRESS_POST").text();
                    if(null!=ORGANIZER_C_ADDRESS_POST&&undefined!=ORGANIZER_C_ADDRESS_POST&&''!=ORGANIZER_C_ADDRESS_POST){
                        vm.pd.ORGANIZER_C_ADDRESS_POST=ORGANIZER_C_ADDRESS_POST;
                    }
                    var TERM_REASON=$("#TERM_REASON").text();
                    if(null!=TERM_REASON&&undefined!=TERM_REASON&&''!=TERM_REASON){
                        vm.pd.TERM_REASON=TERM_REASON;
                    }
                    var HAND_RESULT=$("#HAND_RESULT").text();
                    if(null!=HAND_RESULT&&undefined!=HAND_RESULT&&''!=HAND_RESULT){
                        vm.pd.HAND_RESULT=HAND_RESULT;
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
					
					
                    var DEPT_OPINION=$("#DEPT_OPINION").text();
                    if(null!=DEPT_OPINION&&undefined!=DEPT_OPINION&&''!=DEPT_OPINION){
                        vm.pd.DEPT_OPINION=DEPT_OPINION;
                    }
                   /* var DEPT_OPINION_DATE=$("#DEPT_OPINION_DATE").text();
                    if(null!=DEPT_OPINION_DATE&&undefined!=DEPT_OPINION_DATE&&''!=DEPT_OPINION_DATE){
                        vm.pd.DEPT_OPINION_DATE=DEPT_OPINION_DATE;
                    } */
					
					
					var YEAR2=$("#YEAR2").text();
					if(null!=YEAR2&&undefined!=YEAR2&&''!=YEAR2){
						vm.pd.YEAR2=YEAR2;
					}else{
						vm.pd.YEAR2='';
					}
					var MONTH2=$("#MONTH2").text();
					if(null!=MONTH2&&undefined!=MONTH2&&''!=MONTH2){
						if(MONTH2<10&&MONTH2.length==1){
							MONTH2=("0"+MONTH2)
						}
						vm.pd.MONTH2=MONTH2;
					}else{
						vm.pd.MONTH2='';
					}
					var DAY2=$("#DAY2").text();
					if(null!=DAY2&&undefined!=DAY2&&''!=DAY2){
						if(DAY2<10&&DAY2.length==1){
							DAY2=("0"+DAY2)
						}
						vm.pd.DAY2=DAY2;
					}else{
						vm.pd.DAY2='';
					}
					vm.pd.DEPT_OPINION_DATE=vm.pd.YEAR2+"/"+vm.pd.MONTH2+"/"+vm.pd.DAY2;
					
					
                    var SENDER=$("#SENDER").text();
                    if(null!=SENDER&&undefined!=SENDER&&''!=SENDER){
                        vm.pd.SENDER=SENDER;
                    }
                    var SEND_DATE=$("#SEND_DATE").text();
                    if(null!=SEND_DATE&&undefined!=SEND_DATE&&''!=SEND_DATE){
                        vm.pd.SEND_DATE=SEND_DATE;
                    }
                    var RECEIVER=$("#RECEIVER").text();
                    if(null!=RECEIVER&&undefined!=RECEIVER&&''!=RECEIVER){
                        vm.pd.RECEIVER=RECEIVER;
                    }
                    var RECEIVE_DATE=$("#RECEIVE_DATE").text();
                    if(null!=RECEIVE_DATE&&undefined!=RECEIVE_DATE&&''!=RECEIVE_DATE){
                        vm.pd.RECEIVE_DATE=RECEIVE_DATE;
                    }
                    var VERIFIER=$("#VERIFIER").text();
                    if(null!=VERIFIER&&undefined!=VERIFIER&&''!=VERIFIER){
                        vm.pd.VERIFIER=VERIFIER;
                    }
                    var VERIFIER_DATE=$("#VERIFIER_DATE").text();
                    if(null!=VERIFIER_DATE&&undefined!=VERIFIER_DATE&&''!=VERIFIER_DATE){
                        vm.pd.VERIFIER_DATE=VERIFIER_DATE;
                    }
                    var REHEARING_PERSON=$("#REHEARING_PERSON").text();
                    if(null!=REHEARING_PERSON&&undefined!=REHEARING_PERSON&&''!=REHEARING_PERSON){
                        vm.pd.REHEARING_PERSON=REHEARING_PERSON;
                    }
                    var REHEARING_PERSON_DATE=$("#REHEARING_PERSON_DATE").text();
                    if(null!=REHEARING_PERSON_DATE&&undefined!=REHEARING_PERSON_DATE&&''!=REHEARING_PERSON_DATE){
                        vm.pd.REHEARING_PERSON_DATE=REHEARING_PERSON_DATE;
                    }
                    var BEIZHU=$("#BEIZHU").text();
                    if(null!=BEIZHU&&undefined!=BEIZHU&&''!=BEIZHU){
                        vm.pd.BEIZHU=BEIZHU;
                    }
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