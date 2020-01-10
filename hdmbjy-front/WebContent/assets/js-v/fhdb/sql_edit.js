
var httpurl = httpurlDbmanage;

var vm = new Vue({
	el: '#app',
	
	data:{
		updateSQL: '',		//编辑语句
		querySQL: '',		//查询语句
		sqlstrforExcel: '',	//导出excel用
		mshost: '',			//服务名称
		cha: false,			//查权限
		edit: false,		//编辑权限
		toExcel: false,		//导出到excel权限
		loading:false		//加载状态
    },
    
	methods: {
		
        //初始执行
        init() {
        	var mshost = this.getUrlKey('mshost');	//链接参数
        	if(null != mshost){
        		this.mshost = mshost;
        	}
        	this.goView();
    		this.hasButton();
        },
        
        //进入页面
        goView: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'sqledit/view',
        		data: {MSHOST:this.mshost,tm:new Date().getTime()},
        		dataType:'json',
        		success: function(data){
        		 if("success" == data.result){
        		 }else if ("exception" == data.result){
                 	showException("SQL编辑器模块",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
      	//执行编辑语句
		executeUpdate: function (){
			if("" == this.updateSQL){
				$("#updateSQL").tips({
					side:3,
		            msg:'什么也没输入！',
		            bg:'#AE81FF',
		            time:3
		        });
				return;
			}
			 this.loading = true;
			 $.ajax({
					xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'sqledit/executeUpdate',
			    	data: {sql:this.updateSQL,tm:new Date().getTime()},
					dataType:'json',
					success: function(data){
						 vm.loading = false;
						 if("success" == data.result){
							 $("#updateSQL").tips({
									side:3,
						            msg:'执行成功, 用时：'+data.rTime+' s',
						            bg:'#AE81FF',
						            time:10
						        });
						 }else{
							 $("#updateSQL").tips({
									side:3,
						            msg:'执行失败,sql语句错误 或 非编辑语句or查询数据库连接错误',
						            bg:'#cc0033',
						            time:15
						        });
						 }
					}
				}).done().fail(function(){
	                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
	                setTimeout(function () {
	                	window.location.href = "../../login.html";
	                }, 2000);
	            });
		},
		
		//执行查询语句
		executeQuery: function (){
			if("" == this.querySQL){
				$("#querySQL").tips({
					side:3,
		            msg:'什么也没输入！',
		            bg:'#AE81FF',
		            time:3
		        });
				return;
			}
			 this.loading = true;
			 $.ajax({
				 	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'sqledit/executeQuery',
			    	data: {sql:this.querySQL,tm:new Date().getTime()},
					dataType:'json',
					success: function(data){
						 vm.loading = false;
						 if("success" == data.result){
							 $("#theadid").tips({
									side:3,
						            msg:'执行成功, 查询时间：'+data.rTime+' s',
						            bg:'#AE81FF',
						            time:15
						        });
							 $("#theadid2").html('查询时间：'+data.rTime+' s');
							 $("#columnList").html('');	//初始清空字段名称
							 $("#valuelist").html('');	//初始清空值列表
							 $.each(data.columnList, function(m, column){ 	//列出字段名
								 $("#columnList").append(
									'<th>'+column+'</th>'	 
								 );
							 });
							 var fhcount = 0;
							 $.each(data.dataList, function(n, fhdata){ 	//列出每条记录
								 var str1 = '<tr>';
								 var str2 = '';
								 $.each(fhdata, function(f, fhvalue){ 		//列出字段名
									 str2 += '<td>'+fhvalue+'</d>'; 
								 });
								 var str3 = '</tr>';
								 $("#valuelist").append(str1+str2+str3);
								 fhcount ++;
							 });
							 $("#fhcount").html('共  '+fhcount+' 条');
							 vm.sqlstrforExcel = vm.querySQL;
						 }else{
							 $("#querySQL").tips({
									side:3,
						            msg:'查询失败,sql语句错误或非查询语句or查询数据库连接错误',
						            bg:'#cc0033',
						            time:15
						        });
						 }
					}
				}).done().fail(function(){
	                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
	                setTimeout(function () {
	                	window.location.href = "../../login.html";
	                }, 2000);
	            });
		},
		
		//导出excel
		goExcel: function (){
			if("" == this.sqlstrforExcel){
                swal("", "什么数据都没有，你导出什么?", "warning");
				return
			}else{
				window.location.href = httpurl+'sqledit/excel?sql='+this.sqlstrforExcel;
			}
		},

      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'sqledit:cha,sqledit:edit,toExcel';
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
        			vm.cha = data.sqleditfhadmincha;
        			vm.edit = data.sqleditfhadminedit;
        			vm.toExcel = data.toExcel;		//导出到excel权限
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
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