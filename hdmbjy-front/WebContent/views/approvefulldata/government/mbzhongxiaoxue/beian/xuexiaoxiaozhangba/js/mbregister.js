
var vm = new Vue({
	el: '#app',
	data:{
        MBREGISTER_ID: '',	//主键ID
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
        		this.MBREGISTER_ID = FDID;
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
			if(status!=''&&status!=null&&status!=undefined&&status==0){
				if(this.pd.SC_ALLNAME == '' || this.pd.SC_ALLNAME == undefined){
				            $("#SC_ALLNAME").tips({
				                side:3,
				                msg:'请输入学校全称',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.SC_ALLNAME = '';
				            this.$refs.SC_ALLNAME.focus();
				        return false;
				        }
					if(this.pd.NUMBER == '' || this.pd.NUMBER == undefined){
						$("#NUMBER").tips({
							side:3,
							msg:'请输入教民号',
							bg:'#AE81FF',
							time:2
						});
						this.pd.NUMBER = '';
						this.$refs.NUMBER.focus();
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
				    if(this.pd.CHAIRMAN == '' || this.pd.CHAIRMAN == undefined){
				            $("#CHAIRMAN").tips({
				                side:3,
				                msg:'请输入董事长',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.CHAIRMAN = '';
				            this.$refs.CHAIRMAN.focus();
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
				    if(this.pd.DECISION_MAKING_MEMBER == '' || this.pd.DECISION_MAKING_MEMBER == undefined){
				            $("#DECISION_MAKING_MEMBER").tips({
				                side:3,
				                msg:'请输入决策机构成员',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.DECISION_MAKING_MEMBER = '';
				            this.$refs.DECISION_MAKING_MEMBER.focus();
				        return false;
				        }
				    if(this.pd.BROCHURE_AND_ADVERTISEMENT == '' || this.pd.BROCHURE_AND_ADVERTISEMENT == undefined){
				            $("#BROCHURE_AND_ADVERTISEMENT").tips({
				                side:3,
				                msg:'请输入招生简章和广告',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.BROCHURE_AND_ADVERTISEMENT = '';
				            this.$refs.BROCHURE_AND_ADVERTISEMENT.focus();
				        return false;
				        }
				    if(this.pd.ANNUAL_AUDIT_REPORT == '' || this.pd.ANNUAL_AUDIT_REPORT == undefined){
				            $("#ANNUAL_AUDIT_REPORT").tips({
				                side:3,
				                msg:'请输入年度审计报告',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.ANNUAL_AUDIT_REPORT = '';
				            this.$refs.ANNUAL_AUDIT_REPORT.focus();
				        return false;
				        }
				    if(this.pd.CHANGE_OF_ORGANIZER == '' || this.pd.CHANGE_OF_ORGANIZER == undefined){
				            $("#CHANGE_OF_ORGANIZER").tips({
				                side:3,
				                msg:'请输入举办者更名',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.CHANGE_OF_ORGANIZER = '';
				            this.$refs.CHANGE_OF_ORGANIZER.focus();
				        return false;
				        }
				    if(this.pd.REFUND_METHOD == '' || this.pd.REFUND_METHOD == undefined){
				            $("#REFUND_METHOD").tips({
				                side:3,
				                msg:'请输入收退费办法',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.REFUND_METHOD = '';
				            this.$refs.REFUND_METHOD.focus();
				        return false;
				        }
				    if(this.pd.CONSTITUTION == '' || this.pd.CONSTITUTION == undefined){
				            $("#CONSTITUTION").tips({
				                side:3,
				                msg:'请输入章程',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.CONSTITUTION = '';
				            this.$refs.CONSTITUTION.focus();
				        return false;
				        }
				    if(this.pd.RECORD_BEFORE == '' || this.pd.RECORD_BEFORE == undefined){
				            $("#RECORD_BEFORE").tips({
				                side:3,
				                msg:'请输入备案前',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.RECORD_BEFORE = '';
				            this.$refs.RECORD_BEFORE.focus();
				        return false;
				        }
				    if(this.pd.RECORD_AFTER == '' || this.pd.RECORD_AFTER == undefined){
				            $("#RECORD_AFTER").tips({
				                side:3,
				                msg:'请输入备案后',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.RECORD_AFTER = '';
				            this.$refs.RECORD_AFTER.focus();
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
						
						
					var result=vm.verifyDate(this.pd.ORGANIZER_DATE);	
									if(!result.isNull){
										if(!result.isTrue){
											$("#ORGANIZER_DATE").tips({
												side:3,
												msg:result.msg,
												bg:'#AE81FF',
												time:2
											});
											vm.pd.ORGANIZER_DATE = '';
											vm.pd.YEAR1=vm.pd.MONTH1=vm.pd.DAY1='';     //编号后的YEAR MONTH DAY
											return false;
										}
									}
										
				   /* if(this.pd.ORGANIZER_DATE == '' || this.pd.ORGANIZER_DATE == undefined){
				            $("#ORGANIZER_DATE").tips({
				                side:3,
				                msg:'请输入举办者日期',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.ORGANIZER_DATE = '';
				            this.$refs.ORGANIZER_DATE.focus();
				        return false;
				        } */
				    if(this.pd.COMPETENT_ADVICE == '' || this.pd.COMPETENT_ADVICE == undefined){
				            $("#COMPETENT_ADVICE").tips({
				                side:3,
				                msg:'请输入教育业务主管部门意见',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.COMPETENT_ADVICE = '';
				            this.$refs.COMPETENT_ADVICE.focus();
				        return false;
				        }
				/*    if(this.pd.COMPETENT_DATE == '' || this.pd.COMPETENT_DATE == undefined){
				            $("#COMPETENT_DATE").tips({
				                side:3,
				                msg:'请输入业务部门领导签字日期',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.COMPETENT_DATE = '';
				            this.$refs.COMPETENT_DATE.focus();
				        return false;
				        }
					 */
					var result=vm.verifyDate(this.pd.COMPETENT_DATE);
									if(!result.isNull){
										if(!result.isTrue){
											$("#COMPETENT_DATE").tips({
												side:3,
												msg:result.msg,
												bg:'#AE81FF',
												time:2
											});
											vm.pd.COMPETENT_DATE = '';
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
				    if(this.pd.ACCEPTOR == '' || this.pd.ACCEPTOR == undefined){
				            $("#ACCEPTOR").tips({
				                side:3,
				                msg:'请输入受理人',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.ACCEPTOR = '';
				            this.$refs.ACCEPTOR.focus();
				        return false;
				        }
				    if(this.pd.ACCEPTING_DATE == '' || this.pd.ACCEPTING_DATE == undefined){
				            $("#ACCEPTING_DATE").tips({
				                side:3,
				                msg:'请输入受理日期',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.ACCEPTING_DATE = '';
				            this.$refs.ACCEPTING_DATE.focus();
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
				    if(this.pd.COMPLETION_DATE == '' || this.pd.COMPLETION_DATE == undefined){
				            $("#COMPLETION_DATE").tips({
				                side:3,
				                msg:'请输入通知办结日期',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.COMPLETION_DATE = '';
				            this.$refs.COMPLETION_DATE.focus();
				        return false;
				        }
				    if(this.pd.DELIVERED == '' || this.pd.DELIVERED == undefined){
				            $("#DELIVERED").tips({
				                side:3,
				                msg:'请输入送达地点',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.DELIVERED = '';
				            this.$refs.DELIVERED.focus();
				        return false;
				        }
				    if(this.pd.PROCESS_AND_DATE == '' || this.pd.PROCESS_AND_DATE == undefined){
				            $("#PROCESS_AND_DATE").tips({
				                side:3,
				                msg:'请输入送达人及日期',
				                bg:'#AE81FF',
				                time:2
				            });
				            this.pd.PROCESS_AND_DATE = '';
				            this.$refs.PROCESS_AND_DATE.focus();
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
					url: httpurl+'mbregister/'+this.msg,
			    	data: {
                        MBREGISTER_ID:this.MBREGISTER_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						SUB_STATUS:status,

                        SC_ALLNAME:this.pd.SC_ALLNAME,

						NUMBER:this.pd.NUMBER,

                        PRINCIPAL_AND_PHONE:this.pd.PRINCIPAL_AND_PHONE,

                        LINKMAN_AND_PHONE:this.pd.LINKMAN_AND_PHONE,

                        PRINCIPAL:this.pd.PRINCIPAL,

                        CHAIRMAN:this.pd.CHAIRMAN,

                        LEGAL_PERSON:this.pd.LEGAL_PERSON,

                        DECISION_MAKING_MEMBER:this.pd.DECISION_MAKING_MEMBER,

                        BROCHURE_AND_ADVERTISEMENT:this.pd.BROCHURE_AND_ADVERTISEMENT,

                        ANNUAL_AUDIT_REPORT:this.pd.ANNUAL_AUDIT_REPORT,

                        CHANGE_OF_ORGANIZER:this.pd.CHANGE_OF_ORGANIZER,

                        REFUND_METHOD:this.pd.REFUND_METHOD,

                        CONSTITUTION:this.pd.CONSTITUTION,

                        RECORD_BEFORE:this.pd.RECORD_BEFORE,

                        RECORD_AFTER:this.pd.RECORD_AFTER,

                        ORGANIZER_OPINION:this.pd.ORGANIZER_OPINION,

                        ORGANIZER_DATE:this.pd.ORGANIZER_DATE,

                        COMPETENT_ADVICE:this.pd.COMPETENT_ADVICE,

                        COMPETENT_DATE:this.pd.COMPETENT_DATE,

                        DELIVERY_AND_PHONE:this.pd.DELIVERY_AND_PHONE,

                        DELIVERY_DATE:this.pd.DELIVERY_DATE,

                        ACCEPTOR:this.pd.ACCEPTOR,

                        ACCEPTING_DATE:this.pd.ACCEPTING_DATE,

                        VERIFIER:this.pd.VERIFIER,

                        VERIFIER_DATE:this.pd.VERIFIER_DATE,

                        COMPLETION_DATE:this.pd.COMPLETION_DATE,

                        DELIVERED:this.pd.DELIVERED,

                        PROCESS_AND_DATE:this.pd.PROCESS_AND_DATE,

                        ADDRESSEE_AND_DATE:this.pd.ADDRESSEE_AND_DATE,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.MBREGISTER_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("海淀区民办学校备案登记表",data.exception);//显示异常
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
				url: httpurl+'mbregister/goEdit',
		    	data: {
                    MBREGISTER_ID:this.MBREGISTER_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						if(data.pd.ORGANIZER_DATE!=''&&null!=data.pd.ORGANIZER_DATE&&undefined!=data.pd.ORGANIZER_DATE){
									var ORGANIZER_DATE=data.pd.ORGANIZER_DATE.split("/");
									vm.pd.YEAR1=ORGANIZER_DATE[0];
									vm.pd.MONTH1=ORGANIZER_DATE[1];
									vm.pd.DAY1=ORGANIZER_DATE[2];
								}
						
						if(data.pd.COMPETENT_DATE!=''&&null!=data.pd.COMPETENT_DATE&&undefined!=data.pd.COMPETENT_DATE){
									var COMPETENT_DATE=data.pd.COMPETENT_DATE.split("/");
									vm.pd.YEAR2=COMPETENT_DATE[0];
									vm.pd.MONTH2=COMPETENT_DATE[1];
									vm.pd.DAY3=COMPETENT_DATE[2];
								}	
									
                     }else if ("exception" == data.result){
                     	showException("海淀区民办学校备案登记表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var MBREGISTER_ID=$("#MBREGISTER_ID").text();
                    if(null!=MBREGISTER_ID&&undefined!=MBREGISTER_ID&&''!=MBREGISTER_ID){
                        vm.pd.MBREGISTER_ID=MBREGISTER_ID;
                    }
                    var SC_ALLNAME=$("#SC_ALLNAME").text();
                    if(null!=SC_ALLNAME&&undefined!=SC_ALLNAME&&''!=SC_ALLNAME){
                        vm.pd.SC_ALLNAME=SC_ALLNAME;
                    }

					var NUMBER=$("#NUMBER").text();
					if(null!=NUMBER&&undefined!=NUMBER&&''!=NUMBER){
						vm.pd.NUMBER=NUMBER;
					}

                    var PRINCIPAL_AND_PHONE=$("#PRINCIPAL_AND_PHONE").text();
                    if(null!=PRINCIPAL_AND_PHONE&&undefined!=PRINCIPAL_AND_PHONE&&''!=PRINCIPAL_AND_PHONE){
                        vm.pd.PRINCIPAL_AND_PHONE=PRINCIPAL_AND_PHONE;
                    }
                    var LINKMAN_AND_PHONE=$("#LINKMAN_AND_PHONE").text();
                    if(null!=LINKMAN_AND_PHONE&&undefined!=LINKMAN_AND_PHONE&&''!=LINKMAN_AND_PHONE){
                        vm.pd.LINKMAN_AND_PHONE=LINKMAN_AND_PHONE;
                    }
                    var PRINCIPAL=$("#PRINCIPAL").text();
                    if(null!=PRINCIPAL&&undefined!=PRINCIPAL&&''!=PRINCIPAL){
                        vm.pd.PRINCIPAL=PRINCIPAL;
                    }
                    var CHAIRMAN=$("#CHAIRMAN").text();
                    if(null!=CHAIRMAN&&undefined!=CHAIRMAN&&''!=CHAIRMAN){
                        vm.pd.CHAIRMAN=CHAIRMAN;
                    }
                    var LEGAL_PERSON=$("#LEGAL_PERSON").text();
                    if(null!=LEGAL_PERSON&&undefined!=LEGAL_PERSON&&''!=LEGAL_PERSON){
                        vm.pd.LEGAL_PERSON=LEGAL_PERSON;
                    }
                    var DECISION_MAKING_MEMBER=$("#DECISION_MAKING_MEMBER").text();
                    if(null!=DECISION_MAKING_MEMBER&&undefined!=DECISION_MAKING_MEMBER&&''!=DECISION_MAKING_MEMBER){
                        vm.pd.DECISION_MAKING_MEMBER=DECISION_MAKING_MEMBER;
                    }
                    var BROCHURE_AND_ADVERTISEMENT=$("#BROCHURE_AND_ADVERTISEMENT").text();
                    if(null!=BROCHURE_AND_ADVERTISEMENT&&undefined!=BROCHURE_AND_ADVERTISEMENT&&''!=BROCHURE_AND_ADVERTISEMENT){
                        vm.pd.BROCHURE_AND_ADVERTISEMENT=BROCHURE_AND_ADVERTISEMENT;
                    }
                    var ANNUAL_AUDIT_REPORT=$("#ANNUAL_AUDIT_REPORT").text();
                    if(null!=ANNUAL_AUDIT_REPORT&&undefined!=ANNUAL_AUDIT_REPORT&&''!=ANNUAL_AUDIT_REPORT){
                        vm.pd.ANNUAL_AUDIT_REPORT=ANNUAL_AUDIT_REPORT;
                    }
                    var CHANGE_OF_ORGANIZER=$("#CHANGE_OF_ORGANIZER").text();
                    if(null!=CHANGE_OF_ORGANIZER&&undefined!=CHANGE_OF_ORGANIZER&&''!=CHANGE_OF_ORGANIZER){
                        vm.pd.CHANGE_OF_ORGANIZER=CHANGE_OF_ORGANIZER;
                    }
                    var REFUND_METHOD=$("#REFUND_METHOD").text();
                    if(null!=REFUND_METHOD&&undefined!=REFUND_METHOD&&''!=REFUND_METHOD){
                        vm.pd.REFUND_METHOD=REFUND_METHOD;
                    }
                    var CONSTITUTION=$("#CONSTITUTION").text();
                    if(null!=CONSTITUTION&&undefined!=CONSTITUTION&&''!=CONSTITUTION){
                        vm.pd.CONSTITUTION=CONSTITUTION;
                    }
                    var RECORD_BEFORE=$("#RECORD_BEFORE").text();
                    if(null!=RECORD_BEFORE&&undefined!=RECORD_BEFORE&&''!=RECORD_BEFORE){
                        vm.pd.RECORD_BEFORE=RECORD_BEFORE;
                    }
                    var RECORD_AFTER=$("#RECORD_AFTER").text();
                    if(null!=RECORD_AFTER&&undefined!=RECORD_AFTER&&''!=RECORD_AFTER){
                        vm.pd.RECORD_AFTER=RECORD_AFTER;
                    }
                    var ORGANIZER_OPINION=$("#ORGANIZER_OPINION").text();
                    if(null!=ORGANIZER_OPINION&&undefined!=ORGANIZER_OPINION&&''!=ORGANIZER_OPINION){
                        vm.pd.ORGANIZER_OPINION=ORGANIZER_OPINION;
                    }
                 /*   var ORGANIZER_DATE=$("#ORGANIZER_DATE").text();
                    if(null!=ORGANIZER_DATE&&undefined!=ORGANIZER_DATE&&''!=ORGANIZER_DATE){
                        vm.pd.ORGANIZER_DATE=ORGANIZER_DATE;
                    } */
					
					
					
					
					var YEAR1=$("#YEAR1").val();
					if(null!=YEAR1&&undefined!=YEAR1&&''!=YEAR1){
						vm.pd.YEAR1=YEAR1;
					}else{
						vm.pd.YEAR1='';
					}
					var MONTH1=$("#MONTH1").val();
					if(null!=MONTH1&&undefined!=MONTH1&&''!=MONTH1){
						if(MONTH1<10&&MONTH1.length==1){
							MONTH1=("0"+MONTH1)
						}
						vm.pd.MONTH1=MONTH1;
					}else{
						vm.pd.MONTH1='';
					}
					var DAY1=$("#DAY1").val();
					if(null!=DAY1&&undefined!=DAY1&&''!=DAY1){
						if(DAY1<10&&DAY1.length==1){
							DAY1=("0"+DAY1)
						}
						vm.pd.DAY1=DAY1;
					}else{
						vm.pd.DAY1='';
					}
					vm.pd.ORGANIZER_DATE=vm.pd.YEAR1+"/"+vm.pd.MONTH1+"/"+vm.pd.DAY1;
										
                    var COMPETENT_ADVICE=$("#COMPETENT_ADVICE").text();
                    if(null!=COMPETENT_ADVICE&&undefined!=COMPETENT_ADVICE&&''!=COMPETENT_ADVICE){
                        vm.pd.COMPETENT_ADVICE=COMPETENT_ADVICE;
                    }
                  /*  var COMPETENT_DATE=$("#COMPETENT_DATE").text();
                    if(null!=COMPETENT_DATE&&undefined!=COMPETENT_DATE&&''!=COMPETENT_DATE){
                        vm.pd.COMPETENT_DATE=COMPETENT_DATE;
                    } */
					
					var YEAR2=$("#YEAR2").val();
					if(null!=YEAR2&&undefined!=YEAR2&&''!=YEAR2){
						vm.pd.YEAR2=YEAR2;
					}else{
						vm.pd.YEAR2='';
					}
					var MONTH2=$("#MONTH2").val();
					if(null!=MONTH2&&undefined!=MONTH2&&''!=MONTH2){
						if(MONTH2<10&&MONTH2.length==1){
							MONTH2=("0"+MONTH2)
						}
						vm.pd.MONTH2=MONTH2;
					}else{
						vm.pd.MONTH2='';
					}
					var DAY2=$("#DAY2").val();
					if(null!=DAY2&&undefined!=DAY2&&''!=DAY2){
						if(DAY2<10&&DAY2.length==1){
							DAY2=("0"+DAY2)
						}
						vm.pd.DAY2=DAY2;
					}else{
						vm.pd.DAY2='';
					}
					vm.pd.COMPETENT_DATE=vm.pd.YEAR2+"/"+vm.pd.MONTH2+"/"+vm.pd.DAY2;
					
                    var DELIVERY_AND_PHONE=$("#DELIVERY_AND_PHONE").text();
                    if(null!=DELIVERY_AND_PHONE&&undefined!=DELIVERY_AND_PHONE&&''!=DELIVERY_AND_PHONE){
                        vm.pd.DELIVERY_AND_PHONE=DELIVERY_AND_PHONE;
                    }
                    var DELIVERY_DATE=$("#DELIVERY_DATE").text();
                    if(null!=DELIVERY_DATE&&undefined!=DELIVERY_DATE&&''!=DELIVERY_DATE){
                        vm.pd.DELIVERY_DATE=DELIVERY_DATE;
                    }
                    var ACCEPTOR=$("#ACCEPTOR").text();
                    if(null!=ACCEPTOR&&undefined!=ACCEPTOR&&''!=ACCEPTOR){
                        vm.pd.ACCEPTOR=ACCEPTOR;
                    }
                    var ACCEPTING_DATE=$("#ACCEPTING_DATE").text();
                    if(null!=ACCEPTING_DATE&&undefined!=ACCEPTING_DATE&&''!=ACCEPTING_DATE){
                        vm.pd.ACCEPTING_DATE=ACCEPTING_DATE;
                    }
                    var VERIFIER=$("#VERIFIER").text();
                    if(null!=VERIFIER&&undefined!=VERIFIER&&''!=VERIFIER){
                        vm.pd.VERIFIER=VERIFIER;
                    }
                    var VERIFIER_DATE=$("#VERIFIER_DATE").text();
                    if(null!=VERIFIER_DATE&&undefined!=VERIFIER_DATE&&''!=VERIFIER_DATE){
                        vm.pd.VERIFIER_DATE=VERIFIER_DATE;
                    }
                    var COMPLETION_DATE=$("#COMPLETION_DATE").text();
                    if(null!=COMPLETION_DATE&&undefined!=COMPLETION_DATE&&''!=COMPLETION_DATE){
                        vm.pd.COMPLETION_DATE=COMPLETION_DATE;
                    }
                    var DELIVERED=$("#DELIVERED").text();
                    if(null!=DELIVERED&&undefined!=DELIVERED&&''!=DELIVERED){
                        vm.pd.DELIVERED=DELIVERED;
                    }
                    var PROCESS_AND_DATE=$("#PROCESS_AND_DATE").text();
                    if(null!=PROCESS_AND_DATE&&undefined!=PROCESS_AND_DATE&&''!=PROCESS_AND_DATE){
                        vm.pd.PROCESS_AND_DATE=PROCESS_AND_DATE;
                    }
                    var ADDRESSEE_AND_DATE=$("#ADDRESSEE_AND_DATE").text();
                    if(null!=ADDRESSEE_AND_DATE&&undefined!=ADDRESSEE_AND_DATE&&''!=ADDRESSEE_AND_DATE){
                        vm.pd.ADDRESSEE_AND_DATE=ADDRESSEE_AND_DATE;
                    }
                 /*   var FIELD1=$("#FIELD1").text();
                    if(null!=FIELD1&&undefined!=FIELD1&&''!=FIELD1){
                        vm.pd.FIELD1=FIELD1;
                    }
                    var FIELD2=$("#FIELD2").text();
                    if(null!=FIELD2&&undefined!=FIELD2&&''!=FIELD2){
                        vm.pd.FIELD2=FIELD2;
                    }
                    var FIELD3=$("#FIELD3").text();
                    if(null!=FIELD3&&undefined!=FIELD3&&''!=FIELD3){
                        vm.pd.FIELD3=FIELD3;
                    }*/
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