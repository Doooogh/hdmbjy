var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		RNUMBER: '',	//编码
		KEYWORDS:'',	//检索关键词
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		loading:false	//加载状态
    },
    
	methods: {
		
        //初始执行
        init() {
    		this.getList();
    		this.choiceTips();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'role/roleListWindow?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,ROLE_ID:1,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.roleList;
        			 vm.page = data.page;
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("选择角色",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//选定角色
    	setRole: function (RNUMBER){
    		this.RNUMBER = RNUMBER;
    		this.roleBinding();
    	},
    	
    	//选择角色
    	roleBinding: function (){
    		if('' == this.RNUMBER){
    			$("#fhadminth").tips({
    				side:3,
    	            msg:'没有选择任何角色',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    		}else{
    			$("#RNUMBER").val(this.RNUMBER);
    			top.Dialog.close();
    		}
    	},
    	
    	//提示双击选择
    	choiceTips: function (){
    		$("#fhadminth").tips({
    			side:1,
    	        msg:'双击选择角色',
    	        bg:'#AE81FF',
    	        time:6
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
        }
       //-----分页必用----end
		
	},
	
	mounted(){
        this.init();
    }
})