var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		SPARE1:'',	// 审核字段
		QID:'',         //id 增加
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		nginxurl:'',
		add:false,		//增
		del:false,		//删
		edit:false,		//改
		examine:false,		//审核
		toExcel:false,	//导出到excel权限
		loading:false	//加载状态
    },
    
    mixins: [formatDate],	//混入模块
    
	methods: {
		
        //初始执行
        init() {
        	//复选框控制全选,全不选 
    		$('#zcheckbox').click(function(){
	    		 if($(this).is(':checked')){
	    			 $("input[name='ids']").click();
	    		 }else{
	    			 $("input[name='ids']").attr("checked", false);
	    		 }
    		});
    		this.nginxurl = nginxurl;
    		this.getList();
    		this.getDic();
        },
        //数据字典
        getDic: function(){
        	//审核数据字典
        	$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'dictionaries/getLevelsByNameEn?tm='+new Date().getTime(),
    	    	data: {NAME_EN:'examine'},// 轮播图片审核状态
    			dataType:'json',
    			success: function(data){
    				 $("#SPARE1").html('<option value="" >全部</option>');
    				 $.each(data.list, function(i, dvar){
    						$("#SPARE1").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
    				 });
    			}
    		});
        	
        	
        	/*$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
    	    	data: {DICTIONARIES_ID:'f7a78185f3b1437c83c16a76e574c95e'},// 轮播图片类型
    			dataType:'json',
    			success: function(data){
    				 $("#SPARE1").html('<option value="" >请选择图片类型</option>');
    				 $.each(data.list, function(i, dvar){
    						$("#type").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
    				 });
    			}
    		});*/
        	
        	
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'rotaryimg/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,
        			   SPARE1:this.SPARE1,
        			   tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.QID = data.QID;
        			 vm.hasButton();
        			 vm.loading = false;
        			 //0:未审核 1:已审核
        			 
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("轮播图管理",data.exception);//显示异常
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
    	goAdd: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="轮播图管理";
    		 diag.URL = '../../rotaryimg/rotaryimg/rotaryimg_edit.html';
    		 diag.Width = 600;
    		 diag.Height = 300;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮	//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    	    	 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList();
    			}
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//修改
    	goEdit: function(id,type){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="编辑";
    		 diag.URL = '../../rotaryimg/rotaryimg/rotaryimg_edit.html?FID='+id+'&imgType='+type;
    		 diag.Width = 600;
    		 diag.Height = 300;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList();
    			}
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//删除
    	goDel: function (id,path){
    		var pth = path.substr(path.indexOf("/"));
    		swal({
    			title: '',
                text: "确定要删除吗?",
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
            			url: httpurl+'rotaryimg/delete',
            	    	data: {ROTARYIMG_ID:id,PATH:pth,tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				 if("success" == data.result){
            					 swal("删除成功", "已经从列表中删除!", "success");
            				 }
            				 vm.getList();
            			}
            		});
                }
            });
    	},
    	//审核操作
    	goExamine: function(id,type){
    		if (type == 1) {
				return;
			}else{
				swal({
	    			title: '',
	                text: "确定要通过审核吗?",
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
	            			url: httpurl+'rotaryimg/examine',
	            	    	data: {ROTARYIMG_ID:id,tm:new Date().getTime()},
	            			dataType:'json',
	            			success: function(data){
	            				 if("success" == data.result){
	            					 swal("审核成功", "", "success");
	            				 }
	            				 vm.getList();
	            			}
	            		});
	                }
	            });
			}
    		
    	},
    	
    	
    	
    	//批量操作
    	makeAll: function (msg){
    		swal({
                title: '',
                text: msg,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
    	        	var str = '';
    				for(var i=0;i < document.getElementsByName('ids').length;i++){
    					  if(document.getElementsByName('ids')[i].checked){
    					  	if(str=='') str += document.getElementsByName('ids')[i].value;
    					  	else str += ',' + document.getElementsByName('ids')[i].value;
    					  }
    				}
    				if(str==''){
    					$("#cts").tips({
    						side:2,
    			            msg:'点这里全选',
    			            bg:'#AE81FF',
    			            time:3
    			        });
    	                swal("", "您没有选择任何内容!", "warning");
    					return;
    				}else{
    					if(msg == '确定要删除选中的数据吗?'){
    						this.loading = true;
    						$.ajax({
    							xhrFields: {
    	                            withCredentials: true
    	                        },
    							type: "POST",
    							url: httpurl+'rotaryimg/deleteAll?tm='+new Date().getTime(),
    					    	data: {DATA_IDS:str},
    							dataType:'json',
    							success: function(data){
    								if("success" == data.result){
    									swal("删除成功", "已经从列表中删除!", "success");
    		        				 }
    								vm.getList();
    							}
    						});
    					}
    				}
                }
            });
    	},
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'rotaryimg:add,rotaryimg:del,rotaryimg:edit,toExcel,examine';
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
        			vm.add = data.rotaryimgfhadminadd;		//新增权限
        			vm.del = data.rotaryimgfhadmindel;		//删除权限
        			vm.edit = data.rotaryimgfhadminedit;	//修改权限
        			vm.toExcel = data.toExcel;						//导出到excel权限
        			vm.examine = data.examine;						//审核权限
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);		//显示异常
                 }
        		}
        	})
        },
        
        //导出excel
		goExcel: function (){
			swal({
               	title: '',
                text: '确定要导出到excel吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	window.location.href = httpurl+'rotaryimg/excel';            	
                }
            });
		},
		
		formatDate: function (time){
	        	let date = new Date(time);
	        	return this.formatDateUtil(date, "yyyy-MM-dd hh:mm:ss");
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