
var httpurl = httpurlIm;

layui.use(['layim', 'laypage'], function(){
  var layim = layui.layim
  ,laytpl = layui.laytpl
  ,$ = layui.jquery
  ,res = { };
  var html = laytpl(LAY_tpl.value).render({
    data: res.data
  });
  $('#LAY_view').html(html);
});

var id;
var type;
var showCount = -1;		//每页显示条数
var currentPage = 9999;	//这样写，打开聊天记录页面，先显示最后一页

window.onload=function (){
	id = this.getUrlKey('id');		//链接参数
	type = this.getUrlKey('type');	//链接参数
	setTimeout(function(){
		getList();
    },100);
	if('friend' != type){
		$("#msgm").hide();
	}
}
//获取列表
function getList(){
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurl+'hismsg/himsglist?showCount='+showCount+'&currentPage='+currentPage,
		data: {id:id,type:type,tm:new Date().getTime()},
		dataType:"json",
		success: function(data){
		 if("success" == data.result){
			 var messge = '';
			 $.each(data.varList, function(i, dvar){
				 if(data.pd.USERNAME == dvar.USERNAME){
					 messge += '<li class="layim-chat-mine"><div class="layim-chat-user"><img src="'+httpurlSystem+dvar.PHOTO+'"><cite><i>'+dvar.CTIME+'</i>'+dvar.NAME+'</cite></div><div class="layim-chat-text">'+layui.layim.content(dvar.CONTENT)+'</div></li>';
				 }else{
					 messge +='<li><div class="layim-chat-user"><img src="'+httpurlSystem+dvar.PHOTO+'"><cite><i>'+dvar.CTIME+'</i>'+dvar.NAME+'</cite></div><div class="layim-chat-text">'+layui.layim.content(dvar.CONTENT)+'</div></li>';
				 }
			 });
			 $("#messge").html(messge);
			 
			 $("#pageStr").html(data.page.pageStrSimplify2);
		 }else if ("exception" == data.result){
         	layer.msg("聊天记录"+data.exception);//显示异常
         }
		}
	}).done().fail(function(){
        layer.msg("登录失效! 请求服务器无响应，稍后再试");
        setTimeout(function () {
        	window.location.href = "../../login.html";
        }, 2000);
    });
}

//-----分页必用----start
function nextPage(page){
	currentPage = page;
	getList();
}
//-----分页必用----end

//根据url参数名称获取参数值
function getUrlKey(name) {
    return decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

//打开消息管理窗口
function allmsg(){
	parent.layer.open({
	    type: 2,
	    title: '聊天记录管理',
	    shadeClose: true,
	    shade: false,
	    maxmin: true, //开启最大化最小化按钮
	    area: ['1200px', '600px'],
	    content: '../../fhim/hismsg/hismsg_list_del.html?id='+id+'&type='+type
	  });
}