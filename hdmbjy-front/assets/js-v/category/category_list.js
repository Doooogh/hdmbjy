var vm = new Vue({
	el: '#app',
	
	data: {
		categoryList: [],	//list
		id: '0',	//主键ID
		pd: [],
		add:false,
		del:false,
		edit:false,
		loading:false,	//加载状态,
        nginxurl:nginxurl,
		TYPES:[],

    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('id');//链接参数
        	if(null != FID){
        		this.id = FID;
        		this.getList(this.id);

        	}
        	
        	var FMSG = this.getUrlKey('FMSG');			//从修改添加成功后跳转过来
        	if(null != FMSG && 'ok' == FMSG){
        		parent.vm.getData(this.id); 		//刷新父页面
        	}
        	
        },
        
        //获取列表
        getList: function(cid){
        	this.loading = true;
        	this.id = cid;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'category/list',
        		data: {id:this.id,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.categoryList = data.categoryList;
        			 vm.pd = data.pd;
        			 vm.hasButton();
        			 vm.loading = false;
					 vm.getDict();

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
		setIcon: function (id){
		   	 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="编辑图标";
			 diag.URL = '../Category/Category_icon.html?id='+id;
			 diag.Width = 800;
			 diag.Height = 600;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮 
			 diag.CancelEvent = function(){ //关闭事件
				var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
	   			if(varSon != null && varSon.style.display == 'none'){
	   				 vm.getList(vm.id);
	   			}
				diag.close();
			 };
			 diag.show();
		},
        
		//编辑菜单(新增or修改)
		editCategory: function (id,msg){
			window.location.href="category_edit.html?id="+id+"&msg="+msg;
		},
		
		//删除
		delCategory: function (name,id){
			swal({
            	title: '',
                text: '确定要删除 '+name+' 吗?',
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
	        			url: httpurl+'category/delete',
	        	    	data: {id:id,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
	        					 swal("删除成功", name+" 已经从列表中删除", "success");
	        					 vm.getList(vm.id);		//刷新本页面
	        					 parent.vm.getData(vm.id); //刷新父页面
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
        	var keys = 'category:add,category:del,category:edit';
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
        			vm.add = data.categoryfhadminadd;
        			vm.del = data.categoryfhadmindel;
        			vm.edit = data.categoryfhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },
		getDict: function (){
			$.ajax({
				xhrFields: {
		            withCredentials: true
		        },
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'CATEGORY_TYPE',tm:new Date().getTime()},//类型
				dataType:'json',
				success: function(data){
					vm.TYPES=data.list;
				},
				error:function(){
				alert("错误");	
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