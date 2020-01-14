
var httpurl = httpurlDbmanage;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		pd: [],			//map
		dbtype: '',		//数据库类型
		remoteDB: '',	//是否远程备份
		lastStart: '',
		lastEnd: '',
		TYPE: '',		//类型
		mshost: '',		//服务名称
		oracleMsg: '',	//提示消息(oracle时)
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		del:false,		//删除按钮
		edit:false,		//修改按钮
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
       		this.lastStart = $("#lastStart").val();
           	this.lastEnd = $("#lastEnd").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'brdb/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {MSHOST:this.mshost,keywords:this.pd.keywords,lastStart:this.lastStart,lastEnd:this.lastEnd,TYPE:this.TYPE,tm:new Date().getTime()},
        		dataType:'json',
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.dbtype = data.dbtype;
        			 vm.remoteDB = data.remoteDB;
        			 vm.page = data.page;
        			 vm.pd = data.pd;
        			 vm.hasButton();
        			 if(data.dbtype == 'oracle'){
        				 vm.oracleMsg = "当数据库为Oracle时进行还原, 请先手动删除要还原的表或整库, 否则还原提示成功也无效！";
        			 }
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("数据库还原模块",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
		//还原操作
		dbRecover: function (TABLENAME,SQLPATH,id){
			swal({
            	title: "确定要进行还原["+TABLENAME+"]吗?",
                text: this.oracleMsg,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	this.loading = true;
					$("#backuping2").show();
					 $.ajax({
						 	xhrFields: {
			                    withCredentials: true
			                },
							type: "POST",
							url: httpurl+'brdb/dbRecover',
					    	data: {TABLENAME:TABLENAME,SQLPATH:SQLPATH,tm:new Date().getTime()},
							dataType:'json',
							success: function(data){
								if("success" == data.result){
									 $("#"+id).tips({
											side:1,
								            msg:'还原成功',
								            bg:'#83CB4F',
								            time:15
								        });
								 }else{
									 $("#tsmsg").tips({
											side:3,
								            msg:'还原失败,检查配置文件及是否远程数据库',
								            bg:'#cc0033',
								            time:15
								        });
								 }
								vm.loading = false;
								$("#backuping2").hide();
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
			 diag.URL = '../../fhdb/brdb/brdb_edit.html?FHDB_ID='+Id;
			 diag.Width = 600;
			 diag.Height = 158;
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
		goDel:function (Id){
			swal({
            	title: "确定要删除此记录吗？",
                text: '确保数据安全性,只删除记录,不删除物理硬盘数据',
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
	        			url: httpurl+'brdb/delete',
	        	    	data: {FHDB_ID:Id,tm:new Date().getTime()},
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
            	title: "确定要删除选中的记录吗?",
                text: '确保数据安全性,只删除记录,不删除物理硬盘数据',
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
	   						url: httpurl+'brdb/deleteAll',
	   				    	data: {DATA_IDS:str,tm:new Date().getTime()},
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
		
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'brdb:del,brdb:edit';
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
        			vm.del = data.brdbfhadmindel;	//删
        			vm.edit = data.brdbfhadminedit;	//改
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