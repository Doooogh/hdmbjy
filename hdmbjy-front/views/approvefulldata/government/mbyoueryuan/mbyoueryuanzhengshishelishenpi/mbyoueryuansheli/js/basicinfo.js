var vm = new Vue({
	el: '#app',
	
	data:{
		BASICINFO_ID: '',	//主键ID
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
        		this.BASICINFO_ID = FDID;
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
			// console.log(vm.pd);
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
			if(this.pd.NATIONALITY == '' || this.pd.NATIONALITY == undefined){
				$("#NATIONALITY").tips({
					side:3,
			        msg:'请输入民族',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.NATIONALITY = '';
				this.$refs.NATIONALITY.focus();
			return false;
			}
		/* 	if(this.pd.BIRTHDAY == '' || this.pd.BIRTHDAY == undefined){
				$("#BIRTHDAY").tips({
					side:3,
			        msg:'请输入出生日期',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.BIRTHDAY = '';
				this.$refs.BIRTHDAY.focus();
			return false;
			} */
			
			
			
			
			//不可以为空的DATE
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
					vm.pd.YEAR=vm.pd.MONTH=vm.pd.DAY='';     //编号后的YEAR MONTH DAY
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
				vm.pd.YEAR=vm.pd.MONTH=vm.pd.DAY='';     //编号后的YEAR MONTH DAY
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
			if(this.pd.STANDARD_ULTURE == '' || this.pd.STANDARD_ULTURE == undefined){
				$("#STANDARD_ULTURE").tips({
					side:3,
			        msg:'请输入文化程度',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.STANDARD_ULTURE = '';
				this.$refs.STANDARD_ULTURE.focus();
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
			if(this.pd.POST_CODE == '' || this.pd.POST_CODE == undefined){
				$("#POST_CODE").tips({
					side:3,
			        msg:'请输入邮政编码',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.POST_CODE = '';
				this.$refs.POST_CODE.focus();
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
			if(this.pd.OPINION == '' || this.pd.OPINION == undefined){
				$("#OPINION").tips({
					side:3,
			        msg:'请输入本人意见',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.OPINION = '';
				this.$refs.OPINION.focus();
			return false;
			}	
			}
				
		
    		
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'basicinfo/'+this.msg,
			    	data: {
						BASICINFO_ID:this.BASICINFO_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						SUB_STATUS:status,
						NAME:this.pd.NAME,
						SEX:this.pd.SEX,
						NATIONALITY:this.pd.NATIONALITY,
						BIRTHDAY:this.pd.BIRTHDAY,
						POLITICS_STATUS:this.pd.POLITICS_STATUS,
						TITLE:this.pd.TITLE,
						STANDARD_ULTURE:this.pd.STANDARD_ULTURE,
						ID_NUMBER:this.pd.ID_NUMBER,
						HEALTH_CONDITION:this.pd.HEALTH_CONDITION,
						ISRETIREMENT:this.pd.ISRETIREMENT,
						ORIGINAL_WORK:this.pd.ORIGINAL_WORK,
						PHONE:this.pd.PHONE,
						ADDRESS:this.pd.ADDRESS,
						POST_CODE:this.pd.POST_CODE,
						RESUME:this.pd.RESUME,
						OPINION:this.pd.OPINION,
						tm:new Date().getTime()
					},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
							vm.BASICINFO_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
							swal("", "保存成功", "success");
							setTimeout(function(){
								top.Dialog.close();//关闭弹窗
							},1000);
                        }else if ("exception" == data.result){
                        	showException("决策机构成员个人基本情况表",data.exception);//显示异常
                      /*  	$("#showform").show();
                    		$("#jiazai").hide(); */
                        }
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                   $("#showform").show();
           		   $("#jiazai").hide();
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
				url: httpurl+'basicinfo/goEdit',
		    	data: {
					BASICINFO_ID:this.BASICINFO_ID,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						var birthday=vm.pd.BIRTHDAY.split("/");
						vm.pd.YEAR=birthday[0];
						vm.pd.MONTH=birthday[1];
						vm.pd.DAY=birthday[2];
                     }else if ("exception" == data.result){
                     	showException("决策机构成员个人基本情况表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},
    	
    	//获取数据字典数据
		getDict: function (){
		},
    	
    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
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
		getValue:function(){
			
			var NAME=$("#NAME").text();
			if(null!=NAME&&undefined!=NAME&&''!=NAME){
				vm.pd.NAME=NAME;
			}
			var SEX=$("#SEX").text();
			if(null!=SEX&&undefined!=SEX&&''!=SEX){
				vm.pd.SEX=SEX;
			}
			var NATIONALITY=$("#NATIONALITY").text();
			if(null!=NATIONALITY&&undefined!=NATIONALITY&&''!=NATIONALITY){
				vm.pd.NATIONALITY=NATIONALITY;
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
			vm.pd.BIRTHDAY=vm.pd.YEAR+"/"+vm.pd.MONTH+"/"+vm.pd.DAY;
			 
			var POLITICS_STATUS=$("#POLITICS_STATUS").text();
			if(null!=POLITICS_STATUS&&undefined!=POLITICS_STATUS&&''!=POLITICS_STATUS){
				vm.pd.POLITICS_STATUS=POLITICS_STATUS;
			}
			var TITLE=$("#TITLE").text();
			if(null!=TITLE&&undefined!=TITLE&&''!=TITLE){
				vm.pd.TITLE=TITLE;
			}
			var STANDARD_ULTURE=$("#STANDARD_ULTURE").text();
			if(null!=STANDARD_ULTURE&&undefined!=STANDARD_ULTURE&&''!=STANDARD_ULTURE){
				vm.pd.STANDARD_ULTURE=STANDARD_ULTURE;
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
			var ORIGINAL_WORK=$("#ORIGINAL_WORK").text();
			if(null!=ORIGINAL_WORK&&undefined!=ORIGINAL_WORK&&''!=ORIGINAL_WORK){
				vm.pd.ORIGINAL_WORK=ORIGINAL_WORK;
			}
			
			var PHONE=$("#PHONE").text();
			if(null!=PHONE&&undefined!=PHONE&&''!=PHONE){
				vm.pd.PHONE=PHONE;
			}
			var ADDRESS=$("#ADDRESS").text();
			if(null!=ADDRESS&&undefined!=ADDRESS&&''!=ADDRESS){
				vm.pd.ADDRESS=ADDRESS;
			}
			var POST_CODE=$("#POST_CODE").text();
			if(null!=POST_CODE&&undefined!=POST_CODE&&''!=POST_CODE){
				vm.pd.POST_CODE=POST_CODE;
			}
			var RESUME=$("#RESUME").text();
			if(null!=RESUME&&undefined!=RESUME&&''!=RESUME){
				vm.pd.RESUME=RESUME;
			}
			var OPINION=$("#OPINION").text();
			if(null!=OPINION&&undefined!=OPINION&&''!=OPINION){
				vm.pd.OPINION=OPINION;
			}
		}
        
	},

	
	mounted(){
        this.init();
    }
})