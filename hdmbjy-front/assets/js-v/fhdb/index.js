
var vm = new Vue({
	el: '#app',
	
	data:{
		isShow:false
    },
	
	methods: {
		
        //初始执行
        init() {
        	var mshost = this.getUrlKey('mshost');	//链接参数
        	var type = this.getUrlKey('type');		//链接参数
        	if(null != mshost && null != type){
        		var tohref = '';
        		if('tableList' == type){
        			tohref = 'brdb/table_list.html';
        		}else if('backupList' == type){
        			tohref = 'backup/backup_list.html';
        		}else if('brdbList' == type){
        			tohref = 'brdb/brdb_list.html';
        		}else if('sqlEdit' == type){
        			tohref = 'sqledit/sql_edit.html	';
        		}
        		window.location.href = tohref + '?mshost='+mshost;
        	}else{
        		this.isShow = true;
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
