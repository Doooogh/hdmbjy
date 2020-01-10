
var httpurl = httpurlTools;

var type = '';
var ftlNmame = '';
window.onload=function (){
	type = this.getUrlKey('type');		//链接参数
	ftlNmame = this.getUrlKey('ffile');	//链接参数
    getCode();
}

window.onresize=function(){  
	cmainFrame();
};

//保存
function save(){
	$("#jiazai").show();
	var codeTxt  = getCodeTxt();
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurl+'codeeditor/save',
    	data: {codeTxt:codeTxt,type:type,ftlNmame:ftlNmame,tm:new Date().getTime()},
		dataType:'json',
		success: function(data){
			if("success" == data.result){
			  $("#jiazai").hide();
			  $("#sts").tips({
					side:1,
		            msg:'保存成功',
		            bg:'#83CB4F',
		            time:8
		       });
			 }
		}
	});
}

//获取code
function getCode(){
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurl+'codeeditor/getCode',
    	data: {type:type,ftlNmame:ftlNmame,tm:new Date().getTime()},
		dataType:'json',
		success: function(data){
			if("success" == data.result){
			  $("#jiazai").hide();
			  setCodeTxt(data.code);
			 }else if ("exception" == data.result){
              	showException("模版显示",data.exception);//显示异常
             }
		}
	}).done().fail(function(){
        swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
        setTimeout(function () {
        	window.location.href = "../../login.html";
        }, 2000);
    });
}

//还原
function reduction(){
	$("#jiazai").show();
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurl+'codeeditor/reduction',
    	data: {type:type,ftlNmame:ftlNmame,tm:new Date().getTime()},
		dataType:'json',
		success: function(data){
			if("success" == data.result){
			  $("#jiazai").hide();
			  setCodeTxt(data.code);
			  $("#hts").tips({
					side:1,
		            msg:'还原成功',
		            bg:'#83CB4F',
		            time:8
		       });
			 }
		}
	});
}

//历史编辑
function history(){
	 var diag = new top.Dialog();
	 diag.Drag=true;
	 diag.Title ="历史编辑";
	 diag.URL = '../../tools/codeeditor/codeeditor_list.html?msg=2&TYPE='+type+'&FTLNMAME='+ftlNmame;
	 diag.Width = 800;
	 diag.Height = 500;
	 diag.Modal = true;				//有无遮罩窗口
	 diag. ShowMaxButton = true;	//最大化按钮
     diag.ShowMinButton = true;		//最小化按钮
	 diag.CancelEvent = function(){ //关闭事件
		 if('yes' == diag.innerFrame.contentWindow.document.getElementById('msg').value){
			getCode();
		}
		diag.close();
	 };
	 diag.show();
}

//设置代码内容
function setCodeTxt(value){
    if(typeof(editor) == "undefined"){
        $('#editorBox').val(value);
    }else{
        editor.setValue(value,-1);
    } 
}

//获取代码内容
function getCodeTxt(){
    if(typeof(editor) == "undefined"){
        return $('#editorBox').text();
    }else{
        return editor.getValue();
    } 
}

//根据url参数名称获取参数值
function getUrlKey (name) {
    return decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

if(ie_error()){
    $('#editor').hide();
}else{
    $('#editorBox').hide();
    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/php");
}

function cmainFrame(){
	var hmain = document.getElementById("editor");
	var bheight = document.documentElement.clientHeight;
	hmain .style.width = '100%';
	hmain .style.height = (bheight  - 215) + 'px';
}

cmainFrame();
