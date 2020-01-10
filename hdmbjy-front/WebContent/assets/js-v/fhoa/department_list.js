
var httpurl = httpurlOa;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],				//list
		page: [],					//分页类
		KEYWORDS: '',				//检索条件 关键词
		DEPARTMENT_ID: '0',			//主键ID
		PARENT_ID: '0',				//上级ID
		showCount: -1,				//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,				//当前页码
		add:false,
		del:false,
		edit:false,
		toExcel:false,
		loading:false				//加载状态
    },

	methods: {
		
        //初始执行
        init() {
        	var id = this.getUrlKey('id');  //链接参数, 从树点过来
        	if(null != id){
        		this.DEPARTMENT_ID = id;
        	}
    		this.getList(this.DEPARTMENT_ID);
        },

        //获取列表
        getList: function(F_ID){
        	this.DEPARTMENT_ID = F_ID;
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'department/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {DEPARTMENT_ID:this.DEPARTMENT_ID,KEYWORDS:this.KEYWORDS,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
				 	 vm.PARENT_ID = data.PARENT_ID;
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("组织机构",data.exception);//显示异常
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
		goAdd: function (DEPARTMENT_ID){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="新增";
			 diag.URL = '../../fhoa/department/department_edit.html?PARENT_ID='+DEPARTMENT_ID;
			 diag.Width = 600;
			 diag.Height = 409;
			 diag.CancelEvent = function(){ //关闭事件
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList(vm.DEPARTMENT_ID);
    				 parent.vm.getData(); //刷新父页面
    			 }
				 diag.close();
			 };
			 diag.show();
		},
		
		//修改
		goEdit: function (DEPARTMENT_ID){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="编辑";
			 diag.URL = '../../fhoa/department/department_edit.html?PARENT_ID='+this.PARENT_ID+'&DEPARTMENT_ID='+DEPARTMENT_ID;
			 diag.Width = 600;
			 diag.Height = 409;
			 diag.CancelEvent = function(){ //关闭事件
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList(vm.DEPARTMENT_ID);
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
	        			url: httpurl+'department/delete',
	        	    	data: {DEPARTMENT_ID:Id,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
	        					 swal("删除成功", "已经从列表中删除!", "success");
	        					 vm.getList(vm.DEPARTMENT_ID);
	            				 parent.vm.getData(); //刷新父页面
	        				 }else if("error" == data.result){
	        					swal("删除失败!", "删除失败！请先删除子级或删除占用资源!", "warning");
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
        	var keys = 'department:add,department:del,department:edit,toExcel';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurlSystem+'head/hasButton',
        		data: {keys:keys,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.add = data.departmentfhadminadd;
        			vm.del = data.departmentfhadmindel;
        			vm.edit = data.departmentfhadminedit;
        			vm.toExcel = data.toExcel;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },

	    //-----分页必用----start
	    nextPage: function (page){
	    	this.currentPage = page;
	    	this.getList(this.DEPARTMENT_ID);
	    },
	    changeCount: function (value){
	    	this.showCount = value;
	    	this.getList(this.DEPARTMENT_ID);
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
