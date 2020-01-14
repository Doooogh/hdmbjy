layui.config({
	base : '../../../assets/windows/winui/' 	// 指定 winui 路径
}).extend({ 						// 指定js别名
	window : 'js/winui.window',
	desktop : 'js/winui.desktop',
	start : 'js/winui.start',
	helper : 'js/winui.helper'
}).define([ 'window', 'desktop', 'start', 'helper' ], function(exports) {
	var $ = layui.jquery;

	$(function() {
		winui.window.msg('欢迎 使用 FH Admin', {
			time : 4500,
			offset : '40px',
			btn : [ '点击进入全屏(Esc退出)' ],
			btnAlign : 'c',
			yes : function(index) {
				winui.fullScreen(document.documentElement);
				layer.close(index);
			}
		});

		winui.config({
			settings : layui.data('winui').settings || {
				color : 32,
				taskbarMode : 'bottom',
				startSize : 'sm',
				bgSrc : SKIN,
				lockBgSrc : '../../../assets/windows/images/bg_04.jpg'
			}, 					// 如果本地配置为空则给默认值
			desktop : {
				options : {}, 	// 可以为{} 
				done : function(desktopApp) {
					desktopApp.ondblclick(function(id, elem) {
						OpenWindow(elem);
					});
					desktopApp.contextmenu({
						item : [ "打开此菜单"],
						item1 : function(id, elem) {
							OpenWindow(elem);
						}
					});
				}
			},
			menu : {
				options : {
					url : httpurl+'main/getMenus?MENU_TYPE=2',
					method : 'get',
					data : {}
				},
				done : function(menuItem) {
					// 监听开始菜单点击
					menuItem.onclick(function(elem) {
						OpenWindow(elem);
					});
				}
			}
		}).init({
			audioPlay : startMusic, 	// 是否播放音乐（开机音乐只会播放一次，第二次播放需要关闭当前页面从新打开，刷新无用）
			renderBg : true
										// 是否渲染背景图 （由于js是写在页面底部，所以不太推荐使用这个来渲染，背景图应写在css或者页面头部的时候就开始加载）
		}, function() {
			// 初始化完毕回调
		});

	});

	// 开始菜单磁贴点击
	//$('.winui-tile').on('click', function() {
		//OpenWindow(this);
	//});

	// 开始菜单左侧主题按钮点击
	$('.winui-start-item.winui-start-individuation').on('click', function() {
		winui.window.openTheme();
	});

	// 打开窗口的方法（可自己根据需求来写）
	function OpenWindow(menuItem) {
		var $this = $(menuItem);

		var url = $this.attr('win-url');
		var title = $this.attr('win-title');
		var id = $this.attr('win-id');
		var type = parseInt($this.attr('win-opentype'));
		var maxOpen = parseInt($this.attr('win-maxopen')) || -1;
		if (url == 'theme') {
			winui.window.openTheme();
			return;
		}
		if (!url || !title || !id) {
			winui.window.msg('菜单配置错误（菜单链接、标题、id缺一不可）');
			return;
		}

		var content;
		if (type === 1) {
			$.ajax({
				xhrFields: {
                    withCredentials: true
                },
				type : 'get',
				url : url,
				async : false,
				success : function(data) {
					content = data;
				},
				error : function(e) {
					var page = '';
					switch (e.status) {
					case 404:
						page = '404.html';
						break;
					case 500:
						page = '500.html';
						break;
					default:
						content = "打开窗口失败";
					}
					$.ajax({
						xhrFields: {
		                    withCredentials: true
		                },
						type : 'get',
						url : 'views/error/' + page,
						async : false,
						success : function(data) {
							content = data;
						},
						error : function() {
							layer.close(load);
						}
					});
				}
			});
		} else {
			content = url;
		}
		winui.window.config({
			anim : 0,
			miniAnim : 0,
			maxOpen : -1
		}).open({
			id : id,
			type : type,
			title : title,
			content : content
			// ,area: ['70vw','80vh']
			// ,offset: ['10vh', '15vw']
			,
			maxOpen : maxOpen
		// , max: false
		// , min: false
		// , refresh:true
		});
	}

	// 注销登录
	$('.logout').on('click', function() {
		winui.hideStartMenu();
		winui.window.confirm('确认注销吗?', {
			icon : 3,
			title : '提示'
		}, function(index) {
			vm.goOut('0');
			layer.close(index);
		});
	});

	// 判断是否显示锁屏（这个要放在最后执行）
	if (window.localStorage.getItem("lockscreen") == "true") {
		winui.lockScreen(function(password) {
			var isok = false;
			//解锁验证
			$.ajax({
				xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'admin/isPassword',
		    	data: {password:password,tm:new Date().getTime()},
				dataType:'json',
				async: false,
				success: function(data){
					 if("success" == data.result){
						 isok = true;
					 }else{
						winui.window.msg('密码错误', {
							shift : 6
						});
						isok = false;
					 }
				}
			});
			return isok;
		});
	}

	// 扩展桌面助手工具
	winui.helper.addTool([ {
		tips : '全屏显示(Esc退出)',
		icon : 'fa fa-square-o',
		click : function(e) {
			winui.fullScreen(document.documentElement);
		}
	}, {
		tips : '锁屏',
		icon : 'fa-power-off',
		click : function(e) {
			winui.lockScreen(function(password) {
				var isok = false;
				//解锁验证
				$.ajax({
					xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'admin/isPassword',
			    	data: {password:password,tm:new Date().getTime()},
					dataType:'json',
					async: false,
					success: function(data){
						 if("success" == data.result){
							 isok = true;
						 }else{
							winui.window.msg('密码错误', {
								shift : 6
							});
							isok = false;
						 }
					}
				});
				return isok;
			});
		}
	} ]);

	exports('index', {});
});