
var websocketonline;//websocke对象
var vm = new Vue({
    el: '#app',
    
    data:{
    	userList: [],		//用户List
    	userCount:0,		//在线人数
    	loading:false		//在线状态
    },
    
	methods: {

        //初始执行
        init() {
        	this.online();
        	//复选框控制全选,全不选 
    		$('#zcheckbox').click(function(){
    		 if($(this).is(':checked')){
    			 $("input[name='ids']").click();
    		 }else{
    			 $("input[name='ids']").attr("checked", false);
    		 }
    		});
        },
        
        //获取在线列表
        online: function(){
    		if (window.WebSocket) {
    			this.loading = true;
    			websocketonline = new WebSocket(encodeURI('ws://'+top.onlineAdress)); //onlineAdress在index.js文件定义
    			websocketonline.onopen = function() {
    				websocketonline.send('[QQ313596790]fhadmin');//连接成功
    			};
    			websocketonline.onerror = function() {
    				//连接失败
    			};
    			websocketonline.onclose = function() {
    				//连接断开
    			};
    			//消息接收
    			websocketonline.onmessage = function(message) {
    				var message = JSON.parse(message.data);
    				if (message.type == 'count') {
    					userCount = message.msg;
    				}else if(message.type == 'userlist'){
    					vm.userList = message.list.reverse();
    					vm.userCount = message.list.length;
    				}else if(message.type == 'addUser'){
    					vm.userList[vm.userCount] = message.user ;
    					vm.userList = vm.userList.reverse();
    					vm.userCount = vm.userList.length;
    				}
    			};
    		}
    	},
    	
    	//强制某用户下线（websocket发送）
    	goOutUser: function(theuser){
    		websocketonline.send('[goOut]'+theuser);
    	},

    	//强制某用户下线
    	goOutTUser: function(theuser){
    		theuser = theuser.replace("mobile-","");
    		if('admin' == theuser){
    			swal("操作失败!", "不能强制下线admin用户!", "warning");
    			return;
    		}
    		swal({
    			title: '',
    	        text: "确定要强制["+theuser+"]下线吗?",
    	        icon: "warning",
    	        buttons: true,
    	        dangerMode: true,
    	    })
    	    .then((willDelete) => {
    	        if (willDelete) {
    	        	this.goOutUser(theuser);
    	        }
    	    });
    	},
    	
    	//查看修改用户
    	editUser: function (USERNAME){
    		USERNAME = USERNAME.replace("mobile-","");
    		if('admin' == USERNAME){
    			swal("禁止查看!", "不能查看修改admin用户!", "warning");
    			return;
    		}
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="资料";
    		 diag.URL = '../user/user_edit.html?USERNAME='+USERNAME;
    		 diag.Width = 600;
    		 diag.Height = 496;
    		 diag.CancelEvent = function(){ //关闭事件
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//批量操作
    	makeAll: function(msg){
    		swal({
    			title: '',
                text: msg,
                icon: "warning",
                buttons: true,
                dangerMode: true,
    	    }).then((willDelete) => {
                if (willDelete) {
    		    	var str = '';
    		    	$("input[name='ids']").attr("checked", false);
    				for(var i=0;i < document.getElementsByName('ids').length;i++){
    					  if(document.getElementsByName('ids')[i].checked){
    					  	if('admin' != document.getElementsByName('ids')[i].value){
    							  if(str=='') str += document.getElementsByName('ids')[i].value;
    							  else str += ',' + document.getElementsByName('ids')[i].value;
    						  }else{
    							  document.getElementsByName('ids')[i].checked  = false;
    							  $("#cts").tips({
    									side:3,
    						            msg:'admin用户不能强制下线',
    						            bg:'#AE81FF',
    						            time:5
    						        });
    						  }
    					  }
    				}
    				if(str==''){
    					$("#cts").tips({
    						side:2,
    			            msg:'点这里全选',
    			            bg:'#AE81FF',
    			            time:3
    			        });
    					swal("", "您没有选择任何内容!", "warning");
    					return;
    				}else{
    					var arField = str.split(',');
    					for(var i=0;i<arField.length;i++){
    						websocketonline.send('[goOut]'+arField[i]);
    					}
    				}
                }
            });
    	}

    },
    mounted(){
        this.init();
    }
 
})