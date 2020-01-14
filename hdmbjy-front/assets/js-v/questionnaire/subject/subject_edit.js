var vm = new Vue({
	el: '#app',
	
	data:{
		SUBJECT_ID: '',	//主键ID
		pd: [],	//存放字段参数
		TYPE: '',//题目类型
		SORT: '',//编号
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	var type = this.getUrlKey('type');
        	if(null != FID){
        		this.msg = 'edit';
        		this.SUBJECT_ID = FID;
        		this.getData();
        		if(type == '01403'){
        			$("#typeDev").hide();
        		}else{
        			$("#typeDev").show();
        		}
        		
        	}
        	setTimeout(function(){
        		vm.getDict();
        		vm.getSort();
            },200);
        },
        
        chooseType: function (type){
        	if(type == "01403"){
        		$("#typeDev").hide();
        	}else{
        		$("#typeDev").show();
        	}
        	
        },
        
        //去保存
    	save: function (){
    		
			if(this.SORT == '' || this.SORT == undefined){
				$("#SORT").tips({
					side:3,
		            msg:'请输入序号',
		            bg:'#AE81FF',
		            time:2
		        });
				this.SORT = '';
				this.$refs.SORT.focus();
			return false;
			}
			if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				$("#TITLE").tips({
					side:3,
		            msg:'请输入题目',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITLE = '';
				this.$refs.TITLE.focus();
			return false;
			}
			if(this.TYPE == ''){
				$("#TYPE").tips({
					side:3,
		            msg:'请输入题目类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}
			if(this.TYPE != '01403'){
				if(this.pd.OPTIONA == '' || this.pd.OPTIONA == undefined){
					$("#OPTIONA").tips({
						side:3,
			            msg:'请输入选项A',
			            bg:'#AE81FF',
			            time:2
			        });
					this.pd.OPTIONA = '';
					this.$refs.OPTIONA.focus();
				return false;
				}
				if(this.pd.OPTIONB == '' || this.pd.OPTIONB == undefined){
					$("#OPTIONB").tips({
						side:3,
			            msg:'请输入选项B',
			            bg:'#AE81FF',
			            time:2
			        });
					this.pd.OPTIONB = '';
					this.$refs.OPTIONB.focus();
				return false;
				}
			}
			/*if(this.pd.OPTIONC == '' || this.pd.OPTIONC == undefined){
				$("#OPTIONC").tips({
					side:3,
		            msg:'请输入选项C',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.OPTIONC = '';
				this.$refs.OPTIONC.focus();
			return false;
			}
			if(this.pd.OPTIOND == '' || this.pd.OPTIOND == undefined){
				$("#OPTIOND").tips({
					side:3,
		            msg:'请输入选项D',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.OPTIOND = '';
				this.$refs.OPTIOND.focus();
			return false;
			}
			if(this.pd.OPTIONE == '' || this.pd.OPTIONE == undefined){
				$("#OPTIONE").tips({
					side:3,
		            msg:'请输入选项E',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.OPTIONE = '';
				this.$refs.OPTIONE.focus();
			return false;
			}
			if(this.pd.OPTIONF == '' || this.pd.OPTIONF == undefined){
				$("#OPTIONF").tips({
					side:3,
		            msg:'请输入选项F',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.OPTIONF = '';
				this.$refs.OPTIONF.focus();
			return false;
			}
			if(this.pd.OPTIONG == '' || this.pd.OPTIONG == undefined){
				$("#OPTIONG").tips({
					side:3,
		            msg:'请输入选项G',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.OPTIONG = '';
				this.$refs.OPTIONG.focus();
			return false;
			}
			if(this.pd.OPTIONH == '' || this.pd.OPTIONH == undefined){
				$("#OPTIONH").tips({
					side:3,
		            msg:'请输入选项H',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.OPTIONH = '';
				this.$refs.OPTIONH.focus();
			return false;
			}
			if(this.pd.BZ == '' || this.pd.BZ == undefined){
				$("#BZ").tips({
					side:3,
		            msg:'请输入备注',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.BZ = '';
				this.$refs.BZ.focus();
			return false;
			}
			 if(this.pd.CREATEUSER == '' || this.pd.CREATEUSER == undefined){
				$("#CREATEUSER").tips({
					side:3,
		            msg:'请输入创建人',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.CREATEUSER = '';
				this.$refs.CREATEUSER.focus();
			return false;
			} */
    		
    		$("#showform").hide();
    		$("#jiazai").show();
    		
    		if(this.TYPE == "01403"){
    			this.pd.OPTIONA = '';
    			this.pd.OPTIONB = '';
				this.pd.OPTIONC = '';
				this.pd.OPTIOND = '';
				this.pd.OPTIONE = '';
				this.pd.OPTIONF = '';
				this.pd.OPTIONG = '';
				this.pd.OPTIONH = '';
    		}
    		
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'subject/'+this.msg,
			    	data: {SUBJECT_ID:this.SUBJECT_ID,
				    SORT:this.SORT,
				    TITLE:this.pd.TITLE,
					TYPE:this.TYPE,
				    OPTIONA:this.pd.OPTIONA,
				    OPTIONB:this.pd.OPTIONB,
				    OPTIONC:this.pd.OPTIONC,
				    OPTIOND:this.pd.OPTIOND,
				    OPTIONE:this.pd.OPTIONE,
				    OPTIONF:this.pd.OPTIONF,
				    OPTIONG:this.pd.OPTIONG,
				    OPTIONH:this.pd.OPTIONH,
				    BZ:this.pd.BZ,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("问卷题库",data.exception);//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
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
				url: httpurl+'subject/goEdit',
		    	data: {SUBJECT_ID:this.SUBJECT_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.TYPE = data.pd.TYPE;
						vm.SORT = data.pd.SORT;
                     }else if ("exception" == data.result){
                     	showException("问卷题库",data.exception);	//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
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
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevelsByNameEn?tm='+new Date().getTime(),
			    	data: {NAME_EN:'Questionnaire bank'},
					dataType:'json',
					success: function(data){
						 $("#TYPE").append("<option value=''>请选择题目类型</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.TYPE == dvar.BIANMA){
							  	$("#TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
		},
		
		getSort: function (){
			$.ajax({
				xhrFields: {
                withCredentials: true
            	},
				type: "POST",
				url: httpurl+'subject/getSort?tm='+new Date().getTime(),
				dataType:'json',
				success: function(data){
					if("success" == data.result){
						vm.SORT = parseInt(data.pd.SORT);
						console.info(data.pd.TIME);
                     }else if ("exception" == data.result){
                     	showException("问卷题库",data.exception);	//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
					
				}
			});
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