
var httpurl = httpurlIm;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//好友list
		groupList:[],	//分组列表
		page: [],		//分页类
		pd: [],			//map
		QID: '',		//群ID
		httpurl:'',
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		add:false,
		del:false,
		edit:false,
		loading:false	//加载状态
    },
    
	methods: {
		
        //初始执行
        init() {
        	this.httpurl = httpurl;
    		this.getList();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'qgroup/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {keywords:this.pd.keywords,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.pd = data.pd;
        			 vm.QID = data.QID;
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("群组管理",data.exception);//显示异常
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
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="新增";
			 diag.URL = '../../fhim/qgroup/qgroup_edit.html?QID='+this.QID;
			 diag.Width = 600;
			 diag.Height = 300;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮
			 diag.CancelEvent = function(){ //关闭事件
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
					 $.ajax({
						 	xhrFields: {
			                    withCredentials: true
			                },
							type: "POST",
							url: httpurl+'qgroup/getThisQgroup',	 //获取此群的信息
						   	data: {QGROUP_ID:vm.QID,tm:new Date().getTime()},
							dataType:'json',
							success: function(data){
								top.addQgroup(vm.QID,data.avatar,data.groupname);	//把群添加到群组栏里面	此方法在WebRoot\assets\js-v\fhim.js页面中
								vm.getList();
							}
						});
				}
				diag.close();
			 };
			 diag.show();
		},
    	
		//群成员
		groupMembers: function (Id){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="群成员管理";
			 diag.URL = '../../fhim/qgroup/qgroup_members.html?QGROUP_ID='+Id;
			 diag.Width = 800;
			 diag.Height = 600;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮 
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
		
		//聊天记录
		hismsg: function (Id){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="群聊天记录管理";
			 diag.URL = '../../fhim/hismsg/hismsg_list_del.html?id='+Id+'&type=group';
			 diag.Width = 1000;
			 diag.Height = 600;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮 
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
		
		//解散or退出群
		goDel:function (Id,PATH,TYPE){
			var msg = "";
			if('del'==TYPE){
				msg = "确定要解散此群吗?";
			}else{
				msg = "确定要退出此群吗?";
			}
			swal({
            	title: '',
                text: msg,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	this.loading = true;
	            	top.removeQgroup(Id,TYPE); 	//从自己群组栏移除  此方法在WebRoot\assets\js-v\fhim.js页面中
	            	$.ajax({
	            		xhrFields: {
		                    withCredentials: true
		                },
	        			type: "POST",
	        			url: httpurl+'qgroup/delete',
	        	    	data: {QGROUP_ID:Id,PATH:PATH,TYPE:TYPE,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
	        					 swal("", "操作成功", "success");
	        				 }
	        				 setTimeout(function(){
	                        		vm.getList();
	                            },1000);
	        			}
	        		});
                }
            });
		},
		
		//修改
		goEdit: function (Id){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="编辑";
			 diag.URL = '../../fhim/qgroup/qgroup_edit.html?QGROUP_ID='+Id;
			 diag.Width = 600;
			 diag.Height = 300;
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
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'qgroup:add,qgroup:del,qgroup:edit';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurlSystem+'head/hasButton',
        		data: {keys:keys,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.add = data.qgroupfhadminadd;
        			vm.del = data.qgroupfhadmindel;
        			vm.edit = data.qgroupfhadminedit;
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