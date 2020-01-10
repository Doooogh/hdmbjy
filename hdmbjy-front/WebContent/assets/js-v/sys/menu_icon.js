
var httpurl = httpurlSystem;

var vm = new Vue({
			el: '#app',
	
	data:{
		MENU_ID: ''	//主键ID
    },

    methods: {
    	
    	//初始执行
        init() {
        	var FID = this.getUrlKey('MENU_ID');	//链接参数
        	if(null != FID){
        		this.MENU_ID = FID;
        	}
        },
        
      	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }
    	
    },
	
	mounted(){
        this.init();
    }
})

//保存图标
function setIcon(fid) {
	$("#showform").hide();
	$("#jiazai").show();
	$.ajax({
    	xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurl+'menu/editicon',
    	data: {MENU_ID:vm.MENU_ID,MENU_ICON:fid.getAttribute("data-clipboard-text"),tm:new Date().getTime()},
		dataType:"json",
		success: function(data){
              if("success" == data.result){
            	  swal("", "保存成功", "success");
              	  setTimeout(function(){
              		top.Dialog.close();//关闭弹窗
                  },1000);
              }else if ("exception" == data.result){
              	showException("菜单图标",data.exception);	//显示异常
              	$("#showform").show();
          		$("#jiazai").hide();
              }
           }
	}).done().fail(function(){
        swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
        $("#showform").show();
		$("#jiazai").hide();
     });
}