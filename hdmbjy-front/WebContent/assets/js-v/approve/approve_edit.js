
var vm = new Vue({
	el: '#app',
	
	data:{
		APPROVE_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		PARENT_ID:'',
		pds:[],
		TIER:'',   //节点层级 
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.APPROVE_ID = this.getUrlKey('aId');  //id添加时表示的是父id  在编辑的时候表示的是本id
        	var msg = this.getUrlKey('msg');
			var TIERNUM=this.getUrlKey('tier');
        	var PID=this.getUrlKey("pId");
        	if(null!=PID&&undefined!=PID){
        		this.PARENT_ID=PID;
        	}
			if(null!=TIERNUM&&''!=TIERNUM&&undefined!=TIERNUM){
				this.TIER=TIERNUM;
			}
			 
        	if(null!=this.APPROVE_ID&&""!=this.APPROVE_ID&&msg=='edit'){
        	    this.msg = msg;
        	    this.getData();//修改获取数据
        	}else if(null!=this.APPROVE_ID&&""!=this.APPROVE_ID&&msg=='add'){
        	    this.getGoAdd();//新增获取数据
        	}
        	
        	/* setTimeout(function(){
        		vm.getDict();
        	},300); */
        					
        },
        
        //去保存
    	save: function (){
    	
			if(this.pd.NAME_EN == '' || this.pd.NAME_EN == undefined){
				$("#NAME_EN").tips({
					side:3,
		            msg:'请输入英文名',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NAME_EN = '';
				this.$refs.NAME_EN.focus();
			return false;
			}
			if(this.pd.NAME == '' || this.pd.NAME == undefined){
				$("#NAME").tips({
					side:3,
		            msg:'请输入类型名',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NAME = '';
				this.$refs.NAME.focus();
			return false;
			}
    		
    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'approve/'+this.msg,
			    	data: {
					APPROVE_ID:this.APPROVE_ID,
				    PARENT_ID:this.PARENT_ID,
				    NAME_EN:this.pd.NAME_EN,
					TIER:this.TIER,
				    NAME:this.pd.NAME,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                      if("success" == data.result){
                      	swal("", "保存成功", "success");
                      	setTimeout(function(){
                      	    vm.goback(vm.PARENT_ID,'ok');
                      	},1000);
                      }else if ("exception" == data.result){
                      	showException("审批类型",data.exception);//显示异常
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
				url: httpurl+'approve/goEdit',
		    	data: {APPROVE_ID:this.APPROVE_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
						  
                     	vm.PARENT_ID = data.pd.PARENT_ID ;
                     	vm.pds = data.pds;  //父级信息
                     	vm.pd = data.pd;    //当前修改 信息									//参数map
                     }else if ("exception" == data.result){
                     	showException("审批类型",data.exception);	//显示异常
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
    	//根据主键ID获取数据(新增时)
    	getGoAdd: function(){
    	    //发送 post 请求
    	    $.ajax({
    	        xhrFields: {
    	            withCredentials: true
    	        },
    	        type: "POST",
    	        url: httpurl+'approve/toAdd',
    	        data: {
    	            APPROVE_ID:this.APPROVE_ID,
    	            tm:new Date().getTime()
    	        },
    	        dataType:"json",
    	        success: function(data){
    	            if("success" == data.result){
    	                vm.pds = data.pds;
    	                vm.PARENT_ID = vm.APPROVE_ID;
    					 
    	            }else if ("exception" == data.result){
    	                showException("新增审批类型",data.exception);	//显示异常
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
    	//跳转
    	goback: function (id,FMSG){
    	    window.location.href="approve_list.html?aId="+this.PARENT_ID+"&FMSG="+FMSG;
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