
var httpurl = httpurlSystem;

var zTree;
$(document).ready(function(){
	getData()
});

//获取数据
function getData(){
	//发送 post 请求
    $.ajax({
    	xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurl+'dictionaries/listAllDictToCreateCode',
    	data: {ROLE_ID:this.ROLE_ID,tm:new Date().getTime()},
		dataType:"json",
		success: function(data){
            if("success" == data.result){
       			var setting = {
      				showLine: true,
      				checkable: false
       			};
    			var zTreeNodes = eval(data.zTreeNodes);
    			zTree = $("#tree").zTree(setting, zTreeNodes);
            }
        }
	})
}

//设置ID给父窗口
 function setDID(DICTIONARIES_ID){
	$("#DICTIONARIES_ID").val(DICTIONARIES_ID);
	top.Dialog.close();
 }