
var httpurl = httpurlSystem;

var zTree;	
var vm = new Vue({
	el: '#app',
	
	data:{
		type:''	//栏目模块
    },
    
    methods: {
    	
    	//初始执行
        init() {
        	var type = this.getUrlKey('type');	//链接参数
        	if(null != type){
        		this.type = type;
        	}
        	this.treeFrameT();
        	this.getData();
        },
        
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'head/listMshostDb',
		    	data: {type:this.type,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                    if("success" == data.result){
                    	var setting = {
                			    showLine: true,
                			    checkable: false
                			};
               			var zTreeNodes = eval(data.zTreeNodes);
               			zTree = $("#leftTree").zTree(setting, zTreeNodes);
                    }else if ("exception" == data.result){
                		alert("微服务数据库管理模块"+data.exception);//显示异常
                    }
                }
			}).done().fail(function(){
                alert("登录失效!请求服务器无响应,稍后再试");
                window.location.href="../login.html";
            });
    	},
    	
    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
    	
    	treeFrameT: function (){
			var hmainT = document.getElementById("treeFrame");
			var bheightT = document.documentElement.clientHeight;
			hmainT .style.width = '100%';
			hmainT .style.height = (bheightT-26) + 'px';
		}
    	
    },
    
    mounted(){
        this.init();
    }
})	
	
window.onresize=function(){  
	vm.treeFrameT();
};