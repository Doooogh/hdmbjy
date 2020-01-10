<!DOCTYPE html>
<html lang="en">
	<head>
	<meta charset="utf-8" />
	<script type="text/javascript" src="../../../assets/js/jquery-1.7.2.js"></script>
	<link type="text/css" rel="stylesheet" href="../../../plugins/zTree/2.6/zTreeStyle.css"/>
	<script type="text/javascript" src="../../../plugins/zTree/2.6/jquery.ztree-2.6.min.js"></script>
	
	<!-- vue -->
	<script src="../../../assets/js-vue/vue.js"></script>
    <!--全局配置-->
    <script src="../../../assets/js-v/config.js"></script>
	
<body>

<div style="width:100%;" id="app">

<table style="width:100%;">
	<tr>
		<td style="width:15%;" valign="top">
			<div style="width:15%;">
				<ul id="leftTree" class="tree">
					<li><img src="../../../assets/images/loading.gif" /></li>
				</ul>
			</div>
		</td>
		<td style="width:85%;" valign="top" >
			<iframe name="treeFrame" id="treeFrame" frameborder="0" src="${objectNameLower}_list.html" style="margin:0 auto;width:100%;height:100%;"></iframe>
		</td>
	</tr>
</table>

</div>
		
<script type="text/javascript">

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
				url: httpurl+'${objectNameLower}/listTree',
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

</SCRIPT>
</body>
</html>

