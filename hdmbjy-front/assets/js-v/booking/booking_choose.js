var vm=new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		loading:false,	//加载状态
		BOOKING_ID:'',
		BOOKING_TYPE:''
	},
	
	methods: {
		
	    //初始执行
	    init() {
			var TID = this.getUrlKey('TID');  //获取预约类型
			if(null!=TID){
				this.BOOKING_TYPE=TID;
			}else{
				alert("没有选择预约类型");
				return false;
			}
			this.getList();
	    },
	    
	    //获取列表
	    getList: function(){
	    	this.loading = true;
	    	$.ajax({
	    		xhrFields: {
	                withCredentials: true
	            },
	    		type: "POST",
	    		url: httpurl+'booking/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
	    		data: {
					BOOKING_TYPE:this.BOOKING_TYPE,
					KEYWORDS:this.KEYWORDS,
					tm:new Date().getTime()
					},
	    		dataType:"json",
	    		success: function(data){
	    		 if("success" == data.result){
	    			 vm.varList = data.varList;
	    			 vm.page = data.page;
	    			 vm.loading = false;
	    		 }else if ("exception" == data.result){
					  
	             	showException("预约",data.exception);//显示异常
	             }
	    		}
	    	}).done().fail(function(){
	            swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
	            setTimeout(function () {
	            	window.location.href = "../../login.html";
	            }, 2000);
	        });
	    },
		chooseBooking:function(BOOKING){
			document.getElementById("choose_booking_id").value=BOOKING.BOOKING_ID;
			document.getElementById("choose_booking_title").value=BOOKING.TITLE;
	/* 		document.getElementById("choose_start_time").value=BOOKING.START_TIME;
			document.getElementById("choose_end_time").value=BOOKING.END_TIME; */
			document.getElementById("choose_range").value=BOOKING.RANGE;
			document.getElementById("choose_all_num").value=BOOKING.ALL_NUM;
			document.getElementById("choose_remain_num").value=BOOKING.REMAIN_NUM;
			console.log(BOOKING);
			 
			setTimeout(function(){
				top.Dialog.close();//关闭弹窗
			},1000);
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
});
