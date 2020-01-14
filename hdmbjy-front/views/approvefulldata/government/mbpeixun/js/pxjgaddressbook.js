
var vm = new Vue({
	el: '#app',
	data:{
        PXJGADDRESSBOOK_ID: '',	//主键ID
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
        		this.PXJGADDRESSBOOK_ID = FDID;
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
                //不可以为空的DATE
                var result=vm.verifyDate(this.pd.FILLFORM_DATE);
                if(!result.isNull){
                    if(!result.isTrue){
                        $("#FILLFORM_DATE").tips({
                            side:3,
                            msg:result.msg,
                            bg:'#AE81FF',
                            time:2
                        });
                        vm.pd.FILLFORM_DATE = '';
                        vm.pd.YEAR=vm.pd.MONTH=vm.pd.DAY='';     //编号后的YEAR MONTH DAY
                        return false;
                    }
                }else{
                    $("#FILLFORM_DATE").tips({
                        side:3,
                        msg:result.msg,
                        bg:'#AE81FF',
                        time:2
                    });
                    vm.pd.FILLFORM_DATE = '';
                    vm.pd.YEAR=vm.pd.MONTH=vm.pd.DAY='';     //编号后的YEAR MONTH DAY
                    return false;
                }

            /*if(this.pd.FILLFORM_DATE == '' || this.pd.FILLFORM_DATE == undefined){
                    $("#FILLFORM_DATE").tips({
                        side:3,
                        msg:'请输入填表日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FILLFORM_DATE = '';
                    this.$refs.FILLFORM_DATE.focus();
                return false;
                }*/
            if(this.pd.LICENCE_ONE == '' || this.pd.LICENCE_ONE == undefined){
                    $("#LICENCE_ONE").tips({
                        side:3,
                        msg:'请输入办学许可证号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LICENCE_ONE = '';
                    this.$refs.LICENCE_ONE.focus();
                return false;
                }
            if(this.pd.LICENCE_TWO == '' || this.pd.LICENCE_TWO == undefined){
                    $("#LICENCE_TWO").tips({
                        side:3,
                        msg:'请输入办学许可证号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LICENCE_TWO = '';
                    this.$refs.LICENCE_TWO.focus();
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
            if(this.pd.OFFICE_PHONE == '' || this.pd.OFFICE_PHONE == undefined){
                    $("#OFFICE_PHONE").tips({
                        side:3,
                        msg:'请输入办公电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.OFFICE_PHONE = '';
                    this.$refs.OFFICE_PHONE.focus();
                return false;
                }
            if(this.pd.SCHOOL_ADDRESS == '' || this.pd.SCHOOL_ADDRESS == undefined){
                    $("#SCHOOL_ADDRESS").tips({
                        side:3,
                        msg:'请输入校址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SCHOOL_ADDRESS = '';
                    this.$refs.SCHOOL_ADDRESS.focus();
                return false;
                }
            if(this.pd.ENROLLMENT_PHONE == '' || this.pd.ENROLLMENT_PHONE == undefined){
                    $("#ENROLLMENT_PHONE").tips({
                        side:3,
                        msg:'请输入招生电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ENROLLMENT_PHONE = '';
                    this.$refs.ENROLLMENT_PHONE.focus();
                return false;
                }
            if(this.pd.SCHOOL_WEBSITE == '' || this.pd.SCHOOL_WEBSITE == undefined){
                    $("#SCHOOL_WEBSITE").tips({
                        side:3,
                        msg:'请输入学校网址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SCHOOL_WEBSITE = '';
                    this.$refs.SCHOOL_WEBSITE.focus();
                return false;
                }
            if(this.pd.ELECTRONIC_MAIL == '' || this.pd.ELECTRONIC_MAIL == undefined){
                    $("#ELECTRONIC_MAIL").tips({
                        side:3,
                        msg:'请输入电子邮箱',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ELECTRONIC_MAIL = '';
                    this.$refs.ELECTRONIC_MAIL.focus();
                return false;
                }
            if(this.pd.COMPLAINT_PHONE == '' || this.pd.COMPLAINT_PHONE == undefined){
                    $("#COMPLAINT_PHONE").tips({
                        side:3,
                        msg:'请输入投诉电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.COMPLAINT_PHONE = '';
                    this.$refs.COMPLAINT_PHONE.focus();
                return false;
                }
            if(this.pd.PRINCIPAL_PHONE == '' || this.pd.PRINCIPAL_PHONE == undefined){
                    $("#PRINCIPAL_PHONE").tips({
                        side:3,
                        msg:'请输入手机号码',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL_PHONE = '';
                    this.$refs.PRINCIPAL_PHONE.focus();
                return false;
                }
            if(this.pd.TWENTYFOUR_PHONE == '' || this.pd.TWENTYFOUR_PHONE == undefined){
                    $("#TWENTYFOUR_PHONE").tips({
                        side:3,
                        msg:'请输入24小时电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.TWENTYFOUR_PHONE = '';
                    this.$refs.TWENTYFOUR_PHONE.focus();
                return false;
                }
            if(this.pd.PRINCIPAL_NAME == '' || this.pd.PRINCIPAL_NAME == undefined){
                    $("#PRINCIPAL_NAME").tips({
                        side:3,
                        msg:'请输入校长(中心主任)',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL_NAME = '';
                    this.$refs.PRINCIPAL_NAME.focus();
                return false;
                }
            if(this.pd.PRINCIPAL_WORKPHONE == '' || this.pd.PRINCIPAL_WORKPHONE == undefined){
                    $("#PRINCIPAL_WORKPHONE").tips({
                        side:3,
                        msg:'请输入单位电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL_WORKPHONE = '';
                    this.$refs.PRINCIPAL_WORKPHONE.focus();
                return false;
                }
            if(this.pd.PRINCIPAL_HOUSEPHONE == '' || this.pd.PRINCIPAL_HOUSEPHONE == undefined){
                    $("#PRINCIPAL_HOUSEPHONE").tips({
                        side:3,
                        msg:'请输入住宅电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL_HOUSEPHONE = '';
                    this.$refs.PRINCIPAL_HOUSEPHONE.focus();
                return false;
                }
            if(this.pd.PRINCIPAL_MOBILEPHONE == '' || this.pd.PRINCIPAL_MOBILEPHONE == undefined){
                    $("#PRINCIPAL_MOBILEPHONE").tips({
                        side:3,
                        msg:'请输入手机',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PRINCIPAL_MOBILEPHONE = '';
                    this.$refs.PRINCIPAL_MOBILEPHONE.focus();
                return false;
                }
            if(this.pd.LEGAL_NAME == '' || this.pd.LEGAL_NAME == undefined){
                    $("#LEGAL_NAME").tips({
                        side:3,
                        msg:'请输入法定代表人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_NAME = '';
                    this.$refs.LEGAL_NAME.focus();
                return false;
                }
            if(this.pd.LEGAL_WORKPHONE == '' || this.pd.LEGAL_WORKPHONE == undefined){
                    $("#LEGAL_WORKPHONE").tips({
                        side:3,
                        msg:'请输入单位电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_WORKPHONE = '';
                    this.$refs.LEGAL_WORKPHONE.focus();
                return false;
                }
            if(this.pd.LEGAL_HOUSEPHONE == '' || this.pd.LEGAL_HOUSEPHONE == undefined){
                    $("#LEGAL_HOUSEPHONE").tips({
                        side:3,
                        msg:'请输入住宅电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_HOUSEPHONE = '';
                    this.$refs.LEGAL_HOUSEPHONE.focus();
                return false;
                }
            if(this.pd.LEGAL_MOBILEPHONE == '' || this.pd.LEGAL_MOBILEPHONE == undefined){
                    $("#LEGAL_MOBILEPHONE").tips({
                        side:3,
                        msg:'请输入手机',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.LEGAL_MOBILEPHONE = '';
                    this.$refs.LEGAL_MOBILEPHONE.focus();
                return false;
                }
            if(this.pd.GR_ORGAN_NAME == '' || this.pd.GR_ORGAN_NAME == undefined){
                    $("#GR_ORGAN_NAME").tips({
                        side:3,
                        msg:'请输入举办者(个人)',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.GR_ORGAN_NAME = '';
                    this.$refs.GR_ORGAN_NAME.focus();
                return false;
                }
            if(this.pd.GR_ORGAN_WORKPHONE == '' || this.pd.GR_ORGAN_WORKPHONE == undefined){
                    $("#GR_ORGAN_WORKPHONE").tips({
                        side:3,
                        msg:'请输入单位电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.GR_ORGAN_WORKPHONE = '';
                    this.$refs.GR_ORGAN_WORKPHONE.focus();
                return false;
                }
            if(this.pd.GR_ORGAN_HOUSEPHONE == '' || this.pd.GR_ORGAN_HOUSEPHONE == undefined){
                    $("#GR_ORGAN_HOUSEPHONE").tips({
                        side:3,
                        msg:'请输入住宅电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.GR_ORGAN_HOUSEPHONE = '';
                    this.$refs.GR_ORGAN_HOUSEPHONE.focus();
                return false;
                }
            if(this.pd.GR_ORGAN_MOBILEPHONE == '' || this.pd.GR_ORGAN_MOBILEPHONE == undefined){
                    $("#GR_ORGAN_MOBILEPHONE").tips({
                        side:3,
                        msg:'请输入手机',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.GR_ORGAN_MOBILEPHONE = '';
                    this.$refs.GR_ORGAN_MOBILEPHONE.focus();
                return false;
                }
            if(this.pd.DW_ORGAN_NAME == '' || this.pd.DW_ORGAN_NAME == undefined){
                    $("#DW_ORGAN_NAME").tips({
                        side:3,
                        msg:'请输入举办者(单位)',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DW_ORGAN_NAME = '';
                    this.$refs.DW_ORGAN_NAME.focus();
                return false;
                }
            if(this.pd.DW_ORGAN_PHONE == '' || this.pd.DW_ORGAN_PHONE == undefined){
                    $("#DW_ORGAN_PHONE").tips({
                        side:3,
                        msg:'请输入电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DW_ORGAN_PHONE = '';
                    this.$refs.DW_ORGAN_PHONE.focus();
                return false;
                }
            if(this.pd.MAIL_ADDRESS == '' || this.pd.MAIL_ADDRESS == undefined){
                    $("#MAIL_ADDRESS").tips({
                        side:3,
                        msg:'请输入通信地址收信名称',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.MAIL_ADDRESS = '';
                    this.$refs.MAIL_ADDRESS.focus();
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
            if(this.pd.PHONE == '' || this.pd.PHONE == undefined){
                    $("#PHONE").tips({
                        side:3,
                        msg:'请输入电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.PHONE = '';
                    this.$refs.PHONE.focus();
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
					url: httpurl+'pxjgaddressbook/'+this.msg,
			    	data: {
                        PXJGADDRESSBOOK_ID:this.PXJGADDRESSBOOK_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

						FILLFORM_DATE:this.pd.FILLFORM_DATE,

						LICENCE_ONE:this.pd.LICENCE_ONE,

						LICENCE_TWO:this.pd.LICENCE_TWO,

						SCHOOL_NAME:this.pd.SCHOOL_NAME,

						OFFICE_PHONE:this.pd.OFFICE_PHONE,

						SCHOOL_ADDRESS:this.pd.SCHOOL_ADDRESS,

						ENROLLMENT_PHONE:this.pd.ENROLLMENT_PHONE,

						SCHOOL_WEBSITE:this.pd.SCHOOL_WEBSITE,

						ELECTRONIC_MAIL:this.pd.ELECTRONIC_MAIL,

						COMPLAINT_PHONE:this.pd.COMPLAINT_PHONE,

						PRINCIPAL_PHONE:this.pd.PRINCIPAL_PHONE,

						TWENTYFOUR_PHONE:this.pd.TWENTYFOUR_PHONE,

						PRINCIPAL_NAME:this.pd.PRINCIPAL_NAME,

						PRINCIPAL_WORKPHONE:this.pd.PRINCIPAL_WORKPHONE,

						PRINCIPAL_HOUSEPHONE:this.pd.PRINCIPAL_HOUSEPHONE,

						PRINCIPAL_MOBILEPHONE:this.pd.PRINCIPAL_MOBILEPHONE,

						LEGAL_NAME:this.pd.LEGAL_NAME,

						LEGAL_WORKPHONE:this.pd.LEGAL_WORKPHONE,

						LEGAL_HOUSEPHONE:this.pd.LEGAL_HOUSEPHONE,

						LEGAL_MOBILEPHONE:this.pd.LEGAL_MOBILEPHONE,

						GR_ORGAN_NAME:this.pd.GR_ORGAN_NAME,

						GR_ORGAN_WORKPHONE:this.pd.GR_ORGAN_WORKPHONE,

						GR_ORGAN_HOUSEPHONE:this.pd.GR_ORGAN_HOUSEPHONE,

						GR_ORGAN_MOBILEPHONE:this.pd.GR_ORGAN_MOBILEPHONE,

						DW_ORGAN_NAME:this.pd.DW_ORGAN_NAME,

						DW_ORGAN_PHONE:this.pd.DW_ORGAN_PHONE,

						MAIL_ADDRESS:this.pd.MAIL_ADDRESS,

						POSTAL_CODE:this.pd.POSTAL_CODE,

						LINKMAN:this.pd.LINKMAN,

						MOBILE_PHONE:this.pd.MOBILE_PHONE,

						PHONE:this.pd.PHONE,

						BEIZHU:this.pd.BEIZHU,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.PXJGADDRESSBOOK_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                            vm.SUB_STATUS="3";
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("海淀区民办教育培训机构通讯录",data.exception);//显示异常
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
				url: httpurl+'pxjgaddressbook/goEdit',
		    	data: {
                    PXJGADDRESSBOOK_ID:this.PXJGADDRESSBOOK_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                         if(data.pd.FILLFORM_DATE!=''&&null!=data.pd.FILLFORM_DATE&&undefined!=data.pd.FILLFORM_DATE){
                             var FILLFORM_DATE=data.pd.FILLFORM_DATE.split("/");
                             vm.pd.YEAR=FILLFORM_DATE[0];
                             vm.pd.MONTH=FILLFORM_DATE[1];
                             vm.pd.DAY=FILLFORM_DATE[2];
                         }
                     }else if ("exception" == data.result){
                     	showException("海淀区民办教育培训机构通讯录",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var YEAR=$("#YEAR").text();
                    if(null!=YEAR&&undefined!=YEAR&&''!=YEAR){
                        vm.pd.YEAR=YEAR;
                    }else{
                        vm.pd.YEAR='';
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
                    vm.pd.FILLFORM_DATE=vm.pd.YEAR+"/"+vm.pd.MONTH+"/"+vm.pd.DAY;
                    /*var FILLFORM_DATE=$("#FILLFORM_DATE").text();
                    if(null!=FILLFORM_DATE&&undefined!=FILLFORM_DATE&&''!=FILLFORM_DATE){
                        vm.pd.FILLFORM_DATE=FILLFORM_DATE;
                    }*/
                    var LICENCE_ONE=$("#LICENCE_ONE").text();
                    if(null!=LICENCE_ONE&&undefined!=LICENCE_ONE&&''!=LICENCE_ONE){
                        vm.pd.LICENCE_ONE=LICENCE_ONE;
                    }
                    var LICENCE_TWO=$("#LICENCE_TWO").text();
                    if(null!=LICENCE_TWO&&undefined!=LICENCE_TWO&&''!=LICENCE_TWO){
                        vm.pd.LICENCE_TWO=LICENCE_TWO;
                    }
                    var SCHOOL_NAME=$("#SCHOOL_NAME").text();
                    if(null!=SCHOOL_NAME&&undefined!=SCHOOL_NAME&&''!=SCHOOL_NAME){
                        vm.pd.SCHOOL_NAME=SCHOOL_NAME;
                    }
                    var OFFICE_PHONE=$("#OFFICE_PHONE").text();
                    if(null!=OFFICE_PHONE&&undefined!=OFFICE_PHONE&&''!=OFFICE_PHONE){
                        vm.pd.OFFICE_PHONE=OFFICE_PHONE;
                    }
                    var SCHOOL_ADDRESS=$("#SCHOOL_ADDRESS").text();
                    if(null!=SCHOOL_ADDRESS&&undefined!=SCHOOL_ADDRESS&&''!=SCHOOL_ADDRESS){
                        vm.pd.SCHOOL_ADDRESS=SCHOOL_ADDRESS;
                    }
                    var ENROLLMENT_PHONE=$("#ENROLLMENT_PHONE").text();
                    if(null!=ENROLLMENT_PHONE&&undefined!=ENROLLMENT_PHONE&&''!=ENROLLMENT_PHONE){
                        vm.pd.ENROLLMENT_PHONE=ENROLLMENT_PHONE;
                    }
                    var SCHOOL_WEBSITE=$("#SCHOOL_WEBSITE").text();
                    if(null!=SCHOOL_WEBSITE&&undefined!=SCHOOL_WEBSITE&&''!=SCHOOL_WEBSITE){
                        vm.pd.SCHOOL_WEBSITE=SCHOOL_WEBSITE;
                    }
                    var ELECTRONIC_MAIL=$("#ELECTRONIC_MAIL").text();
                    if(null!=ELECTRONIC_MAIL&&undefined!=ELECTRONIC_MAIL&&''!=ELECTRONIC_MAIL){
                        vm.pd.ELECTRONIC_MAIL=ELECTRONIC_MAIL;
                    }
                    var COMPLAINT_PHONE=$("#COMPLAINT_PHONE").text();
                    if(null!=COMPLAINT_PHONE&&undefined!=COMPLAINT_PHONE&&''!=COMPLAINT_PHONE){
                        vm.pd.COMPLAINT_PHONE=COMPLAINT_PHONE;
                    }
                    var PRINCIPAL_PHONE=$("#PRINCIPAL_PHONE").text();
                    if(null!=PRINCIPAL_PHONE&&undefined!=PRINCIPAL_PHONE&&''!=PRINCIPAL_PHONE){
                        vm.pd.PRINCIPAL_PHONE=PRINCIPAL_PHONE;
                    }
                    var TWENTYFOUR_PHONE=$("#TWENTYFOUR_PHONE").text();
                    if(null!=TWENTYFOUR_PHONE&&undefined!=TWENTYFOUR_PHONE&&''!=TWENTYFOUR_PHONE){
                        vm.pd.TWENTYFOUR_PHONE=TWENTYFOUR_PHONE;
                    }
                    var PRINCIPAL_NAME=$("#PRINCIPAL_NAME").text();
                    if(null!=PRINCIPAL_NAME&&undefined!=PRINCIPAL_NAME&&''!=PRINCIPAL_NAME){
                        vm.pd.PRINCIPAL_NAME=PRINCIPAL_NAME;
                    }
                    var PRINCIPAL_WORKPHONE=$("#PRINCIPAL_WORKPHONE").text();
                    if(null!=PRINCIPAL_WORKPHONE&&undefined!=PRINCIPAL_WORKPHONE&&''!=PRINCIPAL_WORKPHONE){
                        vm.pd.PRINCIPAL_WORKPHONE=PRINCIPAL_WORKPHONE;
                    }
                    var PRINCIPAL_HOUSEPHONE=$("#PRINCIPAL_HOUSEPHONE").text();
                    if(null!=PRINCIPAL_HOUSEPHONE&&undefined!=PRINCIPAL_HOUSEPHONE&&''!=PRINCIPAL_HOUSEPHONE){
                        vm.pd.PRINCIPAL_HOUSEPHONE=PRINCIPAL_HOUSEPHONE;
                    }
                    var PRINCIPAL_MOBILEPHONE=$("#PRINCIPAL_MOBILEPHONE").text();
                    if(null!=PRINCIPAL_MOBILEPHONE&&undefined!=PRINCIPAL_MOBILEPHONE&&''!=PRINCIPAL_MOBILEPHONE){
                        vm.pd.PRINCIPAL_MOBILEPHONE=PRINCIPAL_MOBILEPHONE;
                    }
                    var LEGAL_NAME=$("#LEGAL_NAME").text();
                    if(null!=LEGAL_NAME&&undefined!=LEGAL_NAME&&''!=LEGAL_NAME){
                        vm.pd.LEGAL_NAME=LEGAL_NAME;
                    }
                    var LEGAL_WORKPHONE=$("#LEGAL_WORKPHONE").text();
                    if(null!=LEGAL_WORKPHONE&&undefined!=LEGAL_WORKPHONE&&''!=LEGAL_WORKPHONE){
                        vm.pd.LEGAL_WORKPHONE=LEGAL_WORKPHONE;
                    }
                    var LEGAL_HOUSEPHONE=$("#LEGAL_HOUSEPHONE").text();
                    if(null!=LEGAL_HOUSEPHONE&&undefined!=LEGAL_HOUSEPHONE&&''!=LEGAL_HOUSEPHONE){
                        vm.pd.LEGAL_HOUSEPHONE=LEGAL_HOUSEPHONE;
                    }
                    var LEGAL_MOBILEPHONE=$("#LEGAL_MOBILEPHONE").text();
                    if(null!=LEGAL_MOBILEPHONE&&undefined!=LEGAL_MOBILEPHONE&&''!=LEGAL_MOBILEPHONE){
                        vm.pd.LEGAL_MOBILEPHONE=LEGAL_MOBILEPHONE;
                    }
                    var GR_ORGAN_NAME=$("#GR_ORGAN_NAME").text();
                    if(null!=GR_ORGAN_NAME&&undefined!=GR_ORGAN_NAME&&''!=GR_ORGAN_NAME){
                        vm.pd.GR_ORGAN_NAME=GR_ORGAN_NAME;
                    }
                    var GR_ORGAN_WORKPHONE=$("#GR_ORGAN_WORKPHONE").text();
                    if(null!=GR_ORGAN_WORKPHONE&&undefined!=GR_ORGAN_WORKPHONE&&''!=GR_ORGAN_WORKPHONE){
                        vm.pd.GR_ORGAN_WORKPHONE=GR_ORGAN_WORKPHONE;
                    }
                    var GR_ORGAN_HOUSEPHONE=$("#GR_ORGAN_HOUSEPHONE").text();
                    if(null!=GR_ORGAN_HOUSEPHONE&&undefined!=GR_ORGAN_HOUSEPHONE&&''!=GR_ORGAN_HOUSEPHONE){
                        vm.pd.GR_ORGAN_HOUSEPHONE=GR_ORGAN_HOUSEPHONE;
                    }
                    var GR_ORGAN_MOBILEPHONE=$("#GR_ORGAN_MOBILEPHONE").text();
                    if(null!=GR_ORGAN_MOBILEPHONE&&undefined!=GR_ORGAN_MOBILEPHONE&&''!=GR_ORGAN_MOBILEPHONE){
                        vm.pd.GR_ORGAN_MOBILEPHONE=GR_ORGAN_MOBILEPHONE;
                    }
                    var DW_ORGAN_NAME=$("#DW_ORGAN_NAME").text();
                    if(null!=DW_ORGAN_NAME&&undefined!=DW_ORGAN_NAME&&''!=DW_ORGAN_NAME){
                        vm.pd.DW_ORGAN_NAME=DW_ORGAN_NAME;
                    }
                    var DW_ORGAN_PHONE=$("#DW_ORGAN_PHONE").text();
                    if(null!=DW_ORGAN_PHONE&&undefined!=DW_ORGAN_PHONE&&''!=DW_ORGAN_PHONE){
                        vm.pd.DW_ORGAN_PHONE=DW_ORGAN_PHONE;
                    }
                    var MAIL_ADDRESS=$("#MAIL_ADDRESS").text();
                    if(null!=MAIL_ADDRESS&&undefined!=MAIL_ADDRESS&&''!=MAIL_ADDRESS){
                        vm.pd.MAIL_ADDRESS=MAIL_ADDRESS;
                    }
                    var POSTAL_CODE=$("#POSTAL_CODE").text();
                    if(null!=POSTAL_CODE&&undefined!=POSTAL_CODE&&''!=POSTAL_CODE){
                        vm.pd.POSTAL_CODE=POSTAL_CODE;
                    }
                    var LINKMAN=$("#LINKMAN").text();
                    if(null!=LINKMAN&&undefined!=LINKMAN&&''!=LINKMAN){
                        vm.pd.LINKMAN=LINKMAN;
                    }
                    var MOBILE_PHONE=$("#MOBILE_PHONE").text();
                    if(null!=MOBILE_PHONE&&undefined!=MOBILE_PHONE&&''!=MOBILE_PHONE){
                        vm.pd.MOBILE_PHONE=MOBILE_PHONE;
                    }
                    var PHONE=$("#PHONE").text();
                    if(null!=PHONE&&undefined!=PHONE&&''!=PHONE){
                        vm.pd.PHONE=PHONE;
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