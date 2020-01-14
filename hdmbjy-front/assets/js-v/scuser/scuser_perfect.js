var vm = new Vue({
	el: '#app',
	
	data:{
		SCUSER_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		TITLE_TYPE:'',			//职称类型
		EDUCATION_TYPE:'',		//学历类型
		ISACTIVE:'',
		POST:'',			//岗位
		ORGANIZATION_ID:'',    //机构id
		CONTRACT_ID:'',  //合同id
		CONTRACT_OR_NAME:'',   //合同文件原名 
		CONTRACT_RES:false,  //合同上传结果 
		RECORD_ID:'',			//档案id
		RECORD_RES:false,		//档案结果
		RECORD_OR_NAME:'',   //档案原文件名
		RESUME_ID:'',  //简历id
		RESUME_RES:false,  //上传简历结果
		RESUME_OR_NAME:'',  //简历原文件名
		CONTRACT_PATH:'', //合同 路径
		TYPE:'', //机构人员类型
		
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
			
		},
		//保存
		save:function(){
			// if(this.pd.CONTRACT_TITLE == '' || this.pd.CONTRACT_TITLE == undefined){
			// 	$("#CONTRACT_TITLE").tips({
			// 		side:3,
			//         msg:'请输入合同标题',
			//         bg:'#AE81FF',
			//         time:2
			//     });
			// 	this.pd.CONTRACT_TITLE = '';
			// 	this.$refs.CONTRACT_TITLE.focus();
			// return false;
			// }
			if(this.pd.CONTRACT_TYPE == '' || this.pd.CONTRACT_TYPE == undefined){
				$("#CONTRACT_TYPE").tips({
					side:3,
			        msg:'请输入合同类型',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.CONTRACT_TYPE = '';
				this.$refs.CONTRACT_TYPE.focus();
			return false;
			}
			this.pd.CONTRACT_START_TIME = $("#CONTRACT_START_TIME").val();
			if(this.pd.CONTRACT_START_TIME == '' || this.pd.CONTRACT_START_TIME == undefined){
				$("#CONTRACT_START_TIME").tips({
					side:3,
			        msg:'请输入起聘时间',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.CONTRACT_START_TIME = '';
				this.$refs.CONTRACT_START_TIME.focus();
			return false;
			}
			this.pd.CONTRACT_END_TIME = $("#CONTRACT_END_TIME").val();
			if(this.pd.CONTRACT_END_TIME == '' || this.pd.CONTRACT_END_TIME == undefined){
				$("#CONTRACT_END_TIME").tips({
					side:3,
			        msg:'请输入终聘时间',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.CONTRACT_END_TIME = '';
				this.$refs.CONTRACT_END_TIME.focus();
			return false;
			}
			if(this.pd.CONTRACT_NUMBER == '' || this.pd.CONTRACT_NUMBER == undefined){
				$("#CONTRACT_NUMBER").tips({
					side:3,
			        msg:'请输入合同编号',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.CONTRACT_NUMBER = '';
				this.$refs.CONTRACT_NUMBER.focus();
			return false;
			}
			if(this.CONTRACT_ID == '' || this.CONTRACT_ID == undefined){
				$("#CONTRACT_ID").tips({
					side:3,
			        msg:'请上传合同文件',
			        bg:'#AE81FF',
			        time:2
			    });
				this.CONTRACT_ID = '';
				this.$refs.CONTRACT_ID.focus();
			return false;
			}
			if(this.RECORD_ID == '' || this.RECORD_ID == undefined){
				$("#RECORD_ID").tips({
					side:3,
			        msg:'请上传档案',
			        bg:'#AE81FF',
			        time:2
			    });
				this.RECORD_ID = '';
				this.$refs.RECORD_ID.focus();
			return false;
			}
			if(this.RESUME_ID == '' || this.RESUME_ID == undefined){
				$("#RESUME_ID").tips({
					side:3,
			        msg:'请上传简历',
			        bg:'#AE81FF',
			        time:2
			    });
				this.RESUME_ID = '';
				this.$refs.RESUME_ID.focus();
			return false;
			}
			
			$("#showform").hide();
			$("#jiazai").show();
			
			//发送 post 请求提交保存
			$.ajax({
			    	xhrFields: {
			            withCredentials: true
			        },
					type: "POST",
					url: httpurl+'scuser/editDetail',
			    	data: {
						SCUSER_ID:this.SCUSER_ID,
						CONTRACT_TITLE:this.CONTRACT_OR_NAME,
						CONTRACT_TYPE:this.pd.CONTRACT_TYPE,
						CONTRACT_START_TIME:this.pd.CONTRACT_START_TIME,
						CONTRACT_END_TIME:this.pd.CONTRACT_END_TIME,
						CONTRACT_NUMBER:this.pd.CONTRACT_NUMBER,
						CONTRACT_ID:this.CONTRACT_ID,
						CONTRACT_PATH:this.CONTRACT_PATH,
						RECORD_ID:this.RECORD_ID,
						TYPE:this.TYPE,
						RESUME_ID:this.RESUME_ID,
						tm:new Date().getTime()
						},
					dataType:"json",
					success: function(data){
			            if("success" == data.result){
			            	swal("", "保存成功", "success");
							window.location.href="scuser_list.html?oId="+vm.ORGANIZATION_ID;
							$("#showform").show();
							$("#jiazai").hide();
			            }else if ("exception" == data.result){
			            	showException("民办机构用户更新详细信息",data.exception);//显示异常
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
		goBack:function(){
			window.location.href="scuser_list.html?oId="+vm.ORGANIZATION_ID+"&tPage="+vm.TYPE;
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
	
	layui.use('upload', function() {
	    var $ = layui.jquery
	        , upload = layui.upload;
			
		 //指定允许上传的文件类型
		  upload.render({
			 elem: '#test3'
			,url: httpurl+'/attachment/upload'
			,accept: 'file' ,//普通文件
			data: {
				P_TYPE: '3',   //表示为机构用户信息
				C_TYPE: '1',    //表示为合同
				path:CONTRACT_PATH,   //路径为合同上传路径
				} 
			,done: function(res, index, upload){
				//假设code=0代表上传成功
				if(res.result == "success"){
				  //do something （比如将res返回的图片链接保存到表单的隐藏域）
				  vm.CONTRACT_ID=res.attInfo.ID;
				  vm.CONTRACT_OR_NAME=res.attInfo.ORIGINAL_NAME;  //文件原名
				  vm.CONTRACT_RES=true;
				  vm.CONTRACT_PATH=CONTRACT_PATH+res.attInfo.CONTRACT_OR_NAME
				  console.log("合同"+vm.CONTRACT_ID);
				}else{
				  alert("error");
				}
			},
			error: function(index, upload){
			    //当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
				alert("服务器错误");
				vm.CONTRACT_RES=false;
			  }
		  });
		  
		  //指定允许上传的文件类型
		   upload.render({
		  			 elem: '#test4'
		  			,url: httpurl+'/attachment/upload'
		  			,accept: 'file' ,//普通文件
		  			data: {
		  				P_TYPE: '3',   //表示为机构用户信息
		  				C_TYPE: '2',    //表示为档案
						path:RECORD_PATH,   //上传路径为档案
		  				} 
		  			,done: function(res, index, upload){
		  				//假设code=0代表上传成功
		  				if(res.result == "success"){
		  				  //do something （比如将res返回的图片链接保存到表单的隐藏域）
		  				  vm.RECORD_ID=res.attInfo.ID;
		  				  vm.RECORD_OR_NAME=res.attInfo.ORIGINAL_NAME;  //文件原名
		  				  vm.RECORD_RES=true;
						  console.log("档案"+vm.RECORD_ID);
		  				}else{
		  				  alert("error");
		  				}
		  			},
		  			error: function(index, upload){
		  			    //当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
		  				alert("服务器错误");
		  				vm.CONTRACT_RES=false;
		  			  }
		   });
		   
		   //指定允许上传的文件类型
		    upload.render({
		   			 elem: '#test5'
		   			,url: httpurl+'/attachment/upload'
		   			,accept: 'file' ,//普通文件
		   			data: {
		   				P_TYPE: '3',   //表示为机构用户信息
		   				C_TYPE: '3',    //表示为简历 
						path:RESUME_PATH,   //上传路径为简历
		   				} 
		   			,done: function(res, index, upload){
		   				//假设code=0代表上传成功
		   				if(res.result == "success"){
		   				  //do something （比如将res返回的图片链接保存到表单的隐藏域）
		   				  vm.RESUME_ID=res.attInfo.ID;
		   				  vm.RESUME_OR_NAME=res.attInfo.ORIGINAL_NAME;  //文件原名
		   				  vm.RESUME_RES=true;
						  console.log("简历"+vm.RESUME_ID);
		   				}else{
		   				  alert("error");
		   				}
		   			},
		   			error: function(index, upload){
		   			    //当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
		   				alert("服务器错误");
		   				vm.CONTRACT_RES=false;
		   			  }
		    });
		   
		  });