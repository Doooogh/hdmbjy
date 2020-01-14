
var vm = new Vue({
	el: '#app',
	data:{
        YEXMYCHECK_ID: '',	//主键ID
		pd: [],						//存放字段参数
        msg:'add',
		APPROVE_ID:''  ,//审批的id  ,
		APPROVE_TYPE:'',   //审批的类型
		FORM_ID:'',   //表单的id
		isPreview:false,   //是否是从审批预览页面查看预览
		marks:[], //评分集合
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
        		this.YEXMYCHECK_ID = FDID;
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
			if(this.msg=='add'){
				var myDate = new Date;
				this.pd.FULLDATA_DATE = myDate.getFullYear()+"年"+myDate.getMonth() +"月"+myDate.getDate()+"日"; //获取当前年
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
				if(this.pd.ONE_SCORE == '' || this.pd.ONE_SCORE == undefined){
				         $("#ONE_SCORE").tips({
				             side:3,
				             msg:'请输入依法办园得分',
				             bg:'#AE81FF',
				             time:2
				         });
				         this.pd.ONE_SCORE = '';
				         this.$refs.ONE_SCORE.focus();
				     return false;
				     }
				 if(this.pd.TWO_SCORE == '' || this.pd.TWO_SCORE == undefined){
				         $("#TWO_SCORE").tips({
				             side:3,
				             msg:'请输入财务管理得分',
				             bg:'#AE81FF',
				             time:2
				         });
				         this.pd.TWO_SCORE = '';
				         this.$refs.TWO_SCORE.focus();
				     return false;
				     }
				 if(this.pd.THREE_SCORE == '' || this.pd.THREE_SCORE == undefined){
				         $("#THREE_SCORE").tips({
				             side:3,
				             msg:'请输入行政管理与办园条件得分',
				             bg:'#AE81FF',
				             time:2
				         });
				         this.pd.THREE_SCORE = '';
				         this.$refs.THREE_SCORE.focus();
				     return false;
				     }
				 if(this.pd.FOUR_SCORE == '' || this.pd.FOUR_SCORE == undefined){
				         $("#FOUR_SCORE").tips({
				             side:3,
				             msg:'请输入教学管理得分',
				             bg:'#AE81FF',
				             time:2
				         });
				         this.pd.FOUR_SCORE = '';
				         this.$refs.FOUR_SCORE.focus();
				     return false;
				     }
				 if(this.pd.FIVE_SCORE == '' || this.pd.FIVE_SCORE == undefined){
				         $("#FIVE_SCORE").tips({
				             side:3,
				             msg:'请输入卫生保健得分',
				             bg:'#AE81FF',
				             time:2
				         });
				         this.pd.FIVE_SCORE = '';
				         this.$refs.FIVE_SCORE.focus();
				     return false;
				     }
				 if(this.pd.OPINION == '' || this.pd.OPINION == undefined){
				         $("#OPINION").tips({
				             side:3,
				             msg:'请输入法定代表人意见',
				             bg:'#AE81FF',
				             time:2
				         });
				         this.pd.OPINION = '';
				         this.$refs.OPINION.focus();
				     return false;
				     }
				 if(this.pd.FULLDATA_DATE == '' || this.pd.FULLDATA_DATE == undefined){
				         $("#FULLDATA_DATE").tips({
				             side:3,
				             msg:'请输入填表日期',
				             bg:'#AE81FF',
				             time:2
				         });
				         this.pd.FULLDATA_DATE = '';
				         this.$refs.FULLDATA_DATE.focus();
				     return false;
				     }
			}
				
			
				
				 //发送 post 请求提交保存
				 $.ajax({
				     	xhrFields: {
				             withCredentials: true
				         },
							type: "POST",
							url: httpurl+'yexmycheck/'+this.msg,
							data: {
				            YEXMYCHECK_ID:this.YEXMYCHECK_ID,
							APPROVE_ID:this.APPROVE_ID,   //审批id
							FORM_TYPE:this.APPROVE_TYPE,   //审批类型
							FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
							APPROVEFORM_ID:this.APPROVEFORM_ID,
							SUB_STATUS:status,  	 	//暂存为草稿
				             YEXMYCHECK_ID:this.pd.YEXMYCHECK_ID,
				
				             ONE_SCORE:this.pd.ONE_SCORE,
				
				             TWO_SCORE:this.pd.TWO_SCORE,
				
				             THREE_SCORE:this.pd.THREE_SCORE,
				
				             FOUR_SCORE:this.pd.FOUR_SCORE,
				
				             FIVE_SCORE:this.pd.FIVE_SCORE,
				
				             OPINION:this.pd.OPINION,
				
				             FULLDATA_DATE:this.pd.FULLDATA_DATE,
				
				             CREATE_BY:this.pd.CREATE_BY,
										
										marks:JSON.stringify(this.marks),
				
							    	    tm:new Date().getTime()
				         },
									dataType:"json",
									success: function(data){
				             if("success" == data.result){
				                 vm.YEXMYCHECK_ID=data.RES_ID;
								 vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
				             	swal("", "保存成功", "success");
				             	setTimeout(function(){
				             		top.Dialog.close();//关闭弹窗
				                 },1000);
				             }else if ("exception" == data.result){
				             	showException("海淀区民办幼儿园年检自查表",data.exception);//显示异常
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
				url: httpurl+'yexmycheck/goEdit',
		    	data: {
                    YEXMYCHECK_ID:this.YEXMYCHECK_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.marks=data.marks;
						var fnames=$(".fname");
						$.each(fnames,function(i,fname){
							// $(fname).find(".ftitle").text(vm.marks[i].NAME);
							$(fname).find(".fvalue").text(vm.marks[i].SCORE);
						});
                     }else if ("exception" == data.result){
                     	showException("海淀区民办幼儿园年检自查表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
                  
                    var ONE_SCORE=$("#ONE_SCORE").text();
                    if(null!=ONE_SCORE&&undefined!=ONE_SCORE&&''!=ONE_SCORE){
                        vm.pd.ONE_SCORE=ONE_SCORE;
                    }
                    var TWO_SCORE=$("#TWO_SCORE").text();
                    if(null!=TWO_SCORE&&undefined!=TWO_SCORE&&''!=TWO_SCORE){
                        vm.pd.TWO_SCORE=TWO_SCORE;
                    }
                    var THREE_SCORE=$("#THREE_SCORE").text();
                    if(null!=THREE_SCORE&&undefined!=THREE_SCORE&&''!=THREE_SCORE){
                        vm.pd.THREE_SCORE=THREE_SCORE;
                    }
                    var FOUR_SCORE=$("#FOUR_SCORE").text();
                    if(null!=FOUR_SCORE&&undefined!=FOUR_SCORE&&''!=FOUR_SCORE){
                        vm.pd.FOUR_SCORE=FOUR_SCORE;
                    }
                    var FIVE_SCORE=$("#FIVE_SCORE").text();
                    if(null!=FIVE_SCORE&&undefined!=FIVE_SCORE&&''!=FIVE_SCORE){
                        vm.pd.FIVE_SCORE=FIVE_SCORE;
                    }
                    var OPINION=$("#OPINION").text();
                    if(null!=OPINION&&undefined!=OPINION&&''!=OPINION){
                        vm.pd.OPINION=OPINION;
                    }
                    var FULLDATA_DATE=$("#FULLDATA_DATE").text();
                    if(null!=FULLDATA_DATE&&undefined!=FULLDATA_DATE&&''!=FULLDATA_DATE){
                        vm.pd.FULLDATA_DATE=FULLDATA_DATE;
                    }
                    var CREATE_BY=$("#CREATE_BY").text();
                    if(null!=CREATE_BY&&undefined!=CREATE_BY&&''!=CREATE_BY){
                        vm.pd.CREATE_BY=CREATE_BY;
                    }
					
					
					var fnames=$("table .fname");
					vm.marks=[];
					$("table .fname").each(function(i){
						var mark={};
						mark.NAME=$(this).find(".ftitle").text();
						mark.SCORE=$(this).find(".fvalue").text();
						mark.ONE_ORDER=i+1;
						vm.marks.push(mark);
						 
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