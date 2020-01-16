var zTree;
var vm = new Vue({
    el: '#app',
    data:{
		username: '',		//当前用户
		adminname: '',		//管理员用户
    },
    methods: {

        //初始执行
        init() {
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
                url: httpurl+'archive/archiveTree',
                data: {
					FIND_TYPE:2,
					tm:new Date().getTime()
					},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                    	vm.adminname = data.adminname;
                    	vm.username = data.userName;
                    	var setting = {
							data: {
								simpleData: {
									enable: true
								}
							},
                            view: {
                                selectedMulti: false
                            },
                            showLine: true,
                            checkable: false
                        };
                        var zTreeNodes = eval(data.zTreeNodes);
                        // zTree = $("#leftTree").zTree(setting, zTreeNodes);
                        zTree = $.fn.zTree.init($("#leftTree"), setting, zTreeNodes);
                        vm.treeFrameT();
                    }else if ("exception" == data.result){
                        alert("菜单管理模块"+data.exception);//显示异常
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
   // vm.treeFrameT();
};