
var vm = new Vue({
	el: '#app',
	
	data:{
		APPROVETYPE_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		PARENT_ID:'',
		pds:[],
		TIER:'',   //节点层级 
		APP_TYPE:'',  //审批类型的总类型  1 行政审批  2 年检审批
		RECORD_TYPE:'', //存储档案类型
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.APPROVETYPE_ID = this.getUrlKey('aId');  //id添加时表示的是父id  在编辑的时候表示的是本id
        	var msg = this.getUrlKey('msg');
			var TIERNUM=this.getUrlKey('tier');
        	var PID=this.getUrlKey("pId");
			var ATY=this.getUrlKey("aTy");
        	if(null!=PID&&undefined!=PID){
        		this.PARENT_ID=PID;
        	}
			if(null!=TIERNUM&&''!=TIERNUM&&undefined!=TIERNUM){
				this.TIER=TIERNUM;
			}
			if(null!=ATY&&''!=ATY&&undefined!=ATY){
				this.APP_TYPE=ATY;
			}
        	if(null!=this.APPROVETYPE_ID&&""!=this.APPROVETYPE_ID&&msg=='edit'){
        	    this.msg = msg;
        	    this.getData();//修改获取数据
        	}else if(null!=this.APPROVETYPE_ID&&""!=this.APPROVETYPE_ID&&msg=='add'){
        	    this.getGoAdd();//新增获取数据
        	}
			
        	setTimeout(function(){
        		vm.getDict();
        	},200);
        					
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
					url: httpurl+'approvetype/'+this.msg,
			    	data: {
					APPROVETYPE_ID:this.APPROVETYPE_ID,
				    PARENT_ID:this.PARENT_ID,
				    NAME_EN:this.pd.NAME_EN,
					TIER:this.TIER,
				    NAME:this.pd.NAME,
					TYPE:this.APP_TYPE,
					RECORD_TYPE:this.RECORD_TYPE,
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
				url: httpurl+'approvetype/goEdit',
		    	data: {APPROVETYPE_ID:this.APPROVETYPE_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.PARENT_ID = data.pd.PARENT_ID ;
                     	vm.pds = data.pds;  //父级信息
                     	vm.pd = data.pd;    //当前修改 信息									//参数map
						vm.RECORD_TYPE=data.pd.RECORD_TYPE;						 
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
    	        url: httpurl+'approvetype/toAdd',
    	        data: {
    	            APPROVETYPE_ID:this.APPROVETYPE_ID,
    	            tm:new Date().getTime()
    	        },
    	        dataType:"json",
    	        success: function(data){
    	            if("success" == data.result){
    	                vm.pds = data.pds;
    	                vm.PARENT_ID = vm.APPROVETYPE_ID;
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
    	    window.location.href="approvetype_list.html?aId="+this.PARENT_ID+"&FMSG="+FMSG;
    	},
    	//获取数据字典数据
		getDict: function (){
			
			//学区类型
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'RECORD_TYPES',tm:new Date().getTime()},//类型
				dataType:'json',
				success: function(data){
					$("#RECORD_TYPE").html('<option value="">请选择档案存储类型</option>');
					 $.each(data.list, function(i, dvar){
						 if(dvar.BIANMA==vm.RECORD_TYPE){  
							  $("#RECORD_TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
						 }else{
						 $("#RECORD_TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
						 }
						/*if(dvar.DICTIONARIES_ID==vm.ORGANIZATION_ID&&vm.msg=='add'){
							vm.DISTRICT=vm.ORGANIZATION_ID;
							vm.DISTRICT_NAME=dvar.NAME;
						}else if(vm.msg=='edit'&&dvar.DICTIONARIES_ID==vm.DISTRICT){
							vm.DISTRICT_NAME=dvar.NAME;
						}*/
					 });
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