
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
		loading:false,	//加载状态
		APPROVETYPE_ID:'',
		msg:'',
		TIER:'',  //节点层级
		APP_TYPE:'',  //审批类型的 总类型  1  行政 2  年检
		RECORD_TYPES:[],  //档案存储类型集合
		// TYPES:[],    //机构类型
    },
    
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('aId');//链接参数
			var ATY=this.getUrlKey('aTy');  //审批总的类型
			var TIERNUM=this.getUrlKey('tier');  
			if(null!=ATY&&''!=ATY&&undefined!=ATY){
				this.APP_TYPE=ATY;   //审批类型的 总类型 
			}
        	if(null != FID){
			
        		this.APPROVETYPE_ID = FID;
        		this.getList(this.APPROVETYPE_ID);
        	}
			if(null!=TIERNUM&&''!=TIERNUM&&undefined!=TIERNUM){
				this.TIER=TIERNUM;
			}
        	var FMSG = this.getUrlKey('FMSG');			//从修改添加成功后跳转过来
        	if(null != FMSG && 'ok' == FMSG){
        		parent.vm.getData(this.APPROVETYPE_ID); 		//刷新父页面
        	}
        },
        
        //获取列表
        getList: function(aId){
        	this.loading = true;
			if(aId!=1){
				this.APPROVETYPE_ID=aId;
			}
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'approvetype/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {
					APPROVETYPE_ID:this.APPROVETYPE_ID,
					KEYWORDS:this.KEYWORDS,
					TYPE:this.APP_TYPE,  //会根据审批的总类型 来获取相应的数据
					tm:new Date().getTime()
					},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
					 vm.getDict();
        			 vm.varList = data.varList;
					 vm.pd=data.pd;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("审批类型",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
		
		
		//编辑菜单(新增or修改)
		editApprove: function (APPROVETYPE_ID,msg){
			window.location.href="approvetype_edit.html?aId="+APPROVETYPE_ID+"&msg="+msg+'&tier='+vm.TIER+'&aTy='+vm.APP_TYPE;
		},
    	//新增
    	goAdd: function (APPROVETYPE_ID,msg){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="新增";
    		 diag.URL = '../../approvetype/approvetype/approvetype_edit.html?aId='+APPROVETYPE_ID+"&msg="+msg+'&tier='+vm.TIER+'&aTy='+vm.APP_TYPE;
    		 diag.Width = 1000;
    		 diag.Height = 800;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮 
    		 diag.CancelEvent = function(){ //关闭事件
    	    	 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    				 vm.getList();
    			 if(varSon != null && varSon.style.display == 'none'){
					parent.vm.getData(); //刷新父页面
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
    		 diag.URL = '../../approvetype/approvetype/approvetype_edit.html?FID='+id+'&tier='+vm.TIER;
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
            			url: httpurl+'approvetype/delete',
            	    	data: {APPROVETYPE_ID:id,tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				 if("success" == data.result){
            					 swal("删除成功", name+"已经从列表中删除!", "success");
								 vm.getList(vm.APPROVETYPE_ID);		//刷新本页面
								 parent.vm.getData(vm.APPROVETYPE_ID); //刷新父页面
							
            				 }else{
								 swal("删除失败!", "请先删除子菜单!", "error");
							 }
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
    							url: httpurl+'approvetype/deleteAll?tm='+new Date().getTime(),
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
        	var keys = 'approvetype:add,approvetype:del,approvetype:edit,toExcel';
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
        			vm.add = data.approvetypefhadminadd;		//新增权限
        			vm.del = data.approvetypefhadmindel;		//删除权限
        			vm.edit = data.approvetypefhadminedit;	//修改权限
        			vm.toExcel = data.toExcel;						//导出到excel权限
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
                	window.location.href = httpurl+'approvetype/excel';            	
                }
            });
		},
		
		getDict: function (){
			$.ajax({
				xhrFields: {
		            withCredentials: true
		        },
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'RECORD_TYPES',tm:new Date().getTime()},//类型
				dataType:'json',
				success: function(data){
					vm.RECORD_TYPES=data.list;
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