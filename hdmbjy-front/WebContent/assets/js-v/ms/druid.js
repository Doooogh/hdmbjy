
var vm = new Vue({
	el: '#app',
	
	methods: {
		
        //初始执行
        init() {
        	var mshost = this.getUrlKey('mshost');	//链接参数
        	if(null != mshost){
        		window.location.href = zuulUrl + mshost + '/druid/index.html';
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
