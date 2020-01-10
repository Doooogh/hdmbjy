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
    		console.info(111);
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'organization/listAllOrganization',
		    	data: {
					tm:new Date().getTime(),
					type:'organization'
					},
				dataType:"json",
				success: function(data){
                    if("success" == data.result){
                    	var setting = {
                           
							data: {
								simpleData: {
									enable: true
								}
							},
                			    showLine: true,
                			    checkable: false
                			};
               			var zTreeNodes = eval(data.zTreeNodes);
               			// zTree = $("#leftTree").zTree(setting, zTreeNodes);
                        zTree = $.fn.zTree.init($("#leftTree"), setting, zTreeNodes);
                    }else if ("exception" == data.result){
                		alert("机构管理模块"+data.exception);//显示异常
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