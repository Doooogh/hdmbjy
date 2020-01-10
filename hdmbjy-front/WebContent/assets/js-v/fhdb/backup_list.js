
var httpurl = httpurlDbmanage;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		pd: [],			//map
		STATUS: '',		//状态
		mshost: '',		//服务名称
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
        	var mshost = this.getUrlKey('mshost');	//链接参数
        	if(null != mshost){
        		this.mshost = mshost;
        	}
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
        	this.pd.lastStart = $("#lastStart").val();
           	this.pd.lastEnd = $("#lastEnd").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'timingbackup/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {MSHOST:this.mshost,keywords:this.pd.keywords,lastStart:this.pd.lastStart,lastEnd:this.pd.lastEnd,STATUS:this.STATUS,tm:new Date().getTime()},
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
                 	showException("数据库自动备份模块",data.exception);//显示异常
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
			 diag.URL = '../../fhdb/backup/backup_edit.html';
			 diag.Width = 685;
			 diag.Height = 379;
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
		goEdit: function(Id,VSID){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="编辑";
			 diag.URL = '../../fhdb/backup/backup_edit.html?TIMINGBACKUP_ID='+Id;
			 diag.Width = 685;
			 diag.Height = 379;
			 diag.CancelEvent = function(){ //关闭事件
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList();
    				 $("#offing1"+VSID).hide();
					 $("#oning1"+VSID).show();
					 $("#STATUS"+VSID).html('正在运行<div class="spinner-grow spinner-grow-sm" style="padding-top:-2px;" role="status"><span class="sr-only">..</span></div>');
    			}
				diag.close();
			 };
			 diag.show();
		},
    	
		//删除
		goDel: function (Id){
			swal({
				title: '',
	            text: "确定要删除 吗?",
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
	        			url: httpurl+'timingbackup/delete',
	        	    	data: {TIMINGBACKUP_ID:Id,tm:new Date().getTime()},
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
		makeAll: function (){
			swal({
               	title: '',
   	            text: "确定要删除选中的数据吗?",
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
	    				this.loading = true;
	   					$.ajax({
	   						xhrFields: {
	                            withCredentials: true
	                        },
	   						type: "POST",
	   						url: httpurl+'timingbackup/deleteAll?tm='+new Date().getTime(),
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
            });
		},
		
		//启动 or 关闭
		onoff: function (TIMINGBACKUP_ID,STATUS,ofid,VSID){
			this.loading = true;
			$.ajax({
				xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'timingbackup/changeStatus?tm='+new Date().getTime(),
		    	data: {TIMINGBACKUP_ID:TIMINGBACKUP_ID,STATUS:STATUS},
				dataType:'json',
				cache: false,
				success: function(data){
					vm.loading = false;
					if("success" == data.result){
						 if(STATUS == '1'){
							 $("#"+ofid).tips({
									side:3,
						            msg:'启动成功',
						            bg:'#AE81FF',
						            time:2
						        });
							 $("#offing1"+VSID).hide();
							 $("#oning1"+VSID).show();
							 $("#STATUS"+VSID).html('正在运行<div class="spinner-grow spinner-grow-sm" style="padding-top:-2px;" role="status"><span class="sr-only">..</span></div>');
						 }else{
							 $("#"+ofid).tips({
									side:3,
						            msg:'已经关闭',
						            bg:'#AE81FF',
						            time:2
						        });
							 $("#offing1"+VSID).show();
							 $("#oning1"+VSID).hide();
							 $("#STATUS"+VSID).html('已经停止');
						 }
					}
				}
			});
		},
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'timingbackup:add,timingbackup:del,timingbackup:edit';
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
        			vm.add = data.timingbackupfhadminadd;
        			vm.del = data.timingbackupfhadmindel;
        			vm.edit = data.timingbackupfhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },
        
        //根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
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
