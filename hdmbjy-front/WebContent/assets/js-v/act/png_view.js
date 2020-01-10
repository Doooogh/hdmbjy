
var httpurl = httpurlActiviti;

var vm = new Vue({
	el: '#app',
	
	data:{
		DEPLOYMENT_ID_: '',	//部署ID
		FILENAME: '',		//图片名称
		imgSrc: ''			//图片地址 base64格式
    },
    
    methods: {
    	
    	//初始执行
        init() {
        	this.DEPLOYMENT_ID_ = this.getUrlKey('DEPLOYMENT_ID_');	//链接参数
        	this.FILENAME = this.getUrlKey('FILENAME');				//链接参数
        	this.getdata();
        },
        
        //获取数据
        getdata: function (){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'procdef/getViewPng',
            	data: {DEPLOYMENT_ID_:this.DEPLOYMENT_ID_,FILENAME:this.FILENAME,tm:new Date().getTime()},
        		dataType:'json',
        		success: function(data){
        			if("success" == data.result){
        			  $("#jiazai").hide();
        			 	vm.imgSrc = data.imgSrc;
        			 }else if ("exception" == data.result){
                      	showException("Png预览",data.exception);//显示异常
                     }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
            });
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