
var httpurl = httpurlSystem;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],			//list
		page: [],				//分页类
		KEYWORDS: '',			//检索条件 关键词
		DICTIONARIES_ID: '0',	//主键ID
		ALL_ID:	'0',			//下拉检索用, 当为''时是全部检索
		PARENT_ID: '0',			//上级ID
		TYPE: 1,				//操作类型，检索or上级点击进入 1or2
		showCount: -1,			//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,			//当前页码
		add:false,
		del:false,
		edit:false,
		loading:false			//加载状态
    },
    
	methods: {
		
        //初始执行
        init() {
        	var id = this.getUrlKey('id');  //链接参数, 从树点过来
        	if(null != id){
        		this.DICTIONARIES_ID = id;
        	}
    		this.getList(this.DICTIONARIES_ID,1);
        },
        
        
        //获取列表
        getList: function(DICTIONARIES_ID,TYPE){
        	this.loading = true;
        	this.TYPE = TYPE;
        	if(TYPE == 1){
        		this.DICTIONARIES_ID = DICTIONARIES_ID;
        	}else if('' == this.ALL_ID){
            	this.DICTIONARIES_ID = '';
        	}
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'dictionaries/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {DICTIONARIES_ID:this.DICTIONARIES_ID,KEYWORDS:this.KEYWORDS,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 if(TYPE == 1 || '' != vm.ALL_ID){
        				 	vm.PARENT_ID = data.PARENT_ID;
               			 	vm.ALL_ID = vm.DICTIONARIES_ID;
             	     }else{
             	    	vm.DICTIONARIES_ID = '0';
         	        	vm.PARENT_ID = '0';
             	     }
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("数据字典",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
		//新增
		goAdd: function (DICTIONARIES_ID){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="新增";
			 diag.URL = '../dictionaries/dictionaries_edit.html?PARENT_ID='+DICTIONARIES_ID;
			 diag.Width = 600;
			 diag.Height = 438;
			 diag.CancelEvent = function(){ //关闭事件
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList(vm.DICTIONARIES_ID,1);
    				 parent.vm.getData(); //刷新父页面
    			 }
				 diag.close();
			 };
			 diag.show();
		},
		
		//修改
		goEdit: function (DICTIONARIES_ID){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="编辑";
			 diag.URL = '../dictionaries/dictionaries_edit.html?PARENT_ID='+this.DICTIONARIES_ID+'&DICTIONARIES_ID='+DICTIONARIES_ID;
			 diag.Width = 600;
			 diag.Height = 372;
			 diag.CancelEvent = function(){ //关闭事件
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList(vm.DICTIONARIES_ID,1);
    				 parent.vm.getData(); //刷新父页面
    			 }
				 diag.close();
			 };
			 diag.show();
		},
        
		//删除
		goDel: function (Id){
			swal({
				title: '',
	            text: "确定要删除 吗?",
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
	        			url: httpurl+'dictionaries/delete',
	        	    	data: {DICTIONARIES_ID:Id,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
	        					 swal("删除成功", "已经从列表中删除!", "success");
	        					 vm.getList(vm.DICTIONARIES_ID,1);
	            				 parent.vm.getData(); //刷新父页面
	        				 }else if("error" == data.result){
	        					swal("删除失败!", "删除失败！请先删除子级或删除占用资源!", "warning");
	        					vm.loading = false;
	        				 }else{
	        					swal("删除失败!", "删除失败！排查表不存在或其表中没有BIANMA字段!", "warning");
	        					vm.loading = false;
	        				 }
	        			}
	        		});
                }
            });
		},
		
      	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'dictionaries:add,dictionaries:del,dictionaries:edit';
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
        			vm.add = data.dictionariesfhadminadd;
        			vm.del = data.dictionariesfhadmindel;
        			vm.edit = data.dictionariesfhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },

	    //-----分页必用----start
	    nextPage: function (page){
	    	this.currentPage = page;
	    	this.getList(this.DICTIONARIES_ID,this.TYPE);
	    },
	    changeCount: function (value){
	    	this.showCount = value;
	    	this.getList(this.DICTIONARIES_ID,this.TYPE);
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