
var vm = new Vue({
	el: '#app',
	data:{
        ZHONGZHIAPPROVE_ID: '',	//主键ID
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
        		this.ZHONGZHIAPPROVE_ID = FDID;
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
            if(this.pd.SC_NAME == '' || this.pd.SC_NAME == undefined){
                    $("#SC_NAME").tips({
                        side:3,
                        msg:'请输入学校全称(盖章)',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SC_NAME = '';
                    this.$refs.SC_NAME.focus();
                return false;
                }
            if(this.pd.CERTIFICATE_NUM == '' || this.pd.CERTIFICATE_NUM == undefined){
                    $("#CERTIFICATE_NUM").tips({
                        side:3,
                        msg:'请输入证号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.CERTIFICATE_NUM = '';
                    this.$refs.CERTIFICATE_NUM.focus();
                return false;
                }
            if(this.pd.PRESIDENT == '' || this.pd.PRESIDENT == undefined){
                    $("#PRESIDENT").tips({
                        side:3,
                        msg:'请输入校长',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRESIDENT = '';
                    this.$refs.PRESIDENT.focus();
                return false;
                }
            if(this.pd.LINKMAN == '' || this.pd.LINKMAN == undefined){
                    $("#LINKMAN").tips({
                        side:3,
                        msg:'请输入联系人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LINKMAN = '';
                    this.$refs.LINKMAN.focus();
                return false;
                }
            if(this.pd.PHONE == '' || this.pd.PHONE == undefined){
                    $("#PHONE").tips({
                        side:3,
                        msg:'请输入联系电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PHONE = '';
                    this.$refs.PHONE.focus();
                return false;
                }
            if(this.pd.SC_ADDRESS == '' || this.pd.SC_ADDRESS == undefined){
                    $("#SC_ADDRESS").tips({
                        side:3,
                        msg:'请输入学校地址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SC_ADDRESS = '';
                    this.$refs.SC_ADDRESS.focus();
                return false;
                }
            if(this.pd.REASON == '' || this.pd.REASON == undefined){
                    $("#REASON").tips({
                        side:3,
                        msg:'请输入终止办学理由',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.REASON = '';
                    this.$refs.REASON.focus();
                return false;
                }
            if(this.pd.OPINION == '' || this.pd.OPINION == undefined){
                    $("#OPINION").tips({
                        side:3,
                        msg:'请输入举办者意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.OPINION = '';
                    this.$refs.OPINION.focus();
                return false;
                }
          /*  if(this.pd.OPINION_DATE == '' || this.pd.OPINION_DATE == undefined){
                    $("#OPINION_DATE").tips({
                        side:3,
                        msg:'请输入举办者日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.OPINION_DATE = '';
                    this.$refs.OPINION_DATE.focus();
                return false;
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
					vm.pd.YEAR1=vm.pd.MONTH1=vm.pd.DAY1='';     //编号后的YEAR MONTH DAY
					return false;
				}
								}
            if(this.pd.APPROVE_OPINION == '' || this.pd.APPROVE_OPINION == undefined){
                    $("#APPROVE_OPINION").tips({
                        side:3,
                        msg:'请输入教育行政部门审批意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.APPROVE_OPINION = '';
                    this.$refs.APPROVE_OPINION.focus();
                return false;
                }
         /*   if(this.pd.APPROVE_OPINION_DATE == '' || this.pd.APPROVE_OPINION_DATE == undefined){
                    $("#APPROVE_OPINION_DATE").tips({
                        side:3,
                        msg:'请输入教育行政部门审批意见日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.APPROVE_OPINION_DATE = '';
                    this.$refs.APPROVE_OPINION_DATE.focus();
                return false;
                } */
			var result=vm.verifyDate(this.pd.APPROVE_OPINION_DATE);
			if(!result.isNull){
				if(!result.isTrue){
					$("#APPROVE_OPINION_DATE").tips({
						side:3,
						msg:result.msg,
						bg:'#AE81FF',
						time:2
					});
					vm.pd.APPROVE_OPINION_DATE = '';
					vm.pd.YEAR2=vm.pd.MONTH2=vm.pd.DAY2='';     //编号后的YEAR MONTH DAY
					return false;
				}
								}
				
            if(this.pd.DELIVERY_AND_PHONE == '' || this.pd.DELIVERY_AND_PHONE == undefined){
                    $("#DELIVERY_AND_PHONE").tips({
                        side:3,
                        msg:'请输入交件人及电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DELIVERY_AND_PHONE = '';
                    this.$refs.DELIVERY_AND_PHONE.focus();
                return false;
                }
            if(this.pd.DELIVERY_DATE == '' || this.pd.DELIVERY_DATE == undefined){
                    $("#DELIVERY_DATE").tips({
                        side:3,
                        msg:'请输入交件日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DELIVERY_DATE = '';
                    this.$refs.DELIVERY_DATE.focus();
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
            if(this.pd.NOTIFY_DATE_COMPLETION == '' || this.pd.NOTIFY_DATE_COMPLETION == undefined){
                    $("#NOTIFY_DATE_COMPLETION").tips({
                        side:3,
                        msg:'请输入通知办结日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.NOTIFY_DATE_COMPLETION = '';
                    this.$refs.NOTIFY_DATE_COMPLETION.focus();
                return false;
                }
            if(this.pd.DELIVERED_TO_SITE == '' || this.pd.DELIVERED_TO_SITE == undefined){
                    $("#DELIVERED_TO_SITE").tips({
                        side:3,
                        msg:'请输入送达地点',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DELIVERED_TO_SITE = '';
                    this.$refs.DELIVERED_TO_SITE.focus();
                return false;
                }
            if(this.pd.SERVINT_PERSON_AND_DATE == '' || this.pd.SERVINT_PERSON_AND_DATE == undefined){
                    $("#SERVINT_PERSON_AND_DATE").tips({
                        side:3,
                        msg:'请输入送达人及日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SERVINT_PERSON_AND_DATE = '';
                    this.$refs.SERVINT_PERSON_AND_DATE.focus();
                return false;
                }
            if(this.pd.ADDRESSEE_AND_DATE == '' || this.pd.ADDRESSEE_AND_DATE == undefined){
                    $("#ADDRESSEE_AND_DATE").tips({
                        side:3,
                        msg:'请输入收件人及日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ADDRESSEE_AND_DATE = '';
                    this.$refs.ADDRESSEE_AND_DATE.focus();
                return false;
                }
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'zhongzhiapprove/'+this.msg,
			    	data: {
						ZHONGZHIAPPROVE_ID:this.ZHONGZHIAPPROVE_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,
							SC_NAME:this.pd.SC_NAME,

							CERTIFICATE_NUM:this.pd.CERTIFICATE_NUM,

							PRESIDENT:this.pd.PRESIDENT,

							LINKMAN:this.pd.LINKMAN,

							PHONE:this.pd.PHONE,

							SC_ADDRESS:this.pd.SC_ADDRESS,

							REASON:this.pd.REASON,

							OPINION:this.pd.OPINION,

							OPINION_DATE:this.pd.OPINION_DATE,

							APPROVE_OPINION:this.pd.APPROVE_OPINION,

							APPROVE_OPINION_DATE:this.pd.APPROVE_OPINION_DATE,

							DELIVERY_AND_PHONE:this.pd.DELIVERY_AND_PHONE,

							DELIVERY_DATE:this.pd.DELIVERY_DATE,

							RECEIVER:this.pd.RECEIVER,

							RECEIVER_DATE:this.pd.RECEIVER_DATE,

							VERIFIER:this.pd.VERIFIER,

							VERIFIER_DATE:this.pd.VERIFIER_DATE,

							NOTIFY_DATE_COMPLETION:this.pd.NOTIFY_DATE_COMPLETION,

							DELIVERED_TO_SITE:this.pd.DELIVERED_TO_SITE,

							SERVINT_PERSON_AND_DATE:this.pd.SERVINT_PERSON_AND_DATE,

							ADDRESSEE_AND_DATE:this.pd.ADDRESSEE_AND_DATE,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.ZHONGZHIAPPROVE_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "暂存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("海淀区民办学校申请终止审核表",data.exception);//显示异常
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
				url: httpurl+'zhongzhiapprove/goEdit',
		    	data: {
                    ZHONGZHIAPPROVE_ID:this.ZHONGZHIAPPROVE_ID,
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
							
						if(data.pd.APPROVE_OPINION_DATE!=''&&null!=data.pd.APPROVE_OPINION_DATE&&undefined!=data.pd.APPROVE_OPINION_DATE){
								var APPROVE_OPINION_DATE=data.pd.APPROVE_OPINION_DATE.split("/");
								vm.pd.YEAR1=APPROVE_OPINION_DATE[0];
								vm.pd.MONTH1=APPROVE_OPINION_DATE[1];
								vm.pd.DAY1=APPROVE_OPINION_DATE[2];
							}	
							
                     }else if ("exception" == data.result){
                     	showException("海淀区民办学校申请终止审核表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var SC_NAME=$("#SC_NAME").text();
                    if(null!=SC_NAME&&undefined!=SC_NAME&&''!=SC_NAME){
                        vm.pd.SC_NAME=SC_NAME;
                    }
                    var CERTIFICATE_NUM=$("#CERTIFICATE_NUM").text();
                    if(null!=CERTIFICATE_NUM&&undefined!=CERTIFICATE_NUM&&''!=CERTIFICATE_NUM){
                        vm.pd.CERTIFICATE_NUM=CERTIFICATE_NUM;
                    }
                    var PRESIDENT=$("#PRESIDENT").text();
                    if(null!=PRESIDENT&&undefined!=PRESIDENT&&''!=PRESIDENT){
                        vm.pd.PRESIDENT=PRESIDENT;
                    }
                    var LINKMAN=$("#LINKMAN").text();
                    if(null!=LINKMAN&&undefined!=LINKMAN&&''!=LINKMAN){
                        vm.pd.LINKMAN=LINKMAN;
                    }
                    var PHONE=$("#PHONE").text();
                    if(null!=PHONE&&undefined!=PHONE&&''!=PHONE){
                        vm.pd.PHONE=PHONE;
                    }
                    var SC_ADDRESS=$("#SC_ADDRESS").text();
                    if(null!=SC_ADDRESS&&undefined!=SC_ADDRESS&&''!=SC_ADDRESS){
                        vm.pd.SC_ADDRESS=SC_ADDRESS;
                    }
                    var REASON=$("#REASON").text();
                    if(null!=REASON&&undefined!=REASON&&''!=REASON){
                        vm.pd.REASON=REASON;
                    }
                    var OPINION=$("#OPINION").text();
                    if(null!=OPINION&&undefined!=OPINION&&''!=OPINION){
                        vm.pd.OPINION=OPINION;
                    }
					
					
                  /*  var OPINION_DATE=$("#OPINION_DATE").text();
                    if(null!=OPINION_DATE&&undefined!=OPINION_DATE&&''!=OPINION_DATE){
                        vm.pd.OPINION_DATE=OPINION_DATE;
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
					vm.pd.OPINION_DATE=vm.pd.YEAR1+"/"+vm.pd.MONTH1+"/"+vm.pd.DAY1;
					
					
                    var APPROVE_OPINION=$("#APPROVE_OPINION").text();
                    if(null!=APPROVE_OPINION&&undefined!=APPROVE_OPINION&&''!=APPROVE_OPINION){
                        vm.pd.APPROVE_OPINION=APPROVE_OPINION;
                    }
                   /* var APPROVE_OPINION_DATE=$("#APPROVE_OPINION_DATE").text();
                    if(null!=APPROVE_OPINION_DATE&&undefined!=APPROVE_OPINION_DATE&&''!=APPROVE_OPINION_DATE){
                        vm.pd.APPROVE_OPINION_DATE=APPROVE_OPINION_DATE;
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
					vm.pd.APPROVE_OPINION_DATE=vm.pd.YEAR2+"/"+vm.pd.MONTH2+"/"+vm.pd.DAY2;
					
					
                    var DELIVERY_AND_PHONE=$("#DELIVERY_AND_PHONE").text();
                    if(null!=DELIVERY_AND_PHONE&&undefined!=DELIVERY_AND_PHONE&&''!=DELIVERY_AND_PHONE){
                        vm.pd.DELIVERY_AND_PHONE=DELIVERY_AND_PHONE;
                    }
                    var DELIVERY_DATE=$("#DELIVERY_DATE").text();
                    if(null!=DELIVERY_DATE&&undefined!=DELIVERY_DATE&&''!=DELIVERY_DATE){
                        vm.pd.DELIVERY_DATE=DELIVERY_DATE;
                    }
                    var RECEIVER=$("#RECEIVER").text();
                    if(null!=RECEIVER&&undefined!=RECEIVER&&''!=RECEIVER){
                        vm.pd.RECEIVER=RECEIVER;
                    }
                    var RECEIVER_DATE=$("#RECEIVER_DATE").text();
                    if(null!=RECEIVER_DATE&&undefined!=RECEIVER_DATE&&''!=RECEIVER_DATE){
                        vm.pd.RECEIVER_DATE=RECEIVER_DATE;
                    }
                    var VERIFIER=$("#VERIFIER").text();
                    if(null!=VERIFIER&&undefined!=VERIFIER&&''!=VERIFIER){
                        vm.pd.VERIFIER=VERIFIER;
                    }
                    var VERIFIER_DATE=$("#VERIFIER_DATE").text();
                    if(null!=VERIFIER_DATE&&undefined!=VERIFIER_DATE&&''!=VERIFIER_DATE){
                        vm.pd.VERIFIER_DATE=VERIFIER_DATE;
                    }
                    var NOTIFY_DATE_COMPLETION=$("#NOTIFY_DATE_COMPLETION").text();
                    if(null!=NOTIFY_DATE_COMPLETION&&undefined!=NOTIFY_DATE_COMPLETION&&''!=NOTIFY_DATE_COMPLETION){
                        vm.pd.NOTIFY_DATE_COMPLETION=NOTIFY_DATE_COMPLETION;
                    }
                    var DELIVERED_TO_SITE=$("#DELIVERED_TO_SITE").text();
                    if(null!=DELIVERED_TO_SITE&&undefined!=DELIVERED_TO_SITE&&''!=DELIVERED_TO_SITE){
                        vm.pd.DELIVERED_TO_SITE=DELIVERED_TO_SITE;
                    }
                    var SERVINT_PERSON_AND_DATE=$("#SERVINT_PERSON_AND_DATE").text();
                    if(null!=SERVINT_PERSON_AND_DATE&&undefined!=SERVINT_PERSON_AND_DATE&&''!=SERVINT_PERSON_AND_DATE){
                        vm.pd.SERVINT_PERSON_AND_DATE=SERVINT_PERSON_AND_DATE;
                    }
                    var ADDRESSEE_AND_DATE=$("#ADDRESSEE_AND_DATE").text();
                    if(null!=ADDRESSEE_AND_DATE&&undefined!=ADDRESSEE_AND_DATE&&''!=ADDRESSEE_AND_DATE){
                        vm.pd.ADDRESSEE_AND_DATE=ADDRESSEE_AND_DATE;
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