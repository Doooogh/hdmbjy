
var vm = new Vue({
	el: '#app',
	data:{
        TABLEDATA_ID: '',	//主键ID
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
        		this.TABLEDATA_ID = FDID;
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
            if(this.pd.TABLE_ID == '' || this.pd.TABLE_ID == undefined){
                    $("#TABLE_ID").tips({
                        side:3,
                        msg:'请输入table_id',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.TABLE_ID = '';
                    this.$refs.TABLE_ID.focus();
                return false;
                }
            if(this.pd.VALUE == '' || this.pd.VALUE == undefined){
                    $("#VALUE").tips({
                        side:3,
                        msg:'请输入反馈表数据值',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.VALUE = '';
                    this.$refs.VALUE.focus();
                return false;
                }
            if(this.pd.FIELD1 == '' || this.pd.FIELD1 == undefined){
                    $("#FIELD1").tips({
                        side:3,
                        msg:'请输入备注4',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FIELD1 = '';
                    this.$refs.FIELD1.focus();
                return false;
                }
            if(this.pd.FIELD2 == '' || this.pd.FIELD2 == undefined){
                    $("#FIELD2").tips({
                        side:3,
                        msg:'请输入备注5',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FIELD2 = '';
                    this.$refs.FIELD2.focus();
                return false;
                }
            if(this.pd.FIELD3 == '' || this.pd.FIELD3 == undefined){
                    $("#FIELD3").tips({
                        side:3,
                        msg:'请输入备注6',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FIELD3 = '';
                    this.$refs.FIELD3.focus();
                return false;
                }
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'tabledata/'+this.msg,
			    	data: {
TABLEDATA_ID:this.TABLEDATA_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

						TABLE_ID:this.pd.TABLE_ID,

						VALUE:this.pd.VALUE,

						FIELD1:this.pd.FIELD1,

						FIELD2:this.pd.FIELD2,

						FIELD3:this.pd.FIELD3,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.TABLEDATA_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "暂存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("通知反馈表数据存储表",data.exception);//显示异常
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
				url: httpurl+'tabledata/goEdit',
		    	data: {
                    TABLEDATA_ID:this.TABLEDATA_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("通知反馈表数据存储表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                    var TABLE_ID=$("#TABLE_ID").text();
                    if(null!=TABLE_ID&&undefined!=TABLE_ID&&''!=TABLE_ID){
                        vm.pd.TABLE_ID=TABLE_ID;
                    }
                    var VALUE=$("#VALUE").text();
                    if(null!=VALUE&&undefined!=VALUE&&''!=VALUE){
                        vm.pd.VALUE=VALUE;
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