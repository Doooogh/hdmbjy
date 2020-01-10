var vm = new Vue({
	el: '#app',
	
	data:{
		roleList: [],		//角色列表
		pd: [],				//存放字段参数
		rpd: [],
		msg: '1',
		USERNAME: ''
    },
	
	methods: {
		
        //初始执行
        init() {
        	var USERNAME = this.getUrlKey('USERNAME');	//链接参数
        	if(null != USERNAME){
        		this.USERNAME = USERNAME;
        		this.getData();
        	}
        },
        
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'user/view',
		    	data: {USERNAME:this.USERNAME,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	vm.roleList = data.roleList;				//角色列表
                     	vm.pd = data.pd;							//参数map
                     	vm.rpd = data.rpd;
                     	vm.msg = data.msg;
                     }else if ("exception" == data.result){
                     	showException("查看用户",data.exception);	//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
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