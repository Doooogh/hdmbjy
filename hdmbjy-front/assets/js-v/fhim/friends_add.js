
var httpurl = httpurlIm;

var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		keywords: '',	//检索关键词
		httpurl: '',
		loading:false	//加载状态
    },
    
	methods: {
		
        //初始执行
        init() {
        	$("#keywords").tips({
				side:3,
	            msg:'用户名或姓名',
	            bg:'#AE81FF',
	            time:2
	        });
        	this.httpurl = httpurlSystem;
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'friends/search',
        		data: {fcount:11,keywords:this.keywords,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("好友检索",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
		//查看用户资料
		viewUser: function (USERNAME){
			if("admin" == USERNAME){
				layer.alert('<font color="black">不能查看admin用户</font>');
				return;
			}
			layer.open({
			    type: 2,
			    title: '他(她)的资料',
			    shadeClose: true,
			    shade: false,
			    maxmin: false, //开启最大化最小化按钮
			    area: ['600px', '378px'],
			    content: '../../sys/user/user_view.html?USERNAME='+USERNAME
			  });
		}

	},
	
	mounted(){
        this.init();
    }
})

//点击好友的头像
var cache = {}; //用于临时记录请求到的数据
layui.use(['layim', 'flow'], function(){
	  var layim = layui.layim
	  ,layer = layui.layer
	  ,laytpl = layui.laytpl
	  ,$ = layui.jquery
	  ,flow = layui.flow;
	  //操作
	  var active = { 
		agree: function(othis){
			var li = othis.parents('li')
		      ,uid = li.data('uid')
		      ,from_group = li.data('fromGroup')
		      ,username = li.data('username')
		      ,avatar = li.data('avatar')
			
			layim.add({
				  type: 'friend' 			//friend：申请加好友、group：申请加群
				  ,username: username 		//好友昵称，若申请加群，参数为：groupname
				  ,avatar: avatar		 	//头像
				  ,submit: function(group, remark, index){
				    console.log(group); 	//获取选择的好友分组ID，若为添加群，则不返回值
				    console.log(remark); 	//获取附加信息
				    layer.close(index); 	//关闭改面板
					$.ajax({
						xhrFields: {
		                    withCredentials: true
		                },
						type: "POST",
						url: httpurl+'iminterface/addFriends',	//添加好友接口
				    	data: {FUSERNAME:uid,FGROUP_ID:group,BZ:remark,tm:new Date().getTime()},
						dataType:'json',
						success: function(data){
							if('01' == data.result){
								swal("申请成功", "等待对方同意", "success");
								top.applyFriend(uid);	//申请好友消息发送给对方，此函数在 WebRoot\assets\js-v\fhim.js页面中
							}else{
								swal("申请失败", "您已经添加过他(她)了,无需再申请", "warning");
							}
						}
					});
				  }
				});
		}
	  };
	  $('body').on('click', '.layui-fh', function(){
		    var othis = $(this), type = othis.data('type');
		    active[type] ? active[type].call(this, othis) : '';
		  });
});