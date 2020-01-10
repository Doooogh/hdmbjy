
var vm = new Vue({
	el: '#app',
	data:{
        TEACHINGPROGRAM_ID: '',	//主键ID
		pd: [],						//存放字段参数
        toType:'add',
		APPROVE_ID:''  ,//审批的id  ,
		APPROVE_TYPE:'',   //审批的类型
		FORM_ID:'',   //表单的id
		isPreview:false,   //是否是从审批预览页面查看预览
		plans:[],  //计划集合
		plansLs:[],  //计划集合临时
		pIndex:0,  //plans 长度
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
			this.pd.FULL_DATE = myDate.getFullYear()+"年"+myDate.getMonth() +"月"+myDate.getDate()+"日"; //获取当前年
			

        	if(null != FDID){
        		this.toType = 'edit';
        		this.TEACHINGPROGRAM_ID = FDID;
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
            if(this.pd.FULL_DATE == '' || this.pd.FULL_DATE == undefined){
                    $("#FULL_DATE").tips({
                        side:3,
                        msg:'请输入填表日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.FULL_DATE = '';
                    this.$refs.FULL_DATE.focus();
                return false;
                }
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'teachingprogram/'+this.toType,
			    	data: {
						TEACHINGPROGRAM_ID:this.TEACHINGPROGRAM_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

						ADDRESS:this.pd.ADDRESS,

						FULL_DATE:this.pd.FULL_DATE,

						// TYPE_NAME:this.pd.TYPE_NAME,
						plans:JSON.stringify(this.plansLs),

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.TEACHINGPROGRAM_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("民办培训学校设立教学计划",data.exception);//显示异常
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
				url: httpurl+'teachingprogram/goEdit',
		    	data: {
                    TEACHINGPROGRAM_ID:this.TEACHINGPROGRAM_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.plans=data.plans;
                     }else if ("exception" == data.result){
                     	showException("民办培训学校设立教学计划",data.exception);	//显示异常
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
                    var FULL_DATE=$("#FULL_DATE").text();
                    if(null!=FULL_DATE&&undefined!=FULL_DATE&&''!=FULL_DATE){
                        vm.pd.FULL_DATE=FULL_DATE;
                    }
					
					var plans=$(".t_plan");
					vm.plansLs=[];
					$.each(plans,function(i,plan){
						var pl={};
						pl.ORDER=$(plan).find(".ORDER").text();
						pl.MAJOR=$(plan).find(".MAJOR").text();
						pl.STUDY_PERIOD=$(plan).find(".STUDY_PERIOD").text();
						pl.ALL_CLASS_HOUR=$(plan).find(".ALL_CLASS_HOUR").text();
						pl.TEXTBOOK=$(plan).find(".TEXTBOOK").text();
						pl.CLASS_SET=$(plan).find(".CLASS_SET").text();
						pl.WAY_TARGET=$(plan).find(".WAY_TARGET").text();
						vm.plansLs.push(pl);
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
	watch:{
		pIndex:function (newValue, oldValue) {
			if(newValue==undefined||oldValue==undefined){
				vm.pIndex=0;
			}else{
		       vm.pIndex=Object.keys(vm.plans).length
			}
		    },
	},
	mounted(){
        this.init();
    }
})