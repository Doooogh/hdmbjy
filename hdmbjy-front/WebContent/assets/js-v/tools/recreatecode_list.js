
var httpurl = httpurlTools;

var vm = new Vue({
	el: '#app',
	
	data:{
		dbtype: 'mysql',			//数据库类型
		dbAddress: 'localhost',		//连接地址
		dbport: 3306,				//端口
		username: 'root',			//用户名
		password: '',				//密码
		databaseName: '',			//数据库名
		loading:false				//加载状态
    },
    
	methods: {
		
		//选择数据库
		selectDb: function (){
			this.dbAddress = 'localhost';			//连接地址
			if("mysql" == this.dbtype){
				this.dbport = 3306;					//端口
				this.username = 'root';				//用户名
				this.databaseName = '';				//库名
				
			}else if("oracle" == this.dbtype){
				this.dbport = 1521;					//端口
				this.databaseName = 'orcl';			//库名
				this.username = '';					//用户名
			}else{
				this.dbport = 1433;					//端口
				this.username = 'sa';				//用户名
				this.databaseName = '';				//库名
			}
		},
		
		//连接数据库,读取数据库中的表
		connDb: function (){
			
			if("" == this.dbAddress){
				$("#dbAddress").tips({
					side:1,
		            msg:'请输入连接地址！',
		            bg:'#AE81FF',
		            time:3
		        });
				$("#dbAddress").focus();
				return;
			}
			if("" == this.dbport){
				$("#dbport").tips({
					side:1,
		            msg:'请输入端口！',
		            bg:'#AE81FF',
		            time:3
		        });
				$("#dbport").focus();
				return;
			}
			if("" == this.username){
				$("#username").tips({
					side:1,
		            msg:'请输入用户名！',
		            bg:'#AE81FF',
		            time:3
		        });
				$("#username").focus();
				return;
			}
			if("" == this.password){
				$("#password").tips({
					side:1,
		            msg:'请输入密码！',
		            bg:'#AE81FF',
		            time:3
		        });
				$("#password").focus();
				return;
			}
			if("" == this.databaseName){
				$("#databaseName").tips({
					side:1,
		            msg:'请输入数据库名！',
		            bg:'#AE81FF',
		            time:3
		        });
				$("#databaseName").focus();
				return;
			}
			 this.loading = true;
			 $.ajax({
				 	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'recreateCode/listAllTable',
			    	data: {dbtype:this.dbtype,dbAddress:this.dbAddress,dbport:this.dbport,username:this.username,password:this.password,databaseName:this.databaseName,tm:new Date().getTime()},
					dataType:'json',
					success: function(data){
						 if("success" == data.result){
							 $("#fhdb").tips({
									side:1,
						            msg:'连接成功',
						            bg:'#83CB4F',
						            time:10
						        });
							 $("#valuelist").html('');					//初始清空值列表
							 $("#valuelist").append('<tr>');
							 $.each(data.tblist, function(n, tblist){ 	//列出每条记录
								 $("#valuelist").append('<td>'+(n+1)+'</td><td>'+tblist+'</td><td float: left;><a onclick="vm.productCode(\''+tblist+'\')" style="cursor:pointer;height:20px;" class="btn btn-light btn-sm"><div style="margin-top:-6px;margin-left: -1px;">反射<i class="feather icon-corner-right-up"></i></div></a></td>');
								 if((n+1)%2==0)$("#valuelist").append('</tr><tr>');
							 }); 
							 $("#valuelist").append('</tr>');
						 }else{
							 $("#fhdb").tips({
									side:3,
						            msg:'连接失败,检查连接参数是否正确！',
						            bg:'#cc0033',
						            time:15
						        });
						 }
						 vm.loading = false;
					}
				});
		},
		
		//启动代码生成器
		productCode: function (table){
			 username = this.username.replace("#","%23");	//替换两次，oracle起作用
			 username = this.username.replace("#","%23");
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="代码生成器";
			 diag.URL = '../../tools/createcode/productcode.html?fromRecreate=yes&table='+table+'&dbtype='+this.dbtype+'&dbAddress='+this.dbAddress+'&dbport='+this.dbport+'&username='+username+'&password='+this.password+'&databaseName='+this.databaseName;
			 diag.Width = 919;
			 diag.Height = 600;
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
		
        //初始执行
        init() {
            //回车登录
            document.onkeydown = function(e) {
            var key = window.event.keyCode;
            if (key == 13) {
                vm.connDb();
                }
            }
        }
    
	},
	
    mounted(){
        this.init()
    }
 
})
