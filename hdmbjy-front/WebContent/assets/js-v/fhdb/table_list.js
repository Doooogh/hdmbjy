
var httpurl = httpurlDbmanage;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],		//list
		dbtype: '',			//数据库类型
		databaseName: '',	//数据库名称
		mshost: '',			//服务名称
		add:false,
		loading:false		//加载状态
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
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'brdb/listAllTable',
        		data: {MSHOST:this.mshost,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.dbtype = data.dbtype;
        			 vm.databaseName = data.databaseName;
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("数据库备份模块",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//备份全库
    	backupall: function (){
    		swal({
            	   title: '',
                   text: "确定要备份整个数据库吗?",
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
    						url: httpurl+'brdb/backupAll',
    				    	data: {tm:new Date().getTime()},
    						dataType:'json',
    						success: function(data){
    							 if("success" == data.result){
    								 $("#backupts").tips({
    										side:3,
    							            msg:'备份成功,在数据还原里面查看记录',
    							            bg:'#83CB4F',
    							            time:15
    							        });alldata
    							        $("#alldata").tips({
    										side:3,
    							            msg:'备份成功,在数据还原里面查看记录',
    							            bg:'#83CB4F',
    							            time:15
    							        });alldata
    							 }else{
    								 $("#backupts").tips({
    										side:3,
    							            msg:'备份失败,检查配置文件及备份保存路径',
    							            bg:'#cc0033',
    							            time:15
    							        });
    								 $("#alldata").tips({
    										side:3,
    							            msg:'备份失败,检查配置文件及备份保存路径',
    							            bg:'#83CB4F',
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
        
    	//备份单表
    	backupTable: function (fhtable,id){
    		swal({
            	   title: '',
                   text: "确定要备份这表[ "+fhtable+" ]吗?",
                   icon: "warning",
                   buttons: true,
                   dangerMode: true,
               }).then((willDelete) => {
                   if (willDelete) {
               		this.backupAjax(fhtable,id);
                   }
               });
    	},
    	
    	/**请求备份
    	* fhtable：表名
    	* id ：提示对象的ID
    	*/
    	backupAjax: function (fhtable,id){
    		 this.loading = true;
    		 $("#backuping2").show();
    		 $("#f"+id).tips({
					side:1,
		            msg:'正在备份...请稍后',
		            bg:'#AE81FF',
		            time:3
		        });
    		 $.ajax({
    			xhrFields: {
                     withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'brdb/backupTable?tm='+new Date().getTime(),
    	    	data: {fhtable:fhtable},
    			dataType:'json',
    			success: function(data){
    				 if("success" == data.result){
    					 $("#f"+id).tips({
    							side:2,
    				            msg:'备份成功',
    				            bg:'#83CB4F',
    				            time:5
    				        });
    				 }else{
    					 $("#"+id).tips({
    							side:3,
    				            msg:'备份失败,检查配置文件及备份保存路径',
    				            bg:'#cc0033',
    				            time:15
    				        });
    				 }
    				 vm.loading = false;
    				$("#backuping2").hide();
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
    					var fid = '';
    					for(var i=0;i < document.getElementsByName('ids').length;i++){
    					  if(document.getElementsByName('ids')[i].checked){
    					  	if(str=='') str += document.getElementsByName('ids')[i].value;
    					  	else str += ',fh,' + document.getElementsByName('ids')[i].value;
    					  	
    					  	if(fid=='') fid += document.getElementsByName('ids')[i].id;
    					  	else fid += ',fh,' + document.getElementsByName('ids')[i].id;
    					  }
    					}
    					if(str==''){
    						$("#cts").tips({
    	    					side:2,
    	    		            msg:'点这里全选',
    	    		            bg:'#AE81FF',
    	    		            time:3
    	    		        });
    	                    swal("", "您没有选择任何内容", "warning");
    	    				return;
    					}else{
    						if(msg == '确定要批量备份这些表吗？'){
    							var arrTable = str.split(',fh,');
    							var arrFid = fid.split(',fh,');
    							for(var fhi=0;fhi<arrTable.length;fhi++){
    								this.backupAjax(arrTable[fhi],arrFid[fhi]);
    							}
    						}
    					}
                   }
    			});
    	},
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'brdb:add';
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
        			vm.add = data.brdbfhadminadd;
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
        }

	},
	
	mounted(){
        this.init();
    }
})