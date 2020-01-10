
var httpurl = httpurlDbmanage;

var vm = new Vue({
	el: '#app',
	
	data:{
		TIMINGBACKUP_ID: '',	//主键ID
		varList: [],			//表list
		pd: [],					//存放字段参数
		dbtype: '',				//数据库类型
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('TIMINGBACKUP_ID');	//链接参数
        	if(null != FID){
        		this.msg = 'edit';
        		this.TIMINGBACKUP_ID = FID;
        		this.getData();
        	}else{
        		this.getDataByAdd();
        	}
        },
        
        //去保存
    	save: function (){
    		this.pd.TABLENAME = $("#TABLENAME").val();
    		if(null == this.pd.TABLENAME)this.pd.TABLENAME = 'all';
    		if(this.pd.FHTIME  == '' || this.pd.FHTIME == undefined){
    			$("#setFHTIME").tips({
    				side:3,
    	            msg:'请设置时间规则',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.FHTIME = '';
    			this.$refs.FHTIME.focus();
    		return false;
    		}
    		if(this.pd.BZ  == '' || this.pd.BZ == undefined){
    			$("#BZ").tips({
    				side:3,
    	            msg:'请输入备注',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			this.pd.BZ = '';
    			this.$refs.BZ.focus();
    		return false;
    		}

    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'timingbackup/'+this.msg,
			    	data: {TIMINGBACKUP_ID:this.TIMINGBACKUP_ID,TABLENAME:this.pd.TABLENAME,FHTIME:this.pd.FHTIME,BZ:this.pd.BZ,TIMEEXPLAIN:this.pd.TIMEEXPLAIN,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("数据库定时备份",data.exception);//显示异常
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
    	
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'timingbackup/goEdit',
		    	data: {TIMINGBACKUP_ID:this.TIMINGBACKUP_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	vm.varList =data.varList;	//表list
                     	vm.pd = data.pd;			//参数map
                     	vm.dbtype = data.dbtype;	//数据库类型
                     }else if ("exception" == data.result){
                     	showException("数据库定时备份",data.exception);	//显示异常
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
    	
    	//新增时获取数据
    	getDataByAdd: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'timingbackup/goAdd',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	vm.varList =data.varList;	//表list
                     	vm.dbtype = data.dbtype;	//数据库类型
                     }else if ("exception" == data.result){
                     	showException("数据库定时备份",data.exception);	//显示异常
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

var hour = "*";
var day = "*";
var week = "*";
var month = "*";
//设置时间规则
function setTimegz(value,type){
	if('hour' == type){
		hour = value;
	}else if('day' == type){
		day = value;
	}else if('week' == type){
		week = value;
	}else{
		month = value;
	}
	var strM = "";
	var strW = "";
	var strD = "";
	var strH = "";
	if("*" == month){
		strM = "每个月";
	}else{
		strM = "每年 "+month + " 月份";
	}
	if("?" != week){
		if("*" == week){
			strW = "每周";
			strD = "每天";
			$("#dayId").removeAttr("disabled");  
			$("#dayId").css("background","#FFFFFF");
		}else{
			$("#dayId").attr("disabled","disabled"); 
			$("#dayId").css("background","#F5F5F5");
			day = "?";
			strD = "";
			strW = "每个星期"+getWeek(week);
		}
	}
	if("?" != day){
		if("*" == day){
			strD = "每天";
			strW = "每周";
			$("#weekId").removeAttr("disabled");
			$("#weekId").css("background","#FFFFFF");
		}else{
			$("#weekId").attr("disabled","disabled"); 
			$("#weekId").css("background","#F5F5F5");
			week = "?";
			strW = "";
			strD = day + "号";
		}
	}
	if("*" == hour){
		strH = "每小时";
	}else{
		strH = hour + "点时";
	}
	if("*" == day && "*" == week){
		day = "*";
		week = "?";
	}
	$("#FHTIME").val("0 0 "+hour + " " + day + " " + month + " " + week);
	$("#TIMEEXPLAIN").val(strM+"的 "+strW+" "+strD+" "+strH+"执行一次");
	
	vm.pd.FHTIME = "0 0 "+hour + " " + day + " " + month + " " + week;
	vm.pd.TIMEEXPLAIN = strM+"的 "+strW+" "+strD+" "+strH+"执行一次";
}

//获取星期汉字
function getWeek(value){
	var arrW = new Array("MON","TUES","WED","THUR","FTI","SAT","SUN");
	var arrH = new Array("一","二","三","四","五","六","日");
	for(var i=0;i<arrW.length;i++){
		if(value == arrW[i]) return arrH[i];
	}
}