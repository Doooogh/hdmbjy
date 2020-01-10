
var vm = new Vue({
	el: '#app',
	data:{
        MBPXAPPLYBGTABLE_ID: '',	//主键ID
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
        		this.MBPXAPPLYBGTABLE_ID = FDID;
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
			vm.pd=[];
 			vm.getValue();
			vm.SUB_STATUS=status;
			if(status==0){
            if(this.pd.NUMBER == '' || this.pd.NUMBER == undefined){
                    $("#NUMBER").tips({
                        side:3,
                        msg:'请输入海教社变号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.NUMBER = '';
                    this.$refs.NUMBER.focus();
                return false;
                }
            if(this.pd.SCHOOL_NAME == '' || this.pd.SCHOOL_NAME == undefined){
                    $("#SCHOOL_NAME").tips({
                        side:3,
                        msg:'请输入学校全称',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SCHOOL_NAME = '';
                    this.$refs.SCHOOL_NAME.focus();
                return false;
                }
            if(this.pd.J_NUMBER1 == '' || this.pd.J_NUMBER1 == undefined){
                    $("#J_NUMBER1").tips({
                        side:3,
                        msg:'请输入教民号1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.J_NUMBER1 = '';
                    this.$refs.J_NUMBER1.focus();
                return false;
                }
            if(this.pd.J_NUMBER2 == '' || this.pd.J_NUMBER2 == undefined){
                    $("#J_NUMBER2").tips({
                        side:3,
                        msg:'请输入教民号2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.J_NUMBER2 = '';
                    this.$refs.J_NUMBER2.focus();
                return false;
                }
            if(this.pd.PRINCIPAL_AND_PHONE == '' || this.pd.PRINCIPAL_AND_PHONE == undefined){
                    $("#PRINCIPAL_AND_PHONE").tips({
                        side:3,
                        msg:'请输入校长及电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL_AND_PHONE = '';
                    this.$refs.PRINCIPAL_AND_PHONE.focus();
                return false;
                }
            if(this.pd.LINKMAN_AND_PHONE == '' || this.pd.LINKMAN_AND_PHONE == undefined){
                    $("#LINKMAN_AND_PHONE").tips({
                        side:3,
                        msg:'请输入联系人及电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LINKMAN_AND_PHONE = '';
                    this.$refs.LINKMAN_AND_PHONE.focus();
                return false;
                }
            if(this.pd.TO_SCHOOL_NAME == '' || this.pd.TO_SCHOOL_NAME == undefined){
                    $("#TO_SCHOOL_NAME").tips({
                        side:3,
                        msg:'请输入校名',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.TO_SCHOOL_NAME = '';
                    this.$refs.TO_SCHOOL_NAME.focus();
                return false;
                }
            if(this.pd.TO_SCHOOL_ADDRESS == '' || this.pd.TO_SCHOOL_ADDRESS == undefined){
                    $("#TO_SCHOOL_ADDRESS").tips({
                        side:3,
                        msg:'请输入校址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.TO_SCHOOL_ADDRESS = '';
                    this.$refs.TO_SCHOOL_ADDRESS.focus();
                return false;
                }
            if(this.pd.TO_ORGANIZER == '' || this.pd.TO_ORGANIZER == undefined){
                    $("#TO_ORGANIZER").tips({
                        side:3,
                        msg:'请输入举办者变更',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.TO_ORGANIZER = '';
                    this.$refs.TO_ORGANIZER.focus();
                return false;
                }
            if(this.pd.CHANGE_BEFORE == '' || this.pd.CHANGE_BEFORE == undefined){
                    $("#CHANGE_BEFORE").tips({
                        side:3,
                        msg:'请输入变更前',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.CHANGE_BEFORE = '';
                    this.$refs.CHANGE_BEFORE.focus();
                return false;
                }
            if(this.pd.CHANGE_AFTER == '' || this.pd.CHANGE_AFTER == undefined){
                    $("#CHANGE_AFTER").tips({
                        side:3,
                        msg:'请输入变更后',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.CHANGE_AFTER = '';
                    this.$refs.CHANGE_AFTER.focus();
                return false;
                }
            if(this.pd.REASON == '' || this.pd.REASON == undefined){
                    $("#REASON").tips({
                        side:3,
                        msg:'请输入变更理由',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.REASON = '';
                    this.$refs.REASON.focus();
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
                }
				 */
				
			//可以全部为空的DATE
			var result=vm.verifyDate(this.pd.ORGANIZER_OPINION);	
			if(!result.isNull){
				if(!result.isTrue){
					$("#ORGANIZER_OPINION").tips({
						side:3,
						msg:result.msg,
						bg:'#AE81FF',
						time:2
					});
					vm.pd.ORGANIZER_OPINION = '';
					vm.pd.YEAR1=vm.pd.MONTH1=vm.pd.DAY1='';     //编号后的YEAR MONTH DAY
					return false;
				}
			}		
				
				
            if(this.pd.DEPT_OPINION == '' || this.pd.DEPT_OPINION == undefined){
                    $("#DEPT_OPINION").tips({
                        side:3,
                        msg:'请输入教育行政部门审批意见',
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
                        msg:'请输入教育行政部门审批意见日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DEPT_OPINION_DATE = '';
                    this.$refs.DEPT_OPINION_DATE.focus();
                return false;
                } */
				
			//可以全部为空的DATE
			var result=vm.verifyDate(this.pd.refs.DEPT_OPINION_DATE.focus);	
			if(!result.isNull){
				if(!result.isTrue){
					$("#refs.DEPT_OPINION_DATE.focus").tips({
						side:3,
						msg:result.msg,
						bg:'#AE81FF',
						time:2
					});
					vm.pd.refs.DEPT_OPINION_DATE.focus = '';
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
            if(this.pd.SENDER_DATE == '' || this.pd.SENDER_DATE == undefined){
                    $("#SENDER_DATE").tips({
                        side:3,
                        msg:'请输入交件日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SENDER_DATE = '';
                    this.$refs.SENDER_DATE.focus();
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
            if(this.pd.RECEIVER_DATE == '' || this.pd.RECEIVER_DATE == undefined){
                    $("#RECEIVER_DATE").tips({
                        side:3,
                        msg:'请输入受理日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.RECEIVER_DATE = '';
                    this.$refs.RECEIVER_DATE.focus();
                return false;
                }
            if(this.pd.AUDITOR == '' || this.pd.AUDITOR == undefined){
                    $("#AUDITOR").tips({
                        side:3,
                        msg:'请输入审核人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.AUDITOR = '';
                    this.$refs.AUDITOR.focus();
                return false;
                }
            if(this.pd.AUDITOR_DATE == '' || this.pd.AUDITOR_DATE == undefined){
                    $("#AUDITOR_DATE").tips({
                        side:3,
                        msg:'请输入审核日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.AUDITOR_DATE = '';
                    this.$refs.AUDITOR_DATE.focus();
                return false;
                }
            if(this.pd.AGAIN_AUDITOR == '' || this.pd.AGAIN_AUDITOR == undefined){
                    $("#AGAIN_AUDITOR").tips({
                        side:3,
                        msg:'请输入复审人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.AGAIN_AUDITOR = '';
                    this.$refs.AGAIN_AUDITOR.focus();
                return false;
                }
            if(this.pd.AGAIN_AUDITOR_DATE == '' || this.pd.AGAIN_AUDITOR_DATE == undefined){
                    $("#AGAIN_AUDITOR_DATE").tips({
                        side:3,
                        msg:'请输入复审日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.AGAIN_AUDITOR_DATE = '';
                    this.$refs.AGAIN_AUDITOR_DATE.focus();
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
					url: httpurl+'mbpxapplybgtable/'+this.msg,
			    	data: {
MBPXAPPLYBGTABLE_ID:this.MBPXAPPLYBGTABLE_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

						NUMBER:this.pd.NUMBER,

						SCHOOL_NAME:this.pd.SCHOOL_NAME,

						J_NUMBER1:this.pd.J_NUMBER1,

						J_NUMBER2:this.pd.J_NUMBER2,

						PRINCIPAL_AND_PHONE:this.pd.PRINCIPAL_AND_PHONE,

						LINKMAN_AND_PHONE:this.pd.LINKMAN_AND_PHONE,

						TO_SCHOOL_NAME:this.pd.TO_SCHOOL_NAME,

						TO_SCHOOL_ADDRESS:this.pd.TO_SCHOOL_ADDRESS,

						TO_ORGANIZER:this.pd.TO_ORGANIZER,

						CHANGE_BEFORE:this.pd.CHANGE_BEFORE,

						CHANGE_AFTER:this.pd.CHANGE_AFTER,

						REASON:this.pd.REASON,

						ORGANIZER_OPINION:this.pd.ORGANIZER_OPINION,

						ORGANIZER_OPINION_DATE:this.pd.ORGANIZER_OPINION_DATE,

						DEPT_OPINION:this.pd.DEPT_OPINION,

						DEPT_OPINION_DATE:this.pd.DEPT_OPINION_DATE,

						SENDER:this.pd.SENDER,

						SENDER_DATE:this.pd.SENDER_DATE,

						RECEIVER:this.pd.RECEIVER,

						RECEIVER_DATE:this.pd.RECEIVER_DATE,

						AUDITOR:this.pd.AUDITOR,

						AUDITOR_DATE:this.pd.AUDITOR_DATE,

						AGAIN_AUDITOR:this.pd.AGAIN_AUDITOR,

						AGAIN_AUDITOR_DATE:this.pd.AGAIN_AUDITOR_DATE,

						BEIZHU:this.pd.BEIZHU,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.MBPXAPPLYBGTABLE_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("海淀区民办培训学校申请变更审批表",data.exception);//显示异常
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
				url: httpurl+'mbpxapplybgtable/goEdit',
		    	data: {
                    MBPXAPPLYBGTABLE_ID:this.MBPXAPPLYBGTABLE_ID,
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
                     	showException("海淀区民办培训学校申请变更审批表",data.exception);	//显示异常
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
                    var SCHOOL_NAME=$("#SCHOOL_NAME").text();
                    if(null!=SCHOOL_NAME&&undefined!=SCHOOL_NAME&&''!=SCHOOL_NAME){
                        vm.pd.SCHOOL_NAME=SCHOOL_NAME;
                    }
                    var J_NUMBER1=$("#J_NUMBER1").text();
                    if(null!=J_NUMBER1&&undefined!=J_NUMBER1&&''!=J_NUMBER1){
                        vm.pd.J_NUMBER1=J_NUMBER1;
                    }
                    var J_NUMBER2=$("#J_NUMBER2").text();
                    if(null!=J_NUMBER2&&undefined!=J_NUMBER2&&''!=J_NUMBER2){
                        vm.pd.J_NUMBER2=J_NUMBER2;
                    }
                    var PRINCIPAL_AND_PHONE=$("#PRINCIPAL_AND_PHONE").text();
                    if(null!=PRINCIPAL_AND_PHONE&&undefined!=PRINCIPAL_AND_PHONE&&''!=PRINCIPAL_AND_PHONE){
                        vm.pd.PRINCIPAL_AND_PHONE=PRINCIPAL_AND_PHONE;
                    }
                    var LINKMAN_AND_PHONE=$("#LINKMAN_AND_PHONE").text();
                    if(null!=LINKMAN_AND_PHONE&&undefined!=LINKMAN_AND_PHONE&&''!=LINKMAN_AND_PHONE){
                        vm.pd.LINKMAN_AND_PHONE=LINKMAN_AND_PHONE;
                    }
                    var TO_SCHOOL_NAME=$("#TO_SCHOOL_NAME").text();
                    if(null!=TO_SCHOOL_NAME&&undefined!=TO_SCHOOL_NAME&&''!=TO_SCHOOL_NAME){
                        vm.pd.TO_SCHOOL_NAME=TO_SCHOOL_NAME;
                    }
                    var TO_SCHOOL_ADDRESS=$("#TO_SCHOOL_ADDRESS").text();
                    if(null!=TO_SCHOOL_ADDRESS&&undefined!=TO_SCHOOL_ADDRESS&&''!=TO_SCHOOL_ADDRESS){
                        vm.pd.TO_SCHOOL_ADDRESS=TO_SCHOOL_ADDRESS;
                    }
                    var TO_ORGANIZER=$("#TO_ORGANIZER").text();
                    if(null!=TO_ORGANIZER&&undefined!=TO_ORGANIZER&&''!=TO_ORGANIZER){
                        vm.pd.TO_ORGANIZER=TO_ORGANIZER;
                    }
                    var CHANGE_BEFORE=$("#CHANGE_BEFORE").text();
                    if(null!=CHANGE_BEFORE&&undefined!=CHANGE_BEFORE&&''!=CHANGE_BEFORE){
                        vm.pd.CHANGE_BEFORE=CHANGE_BEFORE;
                    }
                    var CHANGE_AFTER=$("#CHANGE_AFTER").text();
                    if(null!=CHANGE_AFTER&&undefined!=CHANGE_AFTER&&''!=CHANGE_AFTER){
                        vm.pd.CHANGE_AFTER=CHANGE_AFTER;
                    }
                    var REASON=$("#REASON").text();
                    if(null!=REASON&&undefined!=REASON&&''!=REASON){
                        vm.pd.REASON=REASON;
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
                    var SENDER_DATE=$("#SENDER_DATE").text();
                    if(null!=SENDER_DATE&&undefined!=SENDER_DATE&&''!=SENDER_DATE){
                        vm.pd.SENDER_DATE=SENDER_DATE;
                    }
                    var RECEIVER=$("#RECEIVER").text();
                    if(null!=RECEIVER&&undefined!=RECEIVER&&''!=RECEIVER){
                        vm.pd.RECEIVER=RECEIVER;
                    }
                    var RECEIVER_DATE=$("#RECEIVER_DATE").text();
                    if(null!=RECEIVER_DATE&&undefined!=RECEIVER_DATE&&''!=RECEIVER_DATE){
                        vm.pd.RECEIVER_DATE=RECEIVER_DATE;
                    }
                    var AUDITOR=$("#AUDITOR").text();
                    if(null!=AUDITOR&&undefined!=AUDITOR&&''!=AUDITOR){
                        vm.pd.AUDITOR=AUDITOR;
                    }
                    var AUDITOR_DATE=$("#AUDITOR_DATE").text();
                    if(null!=AUDITOR_DATE&&undefined!=AUDITOR_DATE&&''!=AUDITOR_DATE){
                        vm.pd.AUDITOR_DATE=AUDITOR_DATE;
                    }
                    var AGAIN_AUDITOR=$("#AGAIN_AUDITOR").text();
                    if(null!=AGAIN_AUDITOR&&undefined!=AGAIN_AUDITOR&&''!=AGAIN_AUDITOR){
                        vm.pd.AGAIN_AUDITOR=AGAIN_AUDITOR;
                    }
                    var AGAIN_AUDITOR_DATE=$("#AGAIN_AUDITOR_DATE").text();
                    if(null!=AGAIN_AUDITOR_DATE&&undefined!=AGAIN_AUDITOR_DATE&&''!=AGAIN_AUDITOR_DATE){
                        vm.pd.AGAIN_AUDITOR_DATE=AGAIN_AUDITOR_DATE;
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