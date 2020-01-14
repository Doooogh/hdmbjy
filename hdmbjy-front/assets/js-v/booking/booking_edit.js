var num=0;
$(function(){
	$(".range_time").blur(function(){
		var start=$(this).find(".start_time").val();
		var end=$(this).find(".end_time").val();
		console.log(start +", "+ end);
	});
});
var vm = new Vue({
	el: '#app',
	
	data:{
		BOOKING_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		APPROVAL_ROLE:'',
		BOOKINGINFO_ID:'',
		TIME_RANGES:'',
		hasTime:false,  
		show:false,     
		bookingInfos:[],  //预约信息集合 
		hasBookingInfo:false,   //是否已经选择预约信息表
		BOOKINGINFO_TIMERANGE:''  ,//预约时间制定范围
		editTimeRanges:[],   //编辑页面获得的时间范围数据
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.BOOKING_ID = FID;
        		this.getData();
			
        	}
        	setTimeout(function(){
				vm.getInfo();
        		vm.getDict();
				if(this.msg='edit'){
				$.each(vm.bookingInfos, function(i, dvar){
					 if(dvar.BOOKINGINFO_ID==vm.BOOKINGINFO_ID){
						 vm.show=true;
						 vm.hasBookingInfo=true;
						 vm.BOOKINGINFO_TIMERANGE=dvar.START_TIME+" - "+dvar.END_TIME;
					 }
				});	
				}
            },200);
        },
        
        //去保存
    	save: function (){
    		
			
			if(this.BOOKINGINFO_ID == '' || this.BOOKINGINFO_ID == undefined){
				$("#BOOKINGINFO_ID").tips({
					side:3,
		            msg:'请输入预约信息表id',
		            bg:'#AE81FF',
		            time:2
		        });
				this.BOOKINGINFO_ID = '';
				this.$refs.BOOKINGINFO_ID.focus();
			return false;
			}
			if(this.APPROVAL_ROLE == '' || this.APPROVAL_ROLE == undefined){
				$("#APPROVAL_ROLE").tips({
					side:3,
		            msg:'请输入审批角色',
		            bg:'#AE81FF',
		            time:2
		        });
				this.APPROVAL_ROLE = '';
				this.$refs.APPROVAL_ROLE.focus();
			return false;
			}
			
			if(this.pd.ALL_NUM == '' || this.pd.ALL_NUM == undefined){
				$("#RANGE").tips({
					side:3,
		            msg:'请输入预约人数',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.ALL_NUM = '';
				this.$refs.ALL_NUM.focus();
			return false;
			}
			var checkRes=this.checkRangeTimes();
			if(!checkRes){
				this.TIME_RANGES = '';
				return false;
			}
			this.getRangeTime();
    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'booking/'+this.msg,
			    	data: {
					BOOKING_ID:this.BOOKING_ID,
				    BOOKING_ID:this.pd.BOOKING_ID,
				    BOOKINGINFO_ID:this.BOOKINGINFO_ID,
				    APPROVAL_ROLE:this.APPROVAL_ROLE,
				    START_TIME:this.pd.START_TIME,
				    END_TIME:this.pd.END_TIME,
					RANGE:this.TIME_RANGES,
				    ALL_NUM:this.pd.ALL_NUM,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("预约",data.exception);//显示异常
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
				url: httpurl+'booking/goEdit',
		    	data: {BOOKING_ID:this.BOOKING_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.BOOKINGINFO_ID=data.pd.BOOKINGINFO_ID;
						vm.APPROVAL_ROLE=data.pd.APPROVAL_ROLE;
						vm.RANGE=data.pd.RANGE;
						if(vm.RANGE!=null&&vm.RANGE!=undefined&&vm.RANGE!=''){
							vm.hasTime=true;
						}
						vm.setRangeTimes();
                     }else if ("exception" == data.result){
                     	showException("预约",data.exception);	//显示异常
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
		
		isReasonable:function(){
         

		},
		//设置时间范围
		setRangeTimes:function(){
			vm.editTimeRanges=vm.RANGE.split(",");
			$.each(vm.editTimeRanges,function(i,timeRange){
				var start_time=timeRange.substring(0,timeRange.length/2);
				var end_time=timeRange.substring(timeRange.length/2+1,timeRange.length)
				$("#choose_times").append('<tr class="time'+num+'">' +
					'<td>'+
					'<div class="mt40" style="margin-bottom:5px">'+
					'<div class="c-datepicker-date-editor range_time mt10">' +
					' <input placeholder="开始日期" class="c-datepicker-data-input start_time" value="" />' +
					'<span class="c-datepicker-range-separator">-</span>' +
					' <input placeholder="结束日期"  name="" class="c-datepicker-data-input end_time" value="" />' +
					'</div>' +
					'</div>'+
					'</td>'+
					'</tr>');
					$(".time"+num).find(".range_time .start_time").val(start_time);
					$(".time"+num).find(".range_time .end_time").val(end_time);
					
					
					$(".time"+num).append(
						'<td style="padding-left: 10px;"><a onclick="deleteTime('+(num)+')"><i class="feather icon-x"></i></a></td>'
					);
					num++;
			});
			$('.range_time').datePicker({
					isRange: true,
			});
			
		},
		//获取时间
		getRangeTime:function(){
			vm.TIME_RANGES="";
			var times=$(".range_time");
			$.each(times,function(i,time){
				console.log(time);
				var start_time=$(this).find(".start_time").val();
				var end_time=$(this).find(".end_time").val();
				vm.TIME_RANGES+=(start_time+"-"+end_time+",");
			});
			if(vm.TIME_RANGES!=''&&vm.TIME_RANGES!=undefined&&vm.TIME_RANGES!=null){
				vm.TIME_RANGES=vm.TIME_RANGES.substring(0,vm.TIME_RANGES.length-1);
			}
		},
		//检查时间
		checkRangeTimes:function(){
			var isTrue=true;
			var BOOKINGINFO_TIMERANGE=vm.BOOKINGINFO_TIMERANGE.split(" - ");
			var B_START_TIME=new Date(BOOKINGINFO_TIMERANGE[0].replace("-", "/").replace("-", "/"));
			var B_END_TIME=new Date(BOOKINGINFO_TIMERANGE[1].replace("-", "/").replace("-", "/"));
			vm.TIME_RANGES="";
			var times=$(".range_time");
			if(times.length==0){
				$("#RANGE").tips({
					side:3,
				    msg:'请选择预约时间',
				    bg:'#AE81FF',
				    time:2
				});
				this.pd.RANGE = '';
				this.$refs.RANGE.focus();
				return false;
			}else{
				$.each(times,function(i,time){
					var sTime=$(this).find(".start_time").val();
					var eTime=$(this).find(".end_time").val();
					if(sTime!=''&&eTime!=''){
						var start_time=new Date(sTime.replace("-", "/").replace("-", "/"));
						var end_time=new Date(eTime.replace("-", "/").replace("-", "/"));
						if(start_time<B_START_TIME||end_time>B_END_TIME){
							$(time).tips({
								side:3,
							    msg:'选择的时间不在制定时间范围内',
							    bg:'#AE81FF',
							    time:2
							});
							isTrue=false;
							return false;
						}
					}
				});
			}
			return isTrue;
		},
		getInfo:function(){
			//发送 post 请求
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'booking/getRoleAndBookingInfo',
				data: {
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
			         if("success" == data.result){
						 vm.bookingInfos=data.bookingInfos;
						$("#BOOKINGINFO_ID").html('<option value="">请选择预约信息</option>');
						 $.each(data.bookingInfos, function(i, dvar){
							 if(dvar.BOOKINGINFO_ID==vm.BOOKINGINFO_ID){
								  $("#BOOKINGINFO_ID").append("<option value="+dvar.BOOKINGINFO_ID+" selected>"+dvar.TITLE+"</option>");
							 }else{
							 $("#BOOKINGINFO_ID").append("<option value="+dvar.BOOKINGINFO_ID+">"+dvar.TITLE+"</option>");
							 }
						 });
						 
						  if(data.bookingInfos.length<=0){
							  $("#BOOKINGINFO_ID").html('<option value="" >没有预约信息</option>');
							  $("#BOOKINGINFO_ID").attr("disabled",true);
						  }
						 
						 $("#APPROVAL_ROLE").html('<option value="">审批角色</option>');
						  $.each(data.roles, function(i, dvar){
						 	 if(dvar.ROLE_ID==vm.APPROVAL_ROLE){
						 		  $("#APPROVAL_ROLE").append("<option value="+dvar.ROLE_ID+" selected>"+dvar.ROLE_NAME+"</option>");
						 	 }else{
						 	 $("#APPROVAL_ROLE").append("<option value="+dvar.ROLE_ID+">"+dvar.ROLE_NAME+"</option>");
						 	 }
						  });
						  
						 
						 
			         }else if ("exception" == data.result){
			         	showException("预约",data.exception);	//显示异常
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
		check:function(){
			if(this.BOOKINGINFO_ID == '' || this.BOOKINGINFO_ID == undefined){
				$("#BOOKINGINFO_ID").tips({
					side:3,
			        msg:'请选择预约信息表',
			        bg:'#AE81FF',
			        time:2
			    });
				this.BOOKINGINFO_ID = '';
				this.$refs.BOOKINGINFO_ID.focus();
			return false;
			}
			
		},
		//添加时间
    	addTime:function(){
		$("#choose_times").append('<tr class="time'+num+'">' +
						'<td>'+
						'<div class="mt40" style="margin-bottom:5px">'+
		                '<div class="c-datepicker-date-editor range_time mt10">' +
		                ' <input placeholder="开始日期" class="c-datepicker-data-input start_time" value="" />' +
		                '<span class="c-datepicker-range-separator">-</span>' +
		                ' <input placeholder="结束日期"  name="" class="c-datepicker-data-input end_time" value="" />' +
		                '</div>' +
						'</div>'+
						'</td>'+
		                '</tr>');
		$(".time"+num).append(
			'<td style="padding-left: 10px;"><a onclick="deleteTime('+(num)+')"><i class="feather icon-x"></i></a></td>'
		);
		num++;
						
		$('.range_time').datePicker({
				isRange: true,
		});
		vm.hasTime=true;
		},
		
    	//获取数据字典数据
		getDict: function (){
			
		},
    	
    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }
        
	},
	watch:{
		 BOOKINGINFO_ID: function (val) {
		     if(this.BOOKINGINFO_ID != '' && this.BOOKINGINFO_ID != undefined){
		     	$.each(vm.bookingInfos, function(i, dvar){
		     		 if(dvar.BOOKINGINFO_ID==vm.BOOKINGINFO_ID){
		     			 vm.show=true;
		     			 vm.hasBookingInfo=true;
		     			 vm.BOOKINGINFO_TIMERANGE=dvar.START_TIME+" - "+dvar.END_TIME;
		     		 }
		     	});
		     }else{
		     	vm.show=false;
		     	vm.hasBookingInfo=false;
		     } 
		    },
	},
	mounted(){
        this.init();
    },
	
})
function deleteTime(ele){
	$(".time"+ele).remove();
}	 

/* layui.use('laydate', function(){
 var num=0;
 var laydate = layui.laydate;
   //点我触发
    laydate.render({
      elem: '#test20'
      ,eventElem: '#click-1'
      ,trigger: 'click',
	  type: 'datetime',
	  range: true,
	  done: function(value, date){
		  //判断是否合理  如果合理就加入到table  如果不合理就进行提示
		  
		  var BOOKINGINFO_TIMERANGE=vm.BOOKINGINFO_TIMERANGE.split(" - ");
		  var B_START_TIME=BOOKINGINFO_TIMERANGE[0];
		  var B_END_TIME=BOOKINGINFO_TIMERANGE[1];
		  var OWN_TIME=value.split(" - ");
		  var O_START_TIME=OWN_TIME[0];
		  var O_END_TIME=OWN_TIME[0];
		  
		  B_START_DATE=new Date(B_START_TIME.replace("-", "/").replace("-", "/"))
		  B_END_DATE=new Date(B_END_TIME.replace("-", "/").replace("-", "/"))
		  
		  O_START_DATE=new Date(O_START_TIME.replace("-", "/").replace("-", "/"))
		  O_END_DATE=new Date(O_END_TIME.replace("-", "/").replace("-", "/"))
		  
		  if(B_START_DATE<O_START_DATE&&B_END_DATE>O_END_DATE){
			  vm.TIME_RANGES+=(value+',');
			  if(vm.TIME_RANGES!=''){
			  	 vm.hasTime=true;
			  }
			  $("#choose_times").append(
			  '<tr style="height: 33px;" id=time'+(++num)+'><td id=t_td'+num+'>'+value+'</td>'+'<td style="padding-left: 10px;"><a onclick="
			  ('+(num)+')"><i class="feather icon-x"></i></a></td></tr>'
			  );
		  }else{
			  	$("#RANGE").tips({
			  		side:3,
			          msg:'选择的时间不在制定时间范围内',
			          bg:'#AE81FF',
			          time:2
			      });
				return false;
			 
		  }
	  }
    });
	  }); */
 