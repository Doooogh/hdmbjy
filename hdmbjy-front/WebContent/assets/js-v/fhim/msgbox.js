
var httpurl = httpurlIm;

layui.use(['layim', 'flow'], function(){
  var layim = layui.layim
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,$ = layui.jquery
  ,flow = layui.flow;

  var cache = {}; //用于临时记录请求到的数据

  //请求消息
  var renderMsg = function(page, callback){
	 $.ajax({
	 		xhrFields: {
	            withCredentials: true
	        },
			type: "POST",
			url: httpurl+'iminterface/msgboxdata',
		   	data: {tm:new Date().getTime()},
			dataType:'json',
			success: function(res){
			  if(res.code != 0){
		        return layer.msg(res.msg);
		      }
		      //记录来源用户信息
		      layui.each(res.data, function(index, item){
		        cache[item.from] = item.user;
		      });
		      callback && callback(res.data, res.pages);
			}
		}).done().fail(function(){
            layer.msg("登录失效! 请求服务器无响应,稍后再试");
            setTimeout(function () {
            	window.location.href = "../login.html";
            }, 2000);
        });
		//打开页面即把消息标记为已读
		$.ajax({
	 		xhrFields: {
	            withCredentials: true
	        },
			type: "POST",
			url: httpurl+'iminterface/read',
		   	data: {tm:new Date().getTime()},
			dataType:'json',
			success: function(data){}
		});
  };

  flow.load({
    elem: '#LAY_view' 
    ,isAuto: false
    ,end: '<li class="layim-msgbox-tips" onclick="allmsg();" style="cursor:pointer;"><button class="layui-btn layui-btn-xs">消息管理</button></li>'
    ,done: function(page, next){
      renderMsg(page, function(data, pages){
        var html = laytpl(LAY_tpl.value).render({
          data: data
          ,page: page
        });
        next(html, page < pages);
      });
    }
  });

  /*操作*/
  var active = {
		  
    agree: function(othis){				//同意
      var li = othis.parents('li')
      ,uid = li.data('uid')
      ,from_group = li.data('fromGroup')
      ,type = li.data('type')
      ,msgid = li.data('msgid')
      ,qgroupid = li.data('qgroupid')
      ,user = cache[uid];
    
      parent.layui.layim.setFriendGroup({
        type: type 								  //group or friend
        ,username: '<font color="black">'+user.username+'</font>'
        ,avatar: user.avatar
        ,group: parent.layui.layim.cache().friend //获取好友分组数据
        ,submit: function(group, index){
        	
		 	$.ajax({
		 		xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'iminterface/agree',	 //同意申请(好友或者群)接口
			   	data: {SYSMSG_ID:msgid,FGROUP_ID:group,FUSERNAME:uid,TYPE:type,FNAME:user.username,QGROUP_ID:qgroupid,tm:new Date().getTime()},
				dataType:'json',
				success: function(data){}
			});
			if("friend" == type){
				top.agreeFriend(uid);			//同意对方申请好友，发送同意信息给对方(此函数在 WebRoot\assets\js-v\fhim.js页面中)
				parent.layui.layim.addList({	//将好友追加到主面板
					  type: 'friend'
					  ,avatar: user.avatar 		//好友头像
					  ,username: user.username 	//好友昵称
					  ,groupid: group 			//所在的分组id
					  ,id: uid 					//好友ID
					  ,sign: user.sign 			//好友签名
					});
				parent.layui.readyMenu.init(); 	//更新右键点击事件
			}else{
				top.agreeQgroup(uid,qgroupid);	//同意对方申请加群，发送同意信息给对方(此函数在WebRoot\assets\js-v\fhim.js页面中)
			}
			
			parent.layer.close(index);
			othis.parent().html('已同意');
			
        }
      });
    }

    ,refuse: function(othis){		//拒绝
    	 var li = othis.parents('li')
         ,uid = li.data('uid')
         ,from_group = li.data('fromGroup')
         ,type = li.data('type')
         ,msgid = li.data('msgid')
         ,qgroupid = li.data('qgroupid')
         ,user = cache[uid];
	      layer.confirm('确定拒绝吗？', function(index){
	    	  $.ajax({
	    		  	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'iminterface/refuse',	 //拒绝申请(好友或者群)接口
				   	data: {SYSMSG_ID:msgid,FUSERNAME:uid,TYPE:type,FNAME:user.username,QGROUP_ID:qgroupid,tm:new Date().getTime()},
					dataType:'json',
					success: function(data){
						if("01" == data.result){
							layer.close(index);
					        othis.parent().html('<em>已经在群了</em>');
						}else{
							layer.close(index);
					        othis.parent().html('<em>已拒绝</em>');
					        top.applyFriend(uid);		//拒绝对方申请好友，发送信息给对方(此函数在 WebRoot\assets\js-v\fhim.js页面中)注意：通知方式和申请好友通知函数一样，所以用同样的函数即可
						}
						
					}
				});
	      });
    }
  };

  $('body').on('click', '.layui-btn', function(){
    var othis = $(this), type = othis.data('type');
    active[type] ? active[type].call(this, othis) : '';
  });
});

//打开消息管理窗口
function allmsg(){
	parent.layer.open({
	    type: 2,
	    title: '系统消息',
	    shadeClose: true,
	    shade: false,
	    maxmin: true, //开启最大化最小化按钮
	    area: ['1000px', '600px'],
	    content: '../../fhim/sysmsg/sysmsg_list.html'
	  });
}

//打开消息管理窗口
function viewUser(USERNAME){
	if('admin' == USERNAME){
		layer.msg("禁止查看! 不能查看admin用户!");
		return;
	}
	parent.layer.open({
	    type: 2,
	    title: '好友资料',
	    shadeClose: true,
	    shade: false,
	    maxmin: false, //开启最大化最小化按钮
	    area: ['588px', '365px'],
	    content: '../user/user_view.html?USERNAME='+USERNAME
	  });
}
