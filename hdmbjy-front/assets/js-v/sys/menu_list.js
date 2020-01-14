
var httpurl = httpurlSystem;

var vm = new Vue({
	el: '#app',
	
	data: {
		menuList: [],	//list
		MENU_ID: '0',	//主键ID
		pd: [],
		add:false,
		del:false,
		edit:false,
		loading:false	//加载状态
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('MENU_ID');//链接参数
        	if(null != FID){
        		this.MENU_ID = FID;
        		this.getList(this.MENU_ID);
        	}
        	
        	var FMSG = this.getUrlKey('FMSG');			//从修改添加成功后跳转过来
        	if(null != FMSG && 'ok' == FMSG){
        		parent.vm.getData(this.MENU_ID); 		//刷新父页面
        	}
        	
        },
        
        //获取列表
        getList: function(MENU_ID){
        	this.loading = true;
        	this.MENU_ID = MENU_ID;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'menu/list',
        		data: {MENU_ID:this.MENU_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.menuList = data.menuList;
        			 vm.pd = data.pd;
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("菜单管理",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
		//编辑菜单图标
		setIcon: function (MENU_ID){
		   	 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="编辑图标";
			 diag.URL = '../menu/menu_icon.html?MENU_ID='+MENU_ID;
			 diag.Width = 800;
			 diag.Height = 600;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮 
			 diag.CancelEvent = function(){ //关闭事件
				var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
	   			if(varSon != null && varSon.style.display == 'none'){
	   				 vm.getList(vm.MENU_ID);
	   			}
				diag.close();
			 };
			 diag.show();
		},
        
		//编辑菜单(新增or修改)
		editMenu: function (MENU_ID,msg){
			window.location.href="menu_edit.html?MENU_ID="+MENU_ID+"&msg="+msg;
		},
		
		//删除
		delMenu: function (MENU_NAME,MENU_ID){
			swal({
            	title: '',
                text: '确定要删除 '+MENU_NAME+' 吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	this.loading = true;
	            	$.ajax({
	            		xhrFields: {
	                        withCredentials: true
	                    },
	        			type: "POST",
	        			url: httpurl+'menu/delete',
	        	    	data: {MENU_ID:MENU_ID,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
	        					 swal("删除成功", MENU_NAME+" 已经从列表中删除", "success");
	        					 vm.getList(vm.MENU_ID);		//刷新本页面
	        					 parent.vm.getData(vm.MENU_ID); //刷新父页面
	        				 }else{
	        					 swal("删除失败!", "请先删除子菜单!", "error");
	        					 vm.loading = false;
	        				 }
	        				 
	        			}
	        		});
                }
            });
		},
		
       //判断按钮权限，用于是否显示按钮
       hasButton: function(){
        	var keys = 'menu:add,menu:del,menu:edit';
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
        			vm.add = data.menufhadminadd;
        			vm.del = data.menufhadmindel;
        			vm.edit = data.menufhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
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