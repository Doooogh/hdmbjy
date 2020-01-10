var vm = new Vue({
	el: '#app',
	
	data:{
		SCUSER_ID: '',	//主键ID
		pd: [],			//存放字段参数
		ORGANIZATION_ID:'',    //机构id		
		TYPE:'', //机构人员类型
		CONTRACT_ID:'',  //合同附件id
		RECORD_ID:'',     //档案附件id
		RESUME_ID:'',		//简历附件id
    },
	
	methods: {
		init(){
			var SCUID=this.getUrlKey('scuId');
			var OID=this.getUrlKey('ORGANIZATION_ID');
			var TP=this.getUrlKey('type');
			if(null!=SCUID&&undefined!=SCUID){
				this.SCUSER_ID=SCUID;
			}
			if(null!=OID&&undefined!=OID){
				this.ORGANIZATION_ID=OID;
			}
			if(null!=TP&&''!=TP&&undefined!=TP){
				this.TYPE=TP;
			}
			this.getData();
			
		},
		/**
		 * 获取详细内容
		 */
		getData:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'scuser/getData',
				data: {
					SCUSER_ID:this.SCUSER_ID,
					TYPE:this.TYPE,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
					 
			         if("success" == data.result){
			         	vm.pd = data.pd;							//参数map
					
			         }else if ("exception" == data.result){
			         	showException("民办机构用户",data.exception);	//显示异常
			         	$("#showform").show();
			     		$("#jiazai").hide();
			         }
			      }
			}).done().fail(function(){
			      swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
			      $("#showform").show();
				  $("#jiazai").hide();
			   });
			},
			//获取文件格式
			getSuffix:function (fileName) {
				 
				var suffix=fileName.substring(fileName.lastIndexOf("."));
				if(suffix==".png"||suffix==".jpg"||suffix==".jpeg"||suffix==".doc"||suffix==".docx"||suffix==".pdf"){
					return true;
				}
				return false;
			},
			/**
			 * 预览文件
			 */
			preview:function(id,url){
			
				$.ajax({
					xhrFields: {
						withCredentials: true
					},
					type: "POST",
					url: httpurl+'rutask/proview',
					data: {
						ID:id,
						URL:url,  //需要预览文件的路径
						tm:new Date().getTime()
						},	//这个TYPE这里的值是 email
					dataType:'json',
					success: function(data){
						if(data.result == 'success'){
							vm.pdf=data.pdf;
							if(vm.pdf!=''){
								var diag = new top.Dialog();
								diag.Drag=true;
								diag.Title ="预览";
								diag.URL = '../../act/rutask/file_preview.html?pdf='+vm.pdf;
								diag.Width = 950;
								diag.Height = 850;
								diag.Modal = false;			//有无遮罩窗口
								diag.CancelEvent = function(){ //关闭事件
									diag.close();
								};
								diag.show();
							}
							
						}else{
							swal("", "预览文件出现错误", "error");
						}
					},
					error:function () {
						swal("", "预览文件时出现系统错误！", "error");
					}
				});
			},
			goBack:function(){
				window.location.href="scuser_list.html?oId="+vm.ORGANIZATION_ID+"&tPage="+vm.TYPE;
			},
			
			download:function(ID){
				window.location.href=httpurl+"attachment/download?ID="+ID;
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
	});