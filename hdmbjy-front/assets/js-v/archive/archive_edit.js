var vm = new Vue({
	el: '#app',
	
	data:{
		ARCHIVE_ID: '',	//主键ID
		pd: [],	//存放字段参数 FULL_DATE: '',
		nginxurl : '',
		httpurl:'',
		TYPE: '',
		msg:'add',
		ORGANIZATION_ID:'',    //机构id
    },
	
    
    
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	var OID = this.getUrlKey('oId');	//当接收过来的FID不为null时,表示此页面是修改进来的
			if(null!=OID&&undefined!=OID){
				this.ORGANIZATION_ID=OID;
			}
        	if(null != FID){
        		this.msg = 'edit';
        		this.ARCHIVE_ID = FID;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        	this.httpurl = httpurl;
        	this.nginxurl = nginxurl;
        },
        
        //去保存
    	save: function (){
    		this.pd.FULL_DATE = $("#FULL_DATE").val();
			if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				$("#TITLE").tips({
					side:3,
		            msg:'请输入标题',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITLE = '';
				this.$refs.TITLE.focus();
			return false;
			}
			if(this.TYPE == ''){
				$("#TYPE").tips({
					side:3,
		            msg:'请输入文档类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			} 
			
			if(this.pd.FULL_DATE == '' || this.pd.FULL_DATE == undefined){
				$("#FULL_DATE").tips({
					side:3,
		            msg:'请输入填表日期',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FULL_DATE = '';
				this.$refs.FULL_DATE.focus();
			return false;
			}
			
			if(this.pd.BZ == undefined){
				this.pd.BZ = "";
			}
    		
    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            if(0 != this.pd.length && this.pd.PATH != '' && this.pd.PATH != null){
            	console.info(this.pd.PATH);
            	$.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'archive/'+this.msg,
			    	data: {ARCHIVE_ID:this.ARCHIVE_ID,
				    TITLE:this.pd.TITLE,
				    FULL_DATE:this.pd.FULL_DATE,
				    PATH:this.pd.PATH,
					DEPARTMENT_ID:this.ORGANIZATION_ID,
				    USER_ID:this.pd.USER_ID,
				    PDF_PATH:this.pd.PDF_PATH,
				    BZ:this.pd.BZ,
					TYPE:this.TYPE,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("文件系统",data.exception);//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                   $("#showform").show();
           		   $("#jiazai").hide();
                });
            }else{
            	
            	console.info(1);
            	
            	var todata = new FormData();
                var imgFile = document.getElementById("FIMG").files[0];
                todata.append("FIMG", imgFile);
                todata.append("ARCHIVE_ID", this.ARCHIVE_ID);
                todata.append("DEPARTMENT_ID", this.ORGANIZATION_ID);
                todata.append("TITLE", this.pd.TITLE);
                todata.append("FULL_DATE", this.pd.FULL_DATE);
                todata.append("TYPE", this.TYPE);
                todata.append("BZ", this.pd.BZ);
                todata.append("USER_ID",this.pd.USER_ID);
                todata.append("tm",new Date().getTime());
    			$.ajax({
  	            xhrFields: {
  	                  withCredentials: true
  	              },
  				type: "POST",
  				url: httpurl+'archive/'+this.msg,
  			    data: todata,
  			    async: false,  
	            cache: false,  
	            contentType: false,  
	            processData: false,
  				success: function(data){
	  					if("success" == data.result){
	                    	swal("", "保存成功", "success");
	                    	setTimeout(function(){
	                    		top.Dialog.close();//关闭弹窗
	                        },1000);
	                    }else if ("exception" == data.result){
	                    	showException("文件系统",data.exception);//显示异常
	                    	$("#showform").show();
	                		$("#jiazai").hide();
	                    }
                    }
  				}).done().fail(function(){
                     swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                     $("#showform").show();
             		   $("#jiazai").hide();
               });
            	
            }
            
            
            
            
            
            
    	},
    	
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'archive/goEdit',
		    	data: {ARCHIVE_ID:this.ARCHIVE_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.TYPE = data.pd.TYPE;
						$("#FULL_DATE").val(data.pd.FULL_DATE);
						//$("#FULL_DATE").val(vm.pd.FULL_DATE);
                     }else if ("exception" == data.result){
                     	showException("文件系统",data.exception);	//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},
    	
    	//删除上传文件
		delImg: function (PATH,ARCHIVE_ID){
			swal({
            	title: '',
                text: "确定要删除文件吗?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                
            }).then((willDelete) => {
                if (willDelete) {
                	var pth1 = PATH.substr(PATH.indexOf("/"));
	            	$.ajax({
	            		xhrFields: {
		                    withCredentials: true
		                },
	        			type: "POST",
	        			url: httpurl+'archive/delWj',
	        	    	data: {PATH:pth1,ARCHIVE_ID:ARCHIVE_ID,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
	        					 swal("", "删除成功!", "success");
	        				 }
	        				 setTimeout(function(){
	                        		vm.getData();
	                            },1000);
	        			}
	        		});
                }
            });
		},
    	
    	//获取数据字典数据
		getDict: function (){
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevelsByNameEn?tm='+new Date().getTime(),
			    	data: {NAME_EN:'RECORD_TYPES'},
					dataType:'json',
					success: function(data){
						 $("#TYPE").append("<option value=''>请选档案类型</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.TYPE == dvar.BIANMA){
							  	$("#TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
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
//过滤类型 
function fileType(obj){
	document.getElementById('textfield').value=obj.value;
	var fileType=obj.value.substr(obj.value.lastIndexOf(".")).toLowerCase();//获得文件后缀名
    if(fileType != '.gif' && fileType != '.png' && fileType != '.jpg' && fileType != '.jpeg' && fileType != '.doc' && fileType != '.docx' && fileType != '.txt' && fileType != '.xlsx' && fileType != '.xls' && fileType != '.pdf'){
    	$("#FIMG").tips({
			side:3,
            msg:'请上传文件',
            bg:'#AE81FF',
            time:3
        });
    	$("#FIMG").val('');
    	$("#textfield").val('请选择选择文件,文件格式 gif png jpg jpeg doc docx txt xlsx xls pdf');
    	document.getElementById("FIMG").files[0] = '请选择文件';
    }
}	

layui.use('laydate', function(){
	  var laydate = layui.laydate;
	  
	//年选择器
	  laydate.render({
	    elem: '#YEAR',
	    type: 'year',
	    lang: 'cn',
	    theme: 'grid',
	    format: 'yyyy年'
	  });
	
	  laydate.render({
	    elem: '#FULL_DATE',
	    type:'datetime',	
	    lang: 'cn',
	    theme: 'grid',
	    format: 'yyyy-MM-dd HH:mm:ss'
	  });
});

/*layui.use('laydate', function(){
  var laydate = layui.laydate;
    //日期时间选择器
    laydate.render({
      elem: '#test5'
      ,type: 'datetime'
    });
});*/