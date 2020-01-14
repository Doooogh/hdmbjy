var tab;
var vm = new Vue({
    el: '#app',
    methods: {
        //添加标签
        tabAddHandler: function (mid, mtitle, murl) {
            tab.update({
                id : mid,
                title : mtitle,
                url : murl,
                isClosed : true
            });
            tab.add({
                id : mid,
                title : mtitle,
                url : murl,
                isClosed : true
            });
            tab.activate(mid);
        },

        //关闭标签
        tabClose: function (mid){
            tab.close(mid);
        },
        //调整宽度和高度
        cmainFrameT: function (){
            var hmainT = document.getElementById("page");
            var bheightT = document.documentElement.clientHeight;
            hmainT.style.width = '100%';
            hmainT.style.height = (bheightT - 41) + 'px';
        },
        tabTopMethod:function(){
			$("#page_tab1_index1")[0].contentWindow.vm.topTask();
			$("#page_tab1_index1")[0].contentWindow.vm.topInform();
        },
        //初始执行
        init() {
			
            tab = new TabView({
                containerId : 'tab_menu',
                pageid : 'page',
                cid : 'tab1',
                position : "top"
            });
            tab.add({
                id : 'tab1_index1',
                title : "主页",
                url : "default.html",
                isClosed : false
            });
            
            $('#tab_menu').contextPopup({
                title: '',
                items: [
                {label:'关闭全部标签', action:function() { top.vm.indexTabClose('all'); } },
                {label:'关闭当前标签', action:function() { top.vm.indexTabClose('own'); } },
                {label:'关闭其它标签', action:function() { top.vm.indexTabClose('other'); } }
                ]
            });
            this.cmainFrameT();
        }

    },
    mounted(){
        this.init()
    }
})

//窗口宽度高度变化事件
window.onresize = function() {
	vm.cmainFrameT();
};


//3-1-3-5-9-6-7-9-0-QQ