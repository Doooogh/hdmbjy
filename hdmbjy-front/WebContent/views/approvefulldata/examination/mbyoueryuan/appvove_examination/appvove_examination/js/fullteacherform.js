
var vm = new Vue({
	el: '#app',
	data:{
        FULLTEACHERFORM_ID: '',	//主键ID
		pd: [],						//存放字段参数
        toType:'add',
		APPROVE_ID:''  ,//审批的id  ,
		APPROVE_TYPE:'',   //审批的类型
		FORM_ID:'',   //表单的id
		isPreview:false,   //是否是从审批预览页面查看预览
		members:[],  //机构成员集合
		membersLs:[],  //机构成员集合
		mIndex:0,  //members 长度
		SUB_STATUS:'',  //是否为暂存状态   1 是   0 否
		APPROVEFORM_ID:'',  
		index:4
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
			this.pd.DATE = myDate.getFullYear()+"年"+myDate.getMonth() +"月"+myDate.getDate()+"日"; //获取当前年
			

        	if(null != FDID){
        		this.toType = 'edit';
        		this.FULLTEACHERFORM_ID = FDID;
        		this.getData();   //获取数据
				// 
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
        
        addTable:function (){
        	var newT = "<tr class=\"member_num\"><td><p contenteditable=\"false\" class=\"ORDER\">"+ (this.index) +"</p></td><td><p contenteditable=\"true\" class=\"NAME\"></p></td><td><p contenteditable=\"true\" class=\"SEX\"></p></td><td><p contenteditable=\"true\" class=\"BIRTHDAY\"></p></td><td><p contenteditable=\"true\" class=\"ID_CARD\"></p></td><td><p contenteditable=\"true\" class=\"HOUSEHOLD\"></p></td><td><p contenteditable=\"true\" class=\"HAS_TEACHER_CERTIFICATE\"></p></td><td><p contenteditable=\"true\" class=\"TEACH_COURSE\"></p></td></tr>";
			$(".tableT").append(newT);
			this.index=this.index+1;
        },
        delTable:function (){
        	$(".trselect").remove();
        },

        //去保存
    	save: function (status){
            vm.getValue();
			vm.SUB_STATUS=status;
			if(status==0){
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
				if(this.pd.DATE == '' || this.pd.DATE == undefined){
						$("#DATE").tips({
							side:3,
							msg:'请输入日期',
							bg:'#AE81FF',
							time:2
						});
						this.pd.DATE = '';
						this.$refs.DATE.focus();
					return false;
			    }
			}
			
			$.ajax({
			    	xhrFields: {
			            withCredentials: true
			        },
					type: "POST",
					url: httpurl+'fullteacherform/'+this.toType,
			    	data: {
			            FULLTEACHERFORM_ID:this.FULLTEACHERFORM_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
			            FULLDATA_BY:this.pd.FULLDATA_BY,
			            PHONE:this.pd.PHONE,
			
			            DATE:this.pd.DATE,
						
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						SUB_STATUS:status,  	 	//暂存为草稿
						
						members:JSON.stringify(this.membersLs),
						
			    	    tm:new Date().getTime()
			        },
					dataType:"json",
					success: function(data){
			            if("success" == data.result){
			                vm.FULLTEACHERFORM_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
							// 
			            	swal("", "保存成功", "success");
			            	setTimeout(function(){
			            		top.Dialog.close();//关闭弹窗
			                },1000);
			            }else if ("exception" == data.result){
			            	showException("幼儿园专职教师名册",data.exception);//显示异常
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
				url: httpurl+'fullteacherform/goEdit',
		    	data: {
                    FULLTEACHERFORM_ID:this.FULLTEACHERFORM_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.members=data.members;
						vm.index=Object.keys(data.members).length+1
                     }else if ("exception" == data.result){
                     	showException("幼儿园专职教师名册",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
					
                    var FULLDATA_BY=$("#FULLDATA_BY").text();
                    if(null!=FULLDATA_BY&&undefined!=FULLDATA_BY&&''!=FULLDATA_BY){
                        vm.pd.FULLDATA_BY=FULLDATA_BY;
                    }
                    var PHONE=$("#PHONE").text();
                    if(null!=PHONE&&undefined!=PHONE&&''!=PHONE){
                        vm.pd.PHONE=PHONE;
                    }
                    var DATE=$("#DATE").text();
                    if(null!=DATE&&undefined!=DATE&&''!=DATE){
                        vm.pd.DATE=DATE;
                    }
					// 
					var members=$(".member_num");
					vm.membersLs=[];
					$.each(members,function(i,member){
						var mem={};
						mem.ORDER=$(member).find(".ORDER").text();
						mem.NAME=$(member).find(".NAME").text();
						mem.SEX=$(member).find(".SEX").text();
						mem.BIRTHDAY=$(member).find(".BIRTHDAY").text();
						mem.ID_CARD=$(member).find(".ID_CARD").text();
						mem.HOUSEHOLD=$(member).find(".HOUSEHOLD").text();
						mem.HAS_TEACHER_CERTIFICATE=$(member).find(".HAS_TEACHER_CERTIFICATE").text();
						mem.TEACH_COURSE=$(member).find(".TEACH_COURSE").text();
						vm.membersLs.push(mem);
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