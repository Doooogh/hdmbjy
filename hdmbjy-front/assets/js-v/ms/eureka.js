
var vm = new Vue({
	el: '#app',
	
	methods: {
		
        //初始执行
        init() {
        	var eurekanum = this.getUrlKey('eurekanum');	//链接参数
        	if(null != eurekanum){
        		window.location.href = eurekaServers[eurekanum];
        	}else{
        		window.location.href = eurekaServers[0];
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
