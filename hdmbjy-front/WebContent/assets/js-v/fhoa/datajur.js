
var httpurl = httpurlOa;

var vm = new Vue({
	el: '#app',
	
	data:{
		DATAJUR_ID: '',		//主键ID
		pd: [],				//存放字段参数
		DEPARTMENT_ID:''	//部门ID
    },
	
	methods: {
		
        //初始执行
        init() {
        	var DATAJUR_ID = this.getUrlKey('DATAJUR_ID');	//链接参数
        	if(null != DATAJUR_ID){
        		this.DATAJUR_ID = DATAJUR_ID;
        		this.getDepartmenttree();
        	}
        },
        
        //去保存
    	save: function (){

    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'datajur/edit',
			    	data: {DATAJUR_ID:this.DATAJUR_ID,DEPARTMENT_ID:this.DEPARTMENT_ID,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("数据权限",data.exception);//显示异常
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
        
      	//获取部门下拉树
        getDepartmenttree: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'datajur/goEdit',
        		data: {DATAJUR_ID:this.DATAJUR_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        			 vm.DEPARTMENT_ID = data.pd.DEPARTMENT_ID;
	        		 if("success" == data.result){
						//下拉树
						var defaultNodes = JSON.parse(data.zTreeNodes);
						//绑定change事件
						$("#selectTree").bind("change",function(){
							if($(this).attr("relValue")){
								vm.DEPARTMENT_ID = $(this).attr("relValue")
						    }
						});
						//赋给data属性
						$("#selectTree").data("data",defaultNodes);  
						$("#selectTree").render();
						$("#selectTree2_input").val(data.pd.NAME);
	        		 }
        		}
        	})
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