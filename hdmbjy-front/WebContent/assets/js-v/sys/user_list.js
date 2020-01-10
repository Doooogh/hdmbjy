var vm = new Vue({
	el: '#app',
	
	data:{
		roleList: [],	//角色list
		varList: [],	//用户list
		page: [],		//分页类
		pd: [],			//map
		ROLE_ID: '',	//角色ID
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		fhSms:false,	//站内信按钮权限		
		email:false,	//发邮件按钮权限
		fromExcel:false,//从excel导入权限
		toExcel:false,	//导出到excel权限
		add:false,		//新增按钮
		del:false,		//删除按钮
		edit:false,		//修改按钮
		loading:false,	//加载状态
		DEPARTMENT_ID:''
    },

	methods: {
        //初始执行
        init() {
        	var id = this.getUrlKey('id');  //链接参数, 从树点过来
        	if(null != id){
        		this.DEPARTMENT_ID = id;
        	}
    		
        	//复选框控制全选,全不选 
    		$('#zcheckbox').click(function(){
	    		 if($(this).is(':checked')){
	    			 $("input[name='ids']").click();
	    		 }else{
	    			 $("input[name='ids']").attr("checked", false);
	    		 }
    		});
    		this.pd.KEYWORDS = '';
//    		this.getList();
    		this.getList2(this.DEPARTMENT_ID);
        },
      //根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
        //获取列表
        getList2: function(F_ID){
        	this.loading = true;
        	this.DEPARTMENT_ID = F_ID;
       		this.pd.STRARTTIME = $("#STRARTTIME").val();
           	this.pd.ENDTIME = $("#ENDTIME").val();
           	this.ROLE_ID = $("#ROLE_ID").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'user/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {DEPARTMENT_ID:this.DEPARTMENT_ID,KEYWORDS:this.pd.KEYWORDS,STRARTTIME:this.pd.STRARTTIME,ENDTIME:this.pd.ENDTIME,ROLE_ID:this.ROLE_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.roleList = data.roleList;
        			 vm.varList = data.userList;
        			 vm.ROLE_ID = data.ROLE_ID;
        			 vm.page = data.page;
        			 vm.pd = data.pd;
        			 vm.hasButton();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("用户信息",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
       		this.pd.STRARTTIME = $("#STRARTTIME").val();
           	this.pd.ENDTIME = $("#ENDTIME").val();
           	this.ROLE_ID = $("#ROLE_ID").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'user/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {DEPARTMENT_ID:this.DEPARTMENT_ID,KEYWORDS:this.pd.KEYWORDS,STRARTTIME:this.pd.STRARTTIME,ENDTIME:this.pd.ENDTIME,ROLE_ID:this.ROLE_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.roleList = data.roleList;
        			 vm.varList = data.userList;
        			 vm.ROLE_ID = data.ROLE_ID;
        			 vm.page = data.page;
        			 vm.pd = data.pd;
        			 vm.hasButton();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("系统用户",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
 
      	//去发送电子邮件页面
		sendEmail: function (EMAIL){
        	if(!this.email)return;
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="发送电子邮件";
			 diag.URL = '../user/send_email.html?EMAIL='+EMAIL;
			 diag.Width = 1000;
			 diag.Height = 700;
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
		
		//新增
		addUser: function (){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="新增";
			 diag.URL = '../user/user_edit.html';
			 diag.Width = 600;
			 diag.Height = 466;
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
		
		
		//修改
		editUser: function (USER_ID){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="编辑";
			 diag.URL = '../user/user_edit.html?USER_ID='+USER_ID;
			 diag.Width = 600;
			 diag.Height = 466;
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
		delUser: function (USER_ID,NAME){
			swal({
               	title: '',
                text: '确定要删除 '+NAME+' 吗?',
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
	        			url: httpurl+'user/deleteUser',
	        	    	data: {USER_ID:USER_ID,tm:new Date().getTime()},
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
	            	var emstr = '';
	            	var username = '';
	    			for(var i=0;i < document.getElementsByName('ids').length;i++){
	    				  if(document.getElementsByName('ids')[i].checked){
	    				  	if(str=='') str += document.getElementsByName('ids')[i].value;
	    				  	else str += ',' + document.getElementsByName('ids')[i].value;
	    				  	
	    				  	if(emstr=='') emstr += document.getElementsByName('ids')[i].alt;
	    				  	else emstr += ';' + document.getElementsByName('ids')[i].alt;
	    				  	
	    				  	if(username=='') username += document.getElementsByName('ids')[i].title;
	    				  	else username += ';' + document.getElementsByName('ids')[i].title;
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
	    				if(msg == '确定要删除选中的用户吗?'){
	    					this.loading = true;
	    					$.ajax({
	    						xhrFields: {
	                                withCredentials: true
	                            },
	    						type: "POST",
	    						url: httpurl+'user/deleteAllUser?tm='+new Date().getTime(),
	    				    	data: {USER_IDS:str},
	    						dataType:'json',
	    						success: function(data){
	    							if("success" == data.result){
	    								if("success" == data.result){
	    		        					 swal("删除成功", "已经从列表中删除!", "success");
	    		        				 }
	    								vm.getList();
	    							}
	    						}
	    					});
	    				}else if(msg == '确定要给选中的用户发送站内信吗?'){
	    					sendFhsms(username);
	    				}else if(msg == '确定要给选中的用户发送邮件?'){
	    					this.sendEmail(emstr);
	    				}
	    			}
                }
            });
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
                	window.location.href=httpurl+'user/excel?KEYWORDS='+this.pd.KEYWORDS+'&STRARTTIME='+this.pd.STRARTTIME+'&ENDTIME='+this.pd.ENDTIME+'&ROLE_ID='+this.ROLE_ID;	            	
                }
            });
		},

		//打开上传excel页面
		getExcel: function (){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="从EXCEL导入到系统";
			 diag.URL = '../user/user_excel.html';
			 diag.Width = 600;
			 diag.Height = 130;
			 diag.CancelEvent = function(){ //关闭事件
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList();
    			 }
				 diag.close();
			 };
			 diag.show();
		},
		
		//发站内信
		sendFhsms: function (USERNAME){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="站内信";
			 diag.URL = '../fhsms/send_fhsms.html?USERNAME='+USERNAME;
			 diag.Width = 700;
			 diag.Height = 619;
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'user:add,user:del,user:edit,fhSms,email,fromExcel,toExcel';
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
        			vm.add = data.userfhadminadd;	//增
        			vm.del = data.userfhadmindel;	//删
        			vm.edit = data.userfhadminedit;	//改
        			vm.fhSms = data.fhSms;			//站内信按钮权限		
        			vm.email = data.email;			//发邮件按钮权限
        			vm.fromExcel = data.fromExcel;	//从excel导入权限
        			vm.toExcel = data.toExcel;		//导出到excel权限
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