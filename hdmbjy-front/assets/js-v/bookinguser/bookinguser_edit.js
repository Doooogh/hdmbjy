
var vm = new Vue({
	el: '#app',
	
	data:{
		BOOKINGUSER_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		user:[],  //用户信息
		BOOKING_ID:'',   //预约id
		BOOKING:{
			TITLE:"请点击后选择需要的预约"
		},
		showInfo: false,
		BOOKING_TYPE:'',
		FLOW_ID:'',  //流程id
		APP_ID:'',//审批id
		BOOKING_TYPE_NAME:'' ,  //审批类型
    },
	
	methods: {
		
        //初始执行
        init() {
			// this.getUserInfo();
			var FID = this.getUrlKey('FID');	//流程实例id
			
			var EID=this.getUrlKey('EID');   //流程ID
			if(null!=FID&&undefined!=FID&&''!=FID){
				this.FLOW_ID=FID;
			}
			if(null!=EID&&undefined!=EID&&''!=EID){
				this.APP_ID=EID;
			}
			this.getInfoByUser();
			
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
		
		
        //去保存
    	save: function (){
			if(vm.BOOKING_ID == '' ||vm.BOOKING_ID== undefined){
				$("#BOOKING_ID").tips({
					side:3,
			        msg:'请选择需要预约项',
			        bg:'#AE81FF',
			        time:2
			    });
				vm.BOOKING_ID= '';
				this.$refs.BOOKING_ID.focus();
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
					url: httpurl+'bookinguser/'+this.msg,
			    	data: {
						BOOKING_ID:vm.BOOKING_ID,
						APPROVE_ID:vm.APP_ID,
						USER_ID:vm.user.USER_ID,
						PROC_INST_ID:vm.FLOW_ID,
						TYPE:vm.BOOKING_TYPE,
						tm:new Date().getTime()
					},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "预约成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
								parent.Dialog.close();
                            },1000);
                        }else if("failed" == data.result){
							swal("", "抱歉!您来晚一步，名额已抢光!", "error");
							$("#showform").show();
							$("#jiazai").hide();
						}
						else if ("exception" == data.result){
                        	showException("预约人员","服务器错误!");//显示异常
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
		
		getInfoByUser:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'bookinguser/getInfoByUser',
				data: {
					APP_ID:this.APP_ID,   //流程id
					FLOW_ID:this.FLOW_ID,  //流程实例id
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
			         if("success" == data.result){
			         	vm.user=data.user;					//参数map
						vm.BOOKING_TYPE=data.BOOKING_TYPE;
						vm.BOOKING_TYPE_NAME=data.BOOKING_TYPE_NAME;
			         }else if ("exception" == data.result){
			         	showException("预约人员",data.exception);	//显示异常
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
		
		getUserInfo:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'bookinguser/getUserInfo',
				data: {
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
			         if("success" == data.result){
			         	vm.user=data.pd;					//参数map
			         }else if ("exception" == data.result){
			         	showException("预约人员",data.exception);	//显示异常
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
		getBookings:function(){
				 
				var diag = new top.Dialog();
				diag.Drag=true;
				diag.Title ="选择预约项";
				diag.URL = '../../booking/booking/booking_choose.html?TID='+vm.BOOKING_TYPE;
				diag.Width = 1000;
				diag.Height = 700;
				diag.Modal = true;				//有无遮罩窗口
				diag. ShowMaxButton = true;	//最大化按钮
				diag.ShowMinButton = true;		//最小化按钮 
				diag.CancelEvent = function(){ //关闭事件
								 var choose_bId=diag.innerFrame.contentWindow.document.getElementById('choose_booking_id').value;
								 if(null!=choose_bId&&''!=choose_bId&&undefined!=choose_bId){
									 vm.showInfo=true;
									 var choose_bTitle=diag.innerFrame.contentWindow.document.getElementById('choose_booking_title').value;
									 /* var choose_start_time=diag.innerFrame.contentWindow.document.getElementById('choose_start_time').value;
									 var choose_end_time=diag.innerFrame.contentWindow.document.getElementById('choose_end_time').value; */
									 var choose_range=diag.innerFrame.contentWindow.document.getElementById('choose_range').value;
									 var choose_all_num=diag.innerFrame.contentWindow.document.getElementById('choose_all_num').value;
									 var choose_remain_num=diag.innerFrame.contentWindow.document.getElementById('choose_remain_num').value;
									 vm.BOOKING.BOOKING_ID=choose_bId;
									 vm.BOOKING_ID=choose_bId;
									 vm.BOOKING.TITLE=choose_bTitle;
									 /* vm.BOOKING.START_TIME=choose_start_time;
									 vm.BOOKING.END_TIME=choose_end_time; */
									 vm.BOOKING.CHOOSE_RANGE="";
									 $.each( choose_range.split(","),function(i,range){
										vm.BOOKING.CHOOSE_RANGE+=(range+"     ") 
									 });
									 // vm.BOOKING.CHOOSE_RANGE=choose_range;
									 vm.BOOKING.ALL_NUM=choose_all_num;
									 vm.BOOKING.REMAIN_NUM=choose_remain_num;
									 // vm.confirmInfo();
									 // vm.setInfo();
									 diag.close();
								 }else{
									diag.close(); 
								 }
				};
						diag.show(); 
					
		
			
		},
		/**
		 * 检查用户在该类型预约上是否可以预约  并且 判断用户不能再一个类型上同时预约两次
		 */
		checkUser:function(){
			
			if(vm.BOOKING_TYPE!=''&&null!=vm.BOOKING_TYPE&&undefined!=vm.BOOKING_TYPE){
				$.ajax({
					xhrFields: {
				        withCredentials: true
				    },
					type: "POST",
					url: httpurl+'bookinguser/checkUser',
					data: {
						BOOKING_TYPE:vm.BOOKING_TYPE,
						tm:new Date().getTime()
						},
					dataType:"json",
					success: function(data){
				         if("success" == data.result){
							 if("1"==data.code){
								  swal("", "请先完成当前年度审核线下预约!", "warning");
								  vm.user=[];
							 }else if("2"==data.code){
								  swal("", "请先完成当前行政审核线下预约!", "warning");	
								  vm.user=[];
							 }else if("3"==data.code){
								 swal("", "没有需要预约的年审审核!", "warning");
								 vm.user=[];
								 vm.BOOKING_TYPE='';
							 }else if("4"==data.code){
								 swal("", "没有需要预约的行政审核!", "warning");
								 vm.user=[];
								 vm.BOOKING_TYPE='';
							 }else if("0"==data.code){   //表示成功
								vm.user = data.pd;							//参数map
							 }
				         }else if ("exception" == data.result){
							 vm.user=[];
							 vm.BOOKING_TYPE='';
				         	showException("预约人员",data.exception);	//显示异常
				         	$("#showform").show();
				     		$("#jiazai").hide();
				         }
				      }
				}).done().fail(function(){
				      swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
				      $("#showform").show();
					  $("#jiazai").hide();
				   });
			}else{
					 swal("", "请选择预约类型", "warning");
					 vm.user = [];
			}
			
			
		},
		
		confirmInfo:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'examination/confirmInfo',
				data: {
					BOOKING_ID:vm.BOOKING_ID,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
			         if("success" == data.result){
			         	vm.user = data.info;							//参数map
			         }else if ("exception" == data.result){
			         	showException("预约人员",data.exception);	//显示异常
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
				url: httpurl+'bookinguser/goEdit',
		    	data: {BOOKINGUSER_ID:this.BOOKINGUSER_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						$("#BOOKING_TIME").val(data.pd.BOOKING_TIME);
                     }else if ("exception" == data.result){
                     	showException("预约人员",data.exception);	//显示异常
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
    			url: httpurl+'dictionaries/getLevelsByNameEn',
    			data: {NAME_EN:'BOOKING_TYPE',tm:new Date().getTime()},//类型
    			dataType:'json',
    			success: function(data){
    				$("#BOOKING_TYPE").html('<option value="">预约类型</option>');
    				 $.each(data.list, function(i, dvar){
    					 if(dvar.BIANMA==vm.BOOKING_TYPE){
    						  $("#BOOKING_TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
    					 }else{
    					 $("#BOOKING_TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
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
				