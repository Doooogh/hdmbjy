var zTree;	
	var vm = new Vue({
		el: '#app',
		TPAGE:'',  //跳转的页面  1 普通老师 2 专职教师 3 负责人

    methods: {
    	
    	beforeInit(){
    		this.TPAGE=FULLTIME_TEACHER;
    	},
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
				url: httpurl+'organization/listAllOrganization',
		    	data: {
					tm:new Date().getTime(),
					type:'scuser',
					tPage:this.TPAGE,
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
                    			checkable: false,
                    			view: {
                    				nameIsHTML: true, //允许name支持html				
                    				selectedMulti: false
                    			},
                    			edit: {
                    				enable: false,
                    				editNameSelectAll: false
                    			}
                    		};
                    	var zTreeNodes = eval(data.zTreeNodes);
                    	// zTree = $("#leftTree").zTree(setting, zTreeNodes);
                    	zTree = $.fn.zTree.init($("#leftTree"), setting, zTreeNodes);
                    	fuzzySearch('leftTree','#key',null,false); //初始化模糊搜索方法
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
		},
		//根据url参数名称获取参数值
		getUrlKey: function (name) {
 		    return decodeURIComponent(
		        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
		},
    	
    },
    
    mounted(){
        this.init();
    },
	beforeMount(){
		this.beforeInit();
	}
})	
	
window.onresize=function(){  
	vm.treeFrameT();
};