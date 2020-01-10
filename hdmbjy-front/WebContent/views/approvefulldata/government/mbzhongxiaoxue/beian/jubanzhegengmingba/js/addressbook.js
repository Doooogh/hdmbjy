var vm = new Vue({
	el: '#app',
	data:{
        ADDRESSBOOK_ID: '',	//主键ID
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
        		this.ADDRESSBOOK_ID = FDID;
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
			
			var myDate = new Date;
			    this.pd.YEAR = myDate.getFullYear(); //获取当前年
			    this.pd.MONTH = myDate.getMonth() + 1; //获取当前月
			    this.pd.DAY = myDate.getDate(); //获取当前日
        },

        //去保存
    	save: function (status){
            vm.getValue();
			vm.SUB_STATUS=status;
			if(status==0){
				var myreg = /^(((13[0-9]{1})|159)+\d{8})$/;
				if(this.pd.DATE_FILL == '' || this.pd.DATE_FILL == undefined){
				        $("#DATE_FILL").tips({
				            side:3,
				            msg:'请输入填表日期',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.DATE_FILL = '';
				        this.$refs.DATE_FILL.focus();
				    return false;
				    }
					
				if(this.pd.RUNNING_LICENSE == '' || this.pd.RUNNING_LICENSE == undefined){
				        $("#RUNNING_LICENSE").tips({
				            side:3,
				            msg:'请输入正确的办学许可证号',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.RUNNING_LICENSE = '';
				        this.$refs.RUNNING_LICENSE.focus();
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
				if(this.pd.SCHOOL_TELEFACSIMILE == '' || this.pd.SCHOOL_TELEFACSIMILE == undefined){
				        $("#SCHOOL_TELEFACSIMILE").tips({
				            side:3,
				            msg:'请输入电话传真',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.SCHOOL_TELEFACSIMILE = '';
				        this.$refs.SCHOOL_TELEFACSIMILE.focus();
				    return false;
				    }
				if(this.pd.SCHOOL_LOCATION == '' || this.pd.SCHOOL_LOCATION == undefined){
				        $("#SCHOOL_LOCATION").tips({
				            side:3,
				            msg:'请输入校址',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.SCHOOL_LOCATION = '';
				        this.$refs.SCHOOL_LOCATION.focus();
				    return false;
				    }
				if(this.pd.EMAIL == '' || this.pd.EMAIL == undefined){
				  			$("#EMAIL").tips({
				  				side:3,
				  	            msg:'输入邮箱',
				  	            bg:'#AE81FF',
				  	            time:3
				  	        });
				  			this.pd.EMAIL = '';
				  			this.$refs.EMAIL.focus();
				  			return false;
				  		}else if(!this.ismail(this.pd.EMAIL)){
				  			$("#EMAIL").tips({
				  				side:3,
				  	            msg:'邮箱格式不正确',
				  	            bg:'#AE81FF',
				  	            time:3
				  	        });
				  			this.$refs.EMAIL.focus();
				  			return false;
				}
				if(this.pd.SCHOOLMASTER == '' || this.pd.SCHOOLMASTER == undefined){
				        $("#SCHOOLMASTER").tips({
				            side:3,
				            msg:'请输入校长',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.SCHOOLMASTER = '';
				        this.$refs.SCHOOLMASTER.focus();
				    return false;
				    }
					
				if(this.pd.SCHOOLMASTER_PHONE == '' || this.pd.SCHOOLMASTER_PHONE == undefined){
				    			$("#SCHOOLMASTER_PHONE").tips({
				    				side:3,
				    	            msg:'输入手机号',
				    	            bg:'#AE81FF',
				    	            time:3
				    	        });
				    			this.pd.SCHOOLMASTER_PHONE = '';
				    			this.$refs.SCHOOLMASTER_PHONE.focus();
				    			return false;
				    		}else if(this.pd.SCHOOLMASTER_PHONE.length != 11 && !myreg.test(this.pd.SCHOOLMASTER_PHONE)){
				    			$("#SCHOOLMASTER_PHONE").tips({
				    				side:3,
				    	            msg:'手机号格式不正确',
				    	            bg:'#AE81FF',
				    	            time:3
				    	        });
				    			this.$refs.SCHOOLMASTER_PHONE.focus();
				    			return false;
				    		}	
				if(this.pd.CONTACT_PERSON == '' || this.pd.CONTACT_PERSON == undefined){
				        $("#CONTACT_PERSON").tips({
				            side:3,
				            msg:'请输入联系人',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.CONTACT_PERSON = '';
				        this.$refs.CONTACT_PERSON.focus();
				    return false;
				    }
				if(this.pd.CONTACT_PERSON_PHONE == '' || this.pd.CONTACT_PERSON_PHONE == undefined){
				    			$("#CONTACT_PERSON_PHONE").tips({
				    				side:3,
				    	            msg:'输入手机号',
				    	            bg:'#AE81FF',
				    	            time:3
				    	        });
				    			this.pd.CONTACT_PERSON_PHONE = '';
				    			this.$refs.CONTACT_PERSON_PHONE.focus();
				    			return false;
				    		}else if(this.pd.CONTACT_PERSON_PHONE.length != 11 && !myreg.test(this.pd.CONTACT_PERSON_PHONE)){
				    			$("#CONTACT_PERSON_PHONE").tips({
				    				side:3,
				    	            msg:'手机号格式不正确',
				    	            bg:'#AE81FF',
				    	            time:3
				    	        });
				    			this.$refs.CONTACT_PERSON_PHONE.focus();
				    			return false;
				    		}
					
				if(this.pd.ADRESSE == '' || this.pd.ADRESSE == undefined){
				        $("#ADRESSE").tips({
				            side:3,
				            msg:'请输入通讯地址',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ADRESSE = '';
				        this.$refs.ADRESSE.focus();
				    return false;
				    }
				if(this.pd.POSTCODE == '' || this.pd.POSTCODE == undefined){
				        $("#POSTCODE").tips({
				            side:3,
				            msg:'请输入邮编',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.POSTCODE = '';
				        this.$refs.POSTCODE.focus();
				    return false;
				    }
				if(this.pd.NAME_RECIPIENT == '' || this.pd.NAME_RECIPIENT == undefined){
				        $("#NAME_RECIPIENT").tips({
				            side:3,
				            msg:'请输入收信名称或个人',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.NAME_RECIPIENT = '';
				        this.$refs.NAME_RECIPIENT.focus();
				    return false;
				    }
				         
					if(this.pd.RECIPIENT_PHONE == '' || this.pd.RECIPIENT_PHONE == undefined){
					    			$("#RECIPIENT_PHONE").tips({
					    				side:3,
					    	            msg:'输入手机号',
					    	            bg:'#AE81FF',
					    	            time:3
					    	        });
					    			this.pd.RECIPIENT_PHONE = '';
					    			this.$refs.RECIPIENT_PHONE.focus();
					    			return false;
					    		}else if(this.pd.RECIPIENT_PHONE.length != 11 && !myreg.test(this.pd.RECIPIENT_PHONE)){
					    			$("#RECIPIENT_PHONE").tips({
					    				side:3,
					    	            msg:'手机号格式不正确',
					    	            bg:'#AE81FF',
					    	            time:3
					    	        });
					    			this.$refs.RECIPIENT_PHONE.focus();
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
				if(this.pd.ORGANIZER_TELEFACSIMILE == '' || this.pd.ORGANIZER_TELEFACSIMILE == undefined){
				        $("#ORGANIZER_TELEFACSIMILE").tips({
				            side:3,
				            msg:'请输入电话传真',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ORGANIZER_TELEFACSIMILE = '';
				        this.$refs.ORGANIZER_TELEFACSIMILE.focus();
				    return false;
				    }
				if(this.pd.REMARK == '' || this.pd.REMARK == undefined){
				        $("#REMARK").tips({
				            side:3,
				            msg:'请输入备注',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.REMARK = '';
				        this.$refs.REMARK.focus();
				    return false;
				    }
				          
			}
			
          
        

            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'addressbook/'+this.msg,
			    	data: {
                        ADDRESSBOOK_ID:this.ADDRESSBOOK_ID,

						APPROVE_ID:this.APPROVE_ID,   //审批id
						
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id	
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						SUB_STATUS:status,

                        SCHOOL_NAME:this.pd.SCHOOL_NAME,

                        SCHOOL_TELEFACSIMILE:this.pd.SCHOOL_TELEFACSIMILE,

                        SCHOOL_LOCATION:this.pd.SCHOOL_LOCATION,

                        EMAIL:this.pd.EMAIL,

                        SCHOOLMASTER:this.pd.SCHOOLMASTER,

                        SCHOOLMASTER_PHONE:this.pd.SCHOOLMASTER_PHONE,

                        CONTACT_PERSON:this.pd.CONTACT_PERSON,

                        CONTACT_PERSON_PHONE:this.pd.CONTACT_PERSON_PHONE,

                        ADRESSE:this.pd.ADRESSE,

                        POSTCODE:this.pd.POSTCODE,

                        NAME_RECIPIENT:this.pd.NAME_RECIPIENT,

                        RECIPIENT_PHONE:this.pd.RECIPIENT_PHONE,

                        ORGANIZER:this.pd.ORGANIZER,

                        ORGANIZER_TELEFACSIMILE:this.pd.ORGANIZER_TELEFACSIMILE,

                        REMARK:this.pd.REMARK,

                        DATE_FILL:this.pd.DATE_FILL,

                        RUNNING_LICENSE:this.pd.RUNNING_LICENSE,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.ADDRESSBOOK_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("海淀区民办幼儿园通讯录",data.exception);//显示异常
                        }
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                });
    	},
		ismail: function(mail){
    		return(new RegExp(/^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/).test(mail));
    	},
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'addressbook/goEdit',
		    	data: {
                    ADDRESSBOOK_ID:this.ADDRESSBOOK_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						var datefill=data.pd.DATE_FILL.split("/");
						if(datefill.length()!=0){
							vm.pd.YEAR=datefill[0];
							vm.pd.MONTH=datefill[1];
							vm.pd.DAY=datefill[2];
						}
						
						var r_license=data.RUNNING_LICENSE.split("/");
						if(r_license.length()!=0){
							vm.pd.NUM1=r_license[0];
							vm.pd.NUM2=r_license[1];
						}
                     }else if ("exception" == data.result){
                     	showException("海淀区民办幼儿园通讯录",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var ADDRESSBOOK_ID=$("#ADDRESSBOOK_ID").text();
                    if(null!=ADDRESSBOOK_ID&&undefined!=ADDRESSBOOK_ID&&''!=ADDRESSBOOK_ID){
                        vm.pd.ADDRESSBOOK_ID=ADDRESSBOOK_ID;
                    }
                    var SCHOOL_NAME=$("#SCHOOL_NAME").text();
                    if(null!=SCHOOL_NAME&&undefined!=SCHOOL_NAME&&''!=SCHOOL_NAME){
                        vm.pd.SCHOOL_NAME=SCHOOL_NAME;
                    }
                    var SCHOOL_TELEFACSIMILE=$("#SCHOOL_TELEFACSIMILE").text();
                    if(null!=SCHOOL_TELEFACSIMILE&&undefined!=SCHOOL_TELEFACSIMILE&&''!=SCHOOL_TELEFACSIMILE){
                        vm.pd.SCHOOL_TELEFACSIMILE=SCHOOL_TELEFACSIMILE;
                    }
                    var SCHOOL_LOCATION=$("#SCHOOL_LOCATION").text();
                    if(null!=SCHOOL_LOCATION&&undefined!=SCHOOL_LOCATION&&''!=SCHOOL_LOCATION){
                        vm.pd.SCHOOL_LOCATION=SCHOOL_LOCATION;
                    }
                    var EMAIL=$("#EMAIL").text();
                    if(null!=EMAIL&&undefined!=EMAIL&&''!=EMAIL){
                        vm.pd.EMAIL=EMAIL;
                    }
                    var SCHOOLMASTER=$("#SCHOOLMASTER").text();
                    if(null!=SCHOOLMASTER&&undefined!=SCHOOLMASTER&&''!=SCHOOLMASTER){
                        vm.pd.SCHOOLMASTER=SCHOOLMASTER;
                    }
                    var SCHOOLMASTER_PHONE=$("#SCHOOLMASTER_PHONE").text();
                    if(null!=SCHOOLMASTER_PHONE&&undefined!=SCHOOLMASTER_PHONE&&''!=SCHOOLMASTER_PHONE){
                        vm.pd.SCHOOLMASTER_PHONE=SCHOOLMASTER_PHONE;
                    }
                    var CONTACT_PERSON=$("#CONTACT_PERSON").text();
                    if(null!=CONTACT_PERSON&&undefined!=CONTACT_PERSON&&''!=CONTACT_PERSON){
                        vm.pd.CONTACT_PERSON=CONTACT_PERSON;
                    }
                    var CONTACT_PERSON_PHONE=$("#CONTACT_PERSON_PHONE").text();
                    if(null!=CONTACT_PERSON_PHONE&&undefined!=CONTACT_PERSON_PHONE&&''!=CONTACT_PERSON_PHONE){
                        vm.pd.CONTACT_PERSON_PHONE=CONTACT_PERSON_PHONE;
                    }
                    var ADRESSE=$("#ADRESSE").text();
                    if(null!=ADRESSE&&undefined!=ADRESSE&&''!=ADRESSE){
                        vm.pd.ADRESSE=ADRESSE;
                    }
                    var POSTCODE=$("#POSTCODE").text();
                    if(null!=POSTCODE&&undefined!=POSTCODE&&''!=POSTCODE){
                        vm.pd.POSTCODE=POSTCODE;
                    }
                    var NAME_RECIPIENT=$("#NAME_RECIPIENT").text();
                    if(null!=NAME_RECIPIENT&&undefined!=NAME_RECIPIENT&&''!=NAME_RECIPIENT){
                        vm.pd.NAME_RECIPIENT=NAME_RECIPIENT;
                    }
                    var RECIPIENT_PHONE=$("#RECIPIENT_PHONE").text();
                    if(null!=RECIPIENT_PHONE&&undefined!=RECIPIENT_PHONE&&''!=RECIPIENT_PHONE){
                        vm.pd.RECIPIENT_PHONE=RECIPIENT_PHONE;
                    }
                    var ORGANIZER=$("#ORGANIZER").text();
                    if(null!=ORGANIZER&&undefined!=ORGANIZER&&''!=ORGANIZER){
                        vm.pd.ORGANIZER=ORGANIZER;
                    }
                    var ORGANIZER_TELEFACSIMILE=$("#ORGANIZER_TELEFACSIMILE").text();
                    if(null!=ORGANIZER_TELEFACSIMILE&&undefined!=ORGANIZER_TELEFACSIMILE&&''!=ORGANIZER_TELEFACSIMILE){
                        vm.pd.ORGANIZER_TELEFACSIMILE=ORGANIZER_TELEFACSIMILE;
                    }
                    var REMARK=$("#REMARK").text();
                    if(null!=REMARK&&undefined!=REMARK&&''!=REMARK){
                        vm.pd.REMARK=REMARK;
                    }
					
					
					var YEAR=$("#YEAR").text();
					if(null!=YEAR&&undefined!=YEAR&&''!=YEAR&&YEAR.length==4){
						vm.pd.YEAR=YEAR;
					}
					var MONTH=$("#MONTH").text();
					if(null!=MONTH&&undefined!=MONTH&&''!=MONTH&&MONTH>0&&MONTH<=12){
						if(MONTH<10&&MONTH.length==1){
							MONTH=("0"+MONTH)
						}
						vm.pd.MONTH=MONTH;
					}
					var DAY=$("#DAY").text();
					if(null!=DAY&&undefined!=DAY&&''!=DAY&&DAY>0&&DAY<=31){
						if(DAY<10&&DAY.length==1){
							DAY=("0"+DAY)
						}
						vm.pd.DAY=DAY;
					}
					
					vm.pd.DATE_FILL=vm.pd.YEAR+"/"+vm.pd.MONTH+"/"+vm.pd.DAY;
					
					var NUM1=$("#NUM1").text();
					var NUM2=$("#NUM2").text();
                    var RUNNING_LICENSE=$("#RUNNING_LICENSE").text();
                    if(null!=NUM1&&undefined!=NUM1&&''!=NUM1
					&&null!=NUM2&&undefined!=NUM2&&''!=NUM2){
                        vm.pd.RUNNING_LICENSE=NUM1+"/"+NUM2;
                    }
                  
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