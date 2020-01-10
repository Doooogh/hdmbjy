
var vm = new Vue({
	el: '#app',
	data:{
        MBPXJGJXDBASPDJB_ID: '',	//主键ID
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
        		this.MBPXJGJXDBASPDJB_ID = FDID;
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
            vm.pd = [];
 			vm.getValue();
			vm.SUB_STATUS=status;
			if(status==0){
            if(this.pd.DJB_NUMBER == '' || this.pd.DJB_NUMBER == undefined){
                    $("#DJB_NUMBER").tips({
                        side:3,
                        msg:'请输入登记表号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DJB_NUMBER = '';
                    this.$refs.DJB_NUMBER.focus();
                return false;
                }
            if(this.pd.BXXKZH_FIRST == '' || this.pd.BXXKZH_FIRST == undefined){
                    $("#BXXKZH_FIRST").tips({
                        side:3,
                        msg:'请输入办学许可证号第一个空',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BXXKZH_FIRST = '';
                    this.$refs.BXXKZH_FIRST.focus();
                return false;
                }
            if(this.pd.BXXKZH_SECOND == '' || this.pd.BXXKZH_SECOND == undefined){
                    $("#BXXKZH_SECOND").tips({
                        side:3,
                        msg:'请输入办学许可证号第二个空',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BXXKZH_SECOND = '';
                    this.$refs.BXXKZH_SECOND.focus();
                return false;
                }
            if(this.pd.SCHOOL_NAME == '' || this.pd.SCHOOL_NAME == undefined){
                    $("#SCHOOL_NAME").tips({
                        side:3,
                        msg:'请输入校名',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SCHOOL_NAME = '';
                    this.$refs.SCHOOL_NAME.focus();
                return false;
                }
            if(this.pd.SCHOOLMASTER_AND_PHONE == '' || this.pd.SCHOOLMASTER_AND_PHONE == undefined){
                    $("#SCHOOLMASTER_AND_PHONE").tips({
                        side:3,
                        msg:'请输入校长及电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SCHOOLMASTER_AND_PHONE = '';
                    this.$refs.SCHOOLMASTER_AND_PHONE.focus();
                return false;
                }
            if(this.pd.REGISTER_ADDRESS == '' || this.pd.REGISTER_ADDRESS == undefined){
                    $("#REGISTER_ADDRESS").tips({
                        side:3,
                        msg:'请输入注册校址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.REGISTER_ADDRESS = '';
                    this.$refs.REGISTER_ADDRESS.focus();
                return false;
                }
            if(this.pd.REGISTER_XBB_PHONE == '' || this.pd.REGISTER_XBB_PHONE == undefined){
                    $("#REGISTER_XBB_PHONE").tips({
                        side:3,
                        msg:'请输入注册校本部电话',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.REGISTER_XBB_PHONE = '';
                    this.$refs.REGISTER_XBB_PHONE.focus();
                return false;
                }
            if(this.pd.JXD_ADDRESS == '' || this.pd.JXD_ADDRESS == undefined){
                    $("#JXD_ADDRESS").tips({
                        side:3,
                        msg:'请输入教学点地址',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.JXD_ADDRESS = '';
                    this.$refs.JXD_ADDRESS.focus();
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
            if(this.pd.NAME1 == '' || this.pd.NAME1 == undefined){
                    $("#NAME1").tips({
                        side:3,
                        msg:'请输入姓名1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.NAME1 = '';
                    this.$refs.NAME1.focus();
                return false;
                }
            if(this.pd.GENDER1 == '' || this.pd.GENDER1 == undefined){
                    $("#GENDER1").tips({
                        side:3,
                        msg:'请输入性别1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.GENDER1 = '';
                    this.$refs.GENDER1.focus();
                return false;
                }
            if(this.pd.AGE1 == '' || this.pd.AGE1 == undefined){
                    $("#AGE1").tips({
                        side:3,
                        msg:'请输入年龄1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.AGE1 = '';
                    this.$refs.AGE1.focus();
                return false;
                }
            if(this.pd.EDUCATION1 == '' || this.pd.EDUCATION1 == undefined){
                    $("#EDUCATION1").tips({
                        side:3,
                        msg:'请输入文化程度1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.EDUCATION1 = '';
                    this.$refs.EDUCATION1.focus();
                return false;
                }
            if(this.pd.ZHICHENG1 == '' || this.pd.ZHICHENG1 == undefined){
                    $("#ZHICHENG1").tips({
                        side:3,
                        msg:'请输入职称1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ZHICHENG1 = '';
                    this.$refs.ZHICHENG1.focus();
                return false;
                }
            if(this.pd.YGZDW1 == '' || this.pd.YGZDW1 == undefined){
                    $("#YGZDW1").tips({
                        side:3,
                        msg:'请输入原工作单位1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.YGZDW1 = '';
                    this.$refs.YGZDW1.focus();
                return false;
                }
            if(this.pd.HKSZD1 == '' || this.pd.HKSZD1 == undefined){
                    $("#HKSZD1").tips({
                        side:3,
                        msg:'请输入户口所在地1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.HKSZD1 = '';
                    this.$refs.HKSZD1.focus();
                return false;
                }
            if(this.pd.ID_CARD1 == '' || this.pd.ID_CARD1 == undefined){
                    $("#ID_CARD1").tips({
                        side:3,
                        msg:'请输入身份证号码1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ID_CARD1 = '';
                    this.$refs.ID_CARD1.focus();
                return false;
                }
            if(this.pd.SFZZ1 == '' || this.pd.SFZZ1 == undefined){
                    $("#SFZZ1").tips({
                        side:3,
                        msg:'请输入是否在职1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SFZZ1 = '';
                    this.$refs.SFZZ1.focus();
                return false;
                }
            if(this.pd.STZK1 == '' || this.pd.STZK1 == undefined){
                    $("#STZK1").tips({
                        side:3,
                        msg:'请输入身体状况1',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.STZK1 = '';
                    this.$refs.STZK1.focus();
                return false;
                }
            if(this.pd.NAME2 == '' || this.pd.NAME2 == undefined){
                    $("#NAME2").tips({
                        side:3,
                        msg:'请输入姓名2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.NAME2 = '';
                    this.$refs.NAME2.focus();
                return false;
                }
            if(this.pd.GENDER2 == '' || this.pd.GENDER2 == undefined){
                    $("#GENDER2").tips({
                        side:3,
                        msg:'请输入性别2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.GENDER2 = '';
                    this.$refs.GENDER2.focus();
                return false;
                }
            if(this.pd.AGE2 == '' || this.pd.AGE2 == undefined){
                    $("#AGE2").tips({
                        side:3,
                        msg:'请输入年龄2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.AGE2 = '';
                    this.$refs.AGE2.focus();
                return false;
                }
            if(this.pd.EDUCATION2 == '' || this.pd.EDUCATION2 == undefined){
                    $("#EDUCATION2").tips({
                        side:3,
                        msg:'请输入文化程度2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.EDUCATION2 = '';
                    this.$refs.EDUCATION2.focus();
                return false;
                }
            if(this.pd.ZHICHENG2 == '' || this.pd.ZHICHENG2 == undefined){
                    $("#ZHICHENG2").tips({
                        side:3,
                        msg:'请输入职称2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ZHICHENG2 = '';
                    this.$refs.ZHICHENG2.focus();
                return false;
                }
            if(this.pd.YGZDW2 == '' || this.pd.YGZDW2 == undefined){
                    $("#YGZDW2").tips({
                        side:3,
                        msg:'请输入原工作单位2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.YGZDW2 = '';
                    this.$refs.YGZDW2.focus();
                return false;
                }
            if(this.pd.HKSZD2 == '' || this.pd.HKSZD2 == undefined){
                    $("#HKSZD2").tips({
                        side:3,
                        msg:'请输入户口所在地2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.HKSZD2 = '';
                    this.$refs.HKSZD2.focus();
                return false;
                }
            if(this.pd.ID_CARD2 == '' || this.pd.ID_CARD2 == undefined){
                    $("#ID_CARD2").tips({
                        side:3,
                        msg:'请输入身份证号码2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ID_CARD2 = '';
                    this.$refs.ID_CARD2.focus();
                return false;
                }
            if(this.pd.SFZZ2 == '' || this.pd.SFZZ2 == undefined){
                    $("#SFZZ2").tips({
                        side:3,
                        msg:'请输入是否在职2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SFZZ2 = '';
                    this.$refs.SFZZ2.focus();
                return false;
                }
            if(this.pd.STZK2 == '' || this.pd.STZK2 == undefined){
                    $("#STZK2").tips({
                        side:3,
                        msg:'请输入身体状况2',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.STZK2 = '';
                    this.$refs.STZK2.focus();
                return false;
                }
            if(this.pd.JXDMJ == '' || this.pd.JXDMJ == undefined){
                    $("#JXDMJ").tips({
                        side:3,
                        msg:'请输入教学点面积',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.JXDMJ = '';
                    this.$refs.JXDMJ.focus();
                return false;
                }
            if(this.pd.JS_NUMBER == '' || this.pd.JS_NUMBER == undefined){
                    $("#JS_NUMBER").tips({
                        side:3,
                        msg:'请输入教室间数',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.JS_NUMBER = '';
                    this.$refs.JS_NUMBER.focus();
                return false;
                }
            if(this.pd.JS_AREA == '' || this.pd.JS_AREA == undefined){
                    $("#JS_AREA").tips({
                        side:3,
                        msg:'请输入教室面积',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.JS_AREA = '';
                    this.$refs.JS_AREA.focus();
                return false;
                }
            if(this.pd.BGS_NUMBER == '' || this.pd.BGS_NUMBER == undefined){
                    $("#BGS_NUMBER").tips({
                        side:3,
                        msg:'请输入办公室间数',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BGS_NUMBER = '';
                    this.$refs.BGS_NUMBER.focus();
                return false;
                }
            if(this.pd.BGS_AREA == '' || this.pd.BGS_AREA == undefined){
                    $("#BGS_AREA").tips({
                        side:3,
                        msg:'请输入办公室面积',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BGS_AREA = '';
                    this.$refs.BGS_AREA.focus();
                return false;
                }
            if(this.pd.JXSB == '' || this.pd.JXSB == undefined){
                    $("#JXSB").tips({
                        side:3,
                        msg:'请输入教学设备',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.JXSB = '';
                    this.$refs.JXSB.focus();
                return false;
                }
            if(this.pd.WQS_BMYJ == '' || this.pd.WQS_BMYJ == undefined){
                    $("#WQS_BMYJ").tips({
                        side:3,
                        msg:'请输入外区设教学点所在区县教育行政部门意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.WQS_BMYJ = '';
                    this.$refs.WQS_BMYJ.focus();
                return false;
                }

                var result=vm.verifyDate(this.pd.WQS_BMYJ_DATE);
                if(!result.isNull){
                    if(!result.isTrue){
                        $("#WQS_BMYJ_DATE").tips({
                            side:3,
                            msg:result.msg,
                            bg:'#AE81FF',
                            time:2
                        });
                        vm.pd.WQS_BMYJ_DATE = '';
                        vm.pd.YEAR1=vm.pd.MONTH1=vm.pd.DAY1='';
                        this.$refs.WQS_BMYJ_DATE.focus();
                        return false;
                    }
                }

            /*if(this.pd.WQS_BMYJ_DATE == '' || this.pd.WQS_BMYJ_DATE == undefined){
                    $("#WQS_BMYJ_DATE").tips({
                        side:3,
                        msg:'请输入外区设教学点所在区县教育行政部门意见时间',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.WQS_BMYJ_DATE = '';
                    this.$refs.WQS_BMYJ_DATE.focus();
                return false;
                }*/
            if(this.pd.FZJGSPYJ == '' || this.pd.FZJGSPYJ == undefined){
                    $("#FZJGSPYJ").tips({
                        side:3,
                        msg:'请输入发证机关审批意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FZJGSPYJ = '';
                    this.$refs.FZJGSPYJ.focus();
                return false;
                }

                var result=vm.verifyDate(this.pd.FZJGSPYJ_DATE);
                if(!result.isNull){
                    if(!result.isTrue){
                        $("#FZJGSPYJ_DATE").tips({
                            side:3,
                            msg:result.msg,
                            bg:'#AE81FF',
                            time:2
                        });
                        vm.pd.FZJGSPYJ_DATE = '';
                        vm.pd.YEAR2=vm.pd.MONTH2=vm.pd.DAY2='';
                        this.$refs.FZJGSPYJ_DATE.focus();
                        return false;
                    }
                }

            /*if(this.pd.FZJGSPYJ_DATE == '' || this.pd.FZJGSPYJ_DATE == undefined){
                    $("#FZJGSPYJ_DATE").tips({
                        side:3,
                        msg:'请输入发证机关审批意见时间',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FZJGSPYJ_DATE = '';
                    this.$refs.FZJGSPYJ_DATE.focus();
                return false;
                }*/
            if(this.pd.JJR == '' || this.pd.JJR == undefined){
                    $("#JJR").tips({
                        side:3,
                        msg:'请输入交件人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.JJR = '';
                    this.$refs.JJR.focus();
                return false;
                }
            if(this.pd.SLR == '' || this.pd.SLR == undefined){
                    $("#SLR").tips({
                        side:3,
                        msg:'请输入受理人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SLR = '';
                    this.$refs.SLR.focus();
                return false;
                }
            if(this.pd.SHR == '' || this.pd.SHR == undefined){
                    $("#SHR").tips({
                        side:3,
                        msg:'请输入审核人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SHR = '';
                    this.$refs.SHR.focus();
                return false;
                }
            if(this.pd.FSR == '' || this.pd.FSR == undefined){
                    $("#FSR").tips({
                        side:3,
                        msg:'请输入复审人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FSR = '';
                    this.$refs.FSR.focus();
                return false;
                }
            if(this.pd.JJRQ == '' || this.pd.JJRQ == undefined){
                    $("#JJRQ").tips({
                        side:3,
                        msg:'请输入交件日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.JJRQ = '';
                    this.$refs.JJRQ.focus();
                return false;
                }
            if(this.pd.SLRQ == '' || this.pd.SLRQ == undefined){
                    $("#SLRQ").tips({
                        side:3,
                        msg:'请输入受理日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SLRQ = '';
                    this.$refs.SLRQ.focus();
                return false;
                }
            if(this.pd.SHRQ == '' || this.pd.SHRQ == undefined){
                    $("#SHRQ").tips({
                        side:3,
                        msg:'请输入审核日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SHRQ = '';
                    this.$refs.SHRQ.focus();
                return false;
                }
            if(this.pd.FSRQ == '' || this.pd.FSRQ == undefined){
                    $("#FSRQ").tips({
                        side:3,
                        msg:'请输入复审日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FSRQ = '';
                    this.$refs.FSRQ.focus();
                return false;
                }
            if(this.pd.REMARKS == '' || this.pd.REMARKS == undefined){
                    $("#REMARKS").tips({
                        side:3,
                        msg:'请输入备注',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.REMARKS = '';
                    this.$refs.REMARKS.focus();
                return false;
                }
            if(this.pd.NAME3 == '' || this.pd.NAME3 == undefined){
                    $("#NAME3").tips({
                        side:3,
                        msg:'请输入姓名3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.NAME3 = '';
                    this.$refs.NAME3.focus();
                return false;
                }
            if(this.pd.GENDER3 == '' || this.pd.GENDER3 == undefined){
                    $("#GENDER3").tips({
                        side:3,
                        msg:'请输入性别3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.GENDER3 = '';
                    this.$refs.GENDER3.focus();
                return false;
                }
            if(this.pd.AGE3 == '' || this.pd.AGE3 == undefined){
                    $("#AGE3").tips({
                        side:3,
                        msg:'请输入年龄3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.AGE3 = '';
                    this.$refs.AGE3.focus();
                return false;
                }
            if(this.pd.EDUCATION3 == '' || this.pd.EDUCATION3 == undefined){
                    $("#EDUCATION3").tips({
                        side:3,
                        msg:'请输入文化程度3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.EDUCATION3 = '';
                    this.$refs.EDUCATION3.focus();
                return false;
                }
            if(this.pd.ZHICHENG3 == '' || this.pd.ZHICHENG3 == undefined){
                    $("#ZHICHENG3").tips({
                        side:3,
                        msg:'请输入职称3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ZHICHENG3 = '';
                    this.$refs.ZHICHENG3.focus();
                return false;
                }
            if(this.pd.YGZDW3 == '' || this.pd.YGZDW3 == undefined){
                    $("#YGZDW3").tips({
                        side:3,
                        msg:'请输入原工作单位3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.YGZDW3 = '';
                    this.$refs.YGZDW3.focus();
                return false;
                }
            if(this.pd.HKSZD3 == '' || this.pd.HKSZD3 == undefined){
                    $("#HKSZD3").tips({
                        side:3,
                        msg:'请输入户口所在地3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.HKSZD3 = '';
                    this.$refs.HKSZD3.focus();
                return false;
                }
            if(this.pd.ID_CARD3 == '' || this.pd.ID_CARD3 == undefined){
                    $("#ID_CARD3").tips({
                        side:3,
                        msg:'请输入身份证号码3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ID_CARD3 = '';
                    this.$refs.ID_CARD3.focus();
                return false;
                }
            if(this.pd.SFZZ3 == '' || this.pd.SFZZ3 == undefined){
                    $("#SFZZ3").tips({
                        side:3,
                        msg:'请输入是否在职3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SFZZ3 = '';
                    this.$refs.SFZZ3.focus();
                return false;
                }
            if(this.pd.STZK3 == '' || this.pd.STZK3 == undefined){
                    $("#STZK3").tips({
                        side:3,
                        msg:'请输入身体状况3',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.STZK3 = '';
                    this.$refs.STZK3.focus();
                return false;
                }
            if(this.pd.NAME4 == '' || this.pd.NAME4 == undefined){
                    $("#NAME4").tips({
                        side:3,
                        msg:'请输入姓名4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.NAME4 = '';
                    this.$refs.NAME4.focus();
                return false;
                }
            if(this.pd.GENDER4 == '' || this.pd.GENDER4 == undefined){
                    $("#GENDER4").tips({
                        side:3,
                        msg:'请输入性别4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.GENDER4 = '';
                    this.$refs.GENDER4.focus();
                return false;
                }
            if(this.pd.AGE4 == '' || this.pd.AGE4 == undefined){
                    $("#AGE4").tips({
                        side:3,
                        msg:'请输入年龄4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.AGE4 = '';
                    this.$refs.AGE4.focus();
                return false;
                }
            if(this.pd.EDUCATION4 == '' || this.pd.EDUCATION4 == undefined){
                    $("#EDUCATION4").tips({
                        side:3,
                        msg:'请输入文化程度4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.EDUCATION4 = '';
                    this.$refs.EDUCATION4.focus();
                return false;
                }
            if(this.pd.ZHICHENG4 == '' || this.pd.ZHICHENG4 == undefined){
                    $("#ZHICHENG4").tips({
                        side:3,
                        msg:'请输入职称4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ZHICHENG4 = '';
                    this.$refs.ZHICHENG4.focus();
                return false;
                }
            if(this.pd.YGZDW4 == '' || this.pd.YGZDW4 == undefined){
                    $("#YGZDW4").tips({
                        side:3,
                        msg:'请输入原工作单位4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.YGZDW4 = '';
                    this.$refs.YGZDW4.focus();
                return false;
                }
            if(this.pd.HKSZD4 == '' || this.pd.HKSZD4 == undefined){
                    $("#HKSZD4").tips({
                        side:3,
                        msg:'请输入户口所在地4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.HKSZD4 = '';
                    this.$refs.HKSZD4.focus();
                return false;
                }
            if(this.pd.ID_CARD4 == '' || this.pd.ID_CARD4 == undefined){
                    $("#ID_CARD4").tips({
                        side:3,
                        msg:'请输入身份证号码4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.ID_CARD4 = '';
                    this.$refs.ID_CARD4.focus();
                return false;
                }
            if(this.pd.SFZZ4 == '' || this.pd.SFZZ4 == undefined){
                    $("#SFZZ4").tips({
                        side:3,
                        msg:'请输入是否在职4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SFZZ4 = '';
                    this.$refs.SFZZ4.focus();
                return false;
                }
            if(this.pd.STZK4 == '' || this.pd.STZK4 == undefined){
                    $("#STZK4").tips({
                        side:3,
                        msg:'请输入身体状况4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.STZK4 = '';
                    this.$refs.STZK4.focus();
                return false;
                }
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'mbpxjgjxdbaspdjb/'+this.msg,
			    	data: {
MBPXJGJXDBASPDJB_ID:this.MBPXJGJXDBASPDJB_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

						DJB_NUMBER:this.pd.DJB_NUMBER,

						BXXKZH_FIRST:this.pd.BXXKZH_FIRST,

						BXXKZH_SECOND:this.pd.BXXKZH_SECOND,

						SCHOOL_NAME:this.pd.SCHOOL_NAME,

						SCHOOLMASTER_AND_PHONE:this.pd.SCHOOLMASTER_AND_PHONE,

						REGISTER_ADDRESS:this.pd.REGISTER_ADDRESS,

						REGISTER_XBB_PHONE:this.pd.REGISTER_XBB_PHONE,

						JXD_ADDRESS:this.pd.JXD_ADDRESS,

						PHONE:this.pd.PHONE,

						NAME1:this.pd.NAME1,

						GENDER1:this.pd.GENDER1,

						AGE1:this.pd.AGE1,

						EDUCATION1:this.pd.EDUCATION1,

						ZHICHENG1:this.pd.ZHICHENG1,

						YGZDW1:this.pd.YGZDW1,

						HKSZD1:this.pd.HKSZD1,

						ID_CARD1:this.pd.ID_CARD1,

						SFZZ1:this.pd.SFZZ1,

						STZK1:this.pd.STZK1,

						NAME2:this.pd.NAME2,

						GENDER2:this.pd.GENDER2,

						AGE2:this.pd.AGE2,

						EDUCATION2:this.pd.EDUCATION2,

						ZHICHENG2:this.pd.ZHICHENG2,

						YGZDW2:this.pd.YGZDW2,

						HKSZD2:this.pd.HKSZD2,

						ID_CARD2:this.pd.ID_CARD2,

						SFZZ2:this.pd.SFZZ2,

						STZK2:this.pd.STZK2,

						JXDMJ:this.pd.JXDMJ,

						JS_NUMBER:this.pd.JS_NUMBER,

						JS_AREA:this.pd.JS_AREA,

						BGS_NUMBER:this.pd.BGS_NUMBER,

						BGS_AREA:this.pd.BGS_AREA,

						JXSB:this.pd.JXSB,

						WQS_BMYJ:this.pd.WQS_BMYJ,

						WQS_BMYJ_DATE:this.pd.WQS_BMYJ_DATE,

						FZJGSPYJ:this.pd.FZJGSPYJ,

						FZJGSPYJ_DATE:this.pd.FZJGSPYJ_DATE,

						JJR:this.pd.JJR,

						SLR:this.pd.SLR,

						SHR:this.pd.SHR,

						FSR:this.pd.FSR,

						JJRQ:this.pd.JJRQ,

						SLRQ:this.pd.SLRQ,

						SHRQ:this.pd.SHRQ,

						FSRQ:this.pd.FSRQ,

						REMARKS:this.pd.REMARKS,

						NAME3:this.pd.NAME3,

						GENDER3:this.pd.GENDER3,

						AGE3:this.pd.AGE3,

						EDUCATION3:this.pd.EDUCATION3,

						ZHICHENG3:this.pd.ZHICHENG3,

						YGZDW3:this.pd.YGZDW3,

						HKSZD3:this.pd.HKSZD3,

						ID_CARD3:this.pd.ID_CARD3,

						SFZZ3:this.pd.SFZZ3,

						STZK3:this.pd.STZK3,

						NAME4:this.pd.NAME4,

						GENDER4:this.pd.GENDER4,

						AGE4:this.pd.AGE4,

						EDUCATION4:this.pd.EDUCATION4,

						ZHICHENG4:this.pd.ZHICHENG4,

						YGZDW4:this.pd.YGZDW4,

						HKSZD4:this.pd.HKSZD4,

						ID_CARD4:this.pd.ID_CARD4,

						SFZZ4:this.pd.SFZZ4,

						STZK4:this.pd.STZK4,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.MBPXJGJXDBASPDJB_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "暂存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("海淀区民办教育培训机构教学点备案审批登记表",data.exception);//显示异常
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
				url: httpurl+'mbpxjgjxdbaspdjb/goEdit',
		    	data: {
                    MBPXJGJXDBASPDJB_ID:this.MBPXJGJXDBASPDJB_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                         if(data.pd.WQS_BMYJ_DATE!=''&&null!=data.pd.WQS_BMYJ_DATE&&undefined!=data.pd.WQS_BMYJ_DATE){
                             var WQS_BMYJ_DATE=data.pd.WQS_BMYJ_DATE.split("/");
                             vm.pd.YEAR1=WQS_BMYJ_DATE[0];
                             vm.pd.MONTH1=WQS_BMYJ_DATE[1];
                             vm.pd.DAY1=WQS_BMYJ_DATE[2];
                         }
                         if(data.pd.FZJGSPYJ_DATE!=''&&null!=data.pd.FZJGSPYJ_DATE&&undefined!=data.pd.FZJGSPYJ_DATE){
                             var FZJGSPYJ_DATE=data.pd.FZJGSPYJ_DATE.split("/");
                             vm.pd.YEAR1=FZJGSPYJ_DATE[0];
                             vm.pd.MONTH1=FZJGSPYJ_DATE[1];
                             vm.pd.DAY1=FZJGSPYJ_DATE[2];
                         }
                     }else if ("exception" == data.result){
                     	showException("海淀区民办教育培训机构教学点备案审批登记表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var DJB_NUMBER=$("#DJB_NUMBER").text();
                    if(null!=DJB_NUMBER&&undefined!=DJB_NUMBER&&''!=DJB_NUMBER){
                        vm.pd.DJB_NUMBER=DJB_NUMBER;
                    }
                    var BXXKZH_FIRST=$("#BXXKZH_FIRST").text();
                    if(null!=BXXKZH_FIRST&&undefined!=BXXKZH_FIRST&&''!=BXXKZH_FIRST){
                        vm.pd.BXXKZH_FIRST=BXXKZH_FIRST;
                    }
                    var BXXKZH_SECOND=$("#BXXKZH_SECOND").text();
                    if(null!=BXXKZH_SECOND&&undefined!=BXXKZH_SECOND&&''!=BXXKZH_SECOND){
                        vm.pd.BXXKZH_SECOND=BXXKZH_SECOND;
                    }
                    var SCHOOL_NAME=$("#SCHOOL_NAME").text();
                    if(null!=SCHOOL_NAME&&undefined!=SCHOOL_NAME&&''!=SCHOOL_NAME){
                        vm.pd.SCHOOL_NAME=SCHOOL_NAME;
                    }
                    var SCHOOLMASTER_AND_PHONE=$("#SCHOOLMASTER_AND_PHONE").text();
                    if(null!=SCHOOLMASTER_AND_PHONE&&undefined!=SCHOOLMASTER_AND_PHONE&&''!=SCHOOLMASTER_AND_PHONE){
                        vm.pd.SCHOOLMASTER_AND_PHONE=SCHOOLMASTER_AND_PHONE;
                    }
                    var REGISTER_ADDRESS=$("#REGISTER_ADDRESS").text();
                    if(null!=REGISTER_ADDRESS&&undefined!=REGISTER_ADDRESS&&''!=REGISTER_ADDRESS){
                        vm.pd.REGISTER_ADDRESS=REGISTER_ADDRESS;
                    }
                    var REGISTER_XBB_PHONE=$("#REGISTER_XBB_PHONE").text();
                    if(null!=REGISTER_XBB_PHONE&&undefined!=REGISTER_XBB_PHONE&&''!=REGISTER_XBB_PHONE){
                        vm.pd.REGISTER_XBB_PHONE=REGISTER_XBB_PHONE;
                    }
                    var JXD_ADDRESS=$("#JXD_ADDRESS").text();
                    if(null!=JXD_ADDRESS&&undefined!=JXD_ADDRESS&&''!=JXD_ADDRESS){
                        vm.pd.JXD_ADDRESS=JXD_ADDRESS;
                    }
                    var PHONE=$("#PHONE").text();
                    if(null!=PHONE&&undefined!=PHONE&&''!=PHONE){
                        vm.pd.PHONE=PHONE;
                    }
                    var NAME1=$("#NAME1").text();
                    if(null!=NAME1&&undefined!=NAME1&&''!=NAME1){
                        vm.pd.NAME1=NAME1;
                    }
                    var GENDER1=$("#GENDER1").text();
                    if(null!=GENDER1&&undefined!=GENDER1&&''!=GENDER1){
                        vm.pd.GENDER1=GENDER1;
                    }
                    var AGE1=$("#AGE1").text();
                    if(null!=AGE1&&undefined!=AGE1&&''!=AGE1){
                        vm.pd.AGE1=AGE1;
                    }
                    var EDUCATION1=$("#EDUCATION1").text();
                    if(null!=EDUCATION1&&undefined!=EDUCATION1&&''!=EDUCATION1){
                        vm.pd.EDUCATION1=EDUCATION1;
                    }
                    var ZHICHENG1=$("#ZHICHENG1").text();
                    if(null!=ZHICHENG1&&undefined!=ZHICHENG1&&''!=ZHICHENG1){
                        vm.pd.ZHICHENG1=ZHICHENG1;
                    }
                    var YGZDW1=$("#YGZDW1").text();
                    if(null!=YGZDW1&&undefined!=YGZDW1&&''!=YGZDW1){
                        vm.pd.YGZDW1=YGZDW1;
                    }
                    var HKSZD1=$("#HKSZD1").text();
                    if(null!=HKSZD1&&undefined!=HKSZD1&&''!=HKSZD1){
                        vm.pd.HKSZD1=HKSZD1;
                    }
                    var ID_CARD1=$("#ID_CARD1").text();
                    if(null!=ID_CARD1&&undefined!=ID_CARD1&&''!=ID_CARD1){
                        vm.pd.ID_CARD1=ID_CARD1;
                    }
                    var SFZZ1=$("#SFZZ1").text();
                    if(null!=SFZZ1&&undefined!=SFZZ1&&''!=SFZZ1){
                        vm.pd.SFZZ1=SFZZ1;
                    }
                    var STZK1=$("#STZK1").text();
                    if(null!=STZK1&&undefined!=STZK1&&''!=STZK1){
                        vm.pd.STZK1=STZK1;
                    }
                    var NAME2=$("#NAME2").text();
                    if(null!=NAME2&&undefined!=NAME2&&''!=NAME2){
                        vm.pd.NAME2=NAME2;
                    }
                    var GENDER2=$("#GENDER2").text();
                    if(null!=GENDER2&&undefined!=GENDER2&&''!=GENDER2){
                        vm.pd.GENDER2=GENDER2;
                    }
                    var AGE2=$("#AGE2").text();
                    if(null!=AGE2&&undefined!=AGE2&&''!=AGE2){
                        vm.pd.AGE2=AGE2;
                    }
                    var EDUCATION2=$("#EDUCATION2").text();
                    if(null!=EDUCATION2&&undefined!=EDUCATION2&&''!=EDUCATION2){
                        vm.pd.EDUCATION2=EDUCATION2;
                    }
                    var ZHICHENG2=$("#ZHICHENG2").text();
                    if(null!=ZHICHENG2&&undefined!=ZHICHENG2&&''!=ZHICHENG2){
                        vm.pd.ZHICHENG2=ZHICHENG2;
                    }
                    var YGZDW2=$("#YGZDW2").text();
                    if(null!=YGZDW2&&undefined!=YGZDW2&&''!=YGZDW2){
                        vm.pd.YGZDW2=YGZDW2;
                    }
                    var HKSZD2=$("#HKSZD2").text();
                    if(null!=HKSZD2&&undefined!=HKSZD2&&''!=HKSZD2){
                        vm.pd.HKSZD2=HKSZD2;
                    }
                    var ID_CARD2=$("#ID_CARD2").text();
                    if(null!=ID_CARD2&&undefined!=ID_CARD2&&''!=ID_CARD2){
                        vm.pd.ID_CARD2=ID_CARD2;
                    }
                    var SFZZ2=$("#SFZZ2").text();
                    if(null!=SFZZ2&&undefined!=SFZZ2&&''!=SFZZ2){
                        vm.pd.SFZZ2=SFZZ2;
                    }
                    var STZK2=$("#STZK2").text();
                    if(null!=STZK2&&undefined!=STZK2&&''!=STZK2){
                        vm.pd.STZK2=STZK2;
                    }
                    var JXDMJ=$("#JXDMJ").text();
                    if(null!=JXDMJ&&undefined!=JXDMJ&&''!=JXDMJ){
                        vm.pd.JXDMJ=JXDMJ;
                    }
                    var JS_NUMBER=$("#JS_NUMBER").text();
                    if(null!=JS_NUMBER&&undefined!=JS_NUMBER&&''!=JS_NUMBER){
                        vm.pd.JS_NUMBER=JS_NUMBER;
                    }
                    var JS_AREA=$("#JS_AREA").text();
                    if(null!=JS_AREA&&undefined!=JS_AREA&&''!=JS_AREA){
                        vm.pd.JS_AREA=JS_AREA;
                    }
                    var BGS_NUMBER=$("#BGS_NUMBER").text();
                    if(null!=BGS_NUMBER&&undefined!=BGS_NUMBER&&''!=BGS_NUMBER){
                        vm.pd.BGS_NUMBER=BGS_NUMBER;
                    }
                    var BGS_AREA=$("#BGS_AREA").text();
                    if(null!=BGS_AREA&&undefined!=BGS_AREA&&''!=BGS_AREA){
                        vm.pd.BGS_AREA=BGS_AREA;
                    }
                    var JXSB=$("#JXSB").text();
                    if(null!=JXSB&&undefined!=JXSB&&''!=JXSB){
                        vm.pd.JXSB=JXSB;
                    }
                    var WQS_BMYJ=$("#WQS_BMYJ").text();
                    if(null!=WQS_BMYJ&&undefined!=WQS_BMYJ&&''!=WQS_BMYJ){
                        vm.pd.WQS_BMYJ=WQS_BMYJ;
                    }

                    var YEAR1=$("#YEAR1").text();
                    if(null!=YEAR1 && undefined != YEAR1 && '' != YEAR1){
                        vm.pd.YEAR1=YEAR1;
                    }else{
                        vm.pd.YEAR1="";
                    }
                    var MONTH1=$("#MONTH1").text();
                    if(null!=MONTH1 && undefined!=MONTH1 && ''!=MONTH1){
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

                    vm.pd.WQS_BMYJ_DATE=vm.pd.YEAR1+"/"+vm.pd.MONTH1+"/"+vm.pd.DAY1;


                    /*var WQS_BMYJ_DATE=$("#WQS_BMYJ_DATE").text();
                    if(null!=WQS_BMYJ_DATE&&undefined!=WQS_BMYJ_DATE&&''!=WQS_BMYJ_DATE){
                        vm.pd.WQS_BMYJ_DATE=WQS_BMYJ_DATE;
                    }*/
                    var FZJGSPYJ=$("#FZJGSPYJ").text();
                    if(null!=FZJGSPYJ&&undefined!=FZJGSPYJ&&''!=FZJGSPYJ){
                        vm.pd.FZJGSPYJ=FZJGSPYJ;
                    }

                    var YEAR2=$("#YEAR2").text();
                    if(null!=YEAR2 && undefined != YEAR2 && '' != YEAR2){
                        vm.pd.YEAR2=YEAR2;
                    }else{
                        vm.pd.YEAR2="";
                    }
                    var MONTH2=$("#MONTH2").text();
                    if(null!=MONTH2 && undefined!=MONTH2 && ''!=MONTH2){
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

                    vm.pd.FZJGSPYJ_DATE=vm.pd.YEAR2+"/"+vm.pd.MONTH2+"/"+vm.pd.DAY2;

                    /*var FZJGSPYJ_DATE=$("#FZJGSPYJ_DATE").text();
                    if(null!=FZJGSPYJ_DATE&&undefined!=FZJGSPYJ_DATE&&''!=FZJGSPYJ_DATE){
                        vm.pd.FZJGSPYJ_DATE=FZJGSPYJ_DATE;
                    }*/
                    var JJR=$("#JJR").text();
                    if(null!=JJR&&undefined!=JJR&&''!=JJR){
                        vm.pd.JJR=JJR;
                    }
                    var SLR=$("#SLR").text();
                    if(null!=SLR&&undefined!=SLR&&''!=SLR){
                        vm.pd.SLR=SLR;
                    }
                    var SHR=$("#SHR").text();
                    if(null!=SHR&&undefined!=SHR&&''!=SHR){
                        vm.pd.SHR=SHR;
                    }
                    var FSR=$("#FSR").text();
                    if(null!=FSR&&undefined!=FSR&&''!=FSR){
                        vm.pd.FSR=FSR;
                    }
                    var JJRQ=$("#JJRQ").text();
                    if(null!=JJRQ&&undefined!=JJRQ&&''!=JJRQ){
                        vm.pd.JJRQ=JJRQ;
                    }
                    var SLRQ=$("#SLRQ").text();
                    if(null!=SLRQ&&undefined!=SLRQ&&''!=SLRQ){
                        vm.pd.SLRQ=SLRQ;
                    }
                    var SHRQ=$("#SHRQ").text();
                    if(null!=SHRQ&&undefined!=SHRQ&&''!=SHRQ){
                        vm.pd.SHRQ=SHRQ;
                    }
                    var FSRQ=$("#FSRQ").text();
                    if(null!=FSRQ&&undefined!=FSRQ&&''!=FSRQ){
                        vm.pd.FSRQ=FSRQ;
                    }
                    var REMARKS=$("#REMARKS").text();
                    if(null!=REMARKS&&undefined!=REMARKS&&''!=REMARKS){
                        vm.pd.REMARKS=REMARKS;
                    }
                    var NAME3=$("#NAME3").text();
                    if(null!=NAME3&&undefined!=NAME3&&''!=NAME3){
                        vm.pd.NAME3=NAME3;
                    }
                    var GENDER3=$("#GENDER3").text();
                    if(null!=GENDER3&&undefined!=GENDER3&&''!=GENDER3){
                        vm.pd.GENDER3=GENDER3;
                    }
                    var AGE3=$("#AGE3").text();
                    if(null!=AGE3&&undefined!=AGE3&&''!=AGE3){
                        vm.pd.AGE3=AGE3;
                    }
                    var EDUCATION3=$("#EDUCATION3").text();
                    if(null!=EDUCATION3&&undefined!=EDUCATION3&&''!=EDUCATION3){
                        vm.pd.EDUCATION3=EDUCATION3;
                    }
                    var ZHICHENG3=$("#ZHICHENG3").text();
                    if(null!=ZHICHENG3&&undefined!=ZHICHENG3&&''!=ZHICHENG3){
                        vm.pd.ZHICHENG3=ZHICHENG3;
                    }
                    var YGZDW3=$("#YGZDW3").text();
                    if(null!=YGZDW3&&undefined!=YGZDW3&&''!=YGZDW3){
                        vm.pd.YGZDW3=YGZDW3;
                    }
                    var HKSZD3=$("#HKSZD3").text();
                    if(null!=HKSZD3&&undefined!=HKSZD3&&''!=HKSZD3){
                        vm.pd.HKSZD3=HKSZD3;
                    }
                    var ID_CARD3=$("#ID_CARD3").text();
                    if(null!=ID_CARD3&&undefined!=ID_CARD3&&''!=ID_CARD3){
                        vm.pd.ID_CARD3=ID_CARD3;
                    }
                    var SFZZ3=$("#SFZZ3").text();
                    if(null!=SFZZ3&&undefined!=SFZZ3&&''!=SFZZ3){
                        vm.pd.SFZZ3=SFZZ3;
                    }
                    var STZK3=$("#STZK3").text();
                    if(null!=STZK3&&undefined!=STZK3&&''!=STZK3){
                        vm.pd.STZK3=STZK3;
                    }
                    var NAME4=$("#NAME4").text();
                    if(null!=NAME4&&undefined!=NAME4&&''!=NAME4){
                        vm.pd.NAME4=NAME4;
                    }
                    var GENDER4=$("#GENDER4").text();
                    if(null!=GENDER4&&undefined!=GENDER4&&''!=GENDER4){
                        vm.pd.GENDER4=GENDER4;
                    }
                    var AGE4=$("#AGE4").text();
                    if(null!=AGE4&&undefined!=AGE4&&''!=AGE4){
                        vm.pd.AGE4=AGE4;
                    }
                    var EDUCATION4=$("#EDUCATION4").text();
                    if(null!=EDUCATION4&&undefined!=EDUCATION4&&''!=EDUCATION4){
                        vm.pd.EDUCATION4=EDUCATION4;
                    }
                    var ZHICHENG4=$("#ZHICHENG4").text();
                    if(null!=ZHICHENG4&&undefined!=ZHICHENG4&&''!=ZHICHENG4){
                        vm.pd.ZHICHENG4=ZHICHENG4;
                    }
                    var YGZDW4=$("#YGZDW4").text();
                    if(null!=YGZDW4&&undefined!=YGZDW4&&''!=YGZDW4){
                        vm.pd.YGZDW4=YGZDW4;
                    }
                    var HKSZD4=$("#HKSZD4").text();
                    if(null!=HKSZD4&&undefined!=HKSZD4&&''!=HKSZD4){
                        vm.pd.HKSZD4=HKSZD4;
                    }
                    var ID_CARD4=$("#ID_CARD4").text();
                    if(null!=ID_CARD4&&undefined!=ID_CARD4&&''!=ID_CARD4){
                        vm.pd.ID_CARD4=ID_CARD4;
                    }
                    var SFZZ4=$("#SFZZ4").text();
                    if(null!=SFZZ4&&undefined!=SFZZ4&&''!=SFZZ4){
                        vm.pd.SFZZ4=SFZZ4;
                    }
                    var STZK4=$("#STZK4").text();
                    if(null!=STZK4&&undefined!=STZK4&&''!=STZK4){
                        vm.pd.STZK4=STZK4;
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