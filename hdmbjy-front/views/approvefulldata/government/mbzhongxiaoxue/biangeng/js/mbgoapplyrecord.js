
var vm = new Vue({
	el: '#app',
	data:{
        MBGOAPPLYRECORD_ID: '',	//主键ID
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
        		this.MBGOAPPLYRECORD_ID = FDID;
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
    //去保存
    save: function (status){
        vm.getValue();
    	vm.SUB_STATUS=status;
    	if(status!=''&&status!=null&&status!=undefined&&status==0){
			if(this.pd.SC_NAME == '' || this.pd.SC_NAME == undefined){
			           $("#SC_NAME").tips({
			               side:3,
			               msg:'请输入学校全称',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.SC_NAME = '';
			           this.$refs.SC_NAME.focus();
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
			   if(this.pd.CONTACTS_AND_PHONE == '' || this.pd.CONTACTS_AND_PHONE == undefined){
			           $("#CONTACTS_AND_PHONE").tips({
			               side:3,
			               msg:'请输入联系人及电话',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.CONTACTS_AND_PHONE = '';
			           this.$refs.CONTACTS_AND_PHONE.focus();
			       return false;
			       }
			   if(this.pd.PRE_PRO_SCNAME == '' || this.pd.PRE_PRO_SCNAME == undefined){
			           $("#PRE_PRO_SCNAME").tips({
			               side:3,
			               msg:'请输入预备案项目校名',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.PRE_PRO_SCNAME = '';
			           this.$refs.PRE_PRO_SCNAME.focus();
			       return false;
			       }
			   if(this.pd.PRE_PRO_ADDREDD == '' || this.pd.PRE_PRO_ADDREDD == undefined){
			           $("#PRE_PRO_ADDREDD").tips({
			               side:3,
			               msg:'请输入预备案项目地址',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.PRE_PRO_ADDREDD = '';
			           this.$refs.PRE_PRO_ADDREDD.focus();
			       return false;
			       }
			   if(this.pd.PRE_PRO_LEVEL == '' || this.pd.PRE_PRO_LEVEL == undefined){
			           $("#PRE_PRO_LEVEL").tips({
			               side:3,
			               msg:'请输入预备案项目层次',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.PRE_PRO_LEVEL = '';
			           this.$refs.PRE_PRO_LEVEL.focus();
			       return false;
			       }
			   if(this.pd.PRE_PRO_TYPE == '' || this.pd.PRE_PRO_TYPE == undefined){
			           $("#PRE_PRO_TYPE").tips({
			               side:3,
			               msg:'请输入预备案项目类别',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.PRE_PRO_TYPE = '';
			           this.$refs.PRE_PRO_TYPE.focus();
			       return false;
			       }
			   if(this.pd.PRE_PRO_DISCRETE == '' || this.pd.PRE_PRO_DISCRETE == undefined){
			           $("#PRE_PRO_DISCRETE").tips({
			               side:3,
			               msg:'请输入预备案项目分立',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.PRE_PRO_DISCRETE = '';
			           this.$refs.PRE_PRO_DISCRETE.focus();
			       return false;
			       }
			   if(this.pd.PRE_PRO_MERGE == '' || this.pd.PRE_PRO_MERGE == undefined){
			           $("#PRE_PRO_MERGE").tips({
			               side:3,
			               msg:'请输入预备案项目合并',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.PRE_PRO_MERGE = '';
			           this.$refs.PRE_PRO_MERGE.focus();
			       return false;
			       }
			   if(this.pd.PRE_PRO_ORGANIZER == '' || this.pd.PRE_PRO_ORGANIZER == undefined){
			           $("#PRE_PRO_ORGANIZER").tips({
			               side:3,
			               msg:'请输入预备案项目举办者',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.PRE_PRO_ORGANIZER = '';
			           this.$refs.PRE_PRO_ORGANIZER.focus();
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
							
			   if(this.pd.ADMINISTRATIVE_OPINION == '' || this.pd.ADMINISTRATIVE_OPINION == undefined){
			           $("#ADMINISTRATIVE_OPINION").tips({
			               side:3,
			               msg:'请输入教育行政部门审批意见',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.ADMINISTRATIVE_OPINION = '';
			           this.$refs.ADMINISTRATIVE_OPINION.focus();
			       return false;
			       }
			/*   if(this.pd.ADMINISTRATIVE_OPINION_DATE == '' || this.pd.ADMINISTRATIVE_OPINION_DATE == undefined){
			           $("#ADMINISTRATIVE_OPINION_DATE").tips({
			               side:3,
			               msg:'请输入教育行政部门审批意见日期',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.ADMINISTRATIVE_OPINION_DATE = '';
			           this.$refs.ADMINISTRATIVE_OPINION_DATE.focus();
			       return false;
			       } */
							
							
						var result=vm.verifyDate(this.pd.ADMINISTRATIVE_OPINION_DATE);
						if(!result.isNull){
							if(!result.isTrue){
								$("#ADMINISTRATIVE_OPINION_DATE").tips({
									side:3,
									msg:result.msg,
									bg:'#AE81FF',
									time:2
								});
								vm.pd.ADMINISTRATIVE_OPINION_DATE = '';
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
			   if(this.pd.AUDITOR == '' || this.pd.AUDITOR == undefined){
			           $("#AUDITOR").tips({
			               side:3,
			               msg:'请输入审批人',
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
			   if(this.pd.NOTITY_DATE_COMPLETE == '' || this.pd.NOTITY_DATE_COMPLETE == undefined){
			           $("#NOTITY_DATE_COMPLETE").tips({
			               side:3,
			               msg:'请输入通知办结日期',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.NOTITY_DATE_COMPLETE = '';
			           this.$refs.NOTITY_DATE_COMPLETE.focus();
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
			   if(this.pd.SERVING_PERSON_AND_DATE == '' || this.pd.SERVING_PERSON_AND_DATE == undefined){
			           $("#SERVING_PERSON_AND_DATE").tips({
			               side:3,
			               msg:'请输入送达人及日期',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.SERVING_PERSON_AND_DATE = '';
			           this.$refs.SERVING_PERSON_AND_DATE.focus();
			       return false;
			       }
			   if(this.pd.RECIPIENT_AND_DATE == '' || this.pd.RECIPIENT_AND_DATE == undefined){
			           $("#RECIPIENT_AND_DATE").tips({
			               side:3,
			               msg:'请输入收件人及日期',
			               bg:'#AE81FF',
			               time:2
			           });
			           this.pd.RECIPIENT_AND_DATE = '';
			           this.$refs.RECIPIENT_AND_DATE.focus();
			       return false;
			       }
		}
           

            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'mbgoapplyrecord/'+this.msg,
			    	data: {
                        MBGOAPPLYRECORD_ID:this.MBGOAPPLYRECORD_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						SUB_STATUS:status,  	 	//暂存为草稿
                        SC_NAME:this.pd.SC_NAME,

                        PRINCIPAL_AND_PHONE:this.pd.PRINCIPAL_AND_PHONE,

                        CONTACTS_AND_PHONE:this.pd.CONTACTS_AND_PHONE,

                        PRE_PRO_SCNAME:this.pd.PRE_PRO_SCNAME,

                        PRE_PRO_ADDREDD:this.pd.PRE_PRO_ADDREDD,

                        PRE_PRO_LEVEL:this.pd.PRE_PRO_LEVEL,

                        PRE_PRO_TYPE:this.pd.PRE_PRO_TYPE,

                        PRE_PRO_DISCRETE:this.pd.PRE_PRO_DISCRETE,

                        PRE_PRO_MERGE:this.pd.PRE_PRO_MERGE,

                        PRE_PRO_ORGANIZER:this.pd.PRE_PRO_ORGANIZER,

                        CHANGE_BEFORE:this.pd.CHANGE_BEFORE,

                        CHANGE_AFTER:this.pd.CHANGE_AFTER,

                        ORGANIZER_OPINION:this.pd.ORGANIZER_OPINION,

                        ORGANIZER_OPINION_DATE:this.pd.ORGANIZER_OPINION_DATE,

                        ADMINISTRATIVE_OPINION:this.pd.ADMINISTRATIVE_OPINION,

                        ADMINISTRATIVE_OPINION_DATE:this.pd.ADMINISTRATIVE_OPINION_DATE,

                        DELIVERY_AND_PHONE:this.pd.DELIVERY_AND_PHONE,

                        DELIVERY_DATE:this.pd.DELIVERY_DATE,

                        RECEIVER:this.pd.RECEIVER,

                        RECEIVER_DATE:this.pd.RECEIVER_DATE,

                        AUDITOR:this.pd.AUDITOR,

                        AUDITOR_DATE:this.pd.AUDITOR_DATE,

                        NOTITY_DATE_COMPLETE:this.pd.NOTITY_DATE_COMPLETE,

                        DELIVERED_TO_SITE:this.pd.DELIVERED_TO_SITE,

                        SERVING_PERSON_AND_DATE:this.pd.SERVING_PERSON_AND_DATE,

                        RECIPIENT_AND_DATE:this.pd.RECIPIENT_AND_DATE,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.MBGOAPPLYRECORD_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("行政民办中小学变更1海淀区民办学校申请备案登记表",data.exception);//显示异常
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
				url: httpurl+'mbgoapplyrecord/goEdit',
		    	data: {
                    MBGOAPPLYRECORD_ID:this.MBGOAPPLYRECORD_ID,
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
						
						
						if(data.pd.ADMINISTRATIVE_OPINION_DATE!=''&&null!=data.pd.ADMINISTRATIVE_OPINION_DATE&&undefined!=data.pd.ADMINISTRATIVE_OPINION_DATE){
									var ADMINISTRATIVE_OPINION_DATE=data.pd.ADMINISTRATIVE_OPINION_DATE.split("/");
									vm.pd.YEAR2=ADMINISTRATIVE_OPINION_DATE[0];
									vm.pd.MONTH2=ADMINISTRATIVE_OPINION_DATE[1];
									vm.pd.DAY2=ADMINISTRATIVE_OPINION_DATE[2];
								}		
								
								
                     }else if ("exception" == data.result){
                     	showException("行政民办中小学变更1海淀区民办学校申请备案登记表",data.exception);	//显示异常
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
                    var PRINCIPAL_AND_PHONE=$("#PRINCIPAL_AND_PHONE").text();
                    if(null!=PRINCIPAL_AND_PHONE&&undefined!=PRINCIPAL_AND_PHONE&&''!=PRINCIPAL_AND_PHONE){
                        vm.pd.PRINCIPAL_AND_PHONE=PRINCIPAL_AND_PHONE;
                    }
                    var CONTACTS_AND_PHONE=$("#CONTACTS_AND_PHONE").text();
                    if(null!=CONTACTS_AND_PHONE&&undefined!=CONTACTS_AND_PHONE&&''!=CONTACTS_AND_PHONE){
                        vm.pd.CONTACTS_AND_PHONE=CONTACTS_AND_PHONE;
                    }
                    var PRE_PRO_SCNAME=$("#PRE_PRO_SCNAME").text();
                    if(null!=PRE_PRO_SCNAME&&undefined!=PRE_PRO_SCNAME&&''!=PRE_PRO_SCNAME){
                        vm.pd.PRE_PRO_SCNAME=PRE_PRO_SCNAME;
                    }
                    var PRE_PRO_ADDREDD=$("#PRE_PRO_ADDREDD").text();
                    if(null!=PRE_PRO_ADDREDD&&undefined!=PRE_PRO_ADDREDD&&''!=PRE_PRO_ADDREDD){
                        vm.pd.PRE_PRO_ADDREDD=PRE_PRO_ADDREDD;
                    }
                    var PRE_PRO_LEVEL=$("#PRE_PRO_LEVEL").text();
                    if(null!=PRE_PRO_LEVEL&&undefined!=PRE_PRO_LEVEL&&''!=PRE_PRO_LEVEL){
                        vm.pd.PRE_PRO_LEVEL=PRE_PRO_LEVEL;
                    }
                    var PRE_PRO_TYPE=$("#PRE_PRO_TYPE").text();
                    if(null!=PRE_PRO_TYPE&&undefined!=PRE_PRO_TYPE&&''!=PRE_PRO_TYPE){
                        vm.pd.PRE_PRO_TYPE=PRE_PRO_TYPE;
                    }
                    var PRE_PRO_DISCRETE=$("#PRE_PRO_DISCRETE").text();
                    if(null!=PRE_PRO_DISCRETE&&undefined!=PRE_PRO_DISCRETE&&''!=PRE_PRO_DISCRETE){
                        vm.pd.PRE_PRO_DISCRETE=PRE_PRO_DISCRETE;
                    }
                    var PRE_PRO_MERGE=$("#PRE_PRO_MERGE").text();
                    if(null!=PRE_PRO_MERGE&&undefined!=PRE_PRO_MERGE&&''!=PRE_PRO_MERGE){
                        vm.pd.PRE_PRO_MERGE=PRE_PRO_MERGE;
                    }
                    var PRE_PRO_ORGANIZER=$("#PRE_PRO_ORGANIZER").text();
                    if(null!=PRE_PRO_ORGANIZER&&undefined!=PRE_PRO_ORGANIZER&&''!=PRE_PRO_ORGANIZER){
                        vm.pd.PRE_PRO_ORGANIZER=PRE_PRO_ORGANIZER;
                    }
                    var CHANGE_BEFORE=$("#CHANGE_BEFORE").text();
                    if(null!=CHANGE_BEFORE&&undefined!=CHANGE_BEFORE&&''!=CHANGE_BEFORE){
                        vm.pd.CHANGE_BEFORE=CHANGE_BEFORE;
                    }
                    var CHANGE_AFTER=$("#CHANGE_AFTER").text();
                    if(null!=CHANGE_AFTER&&undefined!=CHANGE_AFTER&&''!=CHANGE_AFTER){
                        vm.pd.CHANGE_AFTER=CHANGE_AFTER;
                    }
                    var ORGANIZER_OPINION=$("#ORGANIZER_OPINION").text();
                    if(null!=ORGANIZER_OPINION&&undefined!=ORGANIZER_OPINION&&''!=ORGANIZER_OPINION){
                        vm.pd.ORGANIZER_OPINION=ORGANIZER_OPINION;
                    }
               /*     var ORGANIZER_OPINION_DATE=$("#ORGANIZER_OPINION_DATE").text();
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
										
										
                    var ADMINISTRATIVE_OPINION=$("#ADMINISTRATIVE_OPINION").text();
                    if(null!=ADMINISTRATIVE_OPINION&&undefined!=ADMINISTRATIVE_OPINION&&''!=ADMINISTRATIVE_OPINION){
                        vm.pd.ADMINISTRATIVE_OPINION=ADMINISTRATIVE_OPINION;
                    }
                    /* var ADMINISTRATIVE_OPINION_DATE=$("#ADMINISTRATIVE_OPINION_DATE").text();
                    if(null!=ADMINISTRATIVE_OPINION_DATE&&undefined!=ADMINISTRATIVE_OPINION_DATE&&''!=ADMINISTRATIVE_OPINION_DATE){
                        vm.pd.ADMINISTRATIVE_OPINION_DATE=ADMINISTRATIVE_OPINION_DATE;
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
					vm.pd.ADMINISTRATIVE_OPINION_DATE=vm.pd.YEAR2+"/"+vm.pd.MONTH2+"/"+vm.pd.DAY2;
					
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
                    var AUDITOR=$("#AUDITOR").text();
                    if(null!=AUDITOR&&undefined!=AUDITOR&&''!=AUDITOR){
                        vm.pd.AUDITOR=AUDITOR;
                    }
                    var AUDITOR_DATE=$("#AUDITOR_DATE").text();
                    if(null!=AUDITOR_DATE&&undefined!=AUDITOR_DATE&&''!=AUDITOR_DATE){
                        vm.pd.AUDITOR_DATE=AUDITOR_DATE;
                    }
                    var NOTITY_DATE_COMPLETE=$("#NOTITY_DATE_COMPLETE").text();
                    if(null!=NOTITY_DATE_COMPLETE&&undefined!=NOTITY_DATE_COMPLETE&&''!=NOTITY_DATE_COMPLETE){
                        vm.pd.NOTITY_DATE_COMPLETE=NOTITY_DATE_COMPLETE;
                    }
                    var DELIVERED_TO_SITE=$("#DELIVERED_TO_SITE").text();
                    if(null!=DELIVERED_TO_SITE&&undefined!=DELIVERED_TO_SITE&&''!=DELIVERED_TO_SITE){
                        vm.pd.DELIVERED_TO_SITE=DELIVERED_TO_SITE;
                    }
                    var SERVING_PERSON_AND_DATE=$("#SERVING_PERSON_AND_DATE").text();
                    if(null!=SERVING_PERSON_AND_DATE&&undefined!=SERVING_PERSON_AND_DATE&&''!=SERVING_PERSON_AND_DATE){
                        vm.pd.SERVING_PERSON_AND_DATE=SERVING_PERSON_AND_DATE;
                    }
                    var RECIPIENT_AND_DATE=$("#RECIPIENT_AND_DATE").text();
                    if(null!=RECIPIENT_AND_DATE&&undefined!=RECIPIENT_AND_DATE&&''!=RECIPIENT_AND_DATE){
                        vm.pd.RECIPIENT_AND_DATE=RECIPIENT_AND_DATE;
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