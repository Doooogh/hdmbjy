
var httpurl = httpurlSystem;

var zTree;	
var vm = new Vue({
	el: '#app',

	data:{
		MENU_ID: '0',		//菜单ID
		MENU_URL: ''		//菜单地址
    },
    
    methods: {
    	
    	//初始执行
        init() {
        	this.treeFrameT();
        	var FID = this.getUrlKey('MENU_ID');	//链接参数
        	if(null != FID){
        		this.MENU_ID = FID;
        	}
        	this.getData(this.MENU_ID);
        },
        
    	//根据主键ID获取数据
    	getData: function(MENU_ID){
    		this.MENU_ID = MENU_ID;
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'menu/otherlistMenu',
		    	data: {MENU_ID:this.MENU_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                    if("success" == data.result){
                    	vm.MENU_ID = data.MENU_ID;
                    	vm.MENU_URL = data.MENU_URL;
                    	var setting = {
                			    showLine: true,
                			    checkable: false
                			};
               			var zTreeNodes = eval(data.zTreeNodes);
               			zTree = $("#leftTree").zTree(setting, zTreeNodes);
                    }else if ("exception" == data.result){
                		alert("拓展左侧四级菜单"+data.exception);//显示异常
                    }
                }
			}).done().fail(function(){
                alert("登录失效! 请求服务器无响应，稍后再试");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
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