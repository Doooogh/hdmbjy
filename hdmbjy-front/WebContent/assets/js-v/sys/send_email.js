
var httpurl = httpurlSystem;

var vm = new Vue({
    	el: '#app',
	
	data:{
		serverurl: '',	//后台地址
		TYPE: '2',		//类型，带标签or纯文本
		EMAIL: '',		//邮箱
		TITLE: '',		//标题
		CONTENT: '',	//内容
		CONNULL: false
    },
    
    methods: {
    	//初始执行
        init() {
    		this.serverurl = httpurl;
    		var EMAIL = this.getUrlKey('EMAIL'); //链接参数
        	if(null != EMAIL){
        		this.EMAIL = EMAIL;
        	}
        },
        
      	//发送
        sendEmail: function (){
        	if(this.EMAIL == ''){
        		$("#EMAIL").tips({
        			side:3,
                    msg:'请输入邮箱',
                    bg:'#AE81FF',
                    time:2
                });
        		this.$refs.EMAIL.focus();
        		return false;
        	}
        	if(this.TITLE == ''){
        		$("#TITLE").tips({
        			side:1,
                    msg:'请输入标题',
                    bg:'#AE81FF',
                    time:3
                });
        		this.$refs.TITLE.focus();
        		return false;
        	}
        	
        	this.getContent('email');
        	
        	if(this.CONNULL){
            	$("#showform").hide();
            	$("#jiazai").show();
            	this.btimer(59);
            	$.ajax({
            		xhrFields: {
	                    withCredentials: true
	                },
            		type: "POST",
            		url: httpurl+'head/sendEmail',
                	data: {EMAIL:this.EMAIL,CONTENT:this.CONTENT,TITLE:this.TITLE,TYPE:this.TYPE,tm:new Date().getTime()},
            		dataType:'json',
            		success: function(data){
            			 if(data.result == 'success'){
            				 var count = data.count;
            				 var ecount = data.ecount;
            				 $("#msg").tips({
            					side:3,
            		            msg:'成功发出'+count+'封邮件,失败'+ecount+'封',
            		            bg:'#68B500',
            		            time:6
            			      });
            			 }else{
            				 $("#msg").tips({
            						side:3,
            			            msg:'发送失败,请联系管理员!',
            			            bg:'#FF0000',
            			            time:6
            				 });
            			 }
            			 $('#show1').hide();
            			 $('#show2').show();
            			 vm.timer(5);
            			 setTimeout(function(){
            				 vm.close();//关闭弹窗
                            },6000);
            			 
            		}
            	});
        	}
        },
        
        //获取富文本内容
        getContent: function (TYPE){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'ueditor/getContent',
            	data: {TYPE:TYPE,tm:new Date().getTime()},	//这个TYPE这里的值是 email
        		dataType:'json',
        		async: false,
        		success: function(data){
        			if(data.result == 'success'){
        				if(this.TYPE == '1'){			//这个TYPE是 1或者2
        					vm.CONTENT = data.pd.CONTENT2;	//纯文本的
                    	}else{
                    		vm.CONTENT = data.pd.CONTENT;	//带标签的
                    	}
        				if('' == vm.CONTENT){
        					$("#ueFrame").tips({
                       			side:1,
                                   msg:'请输入内容',
                                   bg:'#AE81FF',
                                   time:3
                             });
        				}else{
        					vm.CONNULL = true;
        				}
        			}else{
                   		$("#ueFrame").tips({
                   			side:1,
                               msg:'请输入内容',
                               bg:'#AE81FF',
                               time:3
                         });
        			}
        		}
        	});
        },

        //倒计时
        timer: function (intDiff){
        	window.setInterval(function(){
        	$('#second_shows2').html('<s></s>'+intDiff+'秒');
        	intDiff--;
        	}, 1000);
        },

        //倒计时
        btimer: function (intDiff){
        	window.setInterval(function(){
        	$('#second_shows').html('<s></s>'+intDiff+'秒');
        	intDiff--;
        	}, 1000);
        },
        
        //关闭弹窗
        close: function (){
        	top.Dialog.close();
        },

        //打开查看
        dialog_open: function (){
        	$("#dialog-add").css("display","block");
        },
        
        //关闭查看
        cancel_pl: function (){
        	$("#dialog-add").css("display","none");
        },
        
      	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&]+?)(&|#|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }

    },
    
	mounted(){
        this.init();
    }
})
