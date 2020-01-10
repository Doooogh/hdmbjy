
var httpurl = httpurlIm;

var vm = new Vue({
	el: '#app',
	
	data:{
		QGROUP_ID: '',		//主键ID
		QID: '',
		httpurl: '',
		pd: [],				//存放字段参数
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var QGROUP_ID = this.getUrlKey('QGROUP_ID');	//链接参数
        	var QID = this.getUrlKey('QID');
        	this.httpurl = httpurl;
        	if(null != QID){		//新增进入
        		this.QID = QID;
        	}
        	if(null != QGROUP_ID){	//修改进入
        		this.msg = 'edit';
        		this.QGROUP_ID = QGROUP_ID;
        		this.getData();
        	}
        },
        
        //去保存
    	save: function (){
    		if(this.pd.NAME == '' || this.pd.NAME == undefined){
				$("#NAME").tips({
					side:3,
		            msg:'请输入群名称',
		            bg:'#AE81FF',
		            time:2
		        });
				this.$refs.NAME.focus();
			return false;
			}
    		
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
    		
    		if(0 != this.pd.length && this.pd.PHOTO != '' && this.pd.PHOTO != null){
    			//发送 post 请求提交保存
                $.ajax({
    	            	xhrFields: {
    	                    withCredentials: true
    	                },
    					url: httpurl+'qgroup/'+ this.msg,
    					type: 'POST',  
    	                data: {QGROUP_ID:this.QGROUP_ID,QID:this.QID,NAME:this.pd.NAME,FIMGZ:this.pd.PHOTO,tm:new Date().getTime()},  
    	                dataType:"json",
    					success: function(data){
                            if("success" == data.result){
                            	swal("", "保存成功", "success");
                            	setTimeout(function(){
                            		top.Dialog.close();//关闭弹窗
                                },1000);
                            }else if ("exception" == data.result){
                            	showException("编辑群",data.exception);//显示异常
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
                todata.append("QGROUP_ID", this.QGROUP_ID);
                todata.append("QID", this.QID);
                todata.append("NAME", this.pd.NAME);
                todata.append("FIMGZ", this.pd.PHOTO);
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					url: httpurl+'qgroup/'+ this.msg,
					type: 'POST',  
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
                        	showException("编辑群",data.exception);//显示异常
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
				url: httpurl+'qgroup/goEdit',
		    	data: {QGROUP_ID:this.QGROUP_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;		//参数map
                     }else if ("exception" == data.result){
                    	showException("编辑群",data.exception);//显示异常
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
    	
		//删除
		delImg: function (PATH,QGROUP_ID){
			swal({
            	title: '',
                text: "确定要删除图片吗?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                
            }).then((willDelete) => {
                if (willDelete) {
	            	$.ajax({
	            		xhrFields: {
		                    withCredentials: true
		                },
	        			type: "POST",
	        			url: httpurl+'qgroup/delImg',
	        	    	data: {PATH:PATH,QGROUP_ID:QGROUP_ID,tm:new Date().getTime()},
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