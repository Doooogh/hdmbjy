
var httpurl = httpurlSystem;

var vm = new Vue({
    el: '#app',
    
    //初始数据
    data: {
    	RUSERNAME: '',
        RPASSWORD: '',
        RNAME: ''
    },
 
	methods: {

         //注册
	     register: function() {

	         if (this.RUSERNAME == "") {
	     		$("#RUSERNAME").tips({
	     			side : 2,
	     			msg : '用户名不得为空',
	     			bg : '#AE81FF',
	     			time : 3
	     		});
	     		this.$refs.FUSER.focus();
	     		return false;
              }
              
	         if (this.RPASSWORD == "") {
	     		$("#RPASSWORD").tips({
	     			side : 2,
	     			msg : '密码不得为空',
	     			bg : '#AE81FF',
	     			time : 3
	     		});
	     		this.$refs.FPSW.focus();
	     		return false;
              }

              if (this.RNAME == "") {
	     		$("#RNAME").tips({
	     			side : 2,
	     			msg : '姓名不得为空',
	     			bg : '#AE81FF',
	     			time : 3
	     		});
	     		this.$refs.FNA.focus();
	     		return false;
              }
            
            var nowtime = this.date2str(new Date(),"yyyyMMdd");
            //发送 post 请求
            $.ajax({
					type: "POST",
					url: httpurl+'admin/register',
			    	data: {USERNAME:this.RUSERNAME,PASSWORD:this.RPASSWORD,NAME:this.RNAME,FKEY:$.md5('USERNAME'+nowtime+',fh,'),tm:new Date().getTime()},
					dataType:"jsonp",  //数据格式设置为jsonp
            		jsonp:"callback",
					success: function(data){
                        if("00" == data.result){
                            $("#login").tips({
                                side : 1,
                                msg : '注册成功,请登录',
                                bg : '#68B500',
                                time : 10
                            });
                            setTimeout(function(){
                                vm.goLogin();
                            },2000);
                        }else if("01" == data.result){
                            $("#RUSERNAME").tips({
                                side : 1,
                                msg : "用户名已存在",
                                bg : '#FF5080',
                                time : 15
                            });
                            this.$refs.FUSER.focus();
                        }else if ("exception" == data.result){
                        	showException("注册",data.exception);//显示异常
                        }
                    }
				}).done().fail(function(){
                   swal("注册失败!", "请求服务器无响应，稍后再试", "warning");
                });
         },

         //去登陆页面
         goLogin: function(){
            window.location.href='login.html';
         },
        
         //日期格式
         date2str: function(x,y) {
            var z ={y:x.getFullYear(),M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
            return y.replace(/(y+|M+|d+|h+|m+|s+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2))});
         },

        //初始执行
        init() {
            //回车登录
            document.onkeydown = function(e) {
            var key = window.event.keyCode;
            if (key == 13) {
                vm.register();
                }
            }
        }

    },
    mounted(){
        this.init()
    }
 
})

setTimeout(function() {
	$('.w3-agilefireworks').fireworks();   
});
 	