
var vm = new Vue({
	el: '#app',
	data:{
        POLICYMAKING_ID: '',	//主键ID
		pd: [],						//存放字段参数
        toType:'add',
		APPROVE_ID:''  ,//审批的id  ,
		APPROVE_TYPE:'',   //审批的类型
		FORM_ID:'',   //表单的id
		isPreview:false,   //是否是从审批预览页面查看预览
		members:[],  //机构成员集合
		membersLs:[],  //机构成员集合临时
		mIndex:0,  //members 长度
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

			var myDate = new Date;
			this.pd.FULLTABLE_DATE = myDate.getFullYear()+"年"+myDate.getMonth() +"月"+myDate.getDate()+"日"; //获取当前年
			

        	if(null != FDID){
        		this.toType = 'edit';
        		this.POLICYMAKING_ID = FDID;
        		this.getData();   //获取数据
        	}
			if(null != FID){
				this.FORM_ID=FID;
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
				
				if(this.pd.ADDRESS == '' || this.pd.ADDRESS == undefined){
				        $("#ADDRESS").tips({
				            side:3,
				            msg:'请输入地址',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.ADDRESS = '';
				        this.$refs.ADDRESS.focus();
				    return false;
				    }
				if(this.pd.FULLTABLE_DATE == '' || this.pd.FULLTABLE_DATE == undefined){
				        $("#FULLTABLE_DATE").tips({
				            side:3,
				            msg:'请输入填表日期',
				            bg:'#AE81FF',
				            time:2
				        });
				        this.pd.FULLTABLE_DATE = '';
				        this.$refs.FULLTABLE_DATE.focus();
				    return false;
				    }
			}
		
           

            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'policymaking/'+this.toType,
			    	data: {
                        POLICYMAKING_ID:this.POLICYMAKING_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						SUB_STATUS:status,

                        ADDRESS:this.pd.ADDRESS,

                        FULLTABLE_DATE:this.pd.FULLTABLE_DATE,

                        // TYPE_NAME:this.pd.TYPE_NAME,
						members:JSON.stringify(this.membersLs),

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.POLICYMAKING_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("决策机构",data.exception);//显示异常
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
				url: httpurl+'policymaking/goEdit',
		    	data: {
                    POLICYMAKING_ID:this.POLICYMAKING_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.members=data.members;
						console.log(vm.members);
                     }else if ("exception" == data.result){
                     	showException("决策机构",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                  
                    var ADDRESS=$("#ADDRESS").text();
                    if(null!=ADDRESS&&undefined!=ADDRESS&&''!=ADDRESS){
                        vm.pd.ADDRESS=ADDRESS;
                    }
                    var FULLTABLE_DATE=$("#FULLTABLE_DATE").text();
                    if(null!=FULLTABLE_DATE&&undefined!=FULLTABLE_DATE&&''!=FULLTABLE_DATE){
                        vm.pd.FULLTABLE_DATE=FULLTABLE_DATE;
                    }
					
					var members=$(".member_num");
					vm.membersLs=[];
					$.each(members,function(i,member){
						var mem={};
						mem.ORDER=$(member).find(".ORDER").text();
						mem.NAME=$(member).find(".NAME").text();
						mem.SEX=$(member).find(".SEX").text();
						mem.AGE=$(member).find(".AGE").text();
						mem.EDUCATION=$(member).find(".EDUCATION").text();
						mem.TITLE=$(member).find(".TITLE").text();
						mem.TEACH_AGE=$(member).find(".TEACH_AGE").text();
						mem.TENURE=$(member).find(".TENURE").text();
						mem.ID_NUMBER=$(member).find(".ID_NUMBER").text();
						mem.ORIGINAL_WORK_JOB=$(member).find(".ORIGINAL_WORK_JOB").text();
						mem.HOME_POST_TEL=$(member).find(".HOME_POST_TEL").text();
						vm.membersLs.push(mem);
					});
					 
					console.log(vm.members);
					console.log("_____________");
					
                    /* var TYPE_NAME=$("#TYPE_NAME").text();
                    if(null!=TYPE_NAME&&undefined!=TYPE_NAME&&''!=TYPE_NAME){
                        vm.pd.TYPE_NAME=TYPE_NAME;
                    }
                    var FIELD1=$("#FIELD1").text();
                    if(null!=FIELD1&&undefined!=FIELD1&&''!=FIELD1){
                        vm.pd.FIELD1=FIELD1;
                    }
                    var FIELD2=$("#FIELD2").text();
                    if(null!=FIELD2&&undefined!=FIELD2&&''!=FIELD2){
                        vm.pd.FIELD2=FIELD2;
                    }
                    var FIELD3=$("#FIELD3").text();
                    if(null!=FIELD3&&undefined!=FIELD3&&''!=FIELD3){
                        vm.pd.FIELD3=FIELD3;
                    } */
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
	watch:{
		mIndex:function (newValue, oldValue) {
			if(newValue==undefined||oldValue==undefined){
				vm.mIndex=0;
			}else{
		       vm.mIndex=Object.keys(vm.members).length
			}
		    },
	},
	mounted(){
        this.init();
    }
})