var vm = new Vue({
	el: '#app',
	data:{
		TYPE:'',
	},
	methods: {
        
		//保存
		goUpload: function (){
			if($("#fileField").val() == ''){
				$("#fileField").tips({
					side:3,
		            msg:'请选择文件',
		            bg:'#AE81FF',
		            time:3
		        });
				return false;
			}
			$("#showform").hide();
			$("#jiazai").show();
            var type = this.getUrlKey("TYPE");
            this.TYPE = type;
            var formdata = new FormData();
            var excelFile = document.getElementById("fileField").files[0];
			formdata.append("excel", excelFile);
			formdata.append("TYPE", type);
            
			//异步 跨域 上传文件
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
                url: httpurl + 'scuser/readExcel',
                type: 'POST',  
                data: formdata,  
                async: false,  
                cache: false,  
                contentType: false,  
                processData: false,  
                success: function (data) {  
	                   if("success" == data.result){
	                	   $("#fileField").tips({
	       					side:3,
	       		            msg:'上传成功',
	       		            bg:'#AE81FF',
	       		            time:2
	       		        });
                       setTimeout(function(){
                   		top.Dialog.close();//关闭弹窗
                       },860);
                   }else if ("exception" == data.result){
                	    //alert("上传excel"+data.exception);//显示异常
                	    var tt = vm.TYPE; 
                	    if (tt == 1) {
                	    	top.swal("普通老师导入",data.exception.replace("java.lang.Exception:",""));//显示异常
						}else if(tt == 2){
							top.swal("专职教师导入",data.exception.replace("java.lang.Exception:",""));//显示异常
						}else if(tt == 3){
							top.swal("负责人导入",data.exception.replace("java.lang.Exception:",""));//显示异常
						}
                	    $("#showform").show();
               			$("#jiazai").hide();
                   }
                } 
           }).done().fail(function(){
        	   alert("登录失效!请求服务器无响应,稍后再试");
               $("#showform").show();
       		   $("#jiazai").hide();
            });
		},
		
		//下载模版
		goDownload: function (){
			window.location.href = httpurl + 'scuser/downExcel';
		},
		getUrlKey: function (name) {
		    return decodeURIComponent(
			        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
			},
        
	}
	
})

//判断格式
function checkFileType (obj){
	document.getElementById('textfield').value=obj.value;
	var fileType=obj.value.substr(obj.value.lastIndexOf(".")).toLowerCase();//获得文件后缀名
    if(fileType != '.xls'){
    	$("#fileField").tips({
			side:3,
            msg:'请上传xls格式的文件',
            bg:'#AE81FF',
            time:3
        });
    	$("#fileField").val('');
    	$("#textfield").val('请选择xls格式的文件');
    }
}