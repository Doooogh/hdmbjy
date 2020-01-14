
var vm = new Vue({
	el: '#app',
	
	data:{
		ROTARYIMG_ID: '',	//主键ID
		IMG_PATH : '',
		nginxurl : '',
		httpurl:'',
		TYPE:'',
		pd: [],						//存放字段参数
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	var imgType = this.getUrlKey('imgType');	//图片类型
        	if(null != FID){
        		this.msg = 'edit';
        		this.ROTARYIMG_ID = FID;
        		this.TYPE = imgType;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict(imgType);
            },200);
        	this.httpurl = httpurl;
        	this.nginxurl = nginxurl;
        	//this.getDict();
        	//console.info(this.TYPE);
        	//$("#TYPE").find("option[value='"+this.TYPE+"']").attr("selected",true);
        	
        },
        
        //去保存
    	save: function (){
    		this.TYPE = $("#TYPE").val();
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
			if(this.TYPE == '' || this.TYPE == undefined){
				$("#TYPE").tips({
					side:3,
		            msg:'请输入类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}
			
			/*if(this.pd.IMG_URL == '' || this.pd.IMG_URL == undefined){
				$("#IMG_URL").tips({
					side:3,
		            msg:'请输入图片链接',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.IMG_URL = '';
				this.$refs.IMG_URL.focus();
			return false;
			}*/
			
			if(typeof($("#FIMG").val()) == 'string'){
				if($("#FIMG").val()=="" || document.getElementById("FIMG").files[0] =='请选择图片'){
					$("#FIMG").tips({
						side:3,
			            msg:'请选图片',
			            bg:'#AE81FF',
			            time:3
			        });
					return false;
				}
			}
			
    		
    		$("#showform").hide();
    		$("#jiazai").show();
    		
    		
    		
    		if(0 != this.pd.length && this.pd.IMG_PATH != '' && this.pd.IMG_PATH != null){
    			
    		    $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'rotaryimg/'+this.msg,
			    	data: {ROTARYIMG_ID:this.ROTARYIMG_ID,
				    TITLE:this.pd.TITLE,
				    TYPE:this.TYPE,
				    IMG_PATH:this.pd.IMG_PATH,
				    SPARE1:this.pd.SPARE1,
				    IMG_URL:this.nginxurl,
				    BZ:this.pd.BZ,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("轮播图管理",data.exception);//显示异常
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
    			var todata = new FormData();
                var imgFile = document.getElementById("FIMG").files[0];
                todata.append("FIMG", imgFile);
                todata.append("ROTARYIMG_ID", this.ROTARYIMG_ID);
                todata.append("TITLE", this.pd.TITLE);
                todata.append("TYPE", this.TYPE);
                todata.append("IMG_URL", this.nginxurl);
                todata.append("BZ", this.pd.BZ);
                todata.append("SPARE1", this.pd.SPARE1);
                todata.append("tm",new Date().getTime());
        		
        		
                //发送 post 请求提交保存
                $.ajax({
    	            	xhrFields: {
    	                    withCredentials: true
    	                },
    					type: "POST",
    					url: httpurl+'rotaryimg/'+this.msg,
    			    	data: todata ,
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
                            	showException("轮播图管理",data.exception);//显示异常
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
				url: httpurl+'rotaryimg/goEdit',
		    	data: {ROTARYIMG_ID:this.ROTARYIMG_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						$("#CREATOR_DATE").val(data.pd.CREATOR_DATE);
                     }else if ("exception" == data.result){
                     	showException("轮播图管理",data.exception);	//显示异常
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
    	
    	//获取数据字典数据
    	//数据字典
    	getDict: function(type){
        	//图片类型
        	$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'dictionaries/getLevelsByNameEn?tm='+new Date().getTime(),
    	    	data: {NAME_EN:'oa_rotaryimg_type'},// 轮播图片类型
    			dataType:'json',
    			success: function(data){
    				 if (type == null) {
    					 $("#TYPE").html('<option value="" >请选择图片类型</option>');
        				 $.each(data.list, function(i, dvar){
        						$("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
        				 });
					}else{
						
						 $.each(data.list, function(i, dvar){
							 if(type == dvar.BIANMA){
		    					$("#TYPE").append("<option value="+dvar.BIANMA+" selected='selected'>"+dvar.NAME+"</option>");
		    				 }else{
		    	    			$("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
		    				 }
     				    });
						
						
					}
    				 
    				 
    				 
    			}
    		});
        	
        	
        },
    	
		//删除
		delImg: function (PATH,ROTARYIMG_ID){
			swal({
            	title: '',
                text: "确定要删除图片吗?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                
            }).then((willDelete) => {
                if (willDelete) {
                	var pth = PATH.substr(PATH.indexOf("/"));
	            	$.ajax({
	            		xhrFields: {
		                    withCredentials: true
		                },
	        			type: "POST",
	        			url: httpurl+'rotaryimg/delImg',
	        	    	data: {PATH:pth,ROTARYIMG_ID:ROTARYIMG_ID,tm:new Date().getTime()},
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
    if(fileType != '.gif' && fileType != '.png' && fileType != '.jpg' && fileType != '.jpeg'){
    	$("#FIMG").tips({
			side:3,
            msg:'请上传图片格式的文件',
            bg:'#AE81FF',
            time:3
        });
    	$("#FIMG").val('');
    	$("#textfield").val('请选择选择图片');
    	document.getElementById("FIMG").files[0] = '请选择图片';
    }
}	