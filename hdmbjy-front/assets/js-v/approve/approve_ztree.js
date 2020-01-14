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
				url: httpurl+'approve/listAllApprove',
		    	data: {
					tm:new Date().getTime(),
					type:'approve'
					},
				dataType:"json",
				success: function(data){
                    if("success" == data.result){
                    	var setting = {
							callback: {
								onClick:vm.setTier
								},
							data: {
								simpleData: {
									enable: true
								},
								},
                			    showLine: true,
                			    checkable: false,
                			};
               			var zTreeNodes = eval(data.zTreeNodes);
                        zTree = $.fn.zTree.init($("#leftTree"), setting, zTreeNodes);
                    }else if ("exception" == data.result){
                		alert("审批类型管理模块"+data.exception);//显示异常
                    }
                }
			})
    	},
		//获取该节点的级数
		setTier:function(event, treeId, treeNode){
			treeNode.url=treeNode.url+"&tier="+treeNode.level;
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

