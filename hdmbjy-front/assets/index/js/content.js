
var vm = new Vue({
	el: '#app',
	
	data:{
		listCategory: [],	//总栏目
		pdWenZhang: [],	//总栏目
		titleName: '',	//总栏目
		ziName: '',	//总栏目
		fName: '',	//总栏目
		pdz: [],
		pdf: [],
		listWenZhang: [],
		COUNTALL:'',
		fjList: [],
		listpda: [],
		wenzhangId:'',	//总栏目
    },
    
	methods: {
        //初始执行
        init() {
        	var id = this.getUrlKey('id');
        	this.wenzhangId = id;
        	this.getList();
        },
        getList: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'indexHtml/wenZhangCont',
        		data: {ID:this.wenzhangId,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.listCategory = data.listCategory;
        			 vm.pdWenZhang = data.pdWenZhang;
        			 vm.pdz = data.pdz;
        			 vm.pdf = data.pdf;
        			 vm.listpda = data.listpda;
        			 vm.titleName = data.pdf.NAME;
        			 vm.ziName = data.pdz.NAME;
        			 vm.fName = data.pdf.NAME;
        			 vm.COUNTALL = data.count;
        			 vm.fjList = data.fjList;
        			 $("#conthtml").html(data.pdWenZhang.REMARKS);
        		 }else if ("exception" == data.result){
                 	showException("前台详细",data.exception);//显示异常
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
        	this.ziName = name;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'indexHtml/listWenZhang',
        		data: {id:id,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 $("#list").css("display","block");
        			 $("#cont").css("display","none");
        			 vm.listWenZhang = data.listWenZhang;
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
        			 $("#conthtml").html(data.pdWenZhang.REMARKS);
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
		//根据url参数名称获取参数值
		getUrlKey: function (name) {
		    return decodeURIComponent(
		        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
		} ,//下载
        downloadAll:function(ids){
        	window.location.href=httpurl+"complaint/downloadFiles?ATTACHMENT="+ids;
        },
	},
	
	mounted(){
        this.init();
    }
})