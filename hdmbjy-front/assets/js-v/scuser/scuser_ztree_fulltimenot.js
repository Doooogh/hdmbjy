
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
		EDUCATION_TYPES:[],  //学历类型
		TITLE_TYPES:[],  //职称类型
		POSTS:[],   //岗位
		ORGANIZATION_ID:'',  //机构id
		TYPE:''    //教师类型
    },
    
	methods: {
        //初始执行
        init() {
			var TP = 2;   //教师类型
			if(null!=TP&&''!=TP){
				this.TYPE=TP;
			}
			// 
        	//复选框控制全选,全不选 
    		$('#zcheckbox').click(function(){
	    		 if($(this).is(':checked')){
	    			 $("input[name='ids']").click();
	    		 }else{
	    			 $("input[name='ids']").attr("checked", false);
	    		 }
    		});
    		this.getList();
        },
        goDownload: function (){
			window.location.href = httpurl + 'scuser/downExcel';
		},
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'scuser/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {
					KEYWORDS:this.KEYWORDS,
					TYPE:this.TYPE,
					tm:new Date().getTime()
					},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
					 vm.getDict();
					 vm.getPost();
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.ORGANIZATION_ID = data.pdOid.ORGANIZATION_ID;
        			 vm.hasButton();
        			 vm.loading = false;
        			 console.info(111);
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("民办机构用户",data.exception);//显示异常
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
    		 var ss = this.ORGANIZATION_ID.ORGANIZATION_ID
    		 console.info(ss);
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="新增";
    		 diag.URL = '../../scuser/scuser/scuser_edit.html?oId='+vm.ORGANIZATION_ID+"&type="+vm.TYPE;
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
    		 diag.URL = '../../scuser/scuser/scuser_edit.html?FID='+id+'&oId='+vm.ORGANIZATION_ID+"&type="+vm.TYPE;
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
            			url: httpurl+'scuser/delete',
            	    	data: {
							SCUSER_ID:id,tm:new Date().getTime(),
							TYPE:vm.TYPE,
							},
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
    							url: httpurl+'scuser/deleteAll?tm='+new Date().getTime(),
    					    	data: {
								DATA_IDS:str,
								TYPE:vm.TYPE,
								},
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
        	var keys = 'scuser:add,scuser:del,scuser:edit,toExcel,fromExcel';
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
        			vm.add = data.scuserfhadminadd;		//新增权限
        			vm.del = data.scuserfhadmindel;		//删除权限
        			vm.edit = data.scuserfhadminedit;	//修改权限
        			vm.toExcel = data.toExcel;						//导出到excel权限
        			vm.fromExcel = data.fromExcel;						//导出到excel权限
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
                	window.location.href = httpurl+'scuser/excel';            	
                }
            });
		},
        
		//获取岗位
		getPost:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'post/listAll',
				data: {
					tm:new Date().getTime()
					},//类型
				dataType:'json',
				success: function(data){  
					vm.POSTS=data.varList;  
				},
				error:function(){
					alert("获取岗位信息错误");
				}
			});
		},
		/**
		 * 机构用户详细资料
		 */
		goDetail:function(SCUSER_ID,ORGANIZATION_ID){
			window.location.href="scuser_detail.html?scuId="+SCUSER_ID+"&ORGANIZATION_ID="+ORGANIZATION_ID+"&type="+vm.TYPE;
		},
		/**
		 * 机构用户完善资料
		 */
		goPerfect:function(SCUSER_ID,ORGANIZATION_ID){
			window.location.href="scuser_perfect.html?scuId="+SCUSER_ID+"&ORGANIZATION_ID="+ORGANIZATION_ID+"&type="+vm.TYPE;
		},
		getDict: function (){
			$.ajax({
				xhrFields: {
		            withCredentials: true
		        },
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'TITLE_TYPE',tm:new Date().getTime()},//职称类型
				dataType:'json',
				success: function(data){
					vm.TITLE_TYPES=data.list;
				},
				error:function(){
				alert("错误");	
				}
			});
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'EDUCATION_TYPE',tm:new Date().getTime()},//学历类型
				dataType:'json',
				success: function(data){
					vm.EDUCATION_TYPES=data.list;
				},
				error:function(){
				alert("错误");	
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
		//根据url参数名称获取参数值
		getUrlKey: function (name) {
		    return decodeURIComponent(
		        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
		},
		getExcel: function (){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="从EXCEL导入到系统";
			 diag.URL = '../../scuser/scuser/scuser_excel.html?TYPE='+vm.TYPE;
			 diag.Width = 600;
			 diag.Height = 130;
			 diag.CancelEvent = function(){ //关闭事件
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
  			 if(varSon != null && varSon.style.display == 'none'){
  				 vm.getList();
  			 }
				 diag.close();
			 };
			 diag.show();
		}
	},
	
	mounted(){
        this.init();
    }
})