
var vm = new Vue({
	el: '#app',
	data:{
        DETERMINATIVETABLE_ID: '',	//主键ID
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
        		this.DETERMINATIVETABLE_ID = FDID;
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
				if(this.pd.SEX == '' || this.pd.SEX == undefined){
				        $("#SEX").tips({
				            side:3,
				            msg:'请输入性别',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.SEX = '';
				        this.$refs.SEX.focus();
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
				if(this.pd.POLITICS_STATUS == '' || this.pd.POLITICS_STATUS == undefined){
				        $("#POLITICS_STATUS").tips({
				            side:3,
				            msg:'请输入政治面貌',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.POLITICS_STATUS = '';
				        this.$refs.POLITICS_STATUS.focus();
				    return false;
				    }
				if(this.pd.DESIGNATE_DPOSITION == '' || this.pd.DESIGNATE_DPOSITION == undefined){
				        $("#DESIGNATE_DPOSITION").tips({
				            side:3,
				            msg:'请输入拟任职务',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.DESIGNATE_DPOSITION = '';
				        this.$refs.DESIGNATE_DPOSITION.focus();
				    return false;
				    }
				if(this.pd.FULLTIME_OR_PARTTIME == '' || this.pd.FULLTIME_OR_PARTTIME == undefined){
				        $("#FULLTIME_OR_PARTTIME").tips({
				            side:3,
				            msg:'请输入专职兼职',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.FULLTIME_OR_PARTTIME = '';
				        this.$refs.FULLTIME_OR_PARTTIME.focus();
				    return false;
				    }
				if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				        $("#TITLE").tips({
				            side:3,
				            msg:'请输入职称',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.TITLE = '';
				        this.$refs.TITLE.focus();
				    return false;
				    }
				var result=vm.verifyDate(this.pd.BIRTHDAY);
				if(!result.isNull){
					if(!result.isTrue){
						$("#BIRTHDAY").tips({
							side:3,
							msg:result.msg,
							bg:'#AE81FF',
							time:2
						});
						vm.pd.BIRTHDAY = '';
						vm.pd.YEAR=vm.pd.MONTH=vm.pd.DAY='';
						 this.$refs.BIRTHDAY.focus();
						return false;
					}
				}else{
					$("#BIRTHDAY").tips({
						side:3,
						msg:result.msg,
						bg:'#AE81FF',
						time:2
					});
					vm.pd.BIRTHDAY = '';
					vm.pd.YEAR=vm.pd.MONTH=vm.pd.DAY='';
					vm.$refs.BIRTHDAY.focus();
					return false;	
				}
				if(this.pd.ID_NUMBER == '' || this.pd.ID_NUMBER == undefined){
				        $("#ID_NUMBER").tips({
				            side:3,
				            msg:'请输入身份证号',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ID_NUMBER = '';
				        this.$refs.ID_NUMBER.focus();
				    return false;
				    }
				if(this.pd.WORK_YEAR == '' || this.pd.WORK_YEAR == undefined){
				        $("#WORK_YEAR").tips({
				            side:3,
				            msg:'请输入从事教育教学工作年限',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.WORK_YEAR = '';
				        this.$refs.WORK_YEAR.focus();
				    return false;
				    }
				if(this.pd.TEACH_MAJOR == '' || this.pd.TEACH_MAJOR == undefined){
				        $("#TEACH_MAJOR").tips({
				            side:3,
				            msg:'请输入从教专业',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.TEACH_MAJOR = '';
				        this.$refs.TEACH_MAJOR.focus();
				    return false;
				    }
				if(this.pd.HEALTHY_CONDITION == '' || this.pd.HEALTHY_CONDITION == undefined){
				        $("#HEALTHY_CONDITION").tips({
				            side:3,
				            msg:'请输入健康情况',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.HEALTHY_CONDITION = '';
				        this.$refs.HEALTHY_CONDITION.focus();
				    return false;
				    }
				if(this.pd.ISRETIREMENT == '' || this.pd.ISRETIREMENT == undefined){
				        $("#ISRETIREMENT").tips({
				            side:3,
				            msg:'请输入是否退休',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ISRETIREMENT = '';
				        this.$refs.ISRETIREMENT.focus();
				    return false;
				    }
				if(this.pd.ORIGINAL_WORK == '' || this.pd.ORIGINAL_WORK == undefined){
				        $("#ORIGINAL_WORK").tips({
				            side:3,
				            msg:'请输入原工作单位以及职务',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ORIGINAL_WORK = '';
				        this.$refs.ORIGINAL_WORK.focus();
				    return false;
				    }
				if(this.pd.PHONE == '' || this.pd.PHONE == undefined){
				        $("#PHONE").tips({
				            side:3,
				            msg:'请输入电话手机',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.PHONE = '';
				        this.$refs.PHONE.focus();
				    return false;
				    }
				if(this.pd.NOW_ADDRESS == '' || this.pd.NOW_ADDRESS == undefined){
				        $("#NOW_ADDRESS").tips({
				            side:3,
				            msg:'请输入现家庭住址',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.NOW_ADDRESS = '';
				        this.$refs.NOW_ADDRESS.focus();
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
				if(this.pd.RESUME == '' || this.pd.RESUME == undefined){
				        $("#RESUME").tips({
				            side:3,
				            msg:'请输入个人简历',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.RESUME = '';
				        this.$refs.RESUME.focus();
				    return false;
				    }
				if(this.pd.PARTY_OPINION == '' || this.pd.PARTY_OPINION == undefined){
				        $("#PARTY_OPINION").tips({
				            side:3,
				            msg:'请输入当事人意见',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.PARTY_OPINION = '';
				        this.$refs.PARTY_OPINION.focus();
				    return false;
				    }
					
				var result=vm.verifyDate(this.pd.PARTY_OPINION_DATE);
				if(!result.isNull){
					if(!result.isTrue){
						$("#PARTY_OPINION_DATE").tips({
							side:3,
							msg:result.msg,
							bg:'#AE81FF',
							time:2
						});
						vm.pd.PARTY_OPINION_DATE = '';
						vm.pd.YEAR1=vm.pd.MONTH1=vm.pd.DAY1='';
						 this.$refs.PARTY_OPINION_DATE.focus();
						return false;
					}
				}
					
				if(this.pd.HR_DE_OPINION == '' || this.pd.HR_DE_OPINION == undefined){
				        $("#HR_DE_OPINION").tips({
				            side:3,
				            msg:'请输入人事部门意见',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.HR_DE_OPINION = '';
				        this.$refs.HR_DE_OPINION.focus();
				    return false;
				    }
				         
					
				var result=vm.verifyDate(this.pd.HR_DE_OPINION_DATE);
				if(!result.isNull){
					if(!result.isTrue){
						$("#HR_DE_OPINION_DATE").tips({
							side:3,
							msg:result.msg,
							bg:'#AE81FF',
							time:2
						});
						vm.pd.HR_DE_OPINION_DATE = '';
						vm.pd.YEAR2=vm.pd.MONTH2=vm.pd.DAY2='';
						this.$refs.HR_DE_OPINION_DATE.focus();
						return false;
					}
				}	
					
					
				if(this.pd.AUTHENTICATE_RES == '' || this.pd.AUTHENTICATE_RES == undefined){
				        $("#AUTHENTICATE_RES").tips({
				            side:3,
				            msg:'请输入举办者政治思想表现道德品质鉴定',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.AUTHENTICATE_RES = '';
				        this.$refs.AUTHENTICATE_RES.focus();
				    return false;
				    }
					
				var result=vm.verifyDate(this.pd.AUTHENTICATE_RES_DATE);
				if(!result.isNull){
					if(!result.isTrue){
						$("#AUTHENTICATE_RES_DATE").tips({
							side:3,
							msg:result.msg,
							bg:'#AE81FF',
							time:2
						});
						vm.pd.AUTHENTICATE_RES_DATE = '';
						vm.pd.YEAR3=vm.pd.MONTH3=vm.pd.DAY3='';
						this.$refs.AUTHENTICATE_RES_DATE.focus();
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
					url: httpurl+'determinativetable/'+this.msg,
			    	data: {
                        DETERMINATIVETABLE_ID:this.DETERMINATIVETABLE_ID,

						APPROVE_ID:this.APPROVE_ID,   //审批id
						
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id	
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						SUB_STATUS:status,
						
                        NAME:this.pd.NAME,

                        SEX:this.pd.SEX,

                        EDUCATION:this.pd.EDUCATION,

                        POLITICS_STATUS:this.pd.POLITICS_STATUS,

                        DESIGNATE_DPOSITION:this.pd.DESIGNATE_DPOSITION,

                        FULLTIME_OR_PARTTIME:this.pd.FULLTIME_OR_PARTTIME,

                        TITLE:this.pd.TITLE,

                        BIRTHDAY:this.pd.BIRTHDAY,

                        ID_NUMBER:this.pd.ID_NUMBER,

                        WORK_YEAR:this.pd.WORK_YEAR,

                        TEACH_MAJOR:this.pd.TEACH_MAJOR,

                        HEALTHY_CONDITION:this.pd.HEALTHY_CONDITION,

                        ISRETIREMENT:this.pd.ISRETIREMENT,

                        ORIGINAL_WORK:this.pd.ORIGINAL_WORK,

                        PHONE:this.pd.PHONE,

                        NOW_ADDRESS:this.pd.NOW_ADDRESS,

                        POSTCODE:this.pd.POSTCODE,

                        RESUME:this.pd.RESUME,

                        PARTY_OPINION:this.pd.PARTY_OPINION,

                        PARTY_OPINION_DATE:this.pd.PARTY_OPINION_DATE,

                        HR_DE_OPINION:this.pd.HR_DE_OPINION,

                        HR_DE_OPINION_DATE:this.pd.HR_DE_OPINION_DATE,

                        AUTHENTICATE_RES:this.pd.AUTHENTICATE_RES,
						
                        AUTHENTICATE_RES_DATE:this.pd.AUTHENTICATE_RES_DATE,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.DETERMINATIVETABLE_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("民办学校举办者基本情况及政治思想品德鉴定表",data.exception);//显示异常
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
				url: httpurl+'determinativetable/goEdit',
		    	data: {
                    DETERMINATIVETABLE_ID:this.DETERMINATIVETABLE_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						var BIRTHDAY=data.pd.BIRTHDAY.split("/");
						vm.pd.YEAR=BIRTHDAY[0];
						vm.pd.MONTH=BIRTHDAY[1];
						vm.pd.DAY=BIRTHDAY[2];
						
						if(data.pd.PARTY_OPINION_DATE!=''&&null!=data.pd.PARTY_OPINION_DATE&&undefined!=data.pd.PARTY_OPINION_DATE){
							var PARTY_OPINION_DATE=data.pd.PARTY_OPINION_DATE.split("/");
							vm.pd.YEAR1=PARTY_OPINION_DATE[0];
							vm.pd.MONTH1=PARTY_OPINION_DATE[1];
							vm.pd.DAY1=PARTY_OPINION_DATE[2];
						}
						if(data.pd.HR_DE_OPINION_DATE!=''&&null!=data.pd.HR_DE_OPINION_DATE&&undefined!=data.pd.HR_DE_OPINION_DATE){
							var HR_DE_OPINION_DATE=data.pd.HR_DE_OPINION_DATE.split("/");
							vm.pd.YEAR2=HR_DE_OPINION_DATE[0];
							vm.pd.MONTH2=HR_DE_OPINION_DATE[1];
							vm.pd.DAY2=HR_DE_OPINION_DATE[2];
						}
						if(data.pd.AUTHENTICATE_RES_DATE!=''&&null!=data.pd.AUTHENTICATE_RES_DATE&&data.pd.AUTHENTICATE_RES_DATE){
							var AUTHENTICATE_RES_DATE=data.pd.AUTHENTICATE_RES_DATE.split("/");
							vm.pd.YEAR3=AUTHENTICATE_RES_DATE[0];
							vm.pd.MONTH3=AUTHENTICATE_RES_DATE[1];
							vm.pd.DAY3=AUTHENTICATE_RES_DATE[2];
						}
                     }else if ("exception" == data.result){
                     	showException("民办学校举办者基本情况及政治思想品德鉴定表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var DETERMINATIVETABLE_ID=$("#DETERMINATIVETABLE_ID").text();
                    if(null!=DETERMINATIVETABLE_ID&&undefined!=DETERMINATIVETABLE_ID&&''!=DETERMINATIVETABLE_ID){
                        vm.pd.DETERMINATIVETABLE_ID=DETERMINATIVETABLE_ID;
                    }
                    var NAME=$("#NAME").text();
                    if(null!=NAME&&undefined!=NAME&&''!=NAME){
                        vm.pd.NAME=NAME;
                    }
                    var SEX=$("#SEX").text();
                    if(null!=SEX&&undefined!=SEX&&''!=SEX){
                        vm.pd.SEX=SEX;
                    }
                    var EDUCATION=$("#EDUCATION").text();
                    if(null!=EDUCATION&&undefined!=EDUCATION&&''!=EDUCATION){
                        vm.pd.EDUCATION=EDUCATION;
                    }
                    var POLITICS_STATUS=$("#POLITICS_STATUS").text();
                    if(null!=POLITICS_STATUS&&undefined!=POLITICS_STATUS&&''!=POLITICS_STATUS){
                        vm.pd.POLITICS_STATUS=POLITICS_STATUS;
                    }
                    var DESIGNATE_DPOSITION=$("#DESIGNATE_DPOSITION").text();
                    if(null!=DESIGNATE_DPOSITION&&undefined!=DESIGNATE_DPOSITION&&''!=DESIGNATE_DPOSITION){
                        vm.pd.DESIGNATE_DPOSITION=DESIGNATE_DPOSITION;
                    }
                    var FULLTIME_OR_PARTTIME=$("#FULLTIME_OR_PARTTIME").text();
                    if(null!=FULLTIME_OR_PARTTIME&&undefined!=FULLTIME_OR_PARTTIME&&''!=FULLTIME_OR_PARTTIME){
                        vm.pd.FULLTIME_OR_PARTTIME=FULLTIME_OR_PARTTIME;
                    }
                    var TITLE=$("#TITLE").text();
                    if(null!=TITLE&&undefined!=TITLE&&''!=TITLE){
                        vm.pd.TITLE=TITLE;
                    }
                   /* var BIRTHDAY=$("#BIRTHDAY").text();
                    if(null!=BIRTHDAY&&undefined!=BIRTHDAY&&''!=BIRTHDAY){
                        vm.pd.BIRTHDAY=BIRTHDAY;
                    } */
					
					
					
					var YEAR=$("#YEAR").text();
					if(null!=YEAR&&undefined!=YEAR&&''!=YEAR){
						vm.pd.YEAR=YEAR;
					}else{
						vm.pd.YEAR="";	
					}
					var MONTH=$("#MONTH").text();
					if(null!=MONTH&&undefined!=MONTH&&''!=MONTH){
						if(MONTH<10&&MONTH.length==1){
							MONTH=("0"+MONTH)
						}
						vm.pd.MONTH=MONTH;
					}else{
						vm.pd.MONTH='';
					}
					var DAY=$("#DAY").text();
					if(null!=DAY&&undefined!=DAY&&''!=DAY){
						if(DAY<10&&DAY.length==1){
							DAY=("0"+DAY)
						}
						vm.pd.DAY=DAY;
					}else{
						vm.pd.DAY='';
					}
					
					vm.pd.BIRTHDAY=vm.pd.YEAR+"/"+vm.pd.MONTH+"/"+vm.pd.DAY;
					
                    var ID_NUMBER=$("#ID_NUMBER").text();
                    if(null!=ID_NUMBER&&undefined!=ID_NUMBER&&''!=ID_NUMBER){
                        vm.pd.ID_NUMBER=ID_NUMBER;
                    }
                    var WORK_YEAR=$("#WORK_YEAR").text();
                    if(null!=WORK_YEAR&&undefined!=WORK_YEAR&&''!=WORK_YEAR){
                        vm.pd.WORK_YEAR=WORK_YEAR;
                    }
                    var TEACH_MAJOR=$("#TEACH_MAJOR").text();
                    if(null!=TEACH_MAJOR&&undefined!=TEACH_MAJOR&&''!=TEACH_MAJOR){
                        vm.pd.TEACH_MAJOR=TEACH_MAJOR;
                    }
                    var HEALTHY_CONDITION=$("#HEALTHY_CONDITION").text();
                    if(null!=HEALTHY_CONDITION&&undefined!=HEALTHY_CONDITION&&''!=HEALTHY_CONDITION){
                        vm.pd.HEALTHY_CONDITION=HEALTHY_CONDITION;
                    }
                    var ISRETIREMENT=$("#ISRETIREMENT").text();
                    if(null!=ISRETIREMENT&&undefined!=ISRETIREMENT&&''!=ISRETIREMENT){
                        vm.pd.ISRETIREMENT=ISRETIREMENT;
                    }
                    var ORIGINAL_WORK=$("#ORIGINAL_WORK").text();
                    if(null!=ORIGINAL_WORK&&undefined!=ORIGINAL_WORK&&''!=ORIGINAL_WORK){
                        vm.pd.ORIGINAL_WORK=ORIGINAL_WORK;
                    }
                    var PHONE=$("#PHONE").text();
                    if(null!=PHONE&&undefined!=PHONE&&''!=PHONE){
                        vm.pd.PHONE=PHONE;
                    }
                    var NOW_ADDRESS=$("#NOW_ADDRESS").text();
                    if(null!=NOW_ADDRESS&&undefined!=NOW_ADDRESS&&''!=NOW_ADDRESS){
                        vm.pd.NOW_ADDRESS=NOW_ADDRESS;
                    }
                    var POSTCODE=$("#POSTCODE").text();
                    if(null!=POSTCODE&&undefined!=POSTCODE&&''!=POSTCODE){
                        vm.pd.POSTCODE=POSTCODE;
                    }
                    var RESUME=$("#RESUME").text();
                    if(null!=RESUME&&undefined!=RESUME&&''!=RESUME){
                        vm.pd.RESUME=RESUME;
                    }
                    var PARTY_OPINION=$("#PARTY_OPINION").text();
                    if(null!=PARTY_OPINION&&undefined!=PARTY_OPINION&&''!=PARTY_OPINION){
                        vm.pd.PARTY_OPINION=PARTY_OPINION;
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
					
					vm.pd.PARTY_OPINION_DATE=vm.pd.YEAR1+"/"+vm.pd.MONTH1+"/"+vm.pd.DAY1;
					
					
                   
                    var HR_DE_OPINION=$("#HR_DE_OPINION").text();
                    if(null!=HR_DE_OPINION&&undefined!=HR_DE_OPINION&&''!=HR_DE_OPINION){
                        vm.pd.HR_DE_OPINION=HR_DE_OPINION;
                    }
					
					
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
					vm.pd.HR_DE_OPINION_DATE=vm.pd.YEAR2+"/"+vm.pd.MONTH2+"/"+vm.pd.DAY2;
					
					var YEAR3=$("#YEAR3").text();
					if(null!=YEAR3&&undefined!=YEAR3&&''!=YEAR3){
						vm.pd.YEAR3=YEAR3;
					}else{
						vm.pd.YEAR3="";	
					}
					var MONTH3=$("#MONTH3").text();
					if(null!=MONTH3&&undefined!=MONTH3&&''!=MONTH3){
						if(MONTH3<10&&MONTH3.length==1){
							MONTH3=("0"+MONTH3)
						}
						vm.pd.MONTH3=MONTH3;
					}else{
						vm.pd.MONTH3='';
					}
					var DAY3=$("#DAY3").text();
					if(null!=DAY3&&undefined!=DAY3&&''!=DAY3){
						if(DAY3<10&&DAY3.length==1){
							DAY3=("0"+DAY3)
						}
						vm.pd.DAY3=DAY3;
					}else{
						vm.pd.DAY3='';
					}
					vm.pd.AUTHENTICATE_RES_DATE=vm.pd.YEAR3+"/"+vm.pd.MONTH3+"/"+vm.pd.DAY3;
					
					
                    var AUTHENTICATE_RES=$("#AUTHENTICATE_RES").text();
                    if(null!=AUTHENTICATE_RES&&undefined!=AUTHENTICATE_RES&&''!=AUTHENTICATE_RES){
                        vm.pd.AUTHENTICATE_RES=AUTHENTICATE_RES;
                    }
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