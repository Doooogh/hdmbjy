
var httpurl = httpurlActiviti;

var vm = new Vue({
	el: '#app',
	
	data:{
		serverurl: '',	//后台地址
		curl:'',		//当前地址
		sysurl:'',		//系统管理服务地址
		modelId: '',	//流程ID
		iframe:false	//是否显示mainFrame
    },
    
    methods: {
    	//初始执行
        init() {
    		
        	var mcallback = this.getUrlKey('mcallback');//返回链接参数
        	if('ok' == mcallback){
        		swal("", "保存成功", "success");
            	setTimeout(function(){
            		top.Dialog.close();	//关闭弹窗
                },1000);
        	}else if('close' == mcallback){
        		top.Dialog.close();		//关闭弹窗
        	}else{
        		this.iframe = true;
        	}
    		
    		this.serverurl = httpurl;
    		this.curl= window.location.href;
    		this.sysurl = httpurlSystem;
    		var modelId = this.getUrlKey('modelId');//链接参数
        	if(null != modelId){
        		this.modelId = modelId;
        	}
        	this.cmainFrame();
        },
        
      	//浏览器窗口大小变化时调用
        cmainFrame: function(){
            var hmain = document.getElementById("mainFrame");
            var bheight = document.documentElement.clientHeight;
            hmain.style.width = '100%';
            hmain.style.height = (bheight-5) + 'px';
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

//窗口大小变化事件
window.onresize=function(){  
	vm.cmainFrame();
};
