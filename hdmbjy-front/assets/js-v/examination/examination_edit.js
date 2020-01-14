var attachment;
var vm = new Vue({
	el: '#app',
	
	data:{
		EXAMINATION_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		HEADMAN:'',
		NAME:'',
		apd:[],  //附件
		ID_:'',
		APPROVETYPE_ID:'',  //一级审批类型
		appList1:[],   //一级审批类型集合
		appList2:[],	//二级审批类型集合，
		isParentList:true, 
		appType1:'',  //一级审批类型
		appType2:'',   //二级审批类型  
		formList:[],  //选中的二级审批类型对应的表单
		formListLength:0, //表单的长度
		attachmentList:[],   //选中的二级审批类型对应的附件
		approveFormList:[],   //表单和审批关联集合
		approveFormListLength:0,  //关联集合长度
		isAllpullFormData:false,  //表单是否全部填写
		allForm:[],//审批类型表单和用户填报表单整合 可能对应表单用户没有填报
		forFormNum:1,  //遍历次数
		styleShow: {     //css 样式
			color: 'darkred',
			fontSize: '11px',
		},
		styleHidden: {     //css 样式
			color: 'darkred',
			fontSize: '11px',
			display:'none',
			marginRight:'10px'
		},
		

		
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
			var ID_=this.getUrlKey('ID_');
			var isBack=this.getUrlKey('isBack');  //是否为驳回后在修改的审批
			if(null!=ID_){
				this.ID_=ID_;
			}
			if(null!=isBack&&undefined!=isBack&&isBack!=''&&isBack==1){
				this.msg = 'edit';
			}
        	if(null != FID){
				// this.msg = 'edit';
        		this.EXAMINATION_ID = FID;
        		this.getData();
        	}else{
				this.autoAdd();
			}
        	setTimeout(function(){
				vm.getInfo();
        		vm.getDict();
				vm.getApproveTypes();
				vm.getApproveTypesOfExamination();
            },200);
        },
        
        //去保存
    	save: function (isSubmit){
    		
			
			
			if(attachment == '' ||attachment== undefined){
				$("#ATTACHMENT_IDS").tips({
					side:3,
			        msg:'请上传附件',
			        bg:'#AE81FF',
			        time:2
			    });
				attachment= '';
				this.$refs.ATTACHMENT_IDS.focus();
			return false;
			}
			
			if(vm.appType2 == '' ||vm.appType2== undefined){
				$("#appType2").tips({
					side:3,
			        msg:'请选择审批子类型',
			        bg:'#AE81FF',
			        time:2
			    });
				vm.appType2= '';
				this.$refs.appType2.focus();
			return false;
			}
			
			
			if(isSubmit==0){
				vm.isAllpull();
				if(!vm.isAllpullFormData){
					return  false;
				}
			}
			
    		$("#showform").hide();
    		$("#jiazai").show();
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'examination/'+this.msg,
			    	data: {
					EXAMINATION_ID:this.EXAMINATION_ID,
				    ATTACHMENT_IDS:attachment,
					ID_:this.ID_,   //当前任务ID_
					USER_ID:this.pd.USER_ID,
					STATUS:'1',  //行政数据是否有效 （1 是 0 否）
					DRAFTS:isSubmit,  //是否为草稿箱
					APPROVE_TYPE:this.appType2,
			    	tm:new Date().getTime()
					},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("年度审核",data.exception);//显示异常
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
				url: httpurl+'examination/goEdit',
		    	data: {
					EXAMINATION_ID:this.EXAMINATION_ID,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.HEADMAN=data.pd.USERNAME;   //负责人名字
						vm.NAME=data.pd.DEPARTMENT_NAME;//机构名称
						vm.apd=data.apd;
						var ap=vm.apd;
						attachment=data.pd.ATTACHMENT_IDS;
						vm.appType1=data.parentType;
						vm.appType2=data.childType;
						vm.approveFormList=data.approveFormList;
						vm.setApproveTypes();
						if(ap!=null||ap!=undefined){
						    $.each(
						        ap,function (index,element) {
						            var tr = $(['<tr id="upload-'+ index +'">'
						                ,'<td>'+ element.ORIGINAL_NAME +'</td>'
						                // ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
						                ,'<td></td>'
						                ,'<td>上传成功</td>'
						                ,'<td>'
						                ," <button class='layui-btn layui-btn-xs layui-btn-danger demo-delete' onclick='deleteFile("+element.ID+","+index+")'>删除</button>"
						                ,'</td>'
						                ,'</tr>'].join(''));
						            $('#demoList').append(tr);
						        }
						    );
						}
                     }else if ("exception" == data.result){
                     	showException("年度审核",data.exception);	//显示异常
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
    	
		//用于编辑时 将类型对应表单和 用户填报表单整合
		getAllForm:function () {
			vm.allForm=[];
		/* 	vm.approveFormList;  //用户填报表单   提示作用
			vm.formList;  //审批类型对应表单 */
			$.each(vm.formList,function(i,form){
				var oneForm={};
				oneForm=form;
				$.each(vm.approveFormList,function(a,approveForm){
					if(form.FULLDATA_ID==approveForm.FULLDATA_ID){
						oneForm.APPROVEFORM_ID=approveForm.APPROVEFORM_ID;
						oneForm.FORMDATA_ID=approveForm.FORMDATA_ID;
						oneForm.SUB_STATUS=approveForm.SUB_STATUS;
						oneForm.SAVED=true;
						return false;
					}
				});
				vm.allForm.push(oneForm);
			});
		},
		//在打开页面的时候自动添加一条数据
		autoAdd:function () {
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'examination/autoAdd',
				data: {
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
			         if("success" == data.result){
							vm.EXAMINATION_ID=data.EXAMINATION_ID;
			         }else if ("exception" == data.result){
			         	showException("行政审核添加",data.exception);	//显示异常
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
		//判断表单除了选填的   是否都已经填写
		isAllpull:function () {
			var allFormData=$(".to_fulldata");
			console.log(allFormData);
			var all=true;
			$.each(allFormData,function(i,formdata){
				if(($(formdata).attr("is_optional")!=1)&&$(formdata).attr("is_ts")!=undefined&&$(formdata).attr("is_ts").trim()!=''&&$(formdata).attr("is_ts")==1){
					$(formdata).tips({
						side:3,
					    msg:'请正式提交该表单,该表单现为暂存状态！',
					    bg:'#AE81FF',
					    time:2
					});
					$(formdata).focus();
					 all=false;
					 return false;
				}
				if(($(formdata).attr("is_optional")!=1)&&$(formdata).attr("fulldata_id").trim()==''){
					$(formdata).tips({
						side:3,
					    msg:'请填写表单',
					    bg:'#AE81FF',
					    time:2
					});
					$(formdata).focus();
					 all=false;
					 return false;
				}
				
				//如果是选填 并且没有正式进行编写(为草稿状态) 不能进行上报
				if(($(formdata).attr("is_optional")==1)&&$(formdata).attr("is_ts")!=undefined&&$(formdata).attr("is_ts").trim()!=''&&$(formdata).attr("is_ts")==1&&$(formdata).attr("fulldata_id").trim()!=''){
					$(formdata).tips({
						side:3,
					    msg:'请正式提交该表单,该表单现为暂存状态！',
					    bg:'#AE81FF',
					    time:2
					});
					$(formdata).focus();
					 all=false;
					 return false;
				}
			});
			if(all){
				vm.isAllpullFormData=true;
			}
		},
		getInfo:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'examination/getInfo',
				data: {
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
			         if("success" == data.result){
						vm.HEADMAN=data.HEADMAN;
						vm.NAME=data.NAME;
						// vm.APPROVETYPE_ID=data.APPROVETYPE_ID;
			         }else if ("exception" == data.result){
			         	showException("行政",data.exception);	//显示异常
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
		setApproveTypes:function () {
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'approvetype/getApproveType',
				data: {
					APPROVE_PID:this.APPROVETYPE_ID,
					TYPE:2,	
					tm:new Date().getTime()
				},
				dataType:'json',
				success: function(data){
					if("success"==data.result){
						vm.appList1=data.approveList;
						//给一级集合赋值
						$("#appType1").html('<option value="">请选择审批类型</option>');
						$.each(vm.appList1, function(i, approve){
							if(approve.APPROVETYPE_ID==vm.appType1){
								$("#appType1").append("<option value="+approve.APPROVETYPE_ID+" selected>"+approve.NAME+"</option>");
							}else{
							 $("#appType1").append("<option value="+approve.APPROVETYPE_ID+">"+approve.NAME+"</option>");
							}
						});
						vm.getFullData();
						
					}
				},
				});
		},
    	//获取数据字典数据
		getApproveTypes:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'approvetype/getApproveType',
				data: {
				APPROVE_PID:this.APPROVETYPE_ID,
				TYPE:2,	
				tm:new Date().getTime()
				},
				dataType:'json',
				success: function(data){
					if(data.result=='success'){
							if((vm.appType1==''||vm.appType1==undefined)){
								vm.appList1=data.approveList;
								//给一级集合赋值
								$("#appType1").html('<option value="">请选择审批类型</option>');
								$.each(vm.appList1, function(i, approve){
									if(approve.APPROVETYPE_ID==vm.appType1){
										$("#appType1").append("<option value="+approve.APPROVETYPE_ID+" selected>"+approve.NAME+"</option>");
									}else{
									 $("#appType1").append("<option value="+approve.APPROVETYPE_ID+">"+approve.NAME+"</option>");
									}
								});
							}else{
								//给二级集合赋值
								$("#appType2").html('<option value="">请选择审批项目</option>');
								$.each(data.approveList, function(i, approve){
									if(approve.APPROVETYPE_ID==vm.appType2){
										$("#appType2").append("<option value="+approve.APPROVETYPE_ID+" selected>"+approve.NAME+"</option>");
									}else{
									 $("#appType2").append("<option value="+approve.APPROVETYPE_ID+">"+approve.NAME+"</option>");
									}
								});
							}
						
					
						
					
					}
				}
			});
		},
		//直接获取审批类型
		getApproveTypesOfExamination:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'approvetype/getApproveTypesOfExamination',
				data: {
				APPROVE_PID:this.APPROVETYPE_ID,
				TYPE:'2',	
				tm:new Date().getTime()
				},
				dataType:'json',
				success: function(data){
					if(data.result=='success'){
						vm.appType1=data.appType1;
						vm.appType2=data.appType2;
						vm.getFullData();
					}
				}
			});
		},
		getFullData:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'fulldata/listByApproveId',
				data: {
				APPROVETYPE_ID:this.appType2,
				FTYPE:2, //表示行政审批类型	
				tm:new Date().getTime()
				},
				dataType:'json',
				success: function(data){
					if(data.result=='success'){
						vm.formList=data.formList;
						vm.attachmentList=data.attachmentList;
						vm.getAllForm();
					}
				}
			});
		},
		//点击链接弹出表单填写页面
		toFulldata:function(e,allName,form_id,EXAMINATION_ID,allUrl,APPROVEFORM_ID){   //e this 对象  allName：该表单的名字+html  form_id:表单的id  EXAMINATION_ID:审批id
			if(APPROVEFORM_ID==undefined||APPROVEFORM_ID==''||APPROVEFORM_ID==null){
				APPROVEFORM_ID=$(e.target).attr("approveform_id");
			}
			// 
			var url="";
			var fulldata_id=$(e.target).attr("fulldata_id");
			if(fulldata_id==''||fulldata_id==undefined){
				url=allUrl+"?FID="+form_id+"&AFT="+vm.appType2+"&AID="+EXAMINATION_ID;
			}else{
				url=allUrl+"?FID="+form_id+"&AFT="+vm.appType2+"&AID="+EXAMINATION_ID+"&FDID="+fulldata_id+"&AFID="+APPROVEFORM_ID;
			}
			var diag = new top.Dialog();
			diag.Drag=true;
			diag.Title ="新增";
			diag.URL = url;   //相对路径
			diag.Width = 1000;
			diag.Height = 800;
			diag.Modal = true;				//有无遮罩窗口
			diag. ShowMaxButton = true;	//最大化按钮
			diag.ShowMinButton = true;		//最小化按钮 
			diag.CancelEvent = function(){ //关闭事件
				var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
				 var formdata = diag.innerFrame.contentWindow.document.getElementById(form_id);
				 var SUB_STATUS = diag.innerFrame.contentWindow.document.getElementById(form_id+'SUB_STATUS');  //暂存状态
				 var APPROVEFORM_ID = diag.innerFrame.contentWindow.document.getElementById(form_id+'APPROVEFORM_ID');  //暂存状态
				 var formdata_id=$(formdata).val();  //关闭后获得的数据id
				 var SUB_STATUS_val=$(SUB_STATUS).val();  //关闭后获得的数据id
				 var APPROVEFORM_ID_val=$(APPROVEFORM_ID).val();  //关闭后获得的数据id
				 $(e.target).attr("approveform_id",APPROVEFORM_ID_val);
				 if(SUB_STATUS_val!=''&&SUB_STATUS_val!=null&&SUB_STATUS_val!=undefined){  //状态为暂存
					 $(e.target).attr("is_ts",SUB_STATUS_val);
				 if(SUB_STATUS_val==1){
					 $(e.target).next().next().css("display","inline");
					 $(e.target).next().css("display","none");
				 }else if(SUB_STATUS_val==0){
					 $(e.target).next().next().css("display","none");
					 $(e.target).next().css("display","inline");
					 
				 }
					
						// $(e.target).after("<span style='color: darkred;font-size: 11px;'>已完成填写</span>"); 
				}
				// 
				if(formdata_id!=''&&formdata_id!=null&&formdata_id!=undefined){
									$(e.target).attr("fulldata_id",formdata_id);
									if(SUB_STATUS_val!=1){
										$(e.target).next().css("display","inline");
										$(e.target).next().next().css("display","none");
									}
									// $(e.target).after("<span style='color: darkred;font-size: 11px;'>已完成填写</span>"); 
				}	
				
				 if(varSon != null && varSon.style.display == 'none'){
					 // vm.getList();
				}
				diag.close();
			};
			diag.show();
		
		},
		toEditdata:function(name,id,formdata_id){
			
			$.ajax({
			    	xhrFields: {
			            withCredentials: true
			        },
					type: "POST",
					url: httpurl+'approvetype/getAllPathByApproveId?FDID='+id,
					async:false,
			    	data: {
						APPROVETYPE_ID:vm.appType2,
						APPROVE1_ID:vm.appType1,
						tm:new Date().getTime()
					},
					dataType:"json",
					success: function(data){
			           if("success" == data.result){
								var url=data.path+name+"?FDID="+id+"&AFT="+vm.appType2;
								var diag = new top.Dialog();
								diag.Drag=true;
								diag.Title ="新增";
								diag.URL = url;
								diag.Width = 1000;
								diag.Height = 800;
								diag.Modal = true;				//有无遮罩窗口
								diag. ShowMaxButton = true;	//最大化按钮
								diag.ShowMinButton = true;		//最小化按钮 
								diag.CancelEvent = function(){ //关闭事件
									 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
									 var formdata = diag.innerFrame.contentWindow.document.getElementById(id);
									 var formdata_id=$(formdata).val();  //关闭后获得的数据
									 $("#"+id).after("<input type='hidden' value=formdata_id /><a class='toEdit_fulldata' @click='toEditdata(form.URL,form.FULLDATA_ID)'>填写完成,可点击修改</a>");
									 if(varSon != null && varSon.style.display == 'none'){
										 // vm.getList();
									}
									diag.close();
								};
								diag.show();
			            }else if ("exception" == data.result){
			            	showException("行政审核",data.exception);//显示异常
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
		getDict: function (){
			
		},
		
		
		
    	
    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
		
			
	  },
	  watch: {
	  	appType1: function (newVal,oldVal) {
	  		if(newVal!=''&&newVal!=undefined){
	  			vm.APPROVETYPE_ID=newVal;
	  			vm.getApproveTypes();
	  		}else {
				$("#appType2").html('<option value="">请选择审批项目</option>');
			}
	  },
	  appType2: function (newVal,oldVal) {
	  		if(newVal!=''&&newVal!=undefined){
	  			vm.getFullData();
	  		}else {
				vm.formList=[];
				vm.attachmentList=[];
	  		}
	  },
	  formList: function (newValue, oldValue) {
	        vm.formListLength=Object.keys(newValue).length 
	  	  },
	  approveFormList:function (newValue, oldValue) {
	  	if(newValue==undefined||oldValue==undefined){
	  		vm.approveFormListLength=0;
	  	}else{
	         vm.approveFormListLength=Object.keys(vm.approveFormList).length
	  	}
	      },
        
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
			data: {
				P_TYPE: '2',   //表示为行政审批
				C_TYPE: '1'    //表示为普通附件
				}
            ,multiple: true
            ,auto: false
            ,bindAction: '#sub',
            size: max_file_size  //限制最大为50
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

                if(obj.aborted==0){
                    // parent.layer.msg("操作成功");
                    if(attachment==""||attachment==undefined){
                        attachment=ids;
                    }else{
                        attachment+=(","+ids);
                    }
                    vm.hasFile=true;
                }
                if(obj.aborted!=0){
                    var msg="有"+obj.aborted+"个图片上传失败";
                    if(obj.aborted==0){
                        msg="出现错误";
                    }
                    // parent.layer.msg(msg);
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