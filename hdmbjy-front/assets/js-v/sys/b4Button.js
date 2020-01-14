
var httpurl = httpurlSystem;

var zTree;
var vm = new Vue({

	el: '#app',

	data:{
		ROLE_ID: '',		//角色ID
		msg: ''
    },
    
	methods: {
    	//初始执行
        init() {
        	var FID = this.getUrlKey('ROLE_ID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.ROLE_ID = FID;
        		this.msg =  this.getUrlKey('msg');
        		this.getData();
        	}
        },
        
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'role/b4Button',
		    	data: {ROLE_ID:this.ROLE_ID,msg:this.msg,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                    if("success" == data.result){
                    	var setting = {
                			    showLine: true,
                			    checkable: true
                			};
               			var zTreeNodes = eval(data.zTreeNodes);
               			zTree = $("#tree").zTree(setting, zTreeNodes);
                    }else if ("exception" == data.result){
                		showException("菜单授权模块",data.exception);//显示异常
                    	$("#showform").show();
                		$("#jiazai").hide();
                    }
                }
			}).done().fail(function(){
				swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               	$("#showform").show();
       		   	$("#jiazai").hide();
            });
    	},
    	
		//保存
		goSave: function (){
			var nodes = zTree.getCheckedNodes();
			var tmpNode;
			var ids = "";
			for(var i=0; i<nodes.length; i++){
				tmpNode = nodes[i];
				if(i!=nodes.length-1){
					ids += tmpNode.id+",";
				}else{
					ids += tmpNode.id;
				}
			}
			$("#showform").hide();
			$("#jiazai").show();
			$.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'role/saveB4Button',
		    	data: {ROLE_ID:this.ROLE_ID,menuIds:ids,msg:this.msg,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                    if("success" == data.result){
                    	swal("", "保存成功", "success");
                    	setTimeout(function(){
                    		top.Dialog.close();//关闭弹窗
                        },1500);
                    }else if ("exception" == data.result){
                    	showException("按钮授权模块",data.exception);//显示异常
                    	$("#showform").show();
                		$("#jiazai").hide();
                    }
                }
			}).done().fail(function(){
				swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               	$("#showform").show();
       		   	$("#jiazai").hide();
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