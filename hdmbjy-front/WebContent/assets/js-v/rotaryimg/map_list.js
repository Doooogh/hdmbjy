var map = new BMap.Map("allmap"); // 创建Map实例
	// 百度地图API功能

	map.centerAndZoom(new BMap.Point(116.691727,39.973129), 13); // 初始化地图,设置中心点坐标和地图级别
	//添加地图类型控件
	map.addControl(new BMap.MapTypeControl({
		mapTypes: [
			BMAP_NORMAL_MAP,
			BMAP_HYBRID_MAP
		]
	}));
	map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

	//style="display: block; width: 160px; height: 50px; overflow: auto hidden;"



	$("#onMap").click(function() {
		//设置中心点
		map.centerAndZoom(new BMap.Point(116.30268,39.965873), 15);
		map.clearOverlays(); 
		$("#up-map-div").css("display","none");		
	});
	$("#onMap1").click(function() {
		//设置中心点
		map.centerAndZoom(new BMap.Point(116.309363,39.98857), 15);
		map.clearOverlays(); 
		$("#up-map-div").css("display","none");
	});
	$("#onMap2").click(function() {
		//设置中心点
		map.centerAndZoom(new BMap.Point(116.351907,39.995342), 15);
		map.clearOverlays(); 
		$("#up-map-div").css("display","none");
	});
	$("#onMap3").click(function() {
		//设置中心点
		map.centerAndZoom(new BMap.Point(116.365705,39.972039), 15);
		map.clearOverlays(); 
		$("#up-map-div").css("display","none");
	});
	
	
	$("#onMap4").click(function() {
	// 幼儿园 : 北京小天使美语幼儿园 , 电话:010-68712313 地址:北京市海淀区车道沟南里小区
	//116.305842,39.973974
	// 幼儿园 : 北京海淀区外国语实验学校附属幼儿园  电话:010-88464890地址:北京市海淀区杏石口路20号
	//116.286511,39.96485
	// 幼儿园 : 北京二十一世纪实验幼儿园  电话:010 - 88455355地址:北京市海淀区曙光花园望河园8号
	//116.319065,39.967007
	var marker1 = new BMap.Marker(new BMap.Point(116.305842,39.973974));
	var marker2 = new BMap.Marker(new BMap.Point(116.286511,39.96485));
	var marker3 = new BMap.Marker(new BMap.Point(116.319065,39.967007));
	map.addOverlay(marker1);
	map.addOverlay(marker2); 
	map.addOverlay(marker3); 
	
	var opts = {
	  width : 160,     // 信息窗口宽度
	  height: 50,     // 信息窗口高度
	}
	
	var infoWindow1 = new BMap.InfoWindow("北京小天使美语幼儿园", opts);  // 创建信息窗口对象 
	marker1.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow1,new BMap.Point(116.305842,39.973974)); //开启信息窗口
		var name = "北京小天使美语幼儿园";
		var tele = "010-68712313"
		var address = "北京市海淀区车道沟南里小区"
		var bz = '北京小天使美语幼儿园通过专业的英语、艺术启蒙教学，充分、合理地开发幼儿的身心潜能，并结合《纲要》给幼儿实施体、智、德、美全面发展，拓展幼儿的心智技能,为培养未来全面型国际人才奠定一个全方位的素质基础。 　　我们的理念：儿童早期艺术教育对培养人的个性、创造力、美感、协调性、自信心及内、外在气质是很关键有效的时期。法国大文豪雨果曾有一句名言:"开启人类智慧宝库有三把钥匙：一把是音符,一把是文字,一把是数…';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
	});
	
	var infoWindow2 = new BMap.InfoWindow("北京海淀区外国语实验学校附属幼儿园", opts);  // 创建信息窗口对象 
	marker2.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow2,new BMap.Point(116.286511,39.96485)); //开启信息窗口
		
		var name = "北京海淀区外国语实验学校附属幼儿园";
		var tele = "010-88464890";
		var address = "京市海淀区杏石口路20号";
		var bz = '幼儿园位于北京市海淀外国语实验学校校园内，占地约10000平方米，建筑面积5000平方米，拥有北京市一流的设备设施，目前以寄宿为主，共设十五个班，可容纳适龄儿童400余人，是一所民办高档幼儿园。幼儿园秉承"海外"严谨治学的传统，从深受家长喜爱和社会广泛认可的"海外"学前中心发展而来。重视习惯培养、打下双语基础、激发广泛兴趣、注重知识启蒙为办园特色，和"海外"小学、初中、高中形成完整的育人体系。 　　幼儿园将于20…';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
	});
	
	var infoWindow3 = new BMap.InfoWindow("北京二十一世纪实验幼儿园", opts);  // 创建信息窗口对象 
	marker3.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow3,new BMap.Point(116.319065,39.967007)); //开启信息窗口
		var name = "北京二十一世纪实验幼儿园";
		var tele = "010 - 88455355";
		var address = "北京市海淀区曙光花园望河园8号";
		var bz = '北京市二十一世纪实验幼儿园创办于1995年，是北京市最早的民办寄宿制幼儿园，也是最早以双语教育和多元文化为基本特色的幼儿园。经过近十年的不懈努力，北京市二十一世纪实验幼儿园以其独特的教育模式、科学的教育方法、出色的教育成果蜚声幼教界，已经培养了近2000名国际化、开放性的中、外籍优秀儿童。 　　优质的早期教育，家长的迫切需求，促使二十一世纪实验幼儿园不断发展壮大。目前幼儿园已经成为以二十一世纪研究中心…';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
	});
	
	
	
	});
	
	    
	
	$("#onMap5").click(function() {
		// 小学 : 北京市建华实验学校小学部  电话:010-68150410地址:北京市海淀区玉泉路66号（十一学校南门内）
		// 116.301745,39.995729
		// 小学 : 北京海淀外国语实验学校小学部  电话:010-88472800地址:北京市海淀区杏石口路20号
		// 116.318202,39.982959
		// 小学 : 北京中关村外国语学校小学部 电话:010-80794628 010-80717080　地址:北京市昌平区回龙观朱辛庄321号　
		// 116.291325,39.987382
		var marker4 = new BMap.Marker(new BMap.Point(116.301745,39.995729));
		var marker5 = new BMap.Marker(new BMap.Point(116.318202,39.982959));
		var marker6 = new BMap.Marker(new BMap.Point(116.291325,39.987382));
		map.addOverlay(marker4);
		map.addOverlay(marker5); 
		map.addOverlay(marker6);
		
		
		var opts = {
		  width : 160,     // 信息窗口宽度
		  height: 50,     // 信息窗口高度
	    }
	
	var infoWindow4 = new BMap.InfoWindow("北京市建华实验学校小学部", opts);  // 创建信息窗口对象 
	marker4.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow4,new BMap.Point(116.301745,39.995729)); //开启信息窗口
		var name = "北京市建华实验学校小学部";
		var tele = "010-68150410";
		var address = "北京市海淀区玉泉路66号";
		var bz = '北京市建华实验学校是一所民办全日制寄宿学校，现有小学部、初中部。初中教育、教学由北京十一学校承担。学校实行董事会领导下的校长负责制，董事长由全国教育系统劳动模范、北京市模范校长、北京十一学校校长李金初担任，校长由北京市优秀党支部书记、北京市教育之星、原北京十一学校党总支书刘桂林担任。 　　北京市建华实验学校是1993年创办的一所具有现代教育特色的全日制寄宿制民办学校，现有小学部、初中部、高中部。';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
	});
	
	var infoWindow5 = new BMap.InfoWindow("北京海淀外国语实验学校小学部", opts);  // 创建信息窗口对象 
	marker5.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow5,new BMap.Point(116.318202,39.982959)); //开启信息窗口
		var name = "北京海淀外国语实验学校小学部";
		var tele = "010-88472800";
		var address = "北京市海淀区杏石口路20号";
		var bz = '北京市海淀外国语实验学校始建于1999年7月，是北京市海淀区政府为适应中关村科技园区发展的需要，批准成立的具有现代化设施的新型外国语实验学校，被首批评为北京市先进民办校。 　　我校设有小学部、中学部、国际部、校务部、物业部，占地20公顷（300亩），总建筑面积9万平方米，总投资4亿元人民币，是由北京市四博连通用机械新技术公司投资举办一所寄宿制学校，现有学生3500多人，教职员工500多人。';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
	});
	
	var infoWindow6 = new BMap.InfoWindow("北京中关村外国语学校小学部", opts);  // 创建信息窗口对象 
	marker6.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow6,new BMap.Point(116.291325,39.987382)); //开启信息窗口
		var name = "北京中关村外国语学校小学部";
		var tele = "010-80794628 010-80717080";
		var address = "北京市昌平区回龙观朱辛庄321号";
		var bz = '中关村外国语学校小学部是一所集学前班、小学、初中、高中为一体的民办寄宿制学校。学校接受海淀区教委的直接领导，学生学籍、考核全部纳入海淀区教研中心的教研、科研指导，并作为其教科研实践基地。';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
	});
		
		
	});
	
	$("#onMap6").click(function() {
		// 中学 : 北京市师达中学  电话:010-62859660地址:北京市海淀区闵庄路70号
		// 116.363333,39.996309
		// 中学 : 北京科迪实验中学（八一中学寄宿部）  电话:010-62480991 陈老师、刘老师 地址:北京市海淀区苏家坨镇
		// 116.337175,39.995922
		// 中学 : 北京市北达资源中学  电话:010-62752071 地址:北京市海淀区颐和园路106号
		// 116.35241,39.98647
		var marker7 = new BMap.Marker(new BMap.Point(116.363333,39.996309));
		var marker8 = new BMap.Marker(new BMap.Point(116.337175,39.995922));
		var marker9 = new BMap.Marker(new BMap.Point(116.35241,39.98647));
		map.addOverlay(marker7);
		map.addOverlay(marker8); 
		map.addOverlay(marker9);
		
		var opts = {
		  width : 160,     // 信息窗口宽度
		  height: 50,     // 信息窗口高度
	    }
		
		var infoWindow7 = new BMap.InfoWindow("北京市师达中学", opts);  // 创建信息窗口对象 
		marker7.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow7,new BMap.Point(116.363333,39.996309)); //开启信息窗口
		var name = "北京市师达中学";
		var tele = "010-62859660";
		var address = "北京市海淀区闵庄路70号";
		var bz = '首都师大附中是“文革”后北京市首批确定的市属重点中学。2000年首批通过北京市验收，进入第一批现代化示范校行列。为充分发挥首都师大附中优质教育资源，保证高水平的高中生来源，2001年首都师大附中派遣教学校长张国玺同志带领58位附中在职教师，创建了民办性质的北京市师达中学（简称“师达中学”）。学校所有房间均使用中央空调，全部教室达到多媒体化。';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
		});
		var infoWindow8 = new BMap.InfoWindow("北京科迪实验中学（八一中学寄宿部）", opts);  // 创建信息窗口对象 
		marker8.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow8,new BMap.Point(116.337175,39.995922)); //开启信息窗口
		var name = "北京科迪实验中学（八一中学寄宿部）";
		var tele = "010-62480991";
		var address = "北京市海淀区苏家坨镇";
		var bz = '北京市科迪实验中学（八一中学寄宿部）创建于2000年，是北京市威凯房地产开发经营公司与北京市八一中学联合创办的一所寄宿制完全中学。学校有34个教学班，在校学生1300余名。 　　学校位于海淀北部新区中关村科技园内，紧邻生态氧吧翠湖湿地，占地300余亩，建筑面积3.2万平方米。学校分为南北校区。 南校区，教学楼、综合楼、宿舍楼、餐厅、图书馆，千人大礼堂掩映于蓝天、红墙与绿树之中;体操房、足球场、篮球场、游泳馆、';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
		});
		var infoWindow9 = new BMap.InfoWindow("北京市北达资源中学", opts);  // 创建信息窗口对象 
		marker9.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow9,new BMap.Point(116.35241,39.98647)); //开启信息窗口
		var name = "北京市北达资源中学";
		var tele = "010-62752071";
		var address = "北京市海淀区颐和园路106号";
		var bz = '北京市北达资源中学创办于1998年4月，是由北京大学资源集团申办，北大附中承办的一所民办中学，实施校董事会领导下的校长负责制。学校坐落与北京大学畅春园内，聚未名湖、博雅塔之灵气，融北大特有的学术和文化氛围于其中，教学设施齐全，教学环境幽雅。2001年暑假学校斥巨资对教学楼进行了装修，对教学设备进行了更新换代，每个教室都安装了多媒体教学设备和空调。2002年初完成了校园网的建设。';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
		});
	});
		
	
	
	$("#onMap7").click(function() {
		// 培训机构 : 华清远见嵌入式培训  电话:400-706-1880 地址:北京市海淀区西三旗悦秀路北京明园大学校内华清远见教育集团
		// 116.37785,39.972509
		// 培训机构 : 北京中关村软件培训学校  电话:15210846964 地址:北京市海淀区西二旗中关村软件园
		// 116.35241,39.972896
		// 培训机构 : 北京维特少儿综合教育  电话:13121371257 地址:北京海淀区清河街道小营西路20号清河大厦502室
		// 116.369801,39.982461
		var marker10 = new BMap.Marker(new BMap.Point(116.37785,39.972509));
		var marker11 = new BMap.Marker(new BMap.Point(116.35241,39.972896));
		var marker12 = new BMap.Marker(new BMap.Point(116.369801,39.982461));
		map.addOverlay(marker10);
		map.addOverlay(marker11); 
		map.addOverlay(marker12);
		
		var opts = {
		  width : 160,     // 信息窗口宽度
		  height: 50,     // 信息窗口高度
	    }
		
		var infoWindow10 = new BMap.InfoWindow("华清远见嵌入式培训 ", opts);  // 创建信息窗口对象 
		marker10.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow10,new BMap.Point(116.37785,39.972509)); //开启信息窗口
		var name = "华清远见嵌入式培训";
		var tele = "400-706-1880";
		var address = "北京市海淀区西三旗悦秀路北京明园大学校内华清远见教育集团";
		var bz = '北京华清远见科技信息有限公司（以下简称华清远见）是中国领先的嵌入式技术服务机构，公司于2004年注册于中国北京海淀高科技园区，核心业务定位在为企业和个人提供高端的嵌入式培训解决方案，为中国嵌入式行业提供最具价值的职业教育服务，其专业服务和质量承诺在客户中享有卓越的声誉。   ■ ARM公司全球授权培训中心（ATC）■ 微软全球嵌入式培训合作伙伴■ 国内首家Atmel公司全球战略合作伙伴■ ';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
		});
		
		var infoWindow11 = new BMap.InfoWindow("北京中关村软件培训学校 ", opts);  // 创建信息窗口对象 
		marker11.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow11,new BMap.Point(116.35241,39.972896)); //开启信息窗口
		var name = "北京中关村软件培训学校";
		var tele = "15210846964";
		var address = "北北京市海淀区西二旗中关村软件园";
		var bz = '北京市 海淀区民办培训机构 学校，是国内领先的前沿科技领域综合教育解决方案供应商，致力于网络信息安全、移动互联网、云计算、大数据、电子商务网络营销等前沿科技领域的软件开发、电子商务及项目管理等人才培养，拥有中关村软件外包资源平台、中小型企业发展促进人才服务平台，是一家集软件研发、服务外包、岗前实训、系统集成于一体的高新技术研发类企业。中软创新总部设在北京中关村软件园，在郑州、西安、南宁、合肥等地设有分公司。 ';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
		});
		
		var infoWindow12 = new BMap.InfoWindow("华清远见嵌入式培训 ", opts);  // 创建信息窗口对象 
		marker12.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow12,new BMap.Point(116.369801,39.982461)); //开启信息窗口
		var name = "北京维特少儿综合教育";
		var tele = "13121371257";
		var address = "北京海淀区清河街道小营西路20号清河大厦502室";
		var bz = '北京维特少儿综合教育融合了西方的教育理念，以兴趣为出发点，科学的引导模式，引导式的教学方法，开发孩子的想象力和创造力。主设课程有幼少儿英语、民族民间舞、拉丁舞、书法、围棋、创意美术、钢琴、吉他，招生年龄4-14岁。';
		htmlDev(name,tele,address,bz)
		$("#up-map-div").css("display","block");
		});
		
	});
	
	
	
	function htmlDev(name,tele,address,bz){
		var html = '<p>学校名称：'+name+'</p>';
			html += '<p>学校电话：'+tele+'</p>';
			html += '<p>学校地址：'+address+'</p>';
			html += '<p>学校简介：'+bz+'</p>';
		$("#up-map-div").html(html);
	}
	
	