
var vm = new Vue({
	el: '#app',
	data:{
        XDJBASICSTATISTICS_ID: '',	//主键ID
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
        		this.XDJBASICSTATISTICS_ID = FDID;
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
            if(this.pd.TITLE_NAME == '' || this.pd.TITLE_NAME == undefined){
                    $("#TITLE_NAME").tips({
                        side:3,
                        msg:'请输入标题名称',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.TITLE_NAME = '';
                    this.$refs.TITLE_NAME.focus();
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
            if(this.pd.IDCARD == '' || this.pd.IDCARD == undefined){
                    $("#IDCARD").tips({
                        side:3,
                        msg:'请输入身份证号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.IDCARD = '';
                    this.$refs.IDCARD.focus();
                return false;
                }
            if(this.pd.POSITIONAL_TITLE == '' || this.pd.POSITIONAL_TITLE == undefined){
                    $("#POSITIONAL_TITLE").tips({
                        side:3,
                        msg:'请输入职称',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.POSITIONAL_TITLE = '';
                    this.$refs.POSITIONAL_TITLE.focus();
                return false;
                }
            if(this.pd.POLITIC_COUNTENANCE == '' || this.pd.POLITIC_COUNTENANCE == undefined){
                    $("#POLITIC_COUNTENANCE").tips({
                        side:3,
                        msg:'请输入政治面貌',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.POLITIC_COUNTENANCE = '';
                    this.$refs.POLITIC_COUNTENANCE.focus();
                return false;
                }
            if(this.pd.PXJG_JOB == '' || this.pd.PXJG_JOB == undefined){
                    $("#PXJG_JOB").tips({
                        side:3,
                        msg:'请输入培训机构拟任职务',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PXJG_JOB = '';
                    this.$refs.PXJG_JOB.focus();
                return false;
                }
            if(this.pd.FULL_PART_JOB == '' || this.pd.FULL_PART_JOB == undefined){
                    $("#FULL_PART_JOB").tips({
                        side:3,
                        msg:'请输入专职兼职',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FULL_PART_JOB = '';
                    this.$refs.FULL_PART_JOB.focus();
                return false;
                }
            if(this.pd.TEACH_YEAR == '' || this.pd.TEACH_YEAR == undefined){
                    $("#TEACH_YEAR").tips({
                        side:3,
                        msg:'请输入从事教育教学工作年限',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.TEACH_YEAR = '';
                    this.$refs.TEACH_YEAR.focus();
                return false;
                }
            if(this.pd.TEACH_PROFESSION == '' || this.pd.TEACH_PROFESSION == undefined){
                    $("#TEACH_PROFESSION").tips({
                        side:3,
                        msg:'请输入从教专业',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.TEACH_PROFESSION = '';
                    this.$refs.TEACH_PROFESSION.focus();
                return false;
                }
            if(this.pd.HEALTH == '' || this.pd.HEALTH == undefined){
                    $("#HEALTH").tips({
                        side:3,
                        msg:'请输入健康状况',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.HEALTH = '';
                    this.$refs.HEALTH.focus();
                return false;
                }
            if(this.pd.IS_RETIRE == '' || this.pd.IS_RETIRE == undefined){
                    $("#IS_RETIRE").tips({
                        side:3,
                        msg:'请输入是否退休',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.IS_RETIRE = '';
                    this.$refs.IS_RETIRE.focus();
                return false;
                }
            if(this.pd.ORIGINAL_WORK == '' || this.pd.ORIGINAL_WORK == undefined){
                    $("#ORIGINAL_WORK").tips({
                        side:3,
                        msg:'请输入原工作单位及职务',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ORIGINAL_WORK = '';
                    this.$refs.ORIGINAL_WORK.focus();
                return false;
                }
            if(this.pd.WORK_PHONE == '' || this.pd.WORK_PHONE == undefined){
                    $("#WORK_PHONE").tips({
                        side:3,
                        msg:'请输入单位电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.WORK_PHONE = '';
                    this.$refs.WORK_PHONE.focus();
                return false;
                }
            if(this.pd.MOBILE_PHONE == '' || this.pd.MOBILE_PHONE == undefined){
                    $("#MOBILE_PHONE").tips({
                        side:3,
                        msg:'请输入手机',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.MOBILE_PHONE = '';
                    this.$refs.MOBILE_PHONE.focus();
                return false;
                }
            if(this.pd.NOW_HOUSEADDRESS == '' || this.pd.NOW_HOUSEADDRESS == undefined){
                    $("#NOW_HOUSEADDRESS").tips({
                        side:3,
                        msg:'请输入现家庭住址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.NOW_HOUSEADDRESS = '';
                    this.$refs.NOW_HOUSEADDRESS.focus();
                return false;
                }
            if(this.pd.POSTAL_CODE == '' || this.pd.POSTAL_CODE == undefined){
                    $("#POSTAL_CODE").tips({
                        side:3,
                        msg:'请输入邮政编码',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.POSTAL_CODE = '';
                    this.$refs.POSTAL_CODE.focus();
                return false;
                }
            if(this.pd.HOUSE_PHONE == '' || this.pd.HOUSE_PHONE == undefined){
                    $("#HOUSE_PHONE").tips({
                        side:3,
                        msg:'请输入住宅电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.HOUSE_PHONE = '';
                    this.$refs.HOUSE_PHONE.focus();
                return false;
                }
            if(this.pd.WORK_RESUME == '' || this.pd.WORK_RESUME == undefined){
                    $("#WORK_RESUME").tips({
                        side:3,
                        msg:'请输入工作简历',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.WORK_RESUME = '';
                    this.$refs.WORK_RESUME.focus();
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

                //可以全部为空的DATE:本人意见日期
                var result1=vm.verifyDate(this.pd.MO_DATE);
                if(!result1.isNull){
                    if(!result1.isTrue){
                        $("#MO_DATE").tips({
                            side:3,
                            msg:result1.msg,
                            bg:'#AE81FF',
                            time:2
                        });
                        vm.pd.MO_DATE = '';
                        vm.pd.YEAR1=vm.pd.MONTH1=vm.pd.DAY1='';     //编号后的YEAR MONTH DAY
                        return false;
                    }
                }

            /*if(this.pd.MO_DATE == '' || this.pd.MO_DATE == undefined){
                    $("#MO_DATE").tips({
                        side:3,
                        msg:'请输入本人意见日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.MO_DATE = '';
                    this.$refs.MO_DATE.focus();
                return false;
                }*/
            if(this.pd.PERSON_DEPT_OPINION == '' || this.pd.PERSON_DEPT_OPINION == undefined){
                    $("#PERSON_DEPT_OPINION").tips({
                        side:3,
                        msg:'请输入所在单位人事部门意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PERSON_DEPT_OPINION = '';
                    this.$refs.PERSON_DEPT_OPINION.focus();
                return false;
                }

                //可以全部为空的DATE:人事部门意见日期
                var result2=vm.verifyDate(this.pd.PDP_DATE);
                if(!result2.isNull){
                    if(!result2.isTrue){
                        $("#PDP_DATE").tips({
                            side:3,
                            msg:result2.msg,
                            bg:'#AE81FF',
                            time:2
                        });
                        vm.pd.PDP_DATE = '';
                        vm.pd.YEAR2=vm.pd.MONTH2=vm.pd.DAY2='';     //编号后的YEAR MONTH DAY
                        return false;
                    }
                }

            /*if(this.pd.PDP_DATE == '' || this.pd.PDP_DATE == undefined){
                    $("#PDP_DATE").tips({
                        side:3,
                        msg:'请输入所在单位人事部门意见日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PDP_DATE = '';
                    this.$refs.PDP_DATE.focus();
                return false;
                }*/
            /*if(this.pd.PASSPORT_PHOTO == '' || this.pd.PASSPORT_PHOTO == undefined){
                    $("#PASSPORT_PHOTO").tips({
                        side:3,
                        msg:'请输入证件照',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PASSPORT_PHOTO = '';
                    this.$refs.PASSPORT_PHOTO.focus();
                return false;
                }*/
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'xdjbasicstatistics/'+this.msg,
			    	data: {
                        XDJBASICSTATISTICS_ID:this.XDJBASICSTATISTICS_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

						TITLE_NAME:this.pd.TITLE_NAME,

						NAME:this.pd.NAME,

						SEX:this.pd.SEX,

						AGE:this.pd.AGE,

						EDUCATION:this.pd.EDUCATION,

						IDCARD:this.pd.IDCARD,

						POSITIONAL_TITLE:this.pd.POSITIONAL_TITLE,

						POLITIC_COUNTENANCE:this.pd.POLITIC_COUNTENANCE,

						PXJG_JOB:this.pd.PXJG_JOB,

						FULL_PART_JOB:this.pd.FULL_PART_JOB,

						TEACH_YEAR:this.pd.TEACH_YEAR,

						TEACH_PROFESSION:this.pd.TEACH_PROFESSION,

						HEALTH:this.pd.HEALTH,

						IS_RETIRE:this.pd.IS_RETIRE,

						ORIGINAL_WORK:this.pd.ORIGINAL_WORK,

						WORK_PHONE:this.pd.WORK_PHONE,

						MOBILE_PHONE:this.pd.MOBILE_PHONE,

						NOW_HOUSEADDRESS:this.pd.NOW_HOUSEADDRESS,

						POSTAL_CODE:this.pd.POSTAL_CODE,

						HOUSE_PHONE:this.pd.HOUSE_PHONE,

						WORK_RESUME:this.pd.WORK_RESUME,

						MY_OPINION:this.pd.MY_OPINION,

						MO_DATE:this.pd.MO_DATE,

						PERSON_DEPT_OPINION:this.pd.PERSON_DEPT_OPINION,

						PDP_DATE:this.pd.PDP_DATE,

						PASSPORT_PHOTO:this.pd.PASSPORT_PHOTO,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.XDJBASICSTATISTICS_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("校长、董事长（理事长）、举办者个人基本情况",data.exception);//显示异常
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
				url: httpurl+'xdjbasicstatistics/goEdit',
		    	data: {
                    XDJBASICSTATISTICS_ID:this.XDJBASICSTATISTICS_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	 vm.pd = data.pd;							//参数map
                         if(data.pd.MO_DATE!=''&&null!=data.pd.MO_DATE&&undefined!=data.pd.MO_DATE){
                             var MO_DATE=data.pd.MO_DATE.split("/");
                             vm.pd.YEAR1=MO_DATE[0];
                             vm.pd.MONTH1=MO_DATE[1];
                             vm.pd.DAY1=MO_DATE[2];
                         }
                         if(data.pd.PDP_DATE!=''&&null!=data.pd.PDP_DATE&&undefined!=data.pd.PDP_DATE){
                             var PDP_DATE=data.pd.PDP_DATE.split("/");
                             vm.pd.YEAR2=PDP_DATE[0];
                             vm.pd.MONTH2=PDP_DATE[1];
                             vm.pd.DAY2=PDP_DATE[2];
                         }
                     }else if ("exception" == data.result){
                     	showException("校长、董事长（理事长）、举办者个人基本情况",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var TITLE_NAME=$("#TITLE_NAME").text();
                    if(null!=TITLE_NAME&&undefined!=TITLE_NAME&&''!=TITLE_NAME){
                        vm.pd.TITLE_NAME=TITLE_NAME;
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
                    var IDCARD=$("#IDCARD").text();
                    if(null!=IDCARD&&undefined!=IDCARD&&''!=IDCARD){
                        vm.pd.IDCARD=IDCARD;
                    }
                    var POSITIONAL_TITLE=$("#POSITIONAL_TITLE").text();
                    if(null!=POSITIONAL_TITLE&&undefined!=POSITIONAL_TITLE&&''!=POSITIONAL_TITLE){
                        vm.pd.POSITIONAL_TITLE=POSITIONAL_TITLE;
                    }
                    var POLITIC_COUNTENANCE=$("#POLITIC_COUNTENANCE").text();
                    if(null!=POLITIC_COUNTENANCE&&undefined!=POLITIC_COUNTENANCE&&''!=POLITIC_COUNTENANCE){
                        vm.pd.POLITIC_COUNTENANCE=POLITIC_COUNTENANCE;
                    }
                    var PXJG_JOB=$("#PXJG_JOB").text();
                    if(null!=PXJG_JOB&&undefined!=PXJG_JOB&&''!=PXJG_JOB){
                        vm.pd.PXJG_JOB=PXJG_JOB;
                    }
                    var FULL_PART_JOB=$("#FULL_PART_JOB").text();
                    if(null!=FULL_PART_JOB&&undefined!=FULL_PART_JOB&&''!=FULL_PART_JOB){
                        vm.pd.FULL_PART_JOB=FULL_PART_JOB;
                    }
                    var TEACH_YEAR=$("#TEACH_YEAR").text();
                    if(null!=TEACH_YEAR&&undefined!=TEACH_YEAR&&''!=TEACH_YEAR){
                        vm.pd.TEACH_YEAR=TEACH_YEAR;
                    }
                    var TEACH_PROFESSION=$("#TEACH_PROFESSION").text();
                    if(null!=TEACH_PROFESSION&&undefined!=TEACH_PROFESSION&&''!=TEACH_PROFESSION){
                        vm.pd.TEACH_PROFESSION=TEACH_PROFESSION;
                    }
                    var HEALTH=$("#HEALTH").text();
                    if(null!=HEALTH&&undefined!=HEALTH&&''!=HEALTH){
                        vm.pd.HEALTH=HEALTH;
                    }
                    var IS_RETIRE=$("#IS_RETIRE").text();
                    if(null!=IS_RETIRE&&undefined!=IS_RETIRE&&''!=IS_RETIRE){
                        vm.pd.IS_RETIRE=IS_RETIRE;
                    }
                    var ORIGINAL_WORK=$("#ORIGINAL_WORK").text();
                    if(null!=ORIGINAL_WORK&&undefined!=ORIGINAL_WORK&&''!=ORIGINAL_WORK){
                        vm.pd.ORIGINAL_WORK=ORIGINAL_WORK;
                    }
                    var WORK_PHONE=$("#WORK_PHONE").text();
                    if(null!=WORK_PHONE&&undefined!=WORK_PHONE&&''!=WORK_PHONE){
                        vm.pd.WORK_PHONE=WORK_PHONE;
                    }
                    var MOBILE_PHONE=$("#MOBILE_PHONE").text();
                    if(null!=MOBILE_PHONE&&undefined!=MOBILE_PHONE&&''!=MOBILE_PHONE){
                        vm.pd.MOBILE_PHONE=MOBILE_PHONE;
                    }
                    var NOW_HOUSEADDRESS=$("#NOW_HOUSEADDRESS").text();
                    if(null!=NOW_HOUSEADDRESS&&undefined!=NOW_HOUSEADDRESS&&''!=NOW_HOUSEADDRESS){
                        vm.pd.NOW_HOUSEADDRESS=NOW_HOUSEADDRESS;
                    }
                    var POSTAL_CODE=$("#POSTAL_CODE").text();
                    if(null!=POSTAL_CODE&&undefined!=POSTAL_CODE&&''!=POSTAL_CODE){
                        vm.pd.POSTAL_CODE=POSTAL_CODE;
                    }
                    var HOUSE_PHONE=$("#HOUSE_PHONE").text();
                    if(null!=HOUSE_PHONE&&undefined!=HOUSE_PHONE&&''!=HOUSE_PHONE){
                        vm.pd.HOUSE_PHONE=HOUSE_PHONE;
                    }
                    var WORK_RESUME=$("#WORK_RESUME").text();
                    if(null!=WORK_RESUME&&undefined!=WORK_RESUME&&''!=WORK_RESUME){
                        vm.pd.WORK_RESUME=WORK_RESUME;
                    }
                    var MY_OPINION=$("#MY_OPINION").text();
                    if(null!=MY_OPINION&&undefined!=MY_OPINION&&''!=MY_OPINION){
                        vm.pd.MY_OPINION=MY_OPINION;
                    }
                    //本人意见日期
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
                    vm.pd.MO_DATE=vm.pd.YEAR1+"/"+vm.pd.MONTH1+"/"+vm.pd.DAY1;
                    //人事部门意见日期
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
                    vm.pd.PDP_DATE=vm.pd.YEAR2+"/"+vm.pd.MONTH2+"/"+vm.pd.DAY2;

                    /*var MO_DATE=$("#MO_DATE").text();
                    if(null!=MO_DATE&&undefined!=MO_DATE&&''!=MO_DATE){
                        vm.pd.MO_DATE=MO_DATE;
                    }*/
                    var PERSON_DEPT_OPINION=$("#PERSON_DEPT_OPINION").text();
                    if(null!=PERSON_DEPT_OPINION&&undefined!=PERSON_DEPT_OPINION&&''!=PERSON_DEPT_OPINION){
                        vm.pd.PERSON_DEPT_OPINION=PERSON_DEPT_OPINION;
                    }
                    /*var PDP_DATE=$("#PDP_DATE").text();
                    if(null!=PDP_DATE&&undefined!=PDP_DATE&&''!=PDP_DATE){
                        vm.pd.PDP_DATE=PDP_DATE;
                    }*/
                    var PASSPORT_PHOTO=$("#PASSPORT_PHOTO").text();
                    if(null!=PASSPORT_PHOTO&&undefined!=PASSPORT_PHOTO&&''!=PASSPORT_PHOTO){
                        vm.pd.PASSPORT_PHOTO=PASSPORT_PHOTO;
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