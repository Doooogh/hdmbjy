
var httpurl = httpurlSystem;

window.onload = function(){ 
	var content = top.vm.handleDetails('');
	content = content.split('../../plugins/ueditor/jsp/upload').join(httpurl+'plugins/ueditor/jsp/upload');
	$("#content").html(content);
};