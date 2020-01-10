
var httpurl = httpurlOa;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],		//list
		page: [],			//分页类
		KEYWORDS:'',		//检索条件,关键词
		DEPARTMENT_ID:'',	//部门ID
		showCount: -1,		//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,		//当前页码
		add:false,			//增
		del:false,			//删
		edit:false,			//改
		userBinding:false,	//绑定用户权限
		Datajur:false,		//组织机构数据权限按钮
		loading:false		//加载状态
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
    		this.getList();
    		this.getDepartmenttree();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'staff/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,DEPARTMENT_ID:this.DEPARTMENT_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.varList = data.varList;
        			vm.page = data.page;
        			vm.hasButton();
        			vm.loading = false;
        			$("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("员工管理",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
        //获取部门下拉树
        getDepartmenttree: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'staff/getDepartmenttree',
        		data: {tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
					//下拉树
					var defaultNodes = JSON.parse(data.zTreeNodes);
					//绑定change事件
					$("#selectTree").bind("change",function(){
						if($(this).attr("relValue")){
							vm.DEPARTMENT_ID = $(this).attr("relValue")
					    }
					});
					//赋给data属性
					$("#selectTree").data("data",defaultNodes);  
					$("#selectTree").render();
        		 }
        		}
        	})
        },
        
    	//新增
    	goAdd: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="新增";
    		 diag.URL = '../../fhoa/staff/staff_edit.html';
    		 diag.Width = 550;
    		 diag.Height = 680;
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
    	goEdit: function(id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="编辑";
    		 diag.URL = '../../fhoa/staff/staff_edit.html?FID='+id;
    		 diag.Width = 550;
    		 diag.Height = 680;
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
            			url: httpurl+'staff/delete',
            	    	data: {STAFF_ID:id,tm:new Date().getTime()},
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
    							url: httpurl+'staff/deleteAll?tm='+new Date().getTime(),
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
    	
		//授权(组织机构数据权限)
		setDatajur: function (STAFF_ID){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="授予组织机构数据权限";
			 diag.URL = '../../fhoa/staff/datajur.html?DATAJUR_ID='+STAFF_ID;
			 diag.Width = 450;
			 diag.Height = 355;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮 
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
    	
    	//打开绑定用户窗口
    	toUserBinding: function (STAFF_ID){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="绑定用户";
    		 diag.URL = '../user/window_user_list.html';
    		 diag.Width = 800;
    		 diag.Height = 600;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮
    		 diag.CancelEvent = function(){ //关闭事件
    			 var USERNAME = diag.innerFrame.contentWindow.document.getElementById('USERNAME').value;
    			 if("" != USERNAME){
    				 $.ajax({
    		        		xhrFields: {
    		                    withCredentials: true
    		                },
    		        		type: "POST",
    		        		url: httpurl+'staff/userBinding',
    		        		data: {STAFF_ID:STAFF_ID,USER_ID:USERNAME,tm:new Date().getTime()},
    		        		dataType:"json",
    		        		success: function(data){
    		        			$("#fhadmincz").tips({
    								side:1,
    					            msg:'绑定成功',
    					            bg:'#83CB4F',
    					            time:3
    					        });
    		        			vm.getList();
    		        		}
    		        	})
    			 }
    			diag.close();
    		 };
    		 diag.show();
    	},
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'staff:add,staff:del,staff:edit,userBinding,Datajur';
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
        			vm.add = data.stafffhadminadd;		//新增权限
        			vm.del = data.stafffhadmindel;		//删除权限
        			vm.edit = data.stafffhadminedit;	//修改权限
        			vm.userBinding = data.userBinding;	//绑定用户按钮权限
        			vm.Datajur = data.Datajur;			//组织机构数据权限按钮
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);		//显示异常
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
//下拉树用，这里什么不写就行
function initComplete(){}
