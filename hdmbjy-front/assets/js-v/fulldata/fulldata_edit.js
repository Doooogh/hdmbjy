
var vm = new Vue({
	el: '#app',
	
	data:{
		FULLDATA_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		APPROVETYPE_ID:'',    //审批类型id
		TYPE:'',   //填报内容的类型    1 表单  2 附件
		TIER:'',   //节点层级 
		ISFORM:true,  //填报数据是否为表单  
		OPTIONAL:'',   //是否为选填  1 是  0  不是
		FTYPE:'',   //表单类型  1行政审批  2  年检审批
    },
	
	methods: {
		
        //初始执行
        init() {
			
        	var FID = this.getPAGE_NAMEKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
			var AID=this.getPAGE_NAMEKey('aId');
			var TIERNUM=this.getPAGE_NAMEKey('tier');
			var ATY=this.getPAGE_NAMEKey('aTy');
			if(null!=ATY&&undefined!=ATY&&''!=ATY){
				this.FTYPE=ATY;
			}
        	if(null != FID){
        		this.msg = 'edit';
        		this.FULLDATA_ID = FID;
        		this.getData();
        	}
			if(null!=AID&&undefined!=AID){
				this.APPROVETYPE_ID=AID;
			}
			if(null!=TIERNUM&&''!=TIERNUM&&undefined!=TIERNUM){
				this.TIER=TIERNUM;
			}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (){
    	
			
			if(this.TYPE == '' || this.TYPE == undefined){
				$("#TYPE").tips({
					side:3,
		            msg:'请选择填报表单类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}
			if(this.ISFORM){
				if(this.OPTIONAL == '' || this.OPTIONAL == undefined){
					$("#OPTIONAL").tips({
						side:3,
				        msg:'请选择是否为选填',
				        bg:'#AE81FF',
				        time:2
				    });
					this.OPTIONALOPTIONAL= '';
					this.$refs.OPTIONAL.focus();
				return false;
				}
			}
		
			if(this.pd.NAME == '' || this.pd.NAME == undefined){
				$("#NAME").tips({
					side:3,
		            msg:'请输入名字',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NAME = '';
				this.$refs.NAME.focus();
			return false;
			}
			if(this.pd.F_ORDER == '' || this.pd.F_ORDER == undefined){
				$("#F_ORDER").tips({
					side:3,
			        msg:'请输入排序',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.F_ORDER = '';
				this.$refs.F_ORDER.focus();
			return false;
			}
			if(this.pd.BEIZHU == '' || this.pd.BEIZHU == undefined){
				this.pd.BEIZHU = '';
			}else{
				var reg=new RegExp("\r\n","g");
				vm.pd.BEIZHU= vm.pd.BEIZHU.replace(reg,"\r\n");
			}
			if(this.ISFORM){
				if(this.pd.PAGE_NAME == '' || this.pd.PAGE_NAME == undefined){
					$("#PAGE_NAME").tips({
						side:3,
				        msg:'请输入PAGE_NAME位置',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.PAGE_NAME = '';
					this.$refs.PAGE_NAME.focus();
				return false;
				}
			}
	
    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'fulldata/'+this.msg,
			    	data: {
					FULLDATA_ID:this.FULLDATA_ID,
				    FULLDATA_ID:this.pd.FULLDATA_ID,
				    APPROVETYPE_ID:this.APPROVETYPE_ID,
				    TYPE:this.TYPE,
					FTYPE:this.FTYPE,
				    OPTIONAL:this.OPTIONAL,
					TIER:this.TIER+1,
				    NAME:this.pd.NAME,
				    PAGE_NAME:this.pd.PAGE_NAME,
					F_ORDER:this.pd.F_ORDER,
					BEIZHU:this.pd.BEIZHU,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("填报数据",data.exception);//显示异常
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
				url: httpurl+'fulldata/goEdit',
		    	data: {FULLDATA_ID:this.FULLDATA_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.TYPE=data.pd.TYPE;
						vm.APPROVETYPE_ID=data.pd.APPROVETYPE_ID;   //赋值给审批类型id
						vm.OPTIONAL=data.pd.OPTIONAL;
                     }else if ("exception" == data.result){
                     	showException("填报数据",data.exception);	//显示异常
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
		},
    	
    	//根据PAGE_NAME参数名称获取参数值
        getPAGE_NAMEKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }
        
	},
	watch:{
		TYPE:function(newVal,oldVal){
			if(newVal==1||newVal==''){
				vm.ISFORM=true;
			}else{
				vm.ISFORM=false;
			}
		}
	},
	
	mounted(){
        this.init();
    }
})
				