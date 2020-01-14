
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		KEYWORDS1:'',	//检索条件,关键词
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		add:false,		//增
		del:false,		//删
		edit:false,		//改
		toExcel:false,	//导出到excel权限
		loading:false,	//加载状态
		isUser:true,  //是否为用户
		EXAMINATION_ID:'',
		TYPES:[]
    },
    
	methods: {
		
        //初始执行
        init() {
        	//复选框控制全选,全不选 
    		$('#zcheckbox').click(function(){
	    		 if($(this).is(':checked')){
	    			 $("input[name='ids']").click();
	    		 }else{
	    			 $("input[name='ids']").attr("checked", false);
	    		 }
    		});
			var EID = this.getUrlKey('EID');	
			if(null != EID){
				this.EXAMINATION_ID = EID;
				// this.KEYWORDS=EID;
			}
    		this.getList();
			// this.KEYWORDS='';
			
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'bookinguser/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {
					KEYWORDS:this.KEYWORDS,
					KEYWORDS1:this.KEYWORDS1,
					tm:new Date().getTime()
					},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
					  vm.getDict();
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
					 vm.isUser=data.isUser;
        			 $("input[name='ids']").attr("checked", false);
					
        		 }else if ("exception" == data.result){
                 	showException("预约人员",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//新增
    	goAdd: function (){
			
			$.ajax({
			    	xhrFields: {
			            withCredentials: true
			        },
					type: "POST",
					url: httpurl+'bookinguser/check',
			    	data: {
			    	tm:new Date().getTime()
					},
					dataType:"json",
					success: function(data){
			            if("success" == data.result){
							if(data.isUser){
								swal("", "只有机构责任人可以新增!", "error");
									return false;
							}else if(data.status==0){
								swal("", "当前没有流程需要线下预约!", "error");
									return false;
							}else if(data.status==1){
								var diag = new top.Dialog();
								diag.Drag=true;
								diag.Title ="新增";
								diag.URL = '../../bookinguser/bookinguser/bookinguser_edit.html';
								diag.Width = 1000;
								diag.Height = 800;
								diag.Modal = true;				//有无遮罩窗口
								diag. ShowMaxButton = true;	//最大化按钮
								diag.ShowMinButton = true;		//最小化按钮 
								diag.CancelEvent = function(){ //关闭事件
									 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
									 if(varSon != null && varSon.style.display == 'none'){
										 vm.getList();
									}
									diag.close();
								};
								diag.show();
							}
			            }else if ("exception" == data.result){
			            	showException("线下预约",data.exception);//显示异常
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
    	
		
		
		/**
		 * 年审下线审核 通过
		 */
		offlineApprove:function(PROC_INST_ID,BOOKINGUSER_ID,BOOKING_TYPE){
			swal({
				title: '',
			    text: "确定要通过该申请吗?",
			    icon: "warning",
			    buttons: true,
			    dangerMode: true,
			}).then((willDelete) => {
			    if (willDelete) {
			    	this.loading = true;
					$.ajax({
						xhrFields: {
					        withCredentials: true
					    },
						type: "POST",
						url: httpurl+'bookinguser/offlineApprove',
						data: {
							BOOKINGUSER_ID:BOOKINGUSER_ID,
							BOOKING_TYPE:BOOKING_TYPE,
							tm:new Date().getTime()
							},
						dataType:"json",
						success: function(data){
					         if("success" == data.result){
								  swal("","线下审批成功", "success");
								   vm.getList();
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
			    }
			});
			
		},
		
		/**
		 * 线下预约拒绝
		 * @param {Object} BOOKINGUSER_ID
		 */
		offlineRefuse:function(PROC_INST_ID,BOOKINGUSER_ID,BOOKING_TYPE){
			swal({
				title: '',
			    text: "确定要拒绝该申请预约吗?",
			    icon: "warning",
			    buttons: true,
			    dangerMode: true,
			}).then((willDelete) => {
			    if (willDelete) {
			    	this.loading = true;
					$.ajax({
						xhrFields: {
					        withCredentials: true
					    },
						type: "POST",
						url: httpurl+'bookinguser/offlineRefuse',
						data: {
							PROC_INST_ID:PROC_INST_ID,  // 流程实例id
							BOOKINGUSER_ID:BOOKINGUSER_ID,
							BOOKING_TYPE:BOOKING_TYPE,
							tm:new Date().getTime()
							},
						dataType:"json",
						success: function(data){
					         if("success" == data.result){
								  swal("线下预约拒绝成功", "已经自动为该用户发送通知!", "success");
								   vm.getList();
					         }else if ("exception" == data.result){
					         	showException("线下预约审批",data.exception);	//显示异常
					         	$("#showform").show();
					     		$("#jiazai").hide();
					         }
					      }
					}).done().fail(function(){
					      swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
					      $("#showform").show();
						  $("#jiazai").hide();
					   });
			    }
			});
			
		},
    	//修改
    	goEdit: function(id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="编辑";
    		 diag.URL = '../../bookinguser/bookinguser/bookinguser_edit.html?FID='+id;
    		 diag.Width = 1000;
    		 diag.Height = 800;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList();
    			}
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//删除
    	goDel: function (id){
    		swal({
    			title: '',
                text: "确定要删除吗?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	this.loading = true;
                	$.ajax({
                		xhrFields: {
                            withCredentials: true
                        },
            			type: "POST",
            			url: httpurl+'bookinguser/delete',
            	    	data: {BOOKINGUSER_ID:id,tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				 if("success" == data.result){
            					 swal("删除成功", "已经从列表中删除!", "success");
            				 }
            				 vm.getList();
            			}
            		});
                }
            });
    	},
    	
    	//批量操作
    	makeAll: function (msg){
    		swal({
                title: '',
                text: msg,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
    	        	var str = '';
    				for(var i=0;i < document.getElementsByName('ids').length;i++){
    					  if(document.getElementsByName('ids')[i].checked){
    					  	if(str=='') str += document.getElementsByName('ids')[i].value;
    					  	else str += ',' + document.getElementsByName('ids')[i].value;
    					  }
    				}
    				if(str==''){
    					$("#cts").tips({
    						side:2,
    			            msg:'点这里全选',
    			            bg:'#AE81FF',
    			            time:3
    			        });
    	                swal("", "您没有选择任何内容!", "warning");
    					return;
    				}else{
    					if(msg == '确定要删除选中的数据吗?'){
    						this.loading = true;
    						$.ajax({
    							xhrFields: {
    	                            withCredentials: true
    	                        },
    							type: "POST",
    							url: httpurl+'bookinguser/deleteAll?tm='+new Date().getTime(),
    					    	data: {DATA_IDS:str},
    							dataType:'json',
    							success: function(data){
    								if("success" == data.result){
    									swal("删除成功", "已经从列表中删除!", "success");
    		        				 }
    								vm.getList();
    							}
    						});
    					}
    				}
                }
            });
    	},
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'bookinguser:add,bookinguser:del,bookinguser:edit,toExcel';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'head/hasButton',
        		data: {keys:keys,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.add = data.bookinguserfhadminadd;		//新增权限
        			vm.del = data.bookinguserfhadmindel;		//删除权限
        			vm.edit = data.bookinguserfhadminedit;	//修改权限
        			vm.toExcel = data.toExcel;						//导出到excel权限
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);		//显示异常
                 }
        		}
        	})
        },
        
        //导出excel
		goExcel: function (){
			swal({
               	title: '',
                text: '确定要导出到excel吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	window.location.href = httpurl+'bookinguser/excel';            	
                }
            });
		},
        
        //-----分页必用----start
        nextPage: function (page){
        	this.currentPage = page;
        	this.getList();
        },
        changeCount: function (value){
        	this.showCount = value;
        	this.getList();
        },
        toTZ: function (){
        	var toPaggeVlue = document.getElementById("toGoPage").value;
        	if(toPaggeVlue == ''){document.getElementById("toGoPage").value=1;return;}
        	if(isNaN(Number(toPaggeVlue))){document.getElementById("toGoPage").value=1;return;}
        	this.nextPage(toPaggeVlue);
        },
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
					vm.TYPES=data.list;
				},
				error:function(){
				alert("错误");	
				}
			});
		},
		//根据url参数名称获取参数值
		getUrlKey: function (name) {
		    return decodeURIComponent(
		        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
		}
       //-----分页必用----end
		
	},
	
	mounted(){
        this.init();
    }
})