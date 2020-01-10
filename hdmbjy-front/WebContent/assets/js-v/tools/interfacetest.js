
var vm = new Vue({
	el: '#app',
	
	data:{
		urlAddress:'',	//接口地址
		resultData:'',	//返回数据
		FKEY:'',		//需要加密的参数
		type:'POST',	//请求类型
		useTime:0,		//请求时间
		loading:false	//加载状态
    },
    
	methods: {
        
        //请求接口
        getData: function(){
        	if(this.urlAddress == ''){
				$("#urlAddress").tips({
					side:3,
		            msg:'请输入接口地址',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#urlAddress").focus();
			return false;
			}
        	this.loading = true;
        	var srart  = Date.now();
        	var nowtime = this.date2str(new Date(),"yyyyMMdd");
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: this.type,
        		url: this.urlAddress,
        		data: {FKEY:$.md5(this.FKEY + nowtime + ',fh,'),tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 vm.loading = false;
        		 vm.resultData = JSON.stringify(data);
        		 var end  = Date.now();
        		 vm.useTime = end - srart;
        		 if("success" == data.result){
        			 vm.jsonFormat();
        			 $("#resultData").tips({
 						side:1,
 			            msg:'接口请求成功，返回正确的结果',
 			            bg:'#75C117',
 			            time:10
 			    	 });
        		 }else if("exception" == data.result){
        			 $("#resultData").tips({
 						side:3,
 			            msg:'请求失败,后台异常',
 			            bg:'#FF5080',
 			            time:10
 			     	});
                 	showException("后台异常",data.exception);//显示异常
                 }else{
                	 vm.jsonFormat();
           			 $("#resultData").tips({
    						side:1,
    			            msg:'接口请求成功，但返回错误的结果',
    			           bg:'#FF5080',
    			            time:10
    			    	});
                 }
        		}
        	}).done().fail(function(){
        		vm.loading = false;
                swal("请求失败!", "请求服务器无响应，检查下接口地址是否有误，稍后再试", "warning");
                $("#resultData").tips({
						side:3,
			            msg:'请求服务器无响应，检查下接口地址是否有误，稍后再试',
			            bg:'#FF5080',
			            time:10
			     	});
            });
        },
        
        //重置
        setReset: function(){
        	this.urlAddress = '';
        	this.resultData = '';
        	$("#json-renderer").html('');
        },
        
      	//格式json
        jsonFormat: function(){
        	try {
  		      var input = eval('(' + this.resultData + ')');
  		    }
  		    catch (error) {
  		      return alert("不能转化 JSON: " + error);
  		    }
  		    var options = {
  		      collapsed: $('#collapsed').is(':checked'),
  		      withQuotes: $('#with-quotes').is(':checked')
  		    };
  		    $('#json-renderer').jsonViewer(input, options);
        },
        
      	//日期格式
        date2str: function(x,y) {
           var z ={y:x.getFullYear(),M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
           return y.replace(/(y+|M+|d+|h+|m+|s+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2))});
        },
        
	}
    
})