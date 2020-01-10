
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		add:false,		//增
		del:false,		//删
		edit:false,		//改
		toExcel:false,	//导出到excel权限
		fromExcel:false,	//导入到excel权限
		loading:false,	//加载状态
		ORGANIZATION_ID:'0',
		msg:'',
		TYPES:[],    //机构类型
    },
    
	methods: {
		
        //初始执行
        init() {
			
			var FID = this.getUrlKey('oId');//链接参数
			if(null != FID&&''!=FID){
				this.ORGANIZATION_ID = FID;
				this.getList(this.ORGANIZATION_ID);
			}
			
			var FMSG = this.getUrlKey('FMSG');			//从修改添加成功后跳转过来
			if(null != FMSG && 'ok' == FMSG){
				parent.vm.getData(this.ORGANIZATION_ID); 		//刷新父页面
			}
			// var FMSG = this.getUrlKey('FMSG');			//从修改添加成功后跳转过来
			/* if(null != FMSG && 'ok' == FMSG){
				parent.vm.getData(this.id); 		//刷新父页面
			} */
			
        	/* //复选框控制全选,全不选 
    		$('#zcheckbox').click(function(){
	    		 if($(this).is(':checked')){
	    			 $("input[name='ids']").click();
	    		 }else{
	    			 $("input[name='ids']").attr("checked", false);
	    		 }
    		}); */
    		// this.getList();
        },
        
		
		//编辑菜单(新增or修改)
		editOrganization: function (ORGANIZATION_ID,msg){
			window.location.href="organization_edit.html?oId="+ORGANIZATION_ID+"&msg="+msg;
		},
		/**
		 * 完善资料
		 */
		perfect:function(ORGANIZATION_ID){
			// 
			window.location.href="organization_perfect.html?oId="+ORGANIZATION_ID+"&pId="+vm.ORGANIZATION_ID;
		},
		/**
		 * 查看详情
		 */	
		detail:function(ORGANIZATION_ID){
			window.location.href="organization_detail.html?oId="+ORGANIZATION_ID;
		},
		getDict: function (){
			$.ajax({
				xhrFields: {
		            withCredentials: true
		        },
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'ORGANIZATION_TYPE',tm:new Date().getTime()},//类型
				dataType:'json',
				success: function(data){
					vm.TYPES=data.list;
				},
				error:function(){
				alert("错误");	
				}
			});
		},
        //获取列表
        getList: function(oId){
        	this.loading = true;
			this.ORGANIZATION_ID=oId;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'organization/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {
					ORGANIZATION_ID:this.ORGANIZATION_ID,
					KEYWORDS:this.KEYWORDS,
					tm:new Date().getTime()
					},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
					 vm.pd=data.pd;
        			 vm.page = data.page;
        			 vm.hasButton();
					 vm.getDict();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("民办学校机构",data.exception);//显示异常
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
    		 diag.Title ="新增";
    		 diag.URL = '../../organization/organization/organization_edit.html';
    		 diag.Width = 1000;
    		 diag.Height = 800;
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
    	
    	//修改
    	goEdit: function(id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="编辑";
    		 diag.URL = '../../organization/organization/organization_edit.html?FID='+id;
    		 diag.Width = 1000;
    		 diag.Height = 800;
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
    	goDel: function (id,name){
    		swal({
    			title: '',
                text: "确定要删除"+name+"吗?",
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
            			url: httpurl+'organization/delete',
            	    	data: {ORGANIZATION_ID:id,tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				 if("success" == data.result){
								 swal("删除成功", name+" 已经从列表中删除", "success");
								 vm.getList(vm.ORGANIZATION_ID);		//刷新本页面
								 parent.vm.getData(vm.ORGANIZATION_ID); //刷新父页面
            				 }
            				 vm.getList();
            			}
            		});
                }
            });
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
    							url: httpurl+'organization/deleteAll?tm='+new Date().getTime(),
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
        	var keys = 'organization:add,organization:del,organization:edit,toExcel,fromExcel';
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
        			vm.add = data.organizationfhadminadd;		//新增权限
        			vm.del = data.organizationfhadmindel;		//删除权限
        			vm.edit = data.organizationfhadminedit;	//修改权限
        			vm.toExcel = data.toExcel;						//导出到excel权限
        			vm.fromExcel = data.fromExcel;						//导出到excel权限
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);		//显示异常
                 }
        		}
        	})
        },
        
		//根据url参数名称获取参数值
		getUrlKey: function (name) {
		    return decodeURIComponent(
		        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
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
                	window.location.href = httpurl+'organization/excel';            	
                }
            });
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
        },
       //-----分页必用----end
		//打开上传excel页面
		getExcel: function (ORGANIZATION_ID){
			
			 if(ORGANIZATION_ID == "-1"){
				 swal("请选择类型");
			 }else{
				 var diag = new top.Dialog();
				 diag.Drag=true;
				 diag.Title ="从EXCEL导入到系统";
				 diag.URL = '../../organization/organization/organization_excel.html?pid='+ORGANIZATION_ID;
				 diag.Width = 600;
				 diag.Height = 130;
				 diag.CancelEvent = function(){ //关闭事件
					 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
	   			 if(varSon != null && varSon.style.display == 'none'){
	   				 vm.getList();
	   				 parent.vm.getData();
	   			 }
					 diag.close();
				 };
				 diag.show();
				// vm.getList();
				  //调用子页面中的subFunction方法。
			 }
			 
			 
		},//下载模版
		goDownload: function (){
			window.location.href = httpurl + 'organization/downExcel';
		}
	},
	
	mounted(){
        this.init();
    }
})