
var vm = new Vue({
	el: '#app',
	
	data:{
		BOOKINGINFO_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		TYPE:'', //预约类型
		STATUS:''  //预约状态
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.BOOKINGINFO_ID = FID;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },
        
        //去保存
    	save: function (){
    	
			if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				$("#TITLE").tips({
					side:3,
		            msg:'请输入主题',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITLE = '';
				this.$refs.TITLE.focus();
			return false;
			}
			if(this.pd.DESCRIPTION == '' || this.pd.DESCRIPTION == undefined){
				$("#DESCRIPTION").tips({
					side:3,
		            msg:'请输入描述',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.DESCRIPTION = '';
				this.$refs.DESCRIPTION.focus();
			return false;
			}
			if(this.TYPE =='' || this.TYPE == undefined){
				$("#TYPE").tips({
					side:3,
		            msg:'请输入类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.TYPE ='';
				this.$refs.TYPE.focus();
			return false;
			}
			
			this.pd.START_TIME = $("#START_TIME").val();
			if(this.pd.START_TIME == '' || this.pd.START_TIME == undefined){
				$("#START_TIME").tips({
					side:3,
		            msg:'请输入开始时间',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.START_TIME = '';
				this.$refs.START_TIME.focus();
			return false;
			}
			this.pd.END_TIME = $("#END_TIME").val();
			if(this.pd.END_TIME == '' || this.pd.END_TIME == undefined){
				$("#END_TIME").tips({
					side:3,
		            msg:'请输入结束时间',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.END_TIME = '';
				this.$refs.END_TIME.focus();
			return false;
			}
			if(this.STATUS == '' || this.STATUS == undefined){
				$("#STATUS").tips({
					side:3,
		            msg:'请输入状态',
		            bg:'#AE81FF',
		            time:2
		        });
				this.STATUS = '';
				this.$refs.STATUS.focus();
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
					url: httpurl+'bookinginfo/'+this.msg,
			    	data: {BOOKINGINFO_ID:this.BOOKINGINFO_ID,
				    BOOKINGINFO_ID:this.pd.BOOKINGINFO_ID,
				    TITLE:this.pd.TITLE,
				    DESCRIPTION:this.pd.DESCRIPTION,
				    TYPE:this.TYPE,
				    START_TIME:this.pd.START_TIME,
				    END_TIME:this.pd.END_TIME,
				    STATUS:this.STATUS,
				    CREATE_TIME:this.pd.CREATE_TIME,
				    CREATE_BY:this.pd.CREATE_BY,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("预约信息",data.exception);//显示异常
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
				url: httpurl+'bookinginfo/goEdit',
		    	data: {BOOKINGINFO_ID:this.BOOKINGINFO_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						$("#START_TIME").val(data.pd.START_TIME);
						$("#END_TIME").val(data.pd.END_TIME);
						$("#CREATE_TIME").val(data.pd.CREATE_TIME);
						$("#UPDATE_TIME").val(data.pd.UPDATE_TIME);
						vm.TYPE=data.pd.TYPE;
						vm.STATUS=data.pd.STATUS;
                     }else if ("exception" == data.result){
                     	showException("预约信息",data.exception);	//显示异常
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
		getDict: function (){
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'BOOKING_TYPE',tm:new Date().getTime()},//类型
				dataType:'json',
				success: function(data){
					$("#TYPE").html('<option value="">预约类型</option>');
					 $.each(data.list, function(i, dvar){
						 if(dvar.BIANMA==vm.TYPE){
							  $("#TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
						 }else{
						 $("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
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