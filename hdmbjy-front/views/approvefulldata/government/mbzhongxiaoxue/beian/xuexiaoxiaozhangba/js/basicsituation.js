
var vm = new Vue({
	el: '#app',
	data:{
        BASICSITUATION_ID: '',	//主键ID
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
        		this.BASICSITUATION_ID = FDID;
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
            if(this.pd.BIRTHDAY_YEAR == '' || this.pd.BIRTHDAY_YEAR == undefined){
                    $("#BIRTHDAY_YEAR").tips({
                        side:3,
                        msg:'请输入出生日期_年',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BIRTHDAY_YEAR = '';
                    this.$refs.BIRTHDAY_YEAR.focus();
                return false;
                }
            if(this.pd.BIRTHDAY_MONTH == '' || this.pd.BIRTHDAY_MONTH == undefined){
                    $("#BIRTHDAY_MONTH").tips({
                        side:3,
                        msg:'请输入出生日期_月',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BIRTHDAY_MONTH = '';
                    this.$refs.BIRTHDAY_MONTH.focus();
                return false;
                }
            if(this.pd.BIRTHDAY_DAY == '' || this.pd.BIRTHDAY_DAY == undefined){
                    $("#BIRTHDAY_DAY").tips({
                        side:3,
                        msg:'请输入出生日期_日',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BIRTHDAY_DAY = '';
                    this.$refs.BIRTHDAY_DAY.focus();
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
            if(this.pd.EDUCATION == '' || this.pd.EDUCATION == undefined){
                    $("#EDUCATION").tips({
                        side:3,
                        msg:'请输入文化程度',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.EDUCATION = '';
                    this.$refs.EDUCATION.focus();
                return false;
                }
            if(this.pd.ID_NUMBER == '' || this.pd.ID_NUMBER == undefined){
                    $("#ID_NUMBER").tips({
                        side:3,
                        msg:'请输入身份证号码',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ID_NUMBER = '';
                    this.$refs.ID_NUMBER.focus();
                return false;
                }
            if(this.pd.HEALTH_CONDITION == '' || this.pd.HEALTH_CONDITION == undefined){
                    $("#HEALTH_CONDITION").tips({
                        side:3,
                        msg:'请输入健康状况',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.HEALTH_CONDITION = '';
                    this.$refs.HEALTH_CONDITION.focus();
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
            if(this.pd.ORIGINAL_WORK_AND_POSITION == '' || this.pd.ORIGINAL_WORK_AND_POSITION == undefined){
                    $("#ORIGINAL_WORK_AND_POSITION").tips({
                        side:3,
                        msg:'请输入原工作单位及职务',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORIGINAL_WORK_AND_POSITION = '';
                    this.$refs.ORIGINAL_WORK_AND_POSITION.focus();
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
            if(this.pd.ADDRESS == '' || this.pd.ADDRESS == undefined){
                    $("#ADDRESS").tips({
                        side:3,
                        msg:'请输入现家庭住址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ADDRESS = '';
                    this.$refs.ADDRESS.focus();
                return false;
                }
            if(this.pd.POST == '' || this.pd.POST == undefined){
                    $("#POST").tips({
                        side:3,
                        msg:'请输入邮政编码',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.POST = '';
                    this.$refs.POST.focus();
                return false;
                }
            if(this.pd.JOB_RESUME == '' || this.pd.JOB_RESUME == undefined){
                    $("#JOB_RESUME").tips({
                        side:3,
                        msg:'请输入工作简历',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.JOB_RESUME = '';
                    this.$refs.JOB_RESUME.focus();
                return false;
                }
            if(this.pd.MY_OPINION == '' || this.pd.MY_OPINION == undefined){
                    $("#MY_OPINION").tips({
                        side:3,
                        msg:'请输入本人意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.MY_OPINION = '';
                    this.$refs.MY_OPINION.focus();
                return false;
                }
           /* if(this.pd.MY_OPINION_DATE == '' || this.pd.MY_OPINION_DATE == undefined){
                    $("#MY_OPINION_DATE").tips({
                        side:3,
                        msg:'请输入本人意见日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.MY_OPINION_DATE = '';
                    this.$refs.MY_OPINION_DATE.focus();
                return false;
                } */
				
				//可以全部为空的DATE
			var result=vm.verifyDate(this.pd.MY_OPINION_DATE);	
			if(!result.isNull){
				if(!result.isTrue){
					$("#MY_OPINION_DATE").tips({
						side:3,
						msg:result.msg,
						bg:'#AE81FF',
						time:2
					});
					vm.pd.MY_OPINION_DATE = '';
					vm.pd.YEAR1=vm.pd.MONTH1=vm.pd.DAY1='';     //编号后的YEAR MONTH DAY
					return false;
				}
			}
				
            if(this.pd.DEPARTMENT_OPINION == '' || this.pd.DEPARTMENT_OPINION == undefined){
                    $("#DEPARTMENT_OPINION").tips({
                        side:3,
                        msg:'请输入本人关系所在单位人事部门意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DEPARTMENT_OPINION = '';
                    this.$refs.DEPARTMENT_OPINION.focus();
                return false;
                }
          /*  if(this.pd.DEPARTMENT_OPINION_DATE == '' || this.pd.DEPARTMENT_OPINION_DATE == undefined){
                    $("#DEPARTMENT_OPINION_DATE").tips({
                        side:3,
                        msg:'请输入本人关系所在单位人事部门意见日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DEPARTMENT_OPINION_DATE = '';
                    this.$refs.DEPARTMENT_OPINION_DATE.focus();
                return false;
                } */
				//可以全部为空的DATE
				var result=vm.verifyDate(this.pd.DEPARTMENT_OPINION_DATE);	
				if(!result.isNull){
					if(!result.isTrue){
						$("#DEPARTMENT_OPINION_DATE").tips({
							side:3,
							msg:result.msg,
							bg:'#AE81FF',
							time:2
						});
						vm.pd.DEPARTMENT_OPINION_DATE = '';
						vm.pd.YEAR2=vm.pd.MONTH2=vm.pd.DAY2='';     //编号后的YEAR MONTH DAY
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
					url: httpurl+'basicsituation/'+this.msg,
			    	data: {
						BASICSITUATION_ID:this.BASICSITUATION_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						
						NAME:this.pd.NAME,

						SEX:this.pd.SEX,

						NATION:this.pd.NATION,

						BIRTHDAY_YEAR:this.pd.BIRTHDAY_YEAR,

						BIRTHDAY_MONTH:this.pd.BIRTHDAY_MONTH,

						BIRTHDAY_DAY:this.pd.BIRTHDAY_DAY,

						POLITICS_STATUS:this.pd.POLITICS_STATUS,

						TITLE:this.pd.TITLE,

						EDUCATION:this.pd.EDUCATION,

						ID_NUMBER:this.pd.ID_NUMBER,

						HEALTH_CONDITION:this.pd.HEALTH_CONDITION,

						ISRETIREMENT:this.pd.ISRETIREMENT,

						ORIGINAL_WORK_AND_POSITION:this.pd.ORIGINAL_WORK_AND_POSITION,

						PHONE:this.pd.PHONE,

						ADDRESS:this.pd.ADDRESS,

						POST:this.pd.POST,

						JOB_RESUME:this.pd.JOB_RESUME,

						MY_OPINION:this.pd.MY_OPINION,

						MY_OPINION_DATE:this.pd.MY_OPINION_DATE,

						DEPARTMENT_OPINION:this.pd.DEPARTMENT_OPINION,

						DEPARTMENT_OPINION_DATE:this.pd.DEPARTMENT_OPINION_DATE,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.BASICSITUATION_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "暂存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("民办学校校长、(董事长、理事长）、法定代表人基本情况表",data.exception);//显示异常
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
				url: httpurl+'basicsituation/goEdit',
		    	data: {
                    BASICSITUATION_ID:this.BASICSITUATION_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						if(data.pd.MY_OPINION_DATE!=''&&null!=data.pd.MY_OPINION_DATE&&undefined!=data.pd.MY_OPINION_DATE){
									var MY_OPINION_DATE=data.pd.MY_OPINION_DATE.split("/");
									vm.pd.YEAR1=MY_OPINION_DATE[0];
									vm.pd.MONTH1=MY_OPINION_DATE[1];
									vm.pd.DAY1=MY_OPINION_DATE[2];
						}
						if(data.pd.MY_OPINION_DATE!=''&&null!=data.pd.MY_OPINION_DATE&&undefined!=data.pd.MY_OPINION_DATE){
									var MY_OPINION_DATE=data.pd.MY_OPINION_DATE.split("/");
									vm.pd.YEAR1=MY_OPINION_DATE[0];
									vm.pd.MONTH1=MY_OPINION_DATE[1];
									vm.pd.DAY1=MY_OPINION_DATE[2];
						}
                     }else if ("exception" == data.result){
                     	showException("民办学校校长、(董事长、理事长）、法定代表人基本情况表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var NAME=$("#NAME").text();
                    if(null!=NAME&&undefined!=NAME&&''!=NAME){
                        vm.pd.NAME=NAME;
                    }
                    var SEX=$("#SEX").text();
                    if(null!=SEX&&undefined!=SEX&&''!=SEX){
                        vm.pd.SEX=SEX;
                    }
                    var NATION=$("#NATION").text();
                    if(null!=NATION&&undefined!=NATION&&''!=NATION){
                        vm.pd.NATION=NATION;
                    }
                    var BIRTHDAY_YEAR=$("#BIRTHDAY_YEAR").text();
                    if(null!=BIRTHDAY_YEAR&&undefined!=BIRTHDAY_YEAR&&''!=BIRTHDAY_YEAR){
                        vm.pd.BIRTHDAY_YEAR=BIRTHDAY_YEAR;
                    }
                    var BIRTHDAY_MONTH=$("#BIRTHDAY_MONTH").text();
                    if(null!=BIRTHDAY_MONTH&&undefined!=BIRTHDAY_MONTH&&''!=BIRTHDAY_MONTH){
                        vm.pd.BIRTHDAY_MONTH=BIRTHDAY_MONTH;
                    }
                    var BIRTHDAY_DAY=$("#BIRTHDAY_DAY").text();
                    if(null!=BIRTHDAY_DAY&&undefined!=BIRTHDAY_DAY&&''!=BIRTHDAY_DAY){
                        vm.pd.BIRTHDAY_DAY=BIRTHDAY_DAY;
                    }
                    var POLITICS_STATUS=$("#POLITICS_STATUS").text();
                    if(null!=POLITICS_STATUS&&undefined!=POLITICS_STATUS&&''!=POLITICS_STATUS){
                        vm.pd.POLITICS_STATUS=POLITICS_STATUS;
                    }
                    var TITLE=$("#TITLE").text();
                    if(null!=TITLE&&undefined!=TITLE&&''!=TITLE){
                        vm.pd.TITLE=TITLE;
                    }
                    var EDUCATION=$("#EDUCATION").text();
                    if(null!=EDUCATION&&undefined!=EDUCATION&&''!=EDUCATION){
                        vm.pd.EDUCATION=EDUCATION;
                    }
                    var ID_NUMBER=$("#ID_NUMBER").text();
                    if(null!=ID_NUMBER&&undefined!=ID_NUMBER&&''!=ID_NUMBER){
                        vm.pd.ID_NUMBER=ID_NUMBER;
                    }
                    var HEALTH_CONDITION=$("#HEALTH_CONDITION").text();
                    if(null!=HEALTH_CONDITION&&undefined!=HEALTH_CONDITION&&''!=HEALTH_CONDITION){
                        vm.pd.HEALTH_CONDITION=HEALTH_CONDITION;
                    }
                    var ISRETIREMENT=$("#ISRETIREMENT").text();
                    if(null!=ISRETIREMENT&&undefined!=ISRETIREMENT&&''!=ISRETIREMENT){
                        vm.pd.ISRETIREMENT=ISRETIREMENT;
                    }
                    var ORIGINAL_WORK_AND_POSITION=$("#ORIGINAL_WORK_AND_POSITION").text();
                    if(null!=ORIGINAL_WORK_AND_POSITION&&undefined!=ORIGINAL_WORK_AND_POSITION&&''!=ORIGINAL_WORK_AND_POSITION){
                        vm.pd.ORIGINAL_WORK_AND_POSITION=ORIGINAL_WORK_AND_POSITION;
                    }
                    var PHONE=$("#PHONE").text();
                    if(null!=PHONE&&undefined!=PHONE&&''!=PHONE){
                        vm.pd.PHONE=PHONE;
                    }
                    var ADDRESS=$("#ADDRESS").text();
                    if(null!=ADDRESS&&undefined!=ADDRESS&&''!=ADDRESS){
                        vm.pd.ADDRESS=ADDRESS;
                    }
                    var POST=$("#POST").text();
                    if(null!=POST&&undefined!=POST&&''!=POST){
                        vm.pd.POST=POST;
                    }
                    var JOB_RESUME=$("#JOB_RESUME").text();
                    if(null!=JOB_RESUME&&undefined!=JOB_RESUME&&''!=JOB_RESUME){
                        vm.pd.JOB_RESUME=JOB_RESUME;
                    }
                    var MY_OPINION=$("#MY_OPINION").text();
                    if(null!=MY_OPINION&&undefined!=MY_OPINION&&''!=MY_OPINION){
                        vm.pd.MY_OPINION=MY_OPINION;
                    }
                  /*  var MY_OPINION_DATE=$("#MY_OPINION_DATE").text();
                    if(null!=MY_OPINION_DATE&&undefined!=MY_OPINION_DATE&&''!=MY_OPINION_DATE){
                        vm.pd.MY_OPINION_DATE=MY_OPINION_DATE;
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
					vm.pd.MY_OPINION_DATE=vm.pd.YEAR1+"/"+vm.pd.MONTH1+"/"+vm.pd.DAY1;
					
					
                    var DEPARTMENT_OPINION=$("#DEPARTMENT_OPINION").text();
                    if(null!=DEPARTMENT_OPINION&&undefined!=DEPARTMENT_OPINION&&''!=DEPARTMENT_OPINION){
                        vm.pd.DEPARTMENT_OPINION=DEPARTMENT_OPINION;
                    }
                    /* var DEPARTMENT_OPINION_DATE=$("#DEPARTMENT_OPINION_DATE").text();
                    if(null!=DEPARTMENT_OPINION_DATE&&undefined!=DEPARTMENT_OPINION_DATE&&''!=DEPARTMENT_OPINION_DATE){
                        vm.pd.DEPARTMENT_OPINION_DATE=DEPARTMENT_OPINION_DATE;
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
					vm.pd.DEPARTMENT_OPINION_DATE=vm.pd.YEAR2+"/"+vm.pd.MONTH2+"/"+vm.pd.DAY2;
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