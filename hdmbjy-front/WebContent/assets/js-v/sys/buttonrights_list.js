
var httpurl = httpurlSystem;

var vm = new Vue({
	el: '#app',

	data:{
		roleList: [],			//list 列出组(页面横向排列的一级组)
		roleList_z: [],			//list 列出此组下架角色
		buttonlist: [],			//list 列出所有按钮
		roleFhbuttonlist: [],	//list 列出所有角色按钮关联数据
		pd: [],					//map
		ROLE_ID: '1',			//角色ID
		rbvalue: false,			//缓冲变量
		edit:false,
		loading:false			//加载状态
    },
    
    methods: {
    	
        //初始执行
        init() {
        	var FID = this.getUrlKey('ROLE_ID');	//链接参数
        	if(null != FID){
        		this.ROLE_ID = FID;
        	}
        	this.getList(this.ROLE_ID);
        },
        
        //获取列表
        getList: function(ROLE_ID){
        	this.loading = true;
        	this.ROLE_ID = ROLE_ID;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'buttonrights/list?',
        		data: {ROLE_ID:ROLE_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.roleList = data.roleList;
        			 vm.roleList_z = data.roleList_z;
        			 vm.buttonlist = data.buttonlist;
        			 vm.roleFhbuttonlist = data.roleFhbuttonlist;
        			 vm.pd = data.pd;
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限设置",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//处理按钮点击
    	upRb: function (ROLE_ID,FHBUTTON_ID){
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+"buttonrights/upRb",
    			data: {ROLE_ID:ROLE_ID,BUTTON_ID:FHBUTTON_ID,tm:new Date().getTime()},
    			dataType:'json',
    			success: function(data){
    				if ("exception" == data.result){
                     	showException("按钮权限设置",data.exception);//显示异常
                     }
    			}
    		});
    	},
    	
    	//切换视图
    	changeView: function(){
    		window.location.href='buttonrights_list_r.html?ROLE_ID='+this.ROLE_ID;
    	},
        
    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
    	
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'buttonrights:edit';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'head/hasButton',
        		data: {keys:keys,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.edit = data.buttonrightsfhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        }
    	
    },
    
    mounted(){
        this.init();
    }
})