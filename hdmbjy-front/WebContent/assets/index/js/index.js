
var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		listCategory: [],	//栏目
		listRotaryimg: [],	//轮播图片
		listArticles: [],	//文章热门推荐
		listXinWen: [],	//文章热门推荐
		listGzgl: [],	//工作管理
		listGzgg: [],	//公示公告
		listDwgk: [],	//党务公开
		listZtzl: [],	//党务公开
		nginxurl:'',
		
    },
    
	methods: {
        //初始执行
        init() {
        	this.nginxurl = nginxurl;
    		this.getList();
    		this.getMap();
    		
    		setTimeout(function(){
    			$(".slideBox").slide({mainCell:".bd ul",autoPlay:true});
        		$(".slideTxtBox").slide({});
        		$(".picScroll-left").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",vis:5,trigger:"click"});
        		$(".ul_rmtj li").each(function(index){if(index > 2){ $(this).remove();};});
        		$(".ul_xwdt li").each(function(index){if(index > 7){ $(this).remove();};});
        		$(".ul_gzgl li").each(function(index){if(index > 7){ $(this).remove();};});
        		$(".ul_gsgg li").each(function(index){if(index > 7){ $(this).remove();};});
        		$(".ul_dwgk li").each(function(index){if(index > 1){ $(this).remove();};});
        		$(".ul_bmfw li").each(function(index){if(index > 2){ $(this).remove();};});
        		$(".searchhistory a").each(function(index){if(index > 2){ $(this).remove();};});
            },1000);
    		
        },
        //获取列表
        getList: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'indexHtml/listAll',
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.listCategory = data.listCategory;
        			 vm.listRotaryimg = data.listRotaryimg;
        			 vm.listArticles = data.listArticles;
        			 vm.listXinWen = data.listXinWen;
        			 vm.listGzgl = data.listGzgl;
        			 vm.listGzgg = data.listGzgg;
        			 vm.listDwgk = data.listDwgk;
        			 vm.listZtzl = data.listZtzl;
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
    	
        getMap: function(){
        	 $.ajax({
         		xhrFields: {
                     withCredentials: true
                 },
         		type: "POST",
         		url: httpurl+'mapHtml/listMapAll',
         		data: {ID:this.wenzhangId,KEYWORDS:'',tm:new Date().getTime()},
         		dataType:"json",
         		success: function(data){
         		 if("success" == data.result){
         			 // 百度地图API功能
         			 var map = new BMap.Map("allmap");    // 创建Map实例
         			 map.centerAndZoom(new BMap.Point(116.304576,39.96582), 15);  // 初始化地图,设置中心点坐标和地图级别
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
        map: function(name,address,myGeo,map,opts,tel,headman_phone,intro,headman){ 
        	myGeo.getPoint(address, function(point){
				if (point) {
					var myIcon = new BMap.Icon("../../assets/index/img/Icon_mark1.png", new BMap.Size(30,40));
					var addressPoint = new BMap.Point(point.lng, point.lat);
					var marker = new BMap.Marker(addressPoint, {icon: myIcon});
					map.addOverlay(marker);
					
					marker.addEventListener("click",function(e){
						var html = "机构名称："+name+"<br>";
						html+="负责人："+headman+"<br>";
						html+="负责人电话："+headman_phone+"<br>";
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