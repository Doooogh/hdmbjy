
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
		SEX:'',			//性别
		ORGANIZATION_ID:'',    //机构id
		TYPE:'',
		HEADMAN_TEACHER:'',   //机构负责人类型
		roleList:[],    //角色集合
		
		
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
			var OID=this.getUrlKey('oId');
			var TP=this.getUrlKey('type');		//用户类型
        	if(null != FID){
        		this.msg = 'edit';
        		this.SCUSER_ID = FID;
        		this.getData();
        	}
			if(null!=OID&&undefined!=OID){
				this.ORGANIZATION_ID=OID;
			}
			if(null!=TP&&''!=TP&&undefined!=TP){
				this.TYPE=TP;
			}
			this.HEADMAN_TEACHER=HEADMAN_TEACHER;
        	setTimeout(function(){
        		vm.getDict();
				vm.getPost();
				vm.getRoleList();
            },200);
        },
        
        //去保存
    	save: function (){
			
			if(this.TYPE==this.HEADMAN_TEACHER&&this.msg=='add'){
				
				if(this.pd.USERNAME == '' || this.pd.USERNAME == undefined || this.pd.USERNAME == '此用户名已存在!'){
					$("#USERNAME").tips({
						side:3,
				        msg:'输入用户名',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.USERNAME = '';
					this.$refs.USERNAME.focus();
					return false;
				}
				if(this.pd.PASSWORD == ''){
					$("#PASSWORD").tips({
						side:3,
				        msg:'输入密码',
				        bg:'#AE81FF',
				        time:2
				    });
					this.pd.PASSWORD = '';
					this.$refs.PASSWORD.focus();
					return false;
				}
			/* 	if(this.pd.NUMBER == '' || this.pd.NUMBER == undefined){
					$("#NUMBER").tips({
						side:3,
				        msg:'输入编号',
				        bg:'#AE81FF',
				        time:3
				    });
					this.pd.NUMBER = '';
					this.$refs.NUMBER.focus();
					return false;
				} */
			}
			
	
		
			if(this.pd.NAME == '' || this.pd.NAME == undefined){
				$("#NAME").tips({
					side:3,
		            msg:'请输入姓名',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NAME = '';
				this.$refs.NAME.focus();
			return false;
			}
			if(this.SEX == '' || this.SEX == undefined){ 
				$("#SEX").tips({
					side:3,
		            msg:'请输入性别',
		            bg:'#AE81FF',
		            time:2
		        });
				this.SEX = '';
				this.$refs.SEX.focus();
			return false;
			}
			if(this.pd.AGE == '' || this.pd.AGE == undefined){
				$("#AGE").tips({
					side:3,
		            msg:'请输入年龄',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.AGE = '';
				this.$refs.AGE.focus();
			return false;
			}
			var myreg = /^(((13[0-9]{1})|159)+\d{8})$/;
			if(this.pd.PHONE == '' || this.pd.PHONE == undefined){
				$("#PHONE").tips({
					side:3,
			        msg:'输入手机号',
			        bg:'#AE81FF',
			        time:3
			    });
				this.pd.PHONE = '';
				this.$refs.PHONE.focus();
				return false;
			}else if(this.pd.PHONE.length != 11 && !myreg.test(this.pd.PHONE)){
				$("#PHONE").tips({
					side:3,
			        msg:'手机号格式不正确',
			        bg:'#AE81FF',
			        time:3
			    });
				this.$refs.PHONE.focus();
				return false;
			}
			if(this.pd.EMAIL == '' || this.pd.EMAIL == undefined){
				$("#EMAIL").tips({
					side:3,
			        msg:'输入邮箱',
			        bg:'#AE81FF',
			        time:3
			    });
				this.pd.EMAIL = '';
				this.$refs.EMAIL.focus();
				return false;
			}else if(!this.ismail(this.pd.EMAIL)){
				$("#EMAIL").tips({
					side:3,
			        msg:'邮箱格式不正确',
			        bg:'#AE81FF',
			        time:3
			    });
				this.$refs.EMAIL.focus();
				return false;
			}
			this.ENTRY_TIME = $("#ENTRY_TIME").val();
			if(this.ENTRY_TIME == '' || this.ENTRY_TIME == undefined){
				$("#ENTRY_TIME").tips({
					side:3,
					msg:'请输入入职时间',
					bg:'#AE81FF',
					time:2
				});
				this.ENTRY_TIME = '';
				this.$refs.ENTRY_TIME.focus();
			return false;
			}
			if(this.TYPE != 3){
				if(this.POST == '' || this.POST == undefined){
					$("#POST").tips({
						side:3,
			            msg:'请输入岗位',
			            bg:'#AE81FF',
			            time:2
			        });
					this.POST = '';
					this.$refs.POST.focus();
				return false;
				}
			}
			
			if(this.ISACTIVE == '' || this.ISACTIVE == undefined){
				$("#ISACTIVE").tips({
					side:3,
		            msg:'请输入是否在编',
		            bg:'#AE81FF',
		            time:2
		        });
				this.ISACTIVE = '';
				this.$refs.ISACTIVE.focus();
			return false;
			}
		
			if(this.EDUCATION_TYPE =='' || this.EDUCATION_TYPE == undefined){
				$("#EDUCATION_TYPE").tips({
					side:3,
		            msg:'请输入学历',
		            bg:'#AE81FF',
		            time:2
		        });
				this.EDUCATION_TYPE = '';
				this.$refs.EDUCATION_TYPE.focus();
			return false;
			}
			if(this.TITLE_TYPE =='' || this.TITLE_TYPE == undefined){
				$("#TITLE_TYPE").tips({
					side:3,
		            msg:'请输入职称',
		            bg:'#AE81FF',
		            time:2
		        });
				this.TITLE_TYPE = '';
				this.$refs.TITLE_TYPE.focus();
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
					url: httpurl+'scuser/'+this.msg,
			    	data: {
					SCUSER_ID:this.SCUSER_ID,
				    SCUSER_ID:this.pd.SCUSER_ID,
					USERNAME:this.pd.USERNAME,
					PASSWORD:this.pd.PASSWORD,
					NUMBER:this.pd.NUMBER,
				    NAME:this.pd.NAME,
				    SEX:this.SEX,
				    AGE:this.pd.AGE,
					TITLE:this.pd.TITLE,
				    PHONE:this.pd.PHONE,
				    EMAIL:this.pd.EMAIL,
				    ORGANIZATION_ID:this.ORGANIZATION_ID,
				    POST:this.POST,
					TYPE:this.TYPE,
					ENTRY_TIME:this.ENTRY_TIME,
				    ISACTIVE:this.ISACTIVE,
				    EDUCATION:this.EDUCATION_TYPE,
				    TITLE:this.TITLE_TYPE,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("民办机构用户",data.exception);//显示异常
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
		
		//新增时获取角色列表
		getRoleList: function(){
			//发送 post 请求
		    $.ajax({
		    	xhrFields: {
		            withCredentials: true
		        },
				type: "POST",
				url: httpurl+'user/goAddUser',
		    	data: {tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
		             if("success" == data.result){
		             	vm.roleList = data.roleList;				//角色列表
		             }else if ("exception" == data.result){
		             	showException("系统用户",data.exception);	//显示异常
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
    	
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'scuser/goEdit',
		    	data: {
					SCUSER_ID:this.SCUSER_ID,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						if(vm.ORGANIZATION_ID==0){
							vm.ORGANIZATION_ID=data.pd.ORGANIZATION_ID;
						}
						vm.ISACTIVE=data.pd.ISACTIVE;
						vm.TITLE_TYPE=data.pd.TITLE;
						vm.EDUCATION_TYPE=data.pd.EDUCATION;
						vm.POST=data.pd.POST;
						vm.SEX=data.pd.SEX;
						$("#ENTRY_TIME").val(data.pd.ENTRY_TIME);
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
		//获取岗位
    	getPost:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'post/listAll',
				data: {
					tm:new Date().getTime()
					},//类型
				dataType:'json',
				success: function(data){
					 $("#POST").html('<option value="">请选择岗位</option>');
					 if(data.result=='success'){
					// 
						 $.each(data.varList, function(i, dvar){
							 if(dvar.POST_ID==vm.POST){
								  $("#POST").append("<option value="+dvar.POST_ID+" selected>"+dvar.NAME+"</option>");
							 }else{
							 $("#POST").append("<option value="+dvar.POST_ID+">"+dvar.NAME+"</option>");
							 }
						 });
					 }
					
				}
			});
			
			
		},
    	goBack:function(){
			top.Dialog.close();//关闭弹窗
    		// window.location.href="scuser_list.html?oId="+vm.ORGANIZATION_ID+"&tPage="+vm.TYPE;
    	},
		//获取数据字典数据
    	getDict: function (){
    		$.ajax({
    			xhrFields: {
    	            withCredentials: true
    	        },
    			type: "POST",
    			url: httpurl+'dictionaries/getLevelsByNameEn',
    			data: {NAME_EN:'EDUCATION_TYPE',tm:new Date().getTime()},//类型
    			dataType:'json',
    			success: function(data){
    				$("#EDUCATION_TYPE").html('<option value="">请选择学历</option>');
    				 $.each(data.list, function(i, dvar){
    					 if(dvar.BIANMA==vm.EDUCATION_TYPE){
    						  $("#EDUCATION_TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
    					 }else{
    					 $("#EDUCATION_TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
    					 }
    				 });
    			}
    		});
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'TITLE_TYPE',tm:new Date().getTime()},//类型
				dataType:'json',
				success: function(data){
					$("#TITLE_TYPE").html('<option value="">请选择职称</option>');
					 $.each(data.list, function(i, dvar){
						 if(dvar.BIANMA==vm.TITLE_TYPE){
							  $("#TITLE_TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
						 }else{
						 $("#TITLE_TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
						 }
					 });
				}
			});
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'SEX',tm:new Date().getTime()},//类型
				dataType:'json',
				success: function(data){
					$("#SEX").html('<option value="">请选择性别</option>');
					$.each(data.list, function(i, dvar){
						if(dvar.BIANMA==vm.SEX){
							$("#SEX").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
						}else{
							$("#SEX").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
						}
					});
				}
			});
    	},
    	
    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
		ismail: function(mail){
			return(new RegExp(/^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/).test(mail));
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
})


    layui.use('upload', function() {
        var $ = layui.jquery
            , upload = layui.upload;
        //普通图片上传
        var uploadInst = upload.render({
            elem: '#test1',
            accept: 'images' //只允许上传图片
            ,acceptMime: 'image/*', //只筛选图片,
            auto:false
            ,choose: function(obj){
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result){
                    $('#demo1').attr('src', result); //图片链接（base64）
                    imageFile=file;
                    vm.hasImage=true;
                });
            },
            done:function () {
                return true;
            }
        });
        var ids="";
        //多文件列表示例
        var demoListView = demoListView1=$('#demoList')
            ,uploadListIns = upload.render({
            url: httpurl+'/examination/attachmentLoad',
            elem: '#testList'
            ,accept: 'file',
            multiple: true
            ,auto: false,
			data: {
				P_TYPE: '1',   //表示为年度审批
				C_TYPE: '1'    //表示为普通附件
				} 
            ,bindAction: '#sub',
            size: "512000"
            ,choose: function(obj){
                var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                //读取本地文件
                obj.preview(function(index, file, result){
                    var tr = $(['<tr id="upload-'+ index +'">'
                        ,'<td>'+ file.name +'</td>'
                        ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                        ,'<td>等待上传</td>'
                        ,'<td>'
                        ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                        ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                        ,'</td>'
                        ,'</tr>'].join(''));

                    //单个重传
                    tr.find('.demo-reload').on('click', function(){
                        obj.upload(index, file);
                    });

                    //删除
                    tr.find('.demo-delete').on('click', function(){
                        delete files[index]; //删除对应的文件
                        tr.remove();
                        uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                    });

                    demoListView.append(tr);
                });
            }
            ,done: function(res, index, upload){
                if(res.code == 0){ //上传成功
                    var tr = demoListView.find('tr#upload-'+ index),
                    tds = tr.children();
                    tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                    // tds.eq(3).html('<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete" >删除</button>'); //清空操作
                    tds.eq(3).html(" <button class='layui-btn layui-btn-xs layui-btn-danger demo-delete'  onclick='deleteFile("+res.ids+")'>删除</button>"); //清空操作   onclick='deleteFile("+res.ids+","+index+")'
                    if(ids==""){
                        ids+=(res.ids);
                    }else{
                        ids+=(","+res.ids);
                    }
                    return delete this.files[index]; //删除文件队列已经上传成功的文件
                }
                this.error(index, upload);
            },
            allDone:function (obj) {
				//  
                if(obj.aborted==0){
                    // parent.layer.msg("操作成功");
                    if(attachment==""||attachment==undefined){
                        attachment=ids;
                    }else{
                        attachment+=(","+ids);
                    }
					
                    vm.hasFile=true;
					// 
                }
                if(obj.aborted!=0){
                    var msg="有"+obj.aborted+"个图片上传失败";
                    if(obj.aborted==0){
                        msg="出现错误";
                    }
                    // parent.layer.msg(msg);
                    alert(msg);
                }
            }
            ,error: function(index, upload){
                var tr = demoListView.find('tr#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
            }
        });




    });

        function deleteFile(id) {
            $("#demoList").on('click', '.demo-delete', function () {
                var tr=$(this);

                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'examination/deleteAttachment',
                    data: {
                        ID:id,
                    },
                    success: function(data){
                        if("success" == data.result){
                           tr.closest('tr').remove();
                            var newatt=attachment.split(",");
							newatt=_.pull(newatt, id+'');
							attachment=_.join(newatt, [separator=','])
                        }else if ("exception" == data.result){
                            showException("年度审批",data.exception);//显示异常
                        }
                    }
                }).done().fail(function(){
                    swal("登录失效!", "请求服务器无响应，稍后再试", "warning");

                });

            });

            //删除
        }