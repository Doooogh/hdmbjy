var vm = new Vue({
	el: '#app',
	
	data:{
		listCategory: [],	//总栏目
    },
    
	methods: {
        //初始执行
        init() {
        	$("#up-map-div").css("display","block");
        	var id = this.getUrlKey('id');
        	this.wenzhangId = id;
        	this.getList();
        },
        getList: function(){
        	var name = $("#name").val();
        	
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'mapHtml/listMapAll',
        		data: {ID:this.wenzhangId,KEYWORDS:name,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.listCategory = data.listCategory;
        			 // 百度地图API功能
        			 var map = new BMap.Map("allmap");    // 创建Map实例
        			 map.centerAndZoom(new BMap.Point(116.304576,39.96582), 13);  // 初始化地图,设置中心点坐标和地图级别
        			 //添加地图类型控件
        			 map.addControl(new BMap.MapTypeControl({
        				mapTypes:[
        			         BMAP_NORMAL_MAP,
        			         BMAP_HYBRID_MAP
        			     ]}));	  
        			 map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
        			 map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        			 var listMap = data.list;
        			 var myGeo = new BMap.Geocoder();
        			 var opts = {
        				width : 80,     // 信息窗口宽度
        			    height: 300,     // 信息窗口高度 
        				title : "" , // 信息窗口标题
        				enableMessage:true//
        			}
        			 
        			 
		        	 for (var i = 0; i < listMap.length; i++) {
						vm.map(listMap[i].NAME,listMap[i].ADDRESS,myGeo,map,opts,listMap[i].TEL,listMap[i].HEADMAN_PHONE,listMap[i].INTRO,listMap[i].HEADMAN);
					 }    
	        		
	        		
        			 
        		 }else if ("exception" == data.result){
                 	showException("前台详细",404);//显示异常
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
        map: function(name,address,myGeo,map,opts,tel,headman_phone,intro,headman){ 
        	myGeo.getPoint(address, function(point){
				if (point) {
					var myIcon = new BMap.Icon("../../assets/index/img/Icon_mark1.png", new BMap.Size(50,40));
					var addressPoint = new BMap.Point(point.lng, point.lat);
					var marker = new BMap.Marker(addressPoint, {icon: myIcon});
					map.addOverlay(marker);
					
					marker.addEventListener("click",function(e){
						var html = "机构名称："+name+"<br>";
						// html+="负责人："+headman+"<br>";
						html+="机构电话："+tel+"<br>";
						html+="地址："+address+"<br>";
						if("undefined"==intro){
							 intro = "暂无简介";
						}
						html+="简介："+intro+"<br>";
						var infoWindow = new BMap.InfoWindow(html, opts);
						map.openInfoWindow(infoWindow,addressPoint); //开启信息窗口
						}
					);
					
					//marker.setLabel(new BMap.Label(name,{offset:new BMap.Size(20,-10)}));
				}
			}, "北京市");
        	
        	
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