
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		titleName: "",	//标题名称
		listCategory: [],	//总栏目
		zongNavPd: [],	//当前栏目 
		ziNav: "",	//当前子栏目
		listCategoryZi: [],	//子栏目
		listWenZhang: [],	//文章列表
		pdWenZhang: [],	//文章详细
		nginxurl:'',
		COUNTALL:'',
		typeZi:'-1',
    },
    
	methods: {
        //初始执行
        init() {
        	var name = this.getUrlKey('name');
        	this.titleName = name;
        	this.nginxurl = nginxurl;
    		this.getList();
    		setTimeout(function(){
	    		$(".searchhistory a").each(function(index){if(index > 2){ $(this).remove();};});
	    		$("div.holder").jPages({
	    	      containerID : "pageul",
	    	      perPage:15,
	    	      minHeight: false,
	    	    });//分页
	    		var len = "<div class=\"split\"></div>" ;
	    		$('#pageul li').each(function(index, item){
	    	    	var li = $(item);
	    			index += 1;
	    	    	if( index % 5 === 0 ){
	    				
	    	       	 	li.append(len);
	    	   	 	}
	    		});
    		 },200);
    		
    		
        },
        //获取列表
        getList: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'indexHtml/xinwenList',
        		data: {titleName:this.titleName,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.listCategory = data.listCategory;
        			 vm.listCategoryZi = data.listCategoryZi;
        			 vm.listWenZhang = data.listWenZhang;
        			 vm.zongNavPd = data.zongNavPd; 
        			 vm.ziNav = data.ziNav;
        			 //vm.typeZi = data.listWenZhang.wenList;
        		 }else if ("exception" == data.result){
                 	showException("前台首页",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../login.html";
                }, 2000);
            });
        },
        test: function(id,name){
        	this.typeZi = name;
        	this.ziNav = name;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'indexHtml/xinwenListZi',
        		data: {name:name,id:id,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 $("#list").css("display","block");//隐藏div
        			 $("#cont").css("display","none");//显示div
        			 vm.listWenZhang = data.listWenZhang;
        			 vm.ziNavPd = data.ziNavPd;
        			 
        		 }else if ("exception" == data.result){
                 	showException("前台首页",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../login.html";
                }, 2000);
            });
        	
        	if($(".split").length > 0){
        		$(".split").remove();
        	}
        	setTimeout(function(){
	    		$(".searchhistory a").each(function(index){if(index > 2){ $(this).remove();};});
	    		$("div.holder").jPages({
	    	      containerID : "pageul",
	    	      perPage:15,
	    	      minHeight: false,
	    	    });//分页
	    		var len = "<div class=\"split\"></div>" ;
	    		$('#pageul li').each(function(index, item){
	    	    	var li = $(item);
	    			index += 1;
	    	    	if( index % 5 === 0 ){
	    	       	 	li.append(len);
	    	   	 	}
	    		});
    		 },200);
        	
        	
        },
        wenzhang: function(id){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'indexHtml/wenzhang',
        		data: {ID:id,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 $("#list").css("display","none");//隐藏div
        			 $("#cont").css("display","block");//显示div
        			 vm.pdWenZhang = data.pdWenZhang;
        			 vm.fjList = data.fjList;
        			 vm.COUNTALL = data.count;
        			 $("#contpagemidHtml").html(data.pdWenZhang.REMARKS);
        		 }else if ("exception" == data.result){
                 	showException("前台首页",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../login.html";
                }, 2000);
            });
        },
        //下载
        downloadAtt:function(id,url){
            window.location.href=httpurl+"article/download?ID="+id+"&URL="+url;
        },
        //下载
        downloadAll:function(ids){
        	window.location.href=httpurl+"complaint/downloadFiles?ATTACHMENT="+ids;
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