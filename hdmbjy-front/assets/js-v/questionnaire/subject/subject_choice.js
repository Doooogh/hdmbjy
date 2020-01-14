var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		add:false,		//增
		del:false,		//删
		edit:false,		//改
		loading:false	//加载状态
    },
    
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
        },
        
        //获取列表
        getList: function(){
        	var idss = this.getUrlKey('TYPEIDS');
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'subject/listAll',
        		data: {idss:idss,KEYWORDS:this.KEYWORDS,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.loading = false;
        			 var str = '';
        			 var titlename = '';
        			 for (var i = 0; i < data.varList.length; i++) {
        				 if (data.varList[i].CHECKBOXTYPE) {
        					 if(str=='') str += data.varList[i].SUBJECT_ID;
        					 else str += ',' + data.varList[i].SUBJECT_ID;
        					 if(titlename=='') titlename += data.varList[i].TITLE;
        					 else titlename += ',' + data.varList[i].TITLE;
						}
					 }
        			 
        			 $("#titlename").val(titlename);
        			 $("#ids").val(str);
        			 
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("问卷题库",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        	
        	
        },
        
    	
      
        save : function(){
        	
        	$("#titlename").val("");
			$("#ids").val("");
        	var str = '';
			for(var i=0;i < document.getElementsByName('ids').length;i++){
				  if(document.getElementsByName('ids')[i].checked){
				  	if(str=='') str += document.getElementsByName('ids')[i].value;
				  	else str += ',' + document.getElementsByName('ids')[i].value;
				  }
			}
			
			var titlename = '';
			for (var i=0;i < document.getElementsByName('ids').length;i++) {
				if(document.getElementsByName('ids')[i].checked){
					var dd = document.getElementById(""+document.getElementsByName('ids')[i].id+"t").innerText;
					if(titlename == ''){
						titlename += dd;
					}else{
						titlename += ',' + dd;
					}
					
				}
			}
			
			if (str.length == 0) {
				$("#zcheckbox").tips({
					side:3,
		            msg:'请选择试卷题目,至少一个',
		            bg:'#AE81FF',
		            time:2
		        });
				return;
			}
			
			$("#titlename").val(titlename);
			$("#ids").val(str);
			top.Dialog.close();//关闭弹窗
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
