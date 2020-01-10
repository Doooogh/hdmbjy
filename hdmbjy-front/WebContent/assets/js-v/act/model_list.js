
var httpurl = httpurlActiviti;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS: '',	//检索条件
		category: '',	//模型分类
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		add:false,
		del:false,
		edit:false,
		cha:false,
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
    		this.getList();
    		this.getDic();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'fhmodel/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,category:this.category,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("模型管理",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//打开流程设计器
    	editor: function (modelId){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="流程设计器";
    		 diag.URL = '../../act/fhmodel/editor.html?modelId='+modelId;
    		 diag.Width = 1230;
    		 diag.Height = 700;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮
    		 diag.CancelEvent = function(){ //关闭事件
    			vm.getList();
    			diag.close();
    		 };
    		 diag.show();
    	},
        
    	//新增
    	goAdd: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="新增模型";
    		 diag.URL = '../../act/fhmodel/fhmodel_add.html';
    		 diag.Width = 600;
    		 diag.Height = 315;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag.CancelEvent = function(){ //关闭事件
    			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				var sunval = diag.innerFrame.contentWindow.document.getElementById('sunval').value;
    				vm.editor(sunval);//打开流程编辑器
    				vm.getList();
    			}
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//打开修改类型页面
    	goEditType: function (ID_){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="修改类型";
    		 diag.URL = '../../act/fhmodel/fhmodel_type.html?ID_='+ID_;
    		 diag.Width = 399;
    		 diag.Height = 146;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = false;	//最大化按钮
    	     diag.ShowMinButton = false;	//最小化按钮
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
    	goDel: function (id){
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
            			url: httpurl+'fhmodel/delete',
            	    	data: {ID_:id,tm:new Date().getTime()},
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
    							url: httpurl+'fhmodel/deleteAll?tm='+new Date().getTime(),
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
    	
    	//部署流程定义
    	deployment: function (modelId,id){
    		this.loading = true;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'fhmodel/deployment?tm='+new Date().getTime(),
    	    	data: {modelId:modelId},
    			dataType:'json',
    			success: function(data){
    				vm.loading = false;
    				if("error" == data.result){
    					$("#"+id).tips({
    						side:2,
    			            msg:'部署失败! 检查下流程图画的是否正确?',
    			            bg:'#F50100',
    			            time:15
    			        });
    				}else{
    					$("#"+id).tips({
    						side:2,
    			            msg:'部署成功! 可到流程管理中查看',
    			            bg:'#87B87F',
    			            time:15
    			        });
    				}
    			}
    		});
    	},
    	
    	//预览
    	view: function (modelId,id){
    		this.loading = true;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'fhmodel/isCanexportXml?tm='+new Date().getTime(),
    	    	data: {modelId:modelId},
    			dataType:'json',
    			success: function(data){
    				vm.loading = false;
    				if("error" == data.result){
    					$("#"+id).tips({
    						side:2,
    			            msg:'预览失败! 检查下流程图画的是否正确?',
    			            bg:'#F50100',
    			            time:8
    			        });
    				}else{
    					var diag = new top.Dialog();
    					diag.Drag=true;
    					diag.Title ="预览XML";
    					diag.URL = '../../act/fhmodel/xml_view.html?modelId='+modelId;
    					diag.Width = 1000;
    					diag.Height = 608;
    					diag.Modal = true;				//有无遮罩窗口
    					diag. ShowMaxButton = true;		//最大化按钮
    				    diag.ShowMinButton = true;		//最小化按钮
    					diag.CancelEvent = function(){ 	//关闭事件
    					diag.close();
    					};
    					diag.show();
    				}
    			}
    		});
    	},
    	
    	//导出模型xml
    	exportXml: function (modelId,id){
    		swal({
               	title: '',
                text: '确定要导出模型xml吗?',
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
            			url: httpurl+'fhmodel/isCanexportXml?tm='+new Date().getTime(),
            	    	data: {modelId:modelId},
            			dataType:'json',
            			success: function(data){
            				this.loading = true;
            				if("error" == data.result){
            					$("#"+id).tips({
            						side:2,
            			            msg:'导出失败! 检查下流程图画的是否正确?',
            			            bg:'#F50100',
            			            time:8
            			        });
            				}else{
            					window.location.href = httpurl+'fhmodel/exportXml?modelId='+modelId;
            				}
            			}
            		});	            	
                }
            });
    	},
    	
    	//调用数据字典(模型分类)
    	getDic: function(){
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurlSystem+'dictionaries/getLevels',
    	    	data: {DICTIONARIES_ID:'act001',tm:new Date().getTime()},//act001 为工作流分类
    			dataType:'json',
    			success: function(data){
    				$("#category").html('<option value="" >请选择分类</option>');
    				 $.each(data.list, function(i, dvar){
    					 $("#category").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
    				 });
    			}
    		});
    	},
    	
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'fhmodel:add,fhmodel:del,fhmodel:edit,fhmodel:cha';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurlSystem + 'head/hasButton',
        		data: {keys:keys,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.add = data.fhmodelfhadminadd;
        			vm.del = data.fhmodelfhadmindel;
        			vm.edit = data.fhmodelfhadminedit;
        			vm.cha = data.fhmodelfhadmincha;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
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
