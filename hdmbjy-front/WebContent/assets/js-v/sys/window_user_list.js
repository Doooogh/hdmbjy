var vm = new Vue({
	el: '#app',
	
	data:{
		roleList: [],	//角色list
		varList: [],	//用户list
		page: [],		//分页类
		pd: [],			//map
		ROLE_ID: '',	//角色ID
		USERNAME: '',	//用户名
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		loading:false	//加载状态
    },

	methods: {
		
        //初始执行
        init() {
    		this.pd.KEYWORDS = '';
    		this.getList();
    		this.choiceTips();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
       		this.pd.STRARTTIME = $("#STRARTTIME").val();
           	this.pd.ENDTIME = $("#ENDTIME").val();
           	this.ROLE_ID = $("#ROLE_ID").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'user/listUsersForWindow?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.pd.KEYWORDS,STRARTTIME:this.pd.STRARTTIME,ENDTIME:this.pd.ENDTIME,ROLE_ID:this.ROLE_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.roleList = data.roleList;
        			 vm.varList = data.userList;
        			 vm.page = data.page;
        			 vm.pd = data.pd;
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("选择用户",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
            });
        },
		
    	//选定用户
    	setUser: function (USERNAME){
    		this.USERNAME = USERNAME;
    		this.userBinding();
    	},

    	//绑定用户
    	userBinding: function (){
    		if('' == this.USERNAME){
    			$("#fhadminth").tips({
    				side:3,
    	            msg:'没有选择任何用户',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    		}else{
    			$("#USERNAME").val(this.USERNAME);
    			top.Dialog.close();
    		}
    	},
    	
		//查看用户
		viewUser: function (USERNAME){
			if('admin' == USERNAME){
				swal("禁止查看!", "不能查看admin用户!", "warning");
				return;
			}
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="资料";
			 diag.URL = '../user/user_view.html?USERNAME='+USERNAME;
			 diag.Width = 600;
			 diag.Height = 319;
			 diag.Modal = false;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
				diag.close();
			 };
			 diag.show();
		},
        
    	//提示双击选择
    	choiceTips: function (){
    		$("#fhadminth").tips({
    			side:1,
    	        msg:'双击选择角色',
    	        bg:'#AE81FF',
    	        time:6
    	    });
    	},
    	
    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
        
        //-----分页必用----start
        nextPage: function (page){
        	this.currentPage = page;
        	this.getList();
        },
        changeCount: function (value){
        	this.showCount = value;
        	this.getList();
        },
        toTZ: function (){
        	var toPaggeVlue = document.getElementById("toGoPage").value;
        	if(toPaggeVlue == ''){document.getElementById("toGoPage").value=1;return;}
        	if(isNaN(Number(toPaggeVlue))){document.getElementById("toGoPage").value=1;return;}
        	this.nextPage(toPaggeVlue);
        }
       //-----分页必用----end
		
	},
	
	mounted(){
        this.init();
    }
})