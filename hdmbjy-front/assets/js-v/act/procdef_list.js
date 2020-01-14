
var httpurl = httpurlActiviti;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS: '',	//检索条件
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		add:false,
		del:false,
		edit:false,
		cha:false,
		loading:false	//加载状态
    },
    
    mixins: [formatDate],	//混入模块
    
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
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	var STRARTTIME = $("#STRARTTIME").val();
        	var ENDTIME = $("#ENDTIME").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'procdef/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,STRARTTIME:STRARTTIME,ENDTIME:ENDTIME,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("流程管理",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//删除
    	goDel: function (id){
    		swal({
    			title: "确定要删除吗?",
                text: "它所关联的所有数据,包括任务和历史流程全部会被删除",
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
            			url: httpurl+'procdef/delete',
            	    	data: {DEPLOYMENT_ID_:id,tm:new Date().getTime()},
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
    							url: httpurl+'procdef/deleteAll?tm='+new Date().getTime(),
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
    	
    	//激活 or 挂起
    	onoff: function (ID_,STATUS,ofid,VSID){
    		this.loading = true;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'procdef/onoffPro?tm='+new Date().getTime(),
    	    	data: {ID_:ID_,STATUS:STATUS},
    			dataType:'json',
    			success: function(data){
    				vm.loading = false;
    				if("success" == data.result){
    					 if(STATUS == '1'){
    						 $("#"+ofid).tips({
    								side:3,
    					            msg:'激活成功',
    					            bg:'#AE81FF',
    					            time:2
    					        });
    						 $("#offing1"+VSID).hide();
    						 $("#oning1"+VSID).show();
    						 $("#STATUS"+VSID).html('<font color="#87B87F">已激活</font><div class="spinner-grow spinner-grow-sm" style="padding-top:-2px;" role="status"><span class="sr-only">..</span></div>');
    					 }else{
    						 $("#"+ofid).tips({
    								side:3,
    					            msg:'已经挂起',
    					            bg:'#AE81FF',
    					            time:2
    					        });
    						 $("#offing1"+VSID).show();
    						 $("#oning1"+VSID).hide();
    						 $("#STATUS"+VSID).html('<font color="red">已挂起</font>');
    					 }
    				 }
    			}
    		});
    	},
    	
    	//映射模型
    	addModel: function (processDefinitionId,czid){
    		this.loading = true;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'fhmodel/saveModelFromPro?tm='+new Date().getTime(),
    	    	data: {processDefinitionId:processDefinitionId},
    			dataType:'json',
    			success: function(data){
    				vm.loading = false;
    				if("success" == data.result){
    					 $("#"+czid).tips({
    							side:3,
    				            msg:'映射成功,可以去模型列表查看',
    				            bg:'#AE81FF',
    				            time:2
    				        });
    				 }else{
    					 $("#"+czid).tips({
    							side:3,
    				            msg:'映射失败!',
    				            bg:'#AE81FF',
    				            time:2
    				        });
    				 }
    			}
    		});
    	},
    	
    	//预览Xml
    	goViewXml: function (DEPLOYMENT_ID_,FILENAME){
    		var diag = new top.Dialog();
    		diag.Drag=true;
    		diag.Title ="预览XML";
    		diag.URL = '../../act/procdef/xml_view.html?DEPLOYMENT_ID_='+DEPLOYMENT_ID_+'&FILENAME='+encodeURI(encodeURI(FILENAME));
    		diag.Width = 1000;
    		diag.Height = 608;
    		diag.Modal = true;				//有无遮罩窗口
    		diag.ShowMinButton = true;		//最小化按钮
    		diag. ShowMaxButton = true;		//最大化按钮
    		diag.CancelEvent = function(){ 	//关闭事件
    		diag.close();
    		};
    		diag.show();
    	},
    	
    	//预览Png
    	goViewPng: function (DEPLOYMENT_ID_,FILENAME){
    		var diag = new top.Dialog();
    		diag.Drag=true;
    		diag.Title ="预览流程图";
    		diag.URL = '../../act/procdef/png_view.html?DEPLOYMENT_ID_='+DEPLOYMENT_ID_+'&FILENAME='+encodeURI(encodeURI(FILENAME));
    		diag.Width = 800;
    		diag.Height = 460;
    		diag.Modal = true;				//有无遮罩窗口
    		diag.ShowMinButton = true;		//最小化按钮
    		diag. ShowMaxButton = true;		//最大化按钮
    		diag.CancelEvent = function(){ 	//关闭事件
    		diag.close();
    		};
    		diag.show();
    	},
    	
    	//导入流程
    	uploadPro: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="导入流程";
    		 diag.URL = '../../act/procdef/procdef_upload.html';
    		 diag.Width = 600;
    		 diag.Height = 168;
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
        	var keys = 'procdef:add,procdef:del,procdef:edit,procdef:cha';
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
        			vm.add = data.procdeffhadminadd;
        			vm.del = data.procdeffhadmindel;
        			vm.edit = data.procdeffhadminedit;
        			vm.cha = data.procdeffhadmincha;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },
        
        //下载
        downloadModel: function (DEPLOYMENT_ID_){
        	swal({
               	title: '',
                text: '确定要下载模型文件吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	window.location.href = httpurl + 'procdef/download?DEPLOYMENT_ID_='+DEPLOYMENT_ID_;            	
                }
            });
        },
        
        formatDate: function (time){
        	let date = new Date(time);
        	return this.formatDateUtil(date, "yyyy-MM-dd hh:mm:ss");
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