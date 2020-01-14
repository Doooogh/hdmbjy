
var vm = new Vue({
	el: '#app',
	data:{
        PXSCBASICINFOTABLE_ID: '',	//主键ID
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
        		this.PXSCBASICINFOTABLE_ID = FDID;
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
			
			if(this.pd.SC_NAME == '' || this.pd.SC_NAME == undefined){
			        $("#SC_NAME").tips({
			            side:3,
			            msg:'请输入培训学校名称',
			            bg:'#AE81FF',
			            time:2
			        });
			        this.pd.SC_NAME = '';
			        this.$refs.SC_NAME.focus();
			    return false;
			    }
				
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
            if(this.pd.AGE == '' || this.pd.AGE == undefined){
                    $("#AGE").tips({
                        side:3,
                        msg:'请输入年龄',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.AGE = '';
                    this.$refs.AGE.focus();
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
            if(this.pd.DUTY == '' || this.pd.DUTY == undefined){
                    $("#DUTY").tips({
                        side:3,
                        msg:'请输入培训机构拟任职务',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DUTY = '';
                    this.$refs.DUTY.focus();
                return false;
                }
            if(this.pd.YEAR_OF_NUMBER == '' || this.pd.YEAR_OF_NUMBER == undefined){
                    $("#YEAR_OF_NUMBER").tips({
                        side:3,
                        msg:'请输入从事教育教学工作年限',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.YEAR_OF_NUMBER = '';
                    this.$refs.YEAR_OF_NUMBER.focus();
                return false;
                }
            if(this.pd.MAJOR == '' || this.pd.MAJOR == undefined){
                    $("#MAJOR").tips({
                        side:3,
                        msg:'请输入从事专业',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.MAJOR = '';
                    this.$refs.MAJOR.focus();
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
            if(this.pd.RETIRE == '' || this.pd.RETIRE == undefined){
                    $("#RETIRE").tips({
                        side:3,
                        msg:'请输入是否退休',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.RETIRE = '';
                    this.$refs.RETIRE.focus();
                return false;
                }
            if(this.pd.ORIGINAL_COMPANY_AND_DUTY == '' || this.pd.ORIGINAL_COMPANY_AND_DUTY == undefined){
                    $("#ORIGINAL_COMPANY_AND_DUTY").tips({
                        side:3,
                        msg:'请输入原工作单位及职务',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORIGINAL_COMPANY_AND_DUTY = '';
                    this.$refs.ORIGINAL_COMPANY_AND_DUTY.focus();
                return false;
                }
            if(this.pd.ORIGINAL_COMPANY_TEL == '' || this.pd.ORIGINAL_COMPANY_TEL == undefined){
                    $("#ORIGINAL_COMPANY_TEL").tips({
                        side:3,
                        msg:'请输入单位电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORIGINAL_COMPANY_TEL = '';
                    this.$refs.ORIGINAL_COMPANY_TEL.focus();
                return false;
                }
            if(this.pd.ORIGINAL_COMPANY_PHONE == '' || this.pd.ORIGINAL_COMPANY_PHONE == undefined){
                    $("#ORIGINAL_COMPANY_PHONE").tips({
                        side:3,
                        msg:'请输入原单位手机',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORIGINAL_COMPANY_PHONE = '';
                    this.$refs.ORIGINAL_COMPANY_PHONE.focus();
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
            if(this.pd.HOMEPHONE == '' || this.pd.HOMEPHONE == undefined){
                    $("#HOMEPHONE").tips({
                        side:3,
                        msg:'请输入住宅电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.HOMEPHONE = '';
                    this.$refs.HOMEPHONE.focus();
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
            if(this.pd.DEPT_OPINION == '' || this.pd.DEPT_OPINION == undefined){
                    $("#DEPT_OPINION").tips({
                        side:3,
                        msg:'请输入所在单位人事部门意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DEPT_OPINION = '';
                    this.$refs.DEPT_OPINION.focus();
                return false;
                }
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'pxscbasicinfotable/'+this.msg,
			    	data: {
						PXSCBASICINFOTABLE_ID:this.PXSCBASICINFOTABLE_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

						NAME:this.pd.NAME,
						
						SC_NAME:this.pd.SC_NAME,

						SEX:this.pd.SEX,

						AGE:this.pd.AGE,

						EDUCATION:this.pd.EDUCATION,

						ID_NUMBER:this.pd.ID_NUMBER,

						TITLE:this.pd.TITLE,

						DUTY:this.pd.DUTY,

						YEAR_OF_NUMBER:this.pd.YEAR_OF_NUMBER,

						MAJOR:this.pd.MAJOR,

						HEALTHY_CONDITION:this.pd.HEALTHY_CONDITION,

						RETIRE:this.pd.RETIRE,

						ORIGINAL_COMPANY_AND_DUTY:this.pd.ORIGINAL_COMPANY_AND_DUTY,

						ORIGINAL_COMPANY_TEL:this.pd.ORIGINAL_COMPANY_TEL,

						ORIGINAL_COMPANY_PHONE:this.pd.ORIGINAL_COMPANY_PHONE,

						NOW_ADDRESS:this.pd.NOW_ADDRESS,

						POST:this.pd.POST,

						HOMEPHONE:this.pd.HOMEPHONE,

						JOB_RESUME:this.pd.JOB_RESUME,

						DEPT_OPINION:this.pd.DEPT_OPINION,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.PXSCBASICINFOTABLE_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("培训学校个人基本情况表",data.exception);//显示异常
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
				url: httpurl+'pxscbasicinfotable/goEdit',
		    	data: {
                    PXSCBASICINFOTABLE_ID:this.PXSCBASICINFOTABLE_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("培训学校个人基本情况表",data.exception);	//显示异常
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
                    var NAME=$("#NAME").text();
                    if(null!=NAME&&undefined!=NAME&&''!=NAME){
                        vm.pd.NAME=NAME;
                    }
                    var SEX=$("#SEX").text();
                    if(null!=SEX&&undefined!=SEX&&''!=SEX){
                        vm.pd.SEX=SEX;
                    }
                    var AGE=$("#AGE").text();
                    if(null!=AGE&&undefined!=AGE&&''!=AGE){
                        vm.pd.AGE=AGE;
                    }
                    var EDUCATION=$("#EDUCATION").text();
                    if(null!=EDUCATION&&undefined!=EDUCATION&&''!=EDUCATION){
                        vm.pd.EDUCATION=EDUCATION;
                    }
                    var ID_NUMBER=$("#ID_NUMBER").text();
                    if(null!=ID_NUMBER&&undefined!=ID_NUMBER&&''!=ID_NUMBER){
                        vm.pd.ID_NUMBER=ID_NUMBER;
                    }
                    var TITLE=$("#TITLE").text();
                    if(null!=TITLE&&undefined!=TITLE&&''!=TITLE){
                        vm.pd.TITLE=TITLE;
                    }
                    var DUTY=$("#DUTY").text();
                    if(null!=DUTY&&undefined!=DUTY&&''!=DUTY){
                        vm.pd.DUTY=DUTY;
                    }
                    var YEAR_OF_NUMBER=$("#YEAR_OF_NUMBER").text();
                    if(null!=YEAR_OF_NUMBER&&undefined!=YEAR_OF_NUMBER&&''!=YEAR_OF_NUMBER){
                        vm.pd.YEAR_OF_NUMBER=YEAR_OF_NUMBER;
                    }
                    var MAJOR=$("#MAJOR").text();
                    if(null!=MAJOR&&undefined!=MAJOR&&''!=MAJOR){
                        vm.pd.MAJOR=MAJOR;
                    }
                    var HEALTHY_CONDITION=$("#HEALTHY_CONDITION").text();
                    if(null!=HEALTHY_CONDITION&&undefined!=HEALTHY_CONDITION&&''!=HEALTHY_CONDITION){
                        vm.pd.HEALTHY_CONDITION=HEALTHY_CONDITION;
                    }
                    var RETIRE=$("#RETIRE").text();
                    if(null!=RETIRE&&undefined!=RETIRE&&''!=RETIRE){
                        vm.pd.RETIRE=RETIRE;
                    }
                    var ORIGINAL_COMPANY_AND_DUTY=$("#ORIGINAL_COMPANY_AND_DUTY").text();
                    if(null!=ORIGINAL_COMPANY_AND_DUTY&&undefined!=ORIGINAL_COMPANY_AND_DUTY&&''!=ORIGINAL_COMPANY_AND_DUTY){
                        vm.pd.ORIGINAL_COMPANY_AND_DUTY=ORIGINAL_COMPANY_AND_DUTY;
                    }
                    var ORIGINAL_COMPANY_TEL=$("#ORIGINAL_COMPANY_TEL").text();
                    if(null!=ORIGINAL_COMPANY_TEL&&undefined!=ORIGINAL_COMPANY_TEL&&''!=ORIGINAL_COMPANY_TEL){
                        vm.pd.ORIGINAL_COMPANY_TEL=ORIGINAL_COMPANY_TEL;
                    }
                    var ORIGINAL_COMPANY_PHONE=$("#ORIGINAL_COMPANY_PHONE").text();
                    if(null!=ORIGINAL_COMPANY_PHONE&&undefined!=ORIGINAL_COMPANY_PHONE&&''!=ORIGINAL_COMPANY_PHONE){
                        vm.pd.ORIGINAL_COMPANY_PHONE=ORIGINAL_COMPANY_PHONE;
                    }
                    var NOW_ADDRESS=$("#NOW_ADDRESS").text();
                    if(null!=NOW_ADDRESS&&undefined!=NOW_ADDRESS&&''!=NOW_ADDRESS){
                        vm.pd.NOW_ADDRESS=NOW_ADDRESS;
                    }
                    var POST=$("#POST").text();
                    if(null!=POST&&undefined!=POST&&''!=POST){
                        vm.pd.POST=POST;
                    }
                    var HOMEPHONE=$("#HOMEPHONE").text();
                    if(null!=HOMEPHONE&&undefined!=HOMEPHONE&&''!=HOMEPHONE){
                        vm.pd.HOMEPHONE=HOMEPHONE;
                    }
                    var JOB_RESUME=$("#JOB_RESUME").text();
                    if(null!=JOB_RESUME&&undefined!=JOB_RESUME&&''!=JOB_RESUME){
                        vm.pd.JOB_RESUME=JOB_RESUME;
                    }
                    var DEPT_OPINION=$("#DEPT_OPINION").text();
                    if(null!=DEPT_OPINION&&undefined!=DEPT_OPINION&&''!=DEPT_OPINION){
                        vm.pd.DEPT_OPINION=DEPT_OPINION;
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