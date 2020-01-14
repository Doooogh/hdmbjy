
var httpurl = httpurlIm;

var vm = new Vue({
	el: '#app',
	
	data:{
		FRIENDS_ID: '',	//主键ID
		FGROUP_ID: '',	//分组ID
		FUSERNAME: '',	//用户名
		groupList: []	//分组列表
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FRIENDS_ID');		//当接收过来的FID不为null时,表示此页面是修改进来的
        	var FUSERNAME = this.getUrlKey('FUSERNAME');
        	if(null != FUSERNAME){
        		this.FUSERNAME = FUSERNAME;
        	}
        	if(null != FID){
        		this.FRIENDS_ID = FID;
        		this.getGroupList();
        		this.getData();
        	}
        },
        
        //去保存
    	save: function (){
    		
    		this.FGROUP_ID = $("#FGROUP_ID").val();
    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'friends/edit',
			    	data: {FRIENDS_ID:this.FRIENDS_ID,FGROUP_ID:this.FGROUP_ID,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	$("#FGROUP_ID").tips({
                				side:3,
                	            msg:'保存成功',
                	            bg:'#AE81FF',
                	            time:2
                	        });
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	alert("好友分组"+data.exception);//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }
                    }
				}).done().fail(function(){
				   alert("登录失效! 请求服务器无响应，稍后再试");
                   $("#showform").show();
           		   $("#jiazai").hide();
                });
    	},
    	
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'friends/goEdit',
		    	data: {FRIENDS_ID:this.FRIENDS_ID,FUSERNAME:this.FUSERNAME,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	vm.FRIENDS_ID = data.pd.FRIENDS_ID;		//主键ID
                     	vm.FGROUP_ID = data.pd.FGROUP_ID;		//分组ID
                     }else if ("exception" == data.result){
                    	alert("好友分组"+data.exception);//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
				  alert("登录失效! 请求服务器无响应，稍后再试");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},
    	
        //分组列表
        getGroupList: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'fgroup/getFgroup',
            	data: {tm:new Date().getTime()},
        		dataType:'json',
        		success: function(data){
        			vm.groupList = data.list;
        		}
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