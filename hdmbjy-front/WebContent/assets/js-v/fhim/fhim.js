
layui.config({
	  base: '../../../plugins/fhim/dist/js/' //扩展 JS 所在目录
	}).extend({
		readyMenu: 'readyMenu'
	});

var websocket = null;	//websocket对象

layui.use(['layim','readyMenu'], function(layim){

	var f = setInterval(function() {
		if("" != wimadress){
			clearInterval(f);
			if (window.WebSocket) {
				websocket = new WebSocket(encodeURI('ws://'+wimadress)); //wimadress参数在 assets/js-v/sys/index.js 中定义并赋值
				websocket.onopen = function() {
					websocket.send(',fhadmin-join,'+user); 	//发送上线消息(把上线状态发送给好友，对方好友栏目本头像从黑白色变彩色)(前提条件：本身在线状态设置为在线状态，否则对方看到的依然是离线状态)
					$("#myIm").tips({
						side:3,
			            msg:'即时通讯已连接成功',
			            bg:'#AE81FF',
			            time:10
			 		});
				};
				websocket.onerror = function() { 			//连接失败
					$("#myIm").tips({
						side:3,
			            msg:'连接发生错误,刷新或者更换浏览器试试',
			            bg:'#AE81FF',
			            time:10
			 		});
				};
				websocket.onclose = function() {			//连接断开
					$("#myIm").tips({
						side:3,
			            msg:'已经断开连接',
			            bg:'#AE81FF',
			            time:10
			 		});
					websocket.send(',fhadmin-leave,');		//发送下线消息
				};
				websocket.onmessage = function(message) {	//消息接收
					var message = JSON.parse(message.data);
					if('friend' == message.type || 'group' == message.type){ //接收好友或群发送的消息
						getFHMessage(message);
					}else if('user_join' == message.type){
						friendOnline(message.user);
						$("#myIm").tips({
							side:3,
				            msg:"好友"+message.name+'上线了',
				            bg:'#AE81FF',
				            time:5
				 		});
					}else if('user_leave' == message.type){
						friendOffline(message.user);
						$("#myIm").tips({
							side:3,
				            msg:"好友"+message.name+'下线了',
				            bg:'#FFA500',
				            time:5
				 		});
					}else if('user_online' == message.type){
						friendOnline(message.user);		//好友设置在线状态
					}else if('user_hide' == message.type){
						friendOffline(message.user);	//好友设置隐身状态
					}else if('user_applyfriend' == message.type){
						applyIFriend();					//申请加好友
					}else if('user_emove' == message.type){
						removeFriend(message.user);		//删除好友(被动删，被拉黑)
					}else if('agreefriend' == message.type){
						addFriend(message);				//对方同意添加好友
					}else if('applyqgroup' == message.type){
						applyIQgroup();					//申请加群申请
					}else if('agreeqgroup' == message.type){
						addIQgroup(message);			//对方同意群申请
					}else if('kickoutqgroup' == message.type){
						kickoutIQgroup(message.id);		//踢出群
					}else if('delqgroup' == message.type){
						delQgroup(message.QGROUP_ID);	//群解散
						$("#myIm").tips({
							side:3,
				            msg:message.CONTENT,
				            bg:'#AE81FF',
				            time:5
				 		});
					}
				};
			}else{
				$("#myIm").tips({
					side:3,
		            msg:'此浏览器不支持websocket,请用支持HTML5的浏览器或者使用最新谷歌、火狐、360等浏览器',
		            bg:'#AE81FF',
		            time:10
		 		});
			}
			
			$.ajax({
				xhrFields: {
		            withCredentials: true
		        },
				type: "POST",
				url: httpurlIm+'iminterface/getImsign',					//获取皮肤
		    	data: {tm:new Date().getTime()},
				dataType:'json',
				success: function(data){
					  /*基础配置*/
					  layim.config({
					    init: {
					      url: httpurlIm+'iminterface/getList'			//初始化接口
					      ,data: {}
					    }
					    ,members: {
					      url: httpurlIm+'iminterface/getMembers'			//查看群员接口
					      ,data: {}
					    }
					    ,uploadImage: {
					      url: httpurlIm+'iminterface/updateImg'			//上传图片接口
					      ,type: 'post' 								//默认post
					    } 
					    
					    ,uploadFile: {
					      url: httpurlIm+'iminterface/updateFile'			//上传文件接口
					      ,type: 'post' 								//默认post
					    }
					    ,isAudio: true 									//开启聊天工具栏音频
					    ,isVideo: true 									//开启聊天工具栏视频
					    /**扩展工具栏*/
					    ,tool: [{
					      alias: 'code'
					      ,title: '代码'
					      ,icon: '&#xe64e;'
					    }]
					    //,brief: true 						//是否简约模式（若开启则不显示主面板）
					    ,title: '我的通讯' 					//自定义主面板最小化时的标题
					    //,right: '100px' 					//主面板相对浏览器右侧距离
					    //,minRight: '90px' 				//聊天面板最小化时相对浏览器右侧距离
					    ,initSkin: data.imsign	 			//1-5 设置初始背景
					    //,skin: ['aaa.jpg'] 				//新增皮肤
					    //,isfriend: false 					//是否开启好友
					    //,isgroup: false 					//是否开启群组
					    //,min: true 						//是否始终最小化主面板，默认false
					    ,notice: true 						//是否开启桌面消息提醒，默认false
					    //,voice: false 					//声音提醒，默认开启，声音文件为：default.mp3
					    ,msgbox: '../../fhim/msgbox.html' 				//消息盒子页面地址，若不开启，剔除该项即可
					    ,find: '../../fhim/friends/friends_add.html' 	//发现页面地址，若不开启，剔除该项即可
					    ,chatLog: '../../fhim/hismsg/hismsg_list.html' 	//聊天记录页面地址，若不开启，剔除该项即可
					    
					  });
				}
			});
		}
  },1000);
	
  layim.on('online', function(data){			//监听在线状态的切换事件
    websocket.send(',fhadmin-'+data+','+user);	//发送在线隐身消息
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurlIm+'iminterface/editState',
    	data: {ONLINE:data,TYPE:"online",tm:new Date().getTime()},
		dataType:'json',
		success: function(data){}
	});
  });
  
  layim.on('sign', function(data){				//监听签名修改
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurlIm+'iminterface/editState',
    	data: {AUTOGRAPH:data,TYPE:"auto",tm:new Date().getTime()},
		dataType:'json',
		success: function(data){}
	});
  });

  layim.on('setSkin', function(filename, src){	//监听更换背景皮肤
		$.ajax({
			xhrFields: {
                withCredentials: true
            },
			type: "POST",
			url: httpurlIm+'iminterface/editState',
		   	data: {SIGN:filename,TYPE:"sign",tm:new Date().getTime()},
			dataType:'json',
			success: function(data){}
		});
	}); 
  
  layim.on('tool(code)', function(insert){		//监听自定义工具栏点击，以添加代码为例
    layer.prompt({
      title: '插入代码'
      ,formType: 2
      ,shade: 0
    }, function(text, index){
      layer.close(index);
      insert('[pre class=layui-code]' + text + '[/pre]'); //将内容插入到编辑器
    });
  });
  
  /*监听layim建立就绪*/
  layim.on('ready', function(res){
	layui.readyMenu.init(); 					//更新右键点击事件
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurlIm+'iminterface/getMsgCount',			//未读消息(加好友群等)总数
    	data: {tm:new Date().getTime()},
		dataType:'json',
		success: function(data){
			if('01' == data.result){
				layim.msgbox(data.count); 		//消息盒子有新消息
			}
		}
	});
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurlIm+'iminterface/getNoreadMsg',		//未读消息(离线消息)接口
    	data: {tm:new Date().getTime()},
		dataType:'json',
		success: function(data){
			if('has' == data.result){
				$.each(data.list, function(i, list){
					layim.getMessage({
						  username: list.NAME 		//消息来源用户名
						  ,avatar: list.PHOTO 		//消息来源用户头像
						  ,id: list.USERNAME 		//消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
						  ,type: "friend" 			//聊天窗口来源类型，从发送消息传递的to里面获取
						  ,content: list.CONTENT 	//消息内容
						  ,timestamp:list.CTIME
					});
				 });
			}
		}
	});
	
  });
  
  //接收到好友或群的消息
  function getFHMessage(data){
	 layim.getMessage(data);
  }
  
  //接收到好友上线消息，头像取消置灰
  function friendOnline(id){
	  layim.setFriendStatus(id, 'online'); //设置指定好友在线，即头像取消置灰
  }
  
  //接收到好友下线消息，头像置灰
  function friendOffline(id){
	  layim.setFriendStatus(id, 'offline'); //设置指定好友下线，即头像置灰
  }
  
  //申请好友消息
  function applyIFriend(){
	  layim.msgbox('新');
	  $("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+fhsmsSound+'.mp3" autoplay controls></audio>');
  }
  
  //申请加群消息
  function applyIQgroup(){
	  layim.msgbox('新');
	  $("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+fhsmsSound+'.mp3" autoplay controls></audio>');
  }
  
  //踢出消息
  function kickoutIQgroup(QGROUP_ID){
	  layui.layim.removeList({
		  type: 'group' 
		  ,id: QGROUP_ID //群ID
		});
	  layim.msgbox('新');
	  $("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+fhsmsSound+'.mp3" autoplay controls></audio>');
  }

  //删除好友(被对方拉黑)
  function removeFriend(FUSERNAME){
	  layim.removeList({
		  type: 'friend' //或者group
		  ,id: FUSERNAME //好友用户名
		});
  }
  
  //对方同意添加好友(加入好友栏目)
  function addFriend(message){
	  layim.addList({
		  type: 'friend' 				//列表类型，只支持friend和group两种
		  ,avatar: message.avatar 		//好友头像
		  ,username: message.username	//好友昵称
		  ,groupid: message.groupid		//所在的分组id
		  ,id: message.id 				//好友id
		  ,status: message.status 		//在线状态
		  ,sign: message.sign		 	//好友签名
	  });
	  layim.msgbox('新');
	  $("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+fhsmsSound+'.mp3" autoplay controls></audio>');
	  layui.readyMenu.init(); 			//更新右键点击事件
  }
  
  //对方同意添群(加入群组栏目)
  function addIQgroup(message){
	  layim.addList({
		  type: 'group' 					//列表类型，只支持friend和group两种
		  ,avatar: message.avatar			//群组头像
		  ,groupname: message.groupname 	//群组名称
		  ,id: message.id 					//群组id
	  });
	  layim.msgbox('新');
	  $("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+fhsmsSound+'.mp3" autoplay controls></audio>');
  }
  
  //群解散
  function delQgroup(QGROUP_ID){
	  layui.layim.removeList({
		  type: 'group' 
		  ,id: QGROUP_ID //群ID
		});
	  layim.msgbox('新');
	  $("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/'+fhsmsSound+'.mp3" autoplay controls></audio>');
  }
  
  //监听发送消息
  layim.on('sendMessage', function(data){
	layer.closeAll('loading');
    var To = data.to;		//当前用户资料
    var mine = data.mine; 	//发送者数据(消息内容以及发送者资料)
    /** 
     *	user:发送者用户名
	 *	uname：发送者用户姓名
	 *	To.id：对方用户名
	 *	To.type：消息类型 group or friend
	 *	mine.avatar:发送者用户头像
	 *	mine.content：消息内容
	 */
	 websocket.send(",fhadmin-msg,"+user+",fh,"+uname+",fh,"+To.id+",fh,"+To.type+",fh,"+mine.avatar+",fh,"+mine.content);
  });

  //监听群员
  layim.on('members', function(data){
    console.log(data);
  });
  
  //监听聊天窗口的切换
  layim.on('chatChange', function(res){
    var type = res.data.type;
    if(type === 'friend'){
    } else if(type === 'group'){
    }
  });

});

//从自己好友栏删除好友
function removeFriendByI(FUSERNAME){
  layui.layim.removeList({
	  type: 'friend' 
	  ,id: FUSERNAME //好友用户名
	});
}

//从对方好友栏里面删除自己
function removeIFromFriend(FUSERNAME){
	websocket.send(',fhadmin-remove,'+user+',fh,'+FUSERNAME); 
}

//从自己手机好友栏里面删除对方
function removeFriendFromMobile(FUSERNAME){
	websocket.send(',fhadmin-remove,'+FUSERNAME+',fh,'+user); 
}

//退出群
function removeQgroup(QGROUP_ID,TYPE){
  layui.layim.removeList({
	  type: 'group' 
	  ,id: QGROUP_ID //群ID
	});
  if('del'==TYPE){
 	websocket.send(',fhadmin-delqgroup,'+QGROUP_ID); 	//解散群，通知所有群成员
  }else{
	websocket.send(',fhadmin-applyqgroup,'+QGROUP_ID);  //申请群和退群，都是通知群主，此函数可共用一个
  }
}

//新建群时，把群添加到群组栏里面
function addQgroup(id,avatar,groupname){
	layui.layim.addList({
		type: 'group' 			//列表类型
	  	,avatar: avatar 		//群组头像
	  	,groupname: groupname 	//群组名称
	  	,id: id					//群组id
	});
}

//同意对方申请好友，发送同意信息给对方
function agreeFriend(FUSERNAME){
	websocket.send(',fhadmin-agreefriend,'+user+",fh,"+FUSERNAME);
}

//同意对方申请加群，发送同意信息给对方
function agreeQgroup(uid,group){
	websocket.send(',fhadmin-agreeqgroup,'+uid+",fh,"+group);
}

//踢出群，发踢出信息给对方
function kickoutQgroup(uid,group){
	websocket.send(',fhadmin-kickoutqgroup,'+uid+",fh,"+group);
}

//申请好友，发送消息
function applyFriend(uid){
	websocket.send(',fhadmin-applyfriend,'+uid);
}

//申请加群，发送消息
function applyQgroup(QGROUP_ID){
	websocket.send(',fhadmin-applyqgroup,'+QGROUP_ID);
}
