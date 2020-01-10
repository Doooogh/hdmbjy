
var httpurl = httpurlSystem;

var vm = new Vue({
    el: '#app',
    
    //初始数据
    data: {
    	FUSER:true,
        FPSW:false,
        CHECKED:false,
    	USERNAME: '',
    	PASSWORD: ''
    },
    
    //进入页面时输入用户名的input获得焦点
    directives: {
        focus: {
        	inserted: function (el, {value}) {
                if (value) {
                    el.focus();
                }
            }
        }
    },
 
	methods: {

         //登录
	     login: function() {

	         if (this.USERNAME == "") {
	     		$("#USERNAME").tips({
	     			side : 2,
	     			msg : '用户名不得为空',
	     			bg : '#AE81FF',
	     			time : 3
	     		});
	     		this.$refs.FUSER.focus();
	     		return false;
              }
              
	         if (this.PASSWORD == "") {
	     		$("#PASSWORD").tips({
	     			side : 2,
	     			msg : '密码不得为空',
	     			bg : '#AE81FF',
	     			time : 3
	     		});
	     		this.$refs.FPSW.focus();
	     		return false;
              }
              
            //发送 post 请求
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'admin/check',
			    	data: {KEYDATA:"qq313596790fh" + this.USERNAME + ",fh," + this.PASSWORD,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if ("success" == data.result) {
                            $("#USERNAME").tips({
                                side : 2,
                                msg : '正在登录 , 请稍后 ...',
                                bg : '#68B500',
                                time : 10
                            });
                            vm.saveCookie();
                            window.location.href = "sys/index/index.html";
                        } else if ("usererror" == data.result) {
                            $("#USERNAME").tips({
                                side : 2,
                                msg : "用户名或密码有误",
                                bg : '#FF5080',
                                time : 15
                            });
                            $("#USERNAME").focus();
                        } else if ("error" == data.result){
                            $("#USERNAME").tips({
                                side : 2,
                                msg : "缺少参数",
                                bg : '#FF5080',
                                time : 15
                            });
                            $("#USERNAME").focus();
                        }else if ("exception" == data.result){
                        	showException("登录",data.exception);//显示异常
                        }
                    }
				}).done().fail(function(){
                   swal("登录失败!", "请求服务器无响应，稍后再试", "warning");
                });
         },
         
         //记住密码到Cookie?
        savePaw: function() {
            if(this.CHECKED){
                this.setCookie("USERNAME", "", -1);
                this.setCookie("PASSWORD", "", -1);
                this.USERNAME = '';
    	        this.PASSWORD = '';
            }
        },

        //记住密码到Cookie
        saveCookie: function() {
            if(this.CHECKED){
                this.setCookie("USERNAME", this.USERNAME, 7);
                this.setCookie("PASSWORD", this.PASSWORD, 7);
            }
        },

        //设置cookie
        setCookie: function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },

        //获取cookie
        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        },
        
        //根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
        
        //判断登录状态
        islogin: function (){
        	$.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'admin/islogin',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                    if ("success" == data.result) {
                        window.location.href = "sys/index/index.html";
                    }
                }
			});
        },

        //初始执行
        init() {
        	
        	this.islogin();		//判断登录状态

            //从cookie读取用户和密码
            this.USERNAME = this.getCookie('USERNAME');
            this.PASSWORD = this.getCookie('PASSWORD');
            if (this.USERNAME != '') {
                this.CHECKED = true;
            }

            //回车登录
            document.onkeydown = function(e) {
            var key = window.event.keyCode;
            if (key == 13) {
                vm.login();
                }
            }
            
            var msg = this.getUrlKey('msg');
            if('1' == msg){
            	swal("登录失败!", "此用户在其它终端已经早于您登录,您暂时无法登录!", "warning");
            }else if('2' == msg){
            	swal("强制下线!", "您被系统管理员强制下线或您的帐号在别处登录!", "warning");
            }

        }

    },
    mounted(){
        this.init()
    }
 
})

//重启之后 点击左侧列表跳转登录首页 
if (window != top) {
	top.location.href = location.href;
}