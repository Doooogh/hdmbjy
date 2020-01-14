
var httpurl = httpurlIm;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//好友list
		groupList:[],	//分组列表
		page: [],		//分页类
		pd: [],			//map
		FGROUP_ID: '',	//分组ID
		httpurl:'',
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		del:false,
		edit:false,
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
        	this.httpurl = httpurlSystem;
        	this.getGroupList();
    		this.getList();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	this.pd.lastStart = $("#lastStart").val();
           	this.pd.lastEnd = $("#lastEnd").val();
           	this.FGROUP_ID = $("#FGROUP_ID").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'friends/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {keywords:this.pd.keywords,lastStart:this.pd.lastStart,lastEnd:this.pd.lastEnd,FGROUP_ID:this.FGROUP_ID,tm:new Date().getTime()},
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
                 	showException("好友管理",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
        //分组列表
        getGroupList: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'fgroup/getFgroup',
            	data: {tm:new Date().getTime()},
        		dataType:'json',
        		success: function(data){
        			vm.groupList = data.list;
        		}
        	});
        },
    	
    	//修改
    	goEdit: function(id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="编辑";
    		 diag.URL = '../../fhim/friends/friends_edit.html?FRIENDS_ID='+id;
    		 diag.Width = 399;
    		 diag.Height = 155;
    		 diag.Modal = true;				//有无遮罩窗口
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
    	goDel: function (Id,FUSERNAME){
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
    					url: httpurl+'friends/deletefromlist',
    			    	data: {FRIENDS_ID:Id,tm:new Date().getTime()},
    					dataType:'json',
    					success: function(data){
    						 if("success" == data.result){
    							 top.removeFriendByI(FUSERNAME); 		//从自己好友栏移除  此方法在WebRoot\assets\js-v\fhim.js页面中
    							 top.removeFriendFromMobile(FUSERNAME);	//从自己手机好友栏里面删除对方
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
    				var nstr = '';
    				for(var i=0;i < document.getElementsByName('ids').length;i++){
    					if(document.getElementsByName('ids')[i].checked){
    					  	if(str=='') str += document.getElementsByName('ids')[i].value;
    					  	else str += ',' + document.getElementsByName('ids')[i].value;
    					  	if(nstr=='') nstr += document.getElementsByName('ids')[i].title;
    					  	else nstr += ',' + document.getElementsByName('ids')[i].title;
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
    						var arrid = nstr.split(',');
    						for(var n=0;n<arrid.length;n++){
    							top.removeFriendByI(arrid[n]); //从自己好友栏移除  此方法在WebRoot\assets\js-v\fhim.js页面中
    						}
    						$.ajax({
    							xhrFields: {
    	                            withCredentials: true
    	                        },
    							type: "POST",
    							url: httpurl+'friends/deleteAll?tm='+new Date().getTime(),
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
    	
    	//拉黑
    	pullblack: function (Id,FUSERNAME){
    		swal({
    	    	title: '确定要拉黑吗?',
    	        text: "拉黑后也会在对方好友栏删除您",
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
    					url: httpurl+'friends/pullblackfromlist',
    			    	data: {FRIENDS_ID:Id,FUSERNAME:FUSERNAME,tm:new Date().getTime()},
    					dataType:'json',
    					success: function(data){
    						 if("success" == data.result){
    							 top.removeFriendByI(FUSERNAME); 		//从自己好友栏移除  此方法在WebRoot\assets\js-v\fhim.js页面中
    							 top.removeIFromFriend(FUSERNAME);		//从对方好友栏里面删除自己
    							 top.removeFriendFromMobile(FUSERNAME);	//从自己手机好友栏里面删除对方
    							 swal("拉黑成功", "已经从列表中删除!", "success");
    						 }
    						 vm.getList();
    					}
    				});
    	        }
    	    });
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
			 diag.URL = '../../sys/user/user_view.html?USERNAME='+USERNAME;
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
        	var keys = 'friends:del,friends:edit';
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
        			vm.del = data.friendsfhadmindel;
        			vm.edit = data.friendsfhadminedit;
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