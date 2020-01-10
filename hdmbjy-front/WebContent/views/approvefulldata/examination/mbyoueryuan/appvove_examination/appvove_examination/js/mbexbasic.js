
var vm = new Vue({
	el: '#app',
	data:{
        MBEXBASIC_ID: '',	//主键ID
		pd: [],						//存放字段参数
        msg:'add',
		APPROVE_ID:''  ,//审批的id  ,
		APPROVE_TYPE:'',   //审批的类型
		FORM_ID:'',   //表单的id
		isPreview:false,   //是否是从审批预览页面查看预览
		SUB_STATUS:'',  //是否为暂存状态   1 是   0 否
		APPROVEFORM_ID:
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
        		this.MBEXBASIC_ID = FDID;
        		this.getData();   //获取数据
        	}
			if(!this.isPreview){
				var myDate = new Date;
				this.pd.FULLDATA_DATE = myDate.getFullYear()+"年"+myDate.getMonth() +"月"+myDate.getDate()+"日"; //获取当前年
				this.getFullDataUser();
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
				            msg:'请输入幼儿园名称',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.SC_NAME = '';
				        this.$refs.SC_NAME.focus();
				    return false;
				    }
				if(this.pd.SC_ADDRESS == '' || this.pd.SC_ADDRESS == undefined){
				        $("#SC_ADDRESS").tips({
				            side:3,
				            msg:'请输入园址',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.SC_ADDRESS = '';
				        this.$refs.SC_ADDRESS.focus();
				    return false;
				    }
				if(this.pd.ORGANIZER == '' || this.pd.ORGANIZER == undefined){
				        $("#ORGANIZER").tips({
				            side:3,
				            msg:'请输入举办者',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ORGANIZER = '';
				        this.$refs.ORGANIZER.focus();
				    return false;
				    }
				if(this.pd.KINDERGARTEN_LEADER == '' || this.pd.KINDERGARTEN_LEADER == undefined){
				        $("#KINDERGARTEN_LEADER").tips({
				            side:3,
				            msg:'请输入园长',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.KINDERGARTEN_LEADER = '';
				        this.$refs.KINDERGARTEN_LEADER.focus();
				    return false;
				    }
				if(this.pd.CERTIFICATE_NUMBER == '' || this.pd.CERTIFICATE_NUMBER == undefined){
				        $("#CERTIFICATE_NUMBER").tips({
				            side:3,
				            msg:'请输入法人证书编号',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.CERTIFICATE_NUMBER = '';
				        this.$refs.CERTIFICATE_NUMBER.focus();
				    return false;
				    }
				if(this.pd.CERTIFICATE_VALIDTO == '' || this.pd.CERTIFICATE_VALIDTO == undefined){
				        $("#CERTIFICATE_VALIDTO").tips({
				            side:3,
				            msg:'请输入法人证书有效期',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.CERTIFICATE_VALIDTO = '';
				        this.$refs.CERTIFICATE_VALIDTO.focus();
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
				if(this.pd.HYGIENE_PERMIT_NUMBER == '' || this.pd.HYGIENE_PERMIT_NUMBER == undefined){
				        $("#HYGIENE_PERMIT_NUMBER").tips({
				            side:3,
				            msg:'请输入食堂卫生许可证编号',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.HYGIENE_PERMIT_NUMBER = '';
				        this.$refs.HYGIENE_PERMIT_NUMBER.focus();
				    return false;
				    }
				if(this.pd.HYGIENE_PERMIT_VALIDTO == '' || this.pd.HYGIENE_PERMIT_VALIDTO == undefined){
				        $("#HYGIENE_PERMIT_VALIDTO").tips({
				            side:3,
				            msg:'请输入食堂卫生许可证有效期',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.HYGIENE_PERMIT_VALIDTO = '';
				        this.$refs.HYGIENE_PERMIT_VALIDTO.focus();
				    return false;
				    }
				if(this.pd.LEASE_HOME == '' || this.pd.LEASE_HOME == undefined){
				        $("#LEASE_HOME").tips({
				            side:3,
				            msg:'请输入院舍租赁年限',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.LEASE_HOME = '';
				        this.$refs.LEASE_HOME.focus();
				    return false;
				    }
				if(this.pd.LEASE_HOME_VALIDTO == '' || this.pd.LEASE_HOME_VALIDTO == undefined){
				        $("#LEASE_HOME_VALIDTO").tips({
				            side:3,
				            msg:'请输入院舍租赁有效期',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.LEASE_HOME_VALIDTO = '';
				        this.$refs.LEASE_HOME_VALIDTO.focus();
				    return false;
				    }
				if(this.pd.HEALTH_CARE_CERTIFICATION_NUMBER == '' || this.pd.HEALTH_CARE_CERTIFICATION_NUMBER == undefined){
				        $("#HEALTH_CARE_CERTIFICATION_NUMBER").tips({
				            side:3,
				            msg:'请输入卫生保健合格证编号',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.HEALTH_CARE_CERTIFICATION_NUMBER = '';
				        this.$refs.HEALTH_CARE_CERTIFICATION_NUMBER.focus();
				    return false;
				    }
				if(this.pd.HEALTH_CARE_CERTIFICATION_VALIDTO == '' || this.pd.HEALTH_CARE_CERTIFICATION_VALIDTO == undefined){
				        $("#HEALTH_CARE_CERTIFICATION_VALIDTO").tips({
				            side:3,
				            msg:'请输入卫生保健合格证有效期',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.HEALTH_CARE_CERTIFICATION_VALIDTO = '';
				        this.$refs.HEALTH_CARE_CERTIFICATION_VALIDTO.focus();
				    return false;
				    }
				if(this.pd.BJF_STANDARD == '' || this.pd.BJF_STANDARD == undefined){
				        $("#BJF_STANDARD").tips({
				            side:3,
				            msg:'请输入保教费标准',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.BJF_STANDARD = '';
				        this.$refs.BJF_STANDARD.focus();
				    return false;
				    }
				if(this.pd.PERCENTAGE_QUALIFIED == '' || this.pd.PERCENTAGE_QUALIFIED == undefined){
				        $("#PERCENTAGE_QUALIFIED").tips({
				            side:3,
				            msg:'请输入教师学历达标率',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.PERCENTAGE_QUALIFIED = '';
				        this.$refs.PERCENTAGE_QUALIFIED.focus();
				    return false;
				    }
				if(this.pd.HOLDING_RATE == '' || this.pd.HOLDING_RATE == undefined){
				        $("#HOLDING_RATE").tips({
				            side:3,
				            msg:'请输入教职工岗位证书持有率',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.HOLDING_RATE = '';
				        this.$refs.HOLDING_RATE.focus();
				    return false;
				    }
				if(this.pd.SERVICE_HOURS == '' || this.pd.SERVICE_HOURS == undefined){
				        $("#SERVICE_HOURS").tips({
				            side:3,
				            msg:'请输入每天服务时间',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.SERVICE_HOURS = '';
				        this.$refs.SERVICE_HOURS.focus();
				    return false;
				    }
				if(this.pd.VACATION_TIME == '' || this.pd.VACATION_TIME == undefined){
				        $("#VACATION_TIME").tips({
				            side:3,
				            msg:'请输入寒暑假时间',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.VACATION_TIME = '';
				        this.$refs.VACATION_TIME.focus();
				    return false;
				    }
				if(this.pd.URL == '' || this.pd.URL == undefined){
				        $("#URL").tips({
				            side:3,
				            msg:'请输入网址',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.URL = '';
				        this.$refs.URL.focus();
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
				if(this.pd.FAX == '' || this.pd.FAX == undefined){
				        $("#FAX").tips({
				            side:3,
				            msg:'请输入传真',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.FAX = '';
				        this.$refs.FAX.focus();
				    return false;
				    }
				if(this.pd.ZD_TOTAL_AREA == '' || this.pd.ZD_TOTAL_AREA == undefined){
				        $("#ZD_TOTAL_AREA").tips({
				            side:3,
				            msg:'请输入占地总面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ZD_TOTAL_AREA = '';
				        this.$refs.ZD_TOTAL_AREA.focus();
				    return false;
				    }
				if(this.pd.ZD_MEAN_AREA == '' || this.pd.ZD_MEAN_AREA == undefined){
				        $("#ZD_MEAN_AREA").tips({
				            side:3,
				            msg:'请输入占地生均面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ZD_MEAN_AREA = '';
				        this.$refs.ZD_MEAN_AREA.focus();
				    return false;
				    }
				if(this.pd.JZ_TOTAL_AREA == '' || this.pd.JZ_TOTAL_AREA == undefined){
				        $("#JZ_TOTAL_AREA").tips({
				            side:3,
				            msg:'请输入建筑总面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.JZ_TOTAL_AREA = '';
				        this.$refs.JZ_TOTAL_AREA.focus();
				    return false;
				    }
				if(this.pd.JZ_MEAN_AREA == '' || this.pd.JZ_MEAN_AREA == undefined){
				        $("#JZ_MEAN_AREA").tips({
				            side:3,
				            msg:'请输入建筑生均面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.JZ_MEAN_AREA = '';
				        this.$refs.JZ_MEAN_AREA.focus();
				    return false;
				    }
				if(this.pd.HDCD_TOTAL_AREA == '' || this.pd.HDCD_TOTAL_AREA == undefined){
				        $("#HDCD_TOTAL_AREA").tips({
				            side:3,
				            msg:'请输入活动场地总面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.HDCD_TOTAL_AREA = '';
				        this.$refs.HDCD_TOTAL_AREA.focus();
				    return false;
				    }
				if(this.pd.HDCD_MEAN_AREA == '' || this.pd.HDCD_MEAN_AREA == undefined){
				        $("#HDCD_MEAN_AREA").tips({
				            side:3,
				            msg:'请输入活动场地生均面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.HDCD_MEAN_AREA = '';
				        this.$refs.HDCD_MEAN_AREA.focus();
				    return false;
				    }
				if(this.pd.JXYF_TOTAL_AREA == '' || this.pd.JXYF_TOTAL_AREA == undefined){
				        $("#JXYF_TOTAL_AREA").tips({
				            side:3,
				            msg:'请输入教学用房总面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.JXYF_TOTAL_AREA = '';
				        this.$refs.JXYF_TOTAL_AREA.focus();
				    return false;
				    }
				if(this.pd.JXYF_MEAN_AREA == '' || this.pd.JXYF_MEAN_AREA == undefined){
				        $("#JXYF_MEAN_AREA").tips({
				            side:3,
				            msg:'请输入教学用房生均面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.JXYF_MEAN_AREA = '';
				        this.$refs.JXYF_MEAN_AREA.focus();
				    return false;
				    }
				if(this.pd.SHYF_TOTAL_AREA == '' || this.pd.SHYF_TOTAL_AREA == undefined){
				        $("#SHYF_TOTAL_AREA").tips({
				            side:3,
				            msg:'请输入生活用房总面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.SHYF_TOTAL_AREA = '';
				        this.$refs.SHYF_TOTAL_AREA.focus();
				    return false;
				    }
				if(this.pd.SHYF_MEAN_AREA == '' || this.pd.SHYF_MEAN_AREA == undefined){
				        $("#SHYF_MEAN_AREA").tips({
				            side:3,
				            msg:'请输入生活用房生均面积',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.SHYF_MEAN_AREA = '';
				        this.$refs.SHYF_MEAN_AREA.focus();
				    return false;
				    }
				if(this.pd.TS_TOTAL_BOOK_NUMBER == '' || this.pd.TS_TOTAL_BOOK_NUMBER == undefined){
				        $("#TS_TOTAL_BOOK_NUMBER").tips({
				            side:3,
				            msg:'请输入图书总数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.TS_TOTAL_BOOK_NUMBER = '';
				        this.$refs.TS_TOTAL_BOOK_NUMBER.focus();
				    return false;
				    }
				if(this.pd.TS_MEAN_BOOK_NUMBER == '' || this.pd.TS_MEAN_BOOK_NUMBER == undefined){
				        $("#TS_MEAN_BOOK_NUMBER").tips({
				            side:3,
				            msg:'请输入图书生均',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.TS_MEAN_BOOK_NUMBER = '';
				        this.$refs.TS_MEAN_BOOK_NUMBER.focus();
				    return false;
				    }
				if(this.pd.WJSB_KIND == '' || this.pd.WJSB_KIND == undefined){
				        $("#WJSB_KIND").tips({
				            side:3,
				            msg:'请输入玩具设备种类',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.WJSB_KIND = '';
				        this.$refs.WJSB_KIND.focus();
				    return false;
				    }
				if(this.pd.WJSB_MEAN_NUMBER == '' || this.pd.WJSB_MEAN_NUMBER == undefined){
				        $("#WJSB_MEAN_NUMBER").tips({
				            side:3,
				            msg:'请输入玩具设备生均数量',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.WJSB_MEAN_NUMBER = '';
				        this.$refs.WJSB_MEAN_NUMBER.focus();
				    return false;
				    }
				if(this.pd.DB_PERSON_NUMBER == '' || this.pd.DB_PERSON_NUMBER == undefined){
				        $("#DB_PERSON_NUMBER").tips({
				            side:3,
				            msg:'请输入大班人数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.DB_PERSON_NUMBER = '';
				        this.$refs.DB_PERSON_NUMBER.focus();
				    return false;
				    }
				if(this.pd.DB_CLASS_NUMBER == '' || this.pd.DB_CLASS_NUMBER == undefined){
				        $("#DB_CLASS_NUMBER").tips({
				            side:3,
				            msg:'请输入大班班数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.DB_CLASS_NUMBER = '';
				        this.$refs.DB_CLASS_NUMBER.focus();
				    return false;
				    }
				if(this.pd.ZB_PERSON_NUMBER == '' || this.pd.ZB_PERSON_NUMBER == undefined){
				        $("#ZB_PERSON_NUMBER").tips({
				            side:3,
				            msg:'请输入中班人数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ZB_PERSON_NUMBER = '';
				        this.$refs.ZB_PERSON_NUMBER.focus();
				    return false;
				    }
				if(this.pd.ZB_CLASS_NUMBER == '' || this.pd.ZB_CLASS_NUMBER == undefined){
				        $("#ZB_CLASS_NUMBER").tips({
				            side:3,
				            msg:'请输入中班班数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ZB_CLASS_NUMBER = '';
				        this.$refs.ZB_CLASS_NUMBER.focus();
				    return false;
				    }
				if(this.pd.XB_PERSON_NUMBER == '' || this.pd.XB_PERSON_NUMBER == undefined){
				        $("#XB_PERSON_NUMBER").tips({
				            side:3,
				            msg:'请输入小班人数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.XB_PERSON_NUMBER = '';
				        this.$refs.XB_PERSON_NUMBER.focus();
				    return false;
				    }
				if(this.pd.XV_CLASS_NUMBER == '' || this.pd.XV_CLASS_NUMBER == undefined){
				        $("#XV_CLASS_NUMBER").tips({
				            side:3,
				            msg:'请输入小班班数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.XV_CLASS_NUMBER = '';
				        this.$refs.XV_CLASS_NUMBER.focus();
				    return false;
				    }
				if(this.pd.XXB_PERSON_NUMBER == '' || this.pd.XXB_PERSON_NUMBER == undefined){
				        $("#XXB_PERSON_NUMBER").tips({
				            side:3,
				            msg:'请输入小小班人数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.XXB_PERSON_NUMBER = '';
				        this.$refs.XXB_PERSON_NUMBER.focus();
				    return false;
				    }
				if(this.pd.XXB_CLASS_NUMBER == '' || this.pd.XXB_CLASS_NUMBER == undefined){
				        $("#XXB_CLASS_NUMBER").tips({
				            side:3,
				            msg:'请输入小小班班数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.XXB_CLASS_NUMBER = '';
				        this.$refs.XXB_CLASS_NUMBER.focus();
				    return false;
				    }
				if(this.pd.STAFF_TOTAL_NUMBER == '' || this.pd.STAFF_TOTAL_NUMBER == undefined){
				        $("#STAFF_TOTAL_NUMBER").tips({
				            side:3,
				            msg:'请输入教职工总数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.STAFF_TOTAL_NUMBER = '';
				        this.$refs.STAFF_TOTAL_NUMBER.focus();
				    return false;
				    }
				if(this.pd.STAFF_TEACHER_NUMBER == '' || this.pd.STAFF_TEACHER_NUMBER == undefined){
				        $("#STAFF_TEACHER_NUMBER").tips({
				            side:3,
				            msg:'请输入教职工教师数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.STAFF_TEACHER_NUMBER = '';
				        this.$refs.STAFF_TEACHER_NUMBER.focus();
				    return false;
				    }
				if(this.pd.STAFF_NURSERY_NUMBER == '' || this.pd.STAFF_NURSERY_NUMBER == undefined){
				        $("#STAFF_NURSERY_NUMBER").tips({
				            side:3,
				            msg:'请输入教职工教育员数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.STAFF_NURSERY_NUMBER = '';
				        this.$refs.STAFF_NURSERY_NUMBER.focus();
				    return false;
				    }
				if(this.pd.STAFF_ELSE_NUMBER == '' || this.pd.STAFF_ELSE_NUMBER == undefined){
				        $("#STAFF_ELSE_NUMBER").tips({
				            side:3,
				            msg:'请输入其他',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.STAFF_ELSE_NUMBER = '';
				        this.$refs.STAFF_ELSE_NUMBER.focus();
				    return false;
				    }
				if(this.pd.YEY_CHILD_TOTAL_NUMBER == '' || this.pd.YEY_CHILD_TOTAL_NUMBER == undefined){
				        $("#YEY_CHILD_TOTAL_NUMBER").tips({
				            side:3,
				            msg:'请输入幼儿园幼儿总数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.YEY_CHILD_TOTAL_NUMBER = '';
				        this.$refs.YEY_CHILD_TOTAL_NUMBER.focus();
				    return false;
				    }
				if(this.pd.EVERYCLASS_NURSERY_NUMBER == '' || this.pd.EVERYCLASS_NURSERY_NUMBER == undefined){
				        $("#EVERYCLASS_NURSERY_NUMBER").tips({
				            side:3,
				            msg:'请输入每班教师保育员数',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.EVERYCLASS_NURSERY_NUMBER = '';
				        this.$refs.EVERYCLASS_NURSERY_NUMBER.focus();
				    return false;
				    }
			}
				//发送 post 请求提交保存
				$.ajax({
				    	xhrFields: {
				            withCredentials: true
				        },
						type: "POST",
						url: httpurl+'mbexbasic/'+this.msg,
				    	data: {
				            MBEXBASIC_ID:this.MBEXBASIC_ID,
							APPROVE_ID:this.APPROVE_ID,   //审批id
							FORM_TYPE:this.APPROVE_TYPE,   //审批类型
							FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
							APPROVEFORM_ID:this.APPROVEFORM_ID,
							SUB_STATUS:status,  	 	//暂存为草稿
				            SC_NAME:this.pd.SC_NAME,
				
				            SC_ADDRESS:this.pd.SC_ADDRESS,
				
				            ORGANIZER:this.pd.ORGANIZER,
				
				            KINDERGARTEN_LEADER:this.pd.KINDERGARTEN_LEADER,
				
				            CERTIFICATE_NUMBER:this.pd.CERTIFICATE_NUMBER,
				
				            CERTIFICATE_VALIDTO:this.pd.CERTIFICATE_VALIDTO,
				
				            LEGAL_PERSON:this.pd.LEGAL_PERSON,
				
				            HYGIENE_PERMIT_NUMBER:this.pd.HYGIENE_PERMIT_NUMBER,
				
				            HYGIENE_PERMIT_VALIDTO:this.pd.HYGIENE_PERMIT_VALIDTO,
				
				            LEASE_HOME:this.pd.LEASE_HOME,
				
				            LEASE_HOME_VALIDTO:this.pd.LEASE_HOME_VALIDTO,
				
				            HEALTH_CARE_CERTIFICATION_NUMBER:this.pd.HEALTH_CARE_CERTIFICATION_NUMBER,
				
				            HEALTH_CARE_CERTIFICATION_VALIDTO:this.pd.HEALTH_CARE_CERTIFICATION_VALIDTO,
				
				            BJF_STANDARD:this.pd.BJF_STANDARD,
				
				            PERCENTAGE_QUALIFIED:this.pd.PERCENTAGE_QUALIFIED,
				
				            HOLDING_RATE:this.pd.HOLDING_RATE,
				
				            SERVICE_HOURS:this.pd.SERVICE_HOURS,
				
				            VACATION_TIME:this.pd.VACATION_TIME,
				
				            URL:this.pd.URL,
				
				            PHONE:this.pd.PHONE,
				
				            FAX:this.pd.FAX,
				
				            ZD_TOTAL_AREA:this.pd.ZD_TOTAL_AREA,
				
				            ZD_MEAN_AREA:this.pd.ZD_MEAN_AREA,
				
				            JZ_TOTAL_AREA:this.pd.JZ_TOTAL_AREA,
				
				            JZ_MEAN_AREA:this.pd.JZ_MEAN_AREA,
				
				            HDCD_TOTAL_AREA:this.pd.HDCD_TOTAL_AREA,
				
				            HDCD_MEAN_AREA:this.pd.HDCD_MEAN_AREA,
				
				            JXYF_TOTAL_AREA:this.pd.JXYF_TOTAL_AREA,
				
				            JXYF_MEAN_AREA:this.pd.JXYF_MEAN_AREA,
				
				            SHYF_TOTAL_AREA:this.pd.SHYF_TOTAL_AREA,
				
				            SHYF_MEAN_AREA:this.pd.SHYF_MEAN_AREA,
				
				            TS_TOTAL_BOOK_NUMBER:this.pd.TS_TOTAL_BOOK_NUMBER,
				
				            TS_MEAN_BOOK_NUMBER:this.pd.TS_MEAN_BOOK_NUMBER,
				
				            WJSB_KIND:this.pd.WJSB_KIND,
				
				            WJSB_MEAN_NUMBER:this.pd.WJSB_MEAN_NUMBER,
				
				            DB_PERSON_NUMBER:this.pd.DB_PERSON_NUMBER,
				
				            DB_CLASS_NUMBER:this.pd.DB_CLASS_NUMBER,
				
				            ZB_PERSON_NUMBER:this.pd.ZB_PERSON_NUMBER,
				
				            ZB_CLASS_NUMBER:this.pd.ZB_CLASS_NUMBER,
				
				            XB_PERSON_NUMBER:this.pd.XB_PERSON_NUMBER,
				
				            XV_CLASS_NUMBER:this.pd.XV_CLASS_NUMBER,
				
				            XXB_PERSON_NUMBER:this.pd.XXB_PERSON_NUMBER,
				
				            XXB_CLASS_NUMBER:this.pd.XXB_CLASS_NUMBER,
				
				            STAFF_TOTAL_NUMBER:this.pd.STAFF_TOTAL_NUMBER,
				
				            STAFF_TEACHER_NUMBER:this.pd.STAFF_TEACHER_NUMBER,
				
				            STAFF_NURSERY_NUMBER:this.pd.STAFF_NURSERY_NUMBER,
				
				            STAFF_ELSE_NUMBER:this.pd.STAFF_ELSE_NUMBER,
				
				            YEY_CHILD_TOTAL_NUMBER:this.pd.YEY_CHILD_TOTAL_NUMBER,
				
				            EVERYCLASS_NURSERY_NUMBER:this.pd.EVERYCLASS_NURSERY_NUMBER,
				
				            FULLDATA_BY:this.pd.FULLDATA_BY,
				
				            FULDATA_DATE:this.pd.FULDATA_DATE,
				
				    	    tm:new Date().getTime()
				        },
						dataType:"json",
						success: function(data){
				            if("success" == data.result){
				                vm.MBEXBASIC_ID=data.RES_ID;
				            	swal("", "暂存成功", "success");
				            	setTimeout(function(){
				            		top.Dialog.close();//关闭弹窗
				                },1000);
				            }else if ("exception" == data.result){
				            	showException("年检民办幼儿园海淀区民办幼儿园基本情况表",data.exception);//显示异常
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
				url: httpurl+'mbexbasic/goEdit',
		    	data: {
                    MBEXBASIC_ID:this.MBEXBASIC_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("年检民办幼儿园海淀区民办幼儿园基本情况表",data.exception);	//显示异常
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
                    var SC_ADDRESS=$("#SC_ADDRESS").text();
                    if(null!=SC_ADDRESS&&undefined!=SC_ADDRESS&&''!=SC_ADDRESS){
                        vm.pd.SC_ADDRESS=SC_ADDRESS;
                    }
                    var ORGANIZER=$("#ORGANIZER").text();
                    if(null!=ORGANIZER&&undefined!=ORGANIZER&&''!=ORGANIZER){
                        vm.pd.ORGANIZER=ORGANIZER;
                    }
                    var KINDERGARTEN_LEADER=$("#KINDERGARTEN_LEADER").text();
                    if(null!=KINDERGARTEN_LEADER&&undefined!=KINDERGARTEN_LEADER&&''!=KINDERGARTEN_LEADER){
                        vm.pd.KINDERGARTEN_LEADER=KINDERGARTEN_LEADER;
                    }
                    var CERTIFICATE_NUMBER=$("#CERTIFICATE_NUMBER").text();
                    if(null!=CERTIFICATE_NUMBER&&undefined!=CERTIFICATE_NUMBER&&''!=CERTIFICATE_NUMBER){
                        vm.pd.CERTIFICATE_NUMBER=CERTIFICATE_NUMBER;
                    }
                    var CERTIFICATE_VALIDTO=$("#CERTIFICATE_VALIDTO").text();
                    if(null!=CERTIFICATE_VALIDTO&&undefined!=CERTIFICATE_VALIDTO&&''!=CERTIFICATE_VALIDTO){
                        vm.pd.CERTIFICATE_VALIDTO=CERTIFICATE_VALIDTO;
                    }
                    var LEGAL_PERSON=$("#LEGAL_PERSON").text();
                    if(null!=LEGAL_PERSON&&undefined!=LEGAL_PERSON&&''!=LEGAL_PERSON){
                        vm.pd.LEGAL_PERSON=LEGAL_PERSON;
                    }
                    var HYGIENE_PERMIT_NUMBER=$("#HYGIENE_PERMIT_NUMBER").text();
                    if(null!=HYGIENE_PERMIT_NUMBER&&undefined!=HYGIENE_PERMIT_NUMBER&&''!=HYGIENE_PERMIT_NUMBER){
                        vm.pd.HYGIENE_PERMIT_NUMBER=HYGIENE_PERMIT_NUMBER;
                    }
                    var HYGIENE_PERMIT_VALIDTO=$("#HYGIENE_PERMIT_VALIDTO").text();
                    if(null!=HYGIENE_PERMIT_VALIDTO&&undefined!=HYGIENE_PERMIT_VALIDTO&&''!=HYGIENE_PERMIT_VALIDTO){
                        vm.pd.HYGIENE_PERMIT_VALIDTO=HYGIENE_PERMIT_VALIDTO;
                    }
                    var LEASE_HOME=$("#LEASE_HOME").text();
                    if(null!=LEASE_HOME&&undefined!=LEASE_HOME&&''!=LEASE_HOME){
                        vm.pd.LEASE_HOME=LEASE_HOME;
                    }
                    var LEASE_HOME_VALIDTO=$("#LEASE_HOME_VALIDTO").text();
                    if(null!=LEASE_HOME_VALIDTO&&undefined!=LEASE_HOME_VALIDTO&&''!=LEASE_HOME_VALIDTO){
                        vm.pd.LEASE_HOME_VALIDTO=LEASE_HOME_VALIDTO;
                    }
                    var HEALTH_CARE_CERTIFICATION_NUMBER=$("#HEALTH_CARE_CERTIFICATION_NUMBER").text();
                    if(null!=HEALTH_CARE_CERTIFICATION_NUMBER&&undefined!=HEALTH_CARE_CERTIFICATION_NUMBER&&''!=HEALTH_CARE_CERTIFICATION_NUMBER){
                        vm.pd.HEALTH_CARE_CERTIFICATION_NUMBER=HEALTH_CARE_CERTIFICATION_NUMBER;
                    }
                    var HEALTH_CARE_CERTIFICATION_VALIDTO=$("#HEALTH_CARE_CERTIFICATION_VALIDTO").text();
                    if(null!=HEALTH_CARE_CERTIFICATION_VALIDTO&&undefined!=HEALTH_CARE_CERTIFICATION_VALIDTO&&''!=HEALTH_CARE_CERTIFICATION_VALIDTO){
                        vm.pd.HEALTH_CARE_CERTIFICATION_VALIDTO=HEALTH_CARE_CERTIFICATION_VALIDTO;
                    }
                    var BJF_STANDARD=$("#BJF_STANDARD").text();
                    if(null!=BJF_STANDARD&&undefined!=BJF_STANDARD&&''!=BJF_STANDARD){
                        vm.pd.BJF_STANDARD=BJF_STANDARD;
                    }
                    var PERCENTAGE_QUALIFIED=$("#PERCENTAGE_QUALIFIED").text();
                    if(null!=PERCENTAGE_QUALIFIED&&undefined!=PERCENTAGE_QUALIFIED&&''!=PERCENTAGE_QUALIFIED){
                        vm.pd.PERCENTAGE_QUALIFIED=PERCENTAGE_QUALIFIED;
                    }
                    var HOLDING_RATE=$("#HOLDING_RATE").text();
                    if(null!=HOLDING_RATE&&undefined!=HOLDING_RATE&&''!=HOLDING_RATE){
                        vm.pd.HOLDING_RATE=HOLDING_RATE;
                    }
                    var SERVICE_HOURS=$("#SERVICE_HOURS").text();
                    if(null!=SERVICE_HOURS&&undefined!=SERVICE_HOURS&&''!=SERVICE_HOURS){
                        vm.pd.SERVICE_HOURS=SERVICE_HOURS;
                    }
                    var VACATION_TIME=$("#VACATION_TIME").text();
                    if(null!=VACATION_TIME&&undefined!=VACATION_TIME&&''!=VACATION_TIME){
                        vm.pd.VACATION_TIME=VACATION_TIME;
                    }
                    var URL=$("#URL").text();
                    if(null!=URL&&undefined!=URL&&''!=URL){
                        vm.pd.URL=URL;
                    }
                    var PHONE=$("#PHONE").text();
                    if(null!=PHONE&&undefined!=PHONE&&''!=PHONE){
                        vm.pd.PHONE=PHONE;
                    }
                    var FAX=$("#FAX").text();
                    if(null!=FAX&&undefined!=FAX&&''!=FAX){
                        vm.pd.FAX=FAX;
                    }
                    var ZD_TOTAL_AREA=$("#ZD_TOTAL_AREA").text();
                    if(null!=ZD_TOTAL_AREA&&undefined!=ZD_TOTAL_AREA&&''!=ZD_TOTAL_AREA){
                        vm.pd.ZD_TOTAL_AREA=ZD_TOTAL_AREA;
                    }
                    var ZD_MEAN_AREA=$("#ZD_MEAN_AREA").text();
                    if(null!=ZD_MEAN_AREA&&undefined!=ZD_MEAN_AREA&&''!=ZD_MEAN_AREA){
                        vm.pd.ZD_MEAN_AREA=ZD_MEAN_AREA;
                    }
                    var JZ_TOTAL_AREA=$("#JZ_TOTAL_AREA").text();
                    if(null!=JZ_TOTAL_AREA&&undefined!=JZ_TOTAL_AREA&&''!=JZ_TOTAL_AREA){
                        vm.pd.JZ_TOTAL_AREA=JZ_TOTAL_AREA;
                    }
                    var JZ_MEAN_AREA=$("#JZ_MEAN_AREA").text();
                    if(null!=JZ_MEAN_AREA&&undefined!=JZ_MEAN_AREA&&''!=JZ_MEAN_AREA){
                        vm.pd.JZ_MEAN_AREA=JZ_MEAN_AREA;
                    }
                    var HDCD_TOTAL_AREA=$("#HDCD_TOTAL_AREA").text();
                    if(null!=HDCD_TOTAL_AREA&&undefined!=HDCD_TOTAL_AREA&&''!=HDCD_TOTAL_AREA){
                        vm.pd.HDCD_TOTAL_AREA=HDCD_TOTAL_AREA;
                    }
                    var HDCD_MEAN_AREA=$("#HDCD_MEAN_AREA").text();
                    if(null!=HDCD_MEAN_AREA&&undefined!=HDCD_MEAN_AREA&&''!=HDCD_MEAN_AREA){
                        vm.pd.HDCD_MEAN_AREA=HDCD_MEAN_AREA;
                    }
                    var JXYF_TOTAL_AREA=$("#JXYF_TOTAL_AREA").text();
                    if(null!=JXYF_TOTAL_AREA&&undefined!=JXYF_TOTAL_AREA&&''!=JXYF_TOTAL_AREA){
                        vm.pd.JXYF_TOTAL_AREA=JXYF_TOTAL_AREA;
                    }
                    var JXYF_MEAN_AREA=$("#JXYF_MEAN_AREA").text();
                    if(null!=JXYF_MEAN_AREA&&undefined!=JXYF_MEAN_AREA&&''!=JXYF_MEAN_AREA){
                        vm.pd.JXYF_MEAN_AREA=JXYF_MEAN_AREA;
                    }
                    var SHYF_TOTAL_AREA=$("#SHYF_TOTAL_AREA").text();
                    if(null!=SHYF_TOTAL_AREA&&undefined!=SHYF_TOTAL_AREA&&''!=SHYF_TOTAL_AREA){
                        vm.pd.SHYF_TOTAL_AREA=SHYF_TOTAL_AREA;
                    }
                    var SHYF_MEAN_AREA=$("#SHYF_MEAN_AREA").text();
                    if(null!=SHYF_MEAN_AREA&&undefined!=SHYF_MEAN_AREA&&''!=SHYF_MEAN_AREA){
                        vm.pd.SHYF_MEAN_AREA=SHYF_MEAN_AREA;
                    }
                    var TS_TOTAL_BOOK_NUMBER=$("#TS_TOTAL_BOOK_NUMBER").text();
                    if(null!=TS_TOTAL_BOOK_NUMBER&&undefined!=TS_TOTAL_BOOK_NUMBER&&''!=TS_TOTAL_BOOK_NUMBER){
                        vm.pd.TS_TOTAL_BOOK_NUMBER=TS_TOTAL_BOOK_NUMBER;
                    }
                    var TS_MEAN_BOOK_NUMBER=$("#TS_MEAN_BOOK_NUMBER").text();
                    if(null!=TS_MEAN_BOOK_NUMBER&&undefined!=TS_MEAN_BOOK_NUMBER&&''!=TS_MEAN_BOOK_NUMBER){
                        vm.pd.TS_MEAN_BOOK_NUMBER=TS_MEAN_BOOK_NUMBER;
                    }
                    var WJSB_KIND=$("#WJSB_KIND").text();
                    if(null!=WJSB_KIND&&undefined!=WJSB_KIND&&''!=WJSB_KIND){
                        vm.pd.WJSB_KIND=WJSB_KIND;
                    }
                    var WJSB_MEAN_NUMBER=$("#WJSB_MEAN_NUMBER").text();
                    if(null!=WJSB_MEAN_NUMBER&&undefined!=WJSB_MEAN_NUMBER&&''!=WJSB_MEAN_NUMBER){
                        vm.pd.WJSB_MEAN_NUMBER=WJSB_MEAN_NUMBER;
                    }
                    var DB_PERSON_NUMBER=$("#DB_PERSON_NUMBER").text();
                    if(null!=DB_PERSON_NUMBER&&undefined!=DB_PERSON_NUMBER&&''!=DB_PERSON_NUMBER){
                        vm.pd.DB_PERSON_NUMBER=DB_PERSON_NUMBER;
                    }
                    var DB_CLASS_NUMBER=$("#DB_CLASS_NUMBER").text();
                    if(null!=DB_CLASS_NUMBER&&undefined!=DB_CLASS_NUMBER&&''!=DB_CLASS_NUMBER){
                        vm.pd.DB_CLASS_NUMBER=DB_CLASS_NUMBER;
                    }
                    var ZB_PERSON_NUMBER=$("#ZB_PERSON_NUMBER").text();
                    if(null!=ZB_PERSON_NUMBER&&undefined!=ZB_PERSON_NUMBER&&''!=ZB_PERSON_NUMBER){
                        vm.pd.ZB_PERSON_NUMBER=ZB_PERSON_NUMBER;
                    }
                    var ZB_CLASS_NUMBER=$("#ZB_CLASS_NUMBER").text();
                    if(null!=ZB_CLASS_NUMBER&&undefined!=ZB_CLASS_NUMBER&&''!=ZB_CLASS_NUMBER){
                        vm.pd.ZB_CLASS_NUMBER=ZB_CLASS_NUMBER;
                    }
                    var XB_PERSON_NUMBER=$("#XB_PERSON_NUMBER").text();
                    if(null!=XB_PERSON_NUMBER&&undefined!=XB_PERSON_NUMBER&&''!=XB_PERSON_NUMBER){
                        vm.pd.XB_PERSON_NUMBER=XB_PERSON_NUMBER;
                    }
                    var XV_CLASS_NUMBER=$("#XV_CLASS_NUMBER").text();
                    if(null!=XV_CLASS_NUMBER&&undefined!=XV_CLASS_NUMBER&&''!=XV_CLASS_NUMBER){
                        vm.pd.XV_CLASS_NUMBER=XV_CLASS_NUMBER;
                    }
                    var XXB_PERSON_NUMBER=$("#XXB_PERSON_NUMBER").text();
                    if(null!=XXB_PERSON_NUMBER&&undefined!=XXB_PERSON_NUMBER&&''!=XXB_PERSON_NUMBER){
                        vm.pd.XXB_PERSON_NUMBER=XXB_PERSON_NUMBER;
                    }
                    var XXB_CLASS_NUMBER=$("#XXB_CLASS_NUMBER").text();
                    if(null!=XXB_CLASS_NUMBER&&undefined!=XXB_CLASS_NUMBER&&''!=XXB_CLASS_NUMBER){
                        vm.pd.XXB_CLASS_NUMBER=XXB_CLASS_NUMBER;
                    }
                    var STAFF_TOTAL_NUMBER=$("#STAFF_TOTAL_NUMBER").text();
                    if(null!=STAFF_TOTAL_NUMBER&&undefined!=STAFF_TOTAL_NUMBER&&''!=STAFF_TOTAL_NUMBER){
                        vm.pd.STAFF_TOTAL_NUMBER=STAFF_TOTAL_NUMBER;
                    }
                    var STAFF_TEACHER_NUMBER=$("#STAFF_TEACHER_NUMBER").text();
                    if(null!=STAFF_TEACHER_NUMBER&&undefined!=STAFF_TEACHER_NUMBER&&''!=STAFF_TEACHER_NUMBER){
                        vm.pd.STAFF_TEACHER_NUMBER=STAFF_TEACHER_NUMBER;
                    }
                    var STAFF_NURSERY_NUMBER=$("#STAFF_NURSERY_NUMBER").text();
                    if(null!=STAFF_NURSERY_NUMBER&&undefined!=STAFF_NURSERY_NUMBER&&''!=STAFF_NURSERY_NUMBER){
                        vm.pd.STAFF_NURSERY_NUMBER=STAFF_NURSERY_NUMBER;
                    }
                    var STAFF_ELSE_NUMBER=$("#STAFF_ELSE_NUMBER").text();
                    if(null!=STAFF_ELSE_NUMBER&&undefined!=STAFF_ELSE_NUMBER&&''!=STAFF_ELSE_NUMBER){
                        vm.pd.STAFF_ELSE_NUMBER=STAFF_ELSE_NUMBER;
                    }
                    var YEY_CHILD_TOTAL_NUMBER=$("#YEY_CHILD_TOTAL_NUMBER").text();
                    if(null!=YEY_CHILD_TOTAL_NUMBER&&undefined!=YEY_CHILD_TOTAL_NUMBER&&''!=YEY_CHILD_TOTAL_NUMBER){
                        vm.pd.YEY_CHILD_TOTAL_NUMBER=YEY_CHILD_TOTAL_NUMBER;
                    }
                    var EVERYCLASS_NURSERY_NUMBER=$("#EVERYCLASS_NURSERY_NUMBER").text();
                    if(null!=EVERYCLASS_NURSERY_NUMBER&&undefined!=EVERYCLASS_NURSERY_NUMBER&&''!=EVERYCLASS_NURSERY_NUMBER){
                        vm.pd.EVERYCLASS_NURSERY_NUMBER=EVERYCLASS_NURSERY_NUMBER;
                    }
                    var FULLDATA_BY=$("#FULLDATA_BY").text();
                    if(null!=FULLDATA_BY&&undefined!=FULLDATA_BY&&''!=FULLDATA_BY){
                        vm.pd.FULLDATA_BY=FULLDATA_BY;
                    }
                    var FULDATA_DATE=$("#FULDATA_DATE").text();
                    if(null!=FULDATA_DATE&&undefined!=FULDATA_DATE&&''!=FULDATA_DATE){
                        vm.pd.FULDATA_DATE=FULDATA_DATE;
                    }
        },
		//获取填表人
		getFullDataUser:function(){
			//发送 post 请求
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'mbexbasic/getFullDataUser',
				data: {
			        tm:new Date().getTime()
			    },
				dataType:"json",
				success: function(data){
			         if("success" == data.result){
			         	vm.pd.FULLDATA_BY=data.FULLDATA_BY;							//参数map
			         }else if ("exception" == data.result){
			         	showException("年检民办幼儿园海淀区民办幼儿园基本情况表",data.exception);	//显示异常
			         }
			      }
			}).done().fail(function(){
			      swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
			   });
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