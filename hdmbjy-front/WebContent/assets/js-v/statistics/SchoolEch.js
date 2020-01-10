var vm = new Vue({
	el: '#app',
	
	data:{
		
    },
	
	methods: {
        //初始执行
	        init() {
	        	this.schoolEch();
	        },
	        //统计图形
			schoolEch: function(){
				$.ajax({
			       	xhrFields: {
			               withCredentials: true
			           },
						type: "POST",
						url: httpurl+'statistics/schoolList',
				    	data: {tm:new Date().getTime()},
						dataType:"json",
						success: function(data){
			               if("success" == data.result){
			            	   
			            	   var dom = document.getElementById("container");
			            	   var myChart = echarts.init(dom);
			            	   var app = {};
			            	   option = null;
			            	   app.title = '折柱混合';
			            	   option = {
			            		   color : ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700", "#6b8e23", "#ff00ff", "#3cb371", "#b8860b", "#30e0e0"],
			            	       tooltip: {
			            	           trigger: 'axis',
			            	           axisPointer: {
			            	               type: 'cross',
			            	               crossStyle: {
			            	                   color: '#999'
			            	               }
			            	           }
			            	       },
			            	       toolbox: {
			            	           feature: {
			            	               dataView: {show: true, readOnly: false},
			            	               magicType: {show: true, type: ['line', 'bar']},
			            	               restore: {show: true},
			            	               saveAsImage: {show: true}
			            	           }
			            	       },
			            	       legend: {
			            	           data:data.legendArr
			            	       },
			            	       xAxis: [
			            	           {
			            	               type: 'category',
			            	               data: data.xAxisArr,
			            	               axisPointer: {
			            	                   type: 'shadow'
			            	               }
			            	           }
			            	       ],
			            	       yAxis: [
			            	           {
			            	               type: 'value',
			            	               name: '数量',
			            	               minInterval: 1,
			            	           }
			            	           
			            	       ],
			            	       series: data.seriesArr
			            	   };
			            	   ;
			            	   if (option && typeof option === "object") {
			            	       myChart.setOption(option, true);
			            	   } 
			            	   
			            	   
			            	   
			            	   var dom1 = document.getElementById("xqpie");
			            	   var myChart1 = echarts.init(dom1);
			            	   var app1 = {};
			            	   option1 = null;
			            	   option1 = {
			            	       color : ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700", "#6b8e23", "#ff00ff", "#3cb371", "#b8860b", "#30e0e0"],
			            	       toolbox: {
			            	           feature: {
			            	               saveAsImage: {show: true}
			            	           }
			            	       },
			            	       tooltip : {
			            	    	   trigger: 'item',
			            	           formatter: "{a} <br/>{b} : {c} ({d}%)"
			            	       },
			            	       legend: {
			            	    	   type: 'scroll',
			            	           orient: 'vertical',
			            	           right: 10,
			            	           top: 20,
			            	           bottom: 20,
			            	           data: data.piexAxis 
			            	       },
			            	       series : [
			            	           {
			            	        	   name: '机构数量',
			            	               type: 'pie',
			            	               radius : '55%',
			            	               center: ['50%', '60%'],
			            	               data:data.pieseriesArr,
			            	               itemStyle: {
			            	                   emphasis: {
			            	                       shadowBlur: 10,
			            	                       shadowOffsetX: 0,
			            	                       shadowColor: 'rgba(0, 0, 0, 0.5)'
			            	                   }
			            	               }
			            	           }
			            	       ]
			            	   };
			            	   ;
			            	   if (option1 && typeof option1 === "object") {
			            	       myChart1.setOption(option1, true);
			            	   }
			            	   
			            	  
			            	   
			            	   
			               }else if ("exception" == data.result){
			               	showException("数据统计",data.exception);//显示异常
			               	$("#showform").show();
			           		$("#jiazai").hide();
			               }
			           }
					}).done().fail(function(){
						swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
			            setTimeout(function () {
			            	window.location.href = "../../login.html";
			            }, 1000);
			       });
			}
		},
	mounted(){
		this.init();
	},
});