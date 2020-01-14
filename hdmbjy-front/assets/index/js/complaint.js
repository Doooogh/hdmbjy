
var vm = new Vue({
	el: '#app',
	
	data:{
		COMPLAINT_ID: '',	//主键ID
		pd: [],						//存放字段参数
		listCategory: [],						//存放字段参数
		TYPE: '',
		typeTitle: '',
		nocountisnot: '',
		titleName: '',
		typeBtn: '1',
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.typeTitle = 1;
        	this.getList();
        	setTimeout(function(){
        		//vm.getDict();
            },200);
        },
        getList: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'complaint/listAll',
        		data: {tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.listCategory = data.listCategory;
        		 }else if ("exception" == data.result){
                 	showException("前台详细",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../login.html";
                }, 2000);
            });
        },
        //去保存
    	save: function (){
    		
    		var JB_USER = $("#JB_USER").val(); 
    		var JB_TEL = $("#JB_TEL").val(); 
    		var UNIT = $("#UNIT").val(); 
    		var TYPE = $("#TYPE").val(); 
    		var REASON= $("#REASON").val(); 
    		
    		if(JB_USER == '' || JB_USER == undefined){
				$("#JB_USER").tips({
					side:3,
		            msg:'请输入举报人',
		            bg:'#AE81FF',
		            time:2
		        });
				this.JB_USER = '';
			return false;
			}
    		
    		if(JB_TEL == '' || JB_TEL == undefined){
				$("#JB_TEL").tips({
					side:3,
		            msg:'请输入举报人电话',
		            bg:'#AE81FF',
		            time:2
		        });
				this.JB_TEL = '';
			return false;
			}else if(!(/^1[3456789]\d{9}$/.test(JB_TEL))){
				$("#JB_TEL").tips({
					side:3,
		            msg:'手机号码有误，请重填',
		            bg:'#AE81FF',
		            time:2
		        });
			  this.JB_TEL = '';
			  return false;
			}
    		
    		if(UNIT == '' || UNIT == undefined){
				$("#UNIT").tips({
					side:3,
		            msg:'请输入被举报单位',
		            bg:'#AE81FF',
		            time:2
		        });
				this.UNIT = '';
			return false;
			}
    		if(REASON == '' || REASON == undefined){
				$("#REASON").tips({
					side:3,
		            msg:'请输入举报原由',
		            bg:'#AE81FF',
		            time:2
		        });
				this.REASON = '';
			return false;
			}
            //发送 post 请求提交保存
    		if(this.nocountisnot==''||this.nocountisnot == undefined){
    			$.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'complaint/add',
			    	data: {
				    JB_USER:JB_USER,
				    JB_TEL:JB_TEL,
					TYPE:TYPE,
				    UNIT:UNIT,
				    REASON:REASON,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	//swal("", "保存成功", "success");
                        	$("#n1").css("display","none");
                        	$("#n2").css("display","block");
                        	$("#NO").val(data.NOCOUNT); 
                        	vm.nocountisnot = data.id
                        	$("#t1").removeClass("on");
                        	$("#t2").addClass("on");
                        	vm.typeBtn = "2";
                        	console.info(data);
                        }else if ("exception" == data.result){
                        	showException("投诉管理","404");//显示异常
                        }
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                   setTimeout(function () {
                   	window.location.href = "../login.html";
                   }, 1000);
                });
    		}else{
    			
    		}
    		
            
    	},
    	
    	find: function (count){
    		var id = $("#NO").val(); 
    		
    		$.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'complaint/findById',
		    	data: {
		    	COMPLAINT_ID:id,
		    	tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                    if("success" == data.result){
                    	if(data.pd.PROCESS !=3){
                    		$("#ts").html("----------- 正在处理中 请稍后查询 -----------");
                    	}else{
                    		$("#n2").css("display","none");
                        	$("#n3").css("display","block");
                        	$("#t2").removeClass("on");
                        	$("#t3").addClass("on");
                        	$("#ptext").html(data.pd.REPLY);
                        	$("#time").html("反馈时间:"+data.pd.CL_TIME);
                        	$("#nextType").addClass("nextStop");
                    	}
                    	
                    	
                    }else if ("exception" == data.result){
                    	showException("投诉管理","404");//显示异常
                    }
                }
			}).done().fail(function(){
               swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               setTimeout(function () {
               	window.location.href = "../login.html";
               }, 1000);
            });
    	},
    	
    	title: function (count){
    		console.info(count);
    		
    		if (count == 1) {
    			this.typeBtn = "1";
    			$("#n1").css("display","none");
        		$("#n2").css("display","none");
    			$("#n3").css("display","none");
    			$("#n1").css("display","block");
			}else if(count== 2){
				this.typeBtn = "2";
				$("#n1").css("display","none");
	    		$("#n2").css("display","none");
				$("#n3").css("display","none");
				$("#n2").css("display","block");
			}else if(count == 3){
				if(this.typeTitle == 2){
					$("#n1").css("display","none");
		    		$("#n2").css("display","none");
					$("#n3").css("display","none");
					$("#n2").css("display","block");
				}
				if(this.typeTitle == 1){
					$("#n1").css("display","none");
	        		$("#n2").css("display","none");
	    			$("#n3").css("display","none");
	    			$("#n1").css("display","block");
				}
				//$("#n3").css("display","block");
			}
    		this.typeTitle = count;
    	},
    	//获取数据字典数据
		getDict: function (){
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
			    	data: {DICTIONARIES_ID:'88c4a095e86041fd928c2a95789b1dc5'},
					dataType:'json',
					success: function(data){
						 $("#TYPE").append("<option value=''>请选择举报类型</option>");
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