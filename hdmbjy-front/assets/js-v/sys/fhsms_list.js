
var httpurl = httpurlSystem;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		pd: [],			//map
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		fhSms:false,
		loading:false	//加载状态
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
    		this.pd.STATUS = 2;
    		this.pd.TYPE = 1;
    		this.getList();
        },
        
        getListByType: function(TYPE){
        	this.pd.TYPE = TYPE;
        	this.getList();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	this.pd.STRARTTIME = $("#STRARTTIME").val();
           	this.pd.ENDTIME = $("#ENDTIME").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'fhsms/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.pd.KEYWORDS,STRARTTIME:this.pd.STRARTTIME,ENDTIME:this.pd.ENDTIME,STATUS:this.pd.STATUS,TYPE:this.pd.TYPE,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.pd = data.pd;
        			 vm.hasButton();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("站内信",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
		//发站内信
		sendFhsms: function (USERNAME){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="站内信";
			 diag.URL = '../fhsms/send_fhsms.html?USERNAME='+USERNAME;
			 diag.Width = 700;
			 diag.Height = 619;
			 diag.Modal = false;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
				vm.getList();
				diag.close();
			 };
			 diag.show();
		},
		
		//删除
		goDel: function (ztid,STATUS,type,Id,SANME_ID){
			swal({
            	title: '',
                text: "确定要删除 吗?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	this.loading = true;
	            	if(type == "1" && STATUS == '2' && $("#"+ztid).html() == '<span class="badge badge-warning">未读</span> <!---->'){
						top.vm.readFhsms();//读取站内信时减少未读总数  <!-- readFhsms()函数在 assets\js-v\index.js中 -->
					}
	            	$.ajax({
	            		xhrFields: {
                            withCredentials: true
                        },
	        			type: "POST",
	        			url: httpurl+'fhsms/delete',
	        	    	data: {FHSMS_ID:Id,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
	        					 swal("删除成功", "已经从列表中删除", "success");
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
	            	var username = '';
	    			for(var i=0;i < document.getElementsByName('ids').length;i++){
	    				  if(document.getElementsByName('ids')[i].checked){
	    				  	if(str=='') str += document.getElementsByName('ids')[i].value;
	    				  	else str += ',' + document.getElementsByName('ids')[i].value;
	    				  	if(username=='') username += document.getElementsByName('ids')[i].title;
						  	else username += ';' + document.getElementsByName('ids')[i].title;
	    				  }
	    			}
	    			if(str=='' && msg != '确定要发站内信吗?'){
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
								url: httpurl+'fhsms/deleteAll?tm='+new Date().getTime(),
						    	data: {DATA_IDS:str},
								dataType:'json',
								success: function(data){
									 if("success" == data.result){
										 top.vm.getFhsmsCount();//更新未读站内信
	    	        					 swal("删除成功", "已经从列表中删除", "success");
	    	        				 }
									 vm.getList();
								}
							});
						}else if(msg == '确定要发站内信吗?'){
							this.sendFhsms(username);
						}
	    			}
                }
            });
		},
		
		//查看信件
		viewx: function (ztid,STATUS,type,Id,SANME_ID){
			if(type == "1" && STATUS == '2' && $("#"+ztid).html() == '<span class="badge badge-warning">未读</span> <!---->'){
				$("#"+ztid).html('<span class="badge badge-success">已读</span>');
				top.vm.readFhsms();//读取站内信时减少未读总数<!-- readFhsms()函数在 assets\js-v\index.js中 -->
			}
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="站内信";
			 diag.URL = '../fhsms/fhsms_view.html?FHSMS_ID='+Id+'&TYPE='+type+'&SANME_ID='+SANME_ID+'&STATUS='+STATUS;
			 diag.Width = 800;
			 diag.Height = 500;
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮 
		     diag.Modal = false;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
		
		//查看用户
		viewUser: function (USERNAME){
			if('admin' == USERNAME){
				swal("禁止查看!", "不能查看admin用户!", "warning");
				return;
			}
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="资料";
			 diag.URL = '../user/user_view.html?USERNAME='+USERNAME;
			 diag.Width = 600;
			 diag.Height = 319;
			 diag.Modal = false;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'fhSms';
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
        			vm.fhSms = data.fhSms;			//站内信按钮权限		
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
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
        }
       //-----分页必用----end
		
	},
	
	mounted(){
        this.init();
    }
})