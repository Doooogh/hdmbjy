
var httpurl = httpurlSystem;

var vm = new Vue({
	el: '#app',
	
	data:{
		serverurl: '',	//后台地址
		curl:'',		//当前地址
		iframe:false	//是否显示mainFrame
    },
    
    methods: {
    	//初始执行
        init() {
    		this.serverurl = httpurl;
    		this.curl= window.location.href;
    		var userPhoto = this.getUrlKey('userPhoto');//链接参数
        	if(null != userPhoto){
        		swal("", "修改成功", "success");
            	setTimeout(function(){
            		top.location.reload(); 				//头像编辑完后，刷新整个页面
                },1000);
        	}else{
        		this.iframe = true;
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