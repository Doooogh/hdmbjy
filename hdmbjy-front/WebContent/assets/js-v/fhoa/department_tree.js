
var httpurl = httpurlOa;

var zTree;	
var vm = new Vue({
	el: '#app',
    
    methods: {
    	
    	//初始执行
        init() {
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
				url: httpurl+'department/listTree',
		    	data: {tm:new Date().getTime()},
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
                		alert("数据字典模块"+data.exception);//显示异常
                    }
                }
			})
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