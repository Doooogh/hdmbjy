var vm = new Vue({
    el: '#app',
    data:{
        ID: '',	//主键ID
        pd: [],						//存放字段参数
        msg:'add',
        attachment:'',
        hasFile:false,
        TYPE:'',
        apd:[],
		zNodes:[],
        draft:0,
		CHECKEDNUM:'',
		CHECKEDNODENAME:'',
		orList:[],   //机构集合
		districtList:[],  //学区集合
		OR_TYPE:'', //  筛选机构类型
		OR_DISTRICT:'',  //筛选机构学区
		INFORMANTS:'',  //需要通知人的ids
		informTables:[],  //通知回执待选列表
		INFORMTABLE_ID:'' ,  //选择的回执单id
		styleShow: {     //css 样式
			color: 'darkred',
			fontSize: '11px',
			display:'none',
			marginRight:'10px'
		},
		setting : {
						check: {
							enable: true,
							chkboxType: { "Y": "ps", "N": "ps" }, //Y被勾选,N没有勾选情况,p操作影响父节点,s影响子节点
						},
						data: {
							simpleData: {
								enable: true
							}
						},
						callback: {
							onCheck: zTreeOnCheck
						}
					},
		selectedTableTitle:''
    },

    methods: {

        //初始执行
        init() {
            //实例化编辑器
            //建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
            var ue = UE.getEditor('editor');
            var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
            if(null != FID){
                this.msg = 'edit';
                this.ID = FID;
                this.getData();
                this.getUser();
				
            }else{
				// this.getOrganization();
                this.getUser();
				this.getListTreeReceiver();
                // this.getTree();
            }

			this.getTableInfos();  //选择回执信息
            setTimeout(function(){
                vm.getDict();
            },200);
        },
		
		//接收人tree,根据主键ID获取数据
		getListTreeReceiver: function(){
			var _self=this;
			//发送 post 请求
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl+'organization//listAllOrganizationForInform',
				data: {tm:new Date().getTime(),type:"organization"},
				dataType:"json",
				success: function(data){
					if("success" == data.result){
						var setting = {
								showLine: true,
								checkable: false
							};
						var zTreeNodes = eval(data.zTreeNodes);
						_self.zNodes = zTreeNodes;
						_self.$options.methods.freshArea(_self);//zTree初始化
					}else if ("exception" == data.result){
						alert("数据字典模块"+data.exception);//显示异常
					}
				}
			})
		},
		
		//zTree初始化
		freshArea: function(_self){
			var zTreeObj=$.fn.zTree.init($("#treeDemo"), _self.setting, _self.zNodes);
			zTreeObj.expandAll(false);//默认ztree全部关闭
		},

        //去保存
        save: function (){
            //富文本编辑器:
            vm.pd.CONTENT=UE.getEditor('editor').getContent();

            if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
                $("#TITLE").tips({
                    side:3,
                    msg:'请输入通知标题',
                    bg:'#AE81FF',
                    time:2
                });
                this.pd.TITLE = '';
                this.$refs.TITLE.focus();
                return false;
            }

            if(this.pd.INITIATOR_NAME == '' || this.pd.INITIATOR_NAME == undefined){
                $("#INITIATOR_NAME").tips({
                    side:3,
                    msg:'请输入发起人姓名',
                    bg:'#AE81FF',
                    time:2
                });
                this.pd.INITIATOR_NAME = '';
                this.$refs.INITIATOR_NAME.focus();
                return false;
            }
            if(this.TYPE == '' || this.TYPE == undefined){
                $("#TYPE").tips({
                    side:3,
                    msg:'请输入类型',
                    bg:'#AE81FF',
                    time:2
                });
                this.TYPE = '';
                this.$refs.TYPE.focus();
                return false;
            }
			debugger;
           /* var treeObj = $.fn.zTree.getZTreeObj("leftTree");
            var nodes = treeObj.getCheckedNodes(true);
            vm.getDepartmentIds(nodes); */
			//1.获取接收人的checked数据的ids-----------------------------开始 :
			var chkNodeArr;//被勾选的id数组
			var nodeIdsStr = "";//ids字符串
			var treenode = $.fn.zTree.getZTreeObj("treeDemo");//获取ztree对象
			chkNodeArr = treenode.getCheckedNodes(true);//true获取选中节点,false未选中节点,默认为true
			// 得到勾选节点的id集合,并用逗号隔开
			for (var i = 0; i < chkNodeArr.length; i++) {
				nodeIdsStr = nodeIdsStr + chkNodeArr[i].id + ",";
			}
			//赋值给变量,传递后台 ;
			this.INFORMANTS = nodeIdsStr;
			
			
			//  vm.getOrganizationIds();
			 
			// if(vm.INFORMANTS!=null&&vm.INFORMANTS!=''){
			//     vm.INFORMANTS=vm.INFORMANTS.substring(0,vm.INFORMANTS.length-1);
			// 	}
				
   //          if(this.INFORMANTS == '' || this.INFORMANTS == undefined){
   //              $("#INFORMANT").tips({
   //                  side:3,
   //                  msg:'请选择接收人',
   //                  bg:'#AE81FF',
   //                  time:2
   //              });
   //              this.INFORMANTS = '';
   //              return false;
   //          }
			/*var reg=new RegExp("\r\n","g");
			vm.pd.CONTENT= vm.pd.CONTENT.replace(reg,"\r\n");*/
			
			
            if(!this.hasFile){
                layer.msg('图片或者附件还没有上传需要继续吗？', {
                    time: 0, //不自动关闭
                    // skin: 'demo-class'
                    btn: ['继续', '取消']
                    ,yes: function(index){
                        $("#showform").hide();
                        $("#jiazai").show();
                        layer.close(index);
						console.log(vm.INFORMTABLE_ID+"_______________");
                        $.ajax({
                            xhrFields: {
                                withCredentials: true
                            },
                            type: "POST",
                            url: httpurl+'inform/'+vm.msg,
                            data: {
                                ID:vm.ID,
                                TITLE:vm.pd.TITLE,
                                ATTACHMENT:vm.attachment,
                                INITIATOR:vm.pd.INITIATOR,
								TABLE_ID:vm.INFORMTABLE_ID,
                                INITIATOR_NAME:vm.pd.INITIATOR_NAME,
                                TYPE:vm.TYPE,
								INFORMANTS:vm.INFORMANTS,
                                GROUP:vm.pd.GROUP,
                                CONTENT:vm.pd.CONTENT,
                                tm:new Date().getTime(),
                                DRAFT:0,
                            },
                            dataType:"json",
                            success: function(data){
                                if("success" == data.result){
                                /*    top.vm.topTask();
                                    top.vm.topInform();*/
                                    top.vm.tabMethod();
									$("#showform").show();
									$("#jiazai").hide();
                                    swal("", "保存成功", "success");
                                    setTimeout(function(){
                                        top.Dialog.close();//关闭弹窗
                                    },1000);
                                }else if ("exception" == data.result){
                                    showException("通知",data.exception);//显示异常
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
                    btn2:function () {
                        $("#showform").show();
                        $("#jiazai").hide();
                    },
                });
            }else{
				console.log(vm.INFORMTABLE_ID+"_______________");
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'inform/'+vm.msg,
                    data: {
                        ID:vm.pd.ID,
                        TITLE:vm.pd.TITLE,
                        ATTACHMENT:vm.attachment,
                        INITIATOR:vm.pd.INITIATOR,
						TABLE_ID:vm.INFORMTABLE_ID,
                        INITIATOR_NAME:vm.pd.INITIATOR_NAME,
                        TYPE:vm.TYPE,
                        GROUP:vm.pd.GROUP,
                        INFORMANTS:vm.INFORMANTS,
                        CONTENT:vm.pd.CONTENT,
                        DRAFT:0,   //是否为草稿
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
                            showException("通知",data.exception);//显示异常
                            $("#showform").show();
                            $("#jiazai").hide();
                        }
                    }
                }).done().fail(function(){
                    swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                    $("#showform").show();
                    $("#jiazai").hide();
                });
            }

        },
        saveDraft:function(){
        //富文本编辑器:
        vm.pd.CONTENT=UE.getEditor('editor').getContent();
         if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
             $("#TITLE").tips({
                 side:3,
                 msg:'请输入通知标题',
                 bg:'#AE81FF',
                 time:2
             });
             this.pd.TITLE = '';
             this.$refs.TITLE.focus();
             return false;
         }
        
         if(this.pd.INITIATOR_NAME == '' || this.pd.INITIATOR_NAME == undefined){
             $("#INITIATOR_NAME").tips({
                 side:3,
                 msg:'请输入发起人姓名',
                 bg:'#AE81FF',
                 time:2
             });
             this.pd.INITIATOR_NAME = '';
             this.$refs.INITIATOR_NAME.focus();
             return false;
         }
         if(this.TYPE == '' || this.TYPE == undefined){
             $("#TYPE").tips({
                 side:3,
                 msg:'请输入类型',
                 bg:'#AE81FF',
                 time:2
             });
             this.TYPE = '';
             this.$refs.TYPE.focus();
             return false;
         }
        
        /* var treeObj = $.fn.zTree.getZTreeObj("leftTree");
         var nodes = treeObj.getCheckedNodes(true);
         vm.getDepartmentIds(nodes); */
        			// vm.getOrganizationIds();
		var chkNodeArr;//被勾选的id数组
		var nodeIdsStr = "";//ids字符串
		var treenode = $.fn.zTree.getZTreeObj("treeDemo");//获取ztree对象
		chkNodeArr = treenode.getCheckedNodes(true);//true获取选中节点,false未选中节点,默认为true
		// 得到勾选节点的id集合,并用逗号隔开
		for (var i = 0; i < chkNodeArr.length; i++) {
			nodeIdsStr = nodeIdsStr + chkNodeArr[i].id + ",";
		}
		//赋值给变量,传递后台 ;
		this.INFORMANTS = nodeIdsStr;			
					
		if(vm.INFORMANTS!=null&&vm.INFORMANTS!=''){
			vm.INFORMANTS=vm.INFORMANTS.substring(0,vm.INFORMANTS.length-1);
			}
         if(this.INFORMANTS == '' || this.INFORMANTS == undefined){
             $("#INFORMANT").tips({
                 side:3,
                 msg:'请选择接收人',
                 bg:'#AE81FF',
                 time:2
             });
             this.INFORMANTS = '';
             return false;
         }
         if(!this.hasFile){
             layer.msg('图片或者附件还没有上传需要继续吗？', {
                 time: 0, //不自动关闭
                 // skin: 'demo-class'
                 btn: ['继续', '取消']
                 ,yes: function(index){
                     $("#showform").hide();
                     $("#jiazai").show();
                     layer.close(index);
                     $.ajax({
                         xhrFields: {
                             withCredentials: true
                         },
                         type: "POST",
                         url: httpurl+'inform/'+vm.msg,
                         data: {
                             ID:vm.pd.ID,
                             TITLE:vm.pd.TITLE,
                             ATTACHMENT:vm.attachment,
                             INITIATOR:vm.pd.INITIATOR,
							 TABLE_ID:vm.INFORMTABLE_ID,
                             INITIATOR_NAME:vm.pd.INITIATOR_NAME,
                             TYPE:vm.TYPE,
                             GROUP:vm.pd.GROUP,
                             INFORMANTS:vm.INFORMANTS,
                             CONTENT:vm.pd.CONTENT,
                             tm:new Date().getTime(),
                             DRAFT:1, //为草稿
                         },
                         dataType:"json",
                         success: function(data){
                             if("success" == data.result){
                                 /*top.vm.topTask();
                                 top.vm.topInform();*/
                                 top.vm.tabMethod();
        									$("#showform").show();
        									$("#jiazai").hide();
                                 swal("", "保存成功", "success");
                                 setTimeout(function(){
                                     top.Dialog.close();//关闭弹窗
                                 },1000);
                             }else if ("exception" == data.result){
                                 showException("通知",data.exception);//显示异常
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
                 btn2:function () {
                     $("#showform").show();
                     $("#jiazai").hide();
                 },
             });
         }else{
             $.ajax({
                 xhrFields: {
                     withCredentials: true
                 },
                 type: "POST",
                 url: httpurl+'inform/'+vm.msg,
                 data: {
                     ID:vm.pd.ID,
                     TITLE:vm.pd.TITLE,
                     ATTACHMENT:vm.attachment,
                     INITIATOR:vm.pd.INITIATOR,
					 TABLE_ID:vm.INFORMTABLE_ID,
                     INITIATOR_NAME:vm.pd.INITIATOR_NAME,
                     TYPE:vm.TYPE,
                     GROUP:vm.pd.GROUP,
                     INFORMANTS:vm.INFORMANTS,
                     CONTENT:vm.pd.CONTENT,
                     DRAFT:1,   //为草稿
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
                         showException("通知",data.exception);//显示异常
                         $("#showform").show();
                         $("#jiazai").hide();
                     }
                 }
             }).done().fail(function(){
                 swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                 $("#showform").show();
                 $("#jiazai").hide();
             });
         }
        },
		filter:function(OR_TYPE,OR_DISTRICT,e){
			//先进行获取已经被勾选的机构
			vm.getOrganizationIds();
			
			if(OR_TYPE==''&&OR_DISTRICT!=''){  //证明这个是在选择学区
				vm.OR_DISTRICT=OR_DISTRICT;
				$(".filter2 a").prop("style","color:#101d37!important");
				$(e.target).prop("style","color:rgb(206, 76, 76);font-weight: bold");
			}
			if(OR_DISTRICT==''&&OR_TYPE!=''){  //证明这个是在选择类型
				vm.OR_TYPE=OR_TYPE;
				$(".filter1 a").prop("style","color:#101d37!important");
				$(e.target).prop("style","color:rgb(206, 76, 76);font-weight: bold");
			}
			if(OR_DISTRICT==''&&OR_TYPE==''){  //点击不限按钮
				if($(e.target).attr("id")=='filter1'){
					vm.OR_TYPE=OR_TYPE;
					$(".filter1 a").prop("style","color:#101d37!important");
					$(e.target).prop("style","color:rgb(206, 76, 76);font-weight: bold");
				}
				if($(e.target).attr("id")=='filter2'){
					vm.OR_DISTRICT=OR_DISTRICT;
					$(".filter2 a").prop("style","color:#101d37!important");
					$(e.target).prop("style","color:rgb(206, 76, 76);font-weight: bold");
				}
			}
			//
			vm.getOrganization();
			setTimeout(function(){
				vm.setOrganizationIds();
			},200);
			
			
			
		},
		/**
		 * @param {Object} e
		 * 对筛选出来的机构进行全选
		 */
		allCheck:function(e){
			var isChecked=$(e.target).is(':checked');
			if(isChecked){
				$('.sc_one input:checkbox').attr("checked", true);
			}else{
				$('.sc_one input:checkbox').attr("checked", false);
			
			}
		},
		getTableInfos:function(){
			$.ajax({
			    xhrFields: {
			        withCredentials: true
			    },
			    type: "POST",
			    url: httpurl+'table/list',
			    data: {
			        tm:new Date().getTime(),
			    },
			    dataType:"json",
			    success: function(data){
			       if(data.result=='success'){
					  vm.informTables=data.varList;
				   }else if ("exception" == data.result){
						showException("获取回执列表",data.exception);//显示异常
					}
			    },
		});		
		},
		//提示已经选择的回执单  并且添加样式
		chooseInformTable:function(e,INFROMTABLE_ID,INFORMTABLE_TITLE){
			vm.INFORMTABLE_ID=INFROMTABLE_ID;
			vm.selectedTableTitle="已选择"+INFORMTABLE_TITLE;
			$(".table_title").css("color","black").css("font-weight","normal");
			$("#"+INFROMTABLE_ID).css("color","#097373").css("weight","bold ");
		},
		//预览已经
		previewInformTable:function(e,INFROMTABLE_ID,INFORMTABLE_TITLE){
			var diag = new top.Dialog();
			diag.Drag=true;
			diag.Title ="回执单预览";
			diag.URL = '../../inform/inform/informtable.html?TABLE_ID='+INFROMTABLE_ID;
			diag.Width = 1000;
			diag.Height = 600;
			diag.Modal = true;				//有无遮罩窗口
			diag. ShowMaxButton = true;	//最大化按钮
			diag.ShowMinButton = true;		//最小化按钮
			diag.CancelEvent = function(){ //关闭事件
			 diag.close();
			};
			diag.show();
		},
		//清空所有待选回执单样式
		clearInformTable:function(){
			vm.INFORMTABLE_ID="";
			vm.selectedTableTitle="";
			$(".table_title").css("color","black").css("font-weight","normal");
		},
		//获得所有的机构
		getOrganization:function(){
			$.ajax({
			    xhrFields: {
			        withCredentials: true
			    },
			    type: "POST",
			    url: httpurl+'organization/allList',
			    data: {
			        tm:new Date().getTime(),
			        TYPE:this.OR_TYPE,
					DISTRICT:this.OR_DISTRICT,
			    },
			    dataType:"json",
			    success: function(data){
			       if(data.result=='success'){
					   vm.orList=data.list;
				   }else if ("exception" == data.result){
                                    showException("通知",data.exception);//显示异常
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
        getTree:function(){
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'organization/listTreeAll',
                data: {
                    tm:new Date().getTime(),
                    ID:this.ID
                },
                dataType:"json",
                success: function(data){
                    var setting = {
                        check: {
                            enable: true,
                            chkboxType : {
                                "Y" : "ps",
                                "N" : "ps",
                            }
                        },
                        data: {
                            simpleData: {
                                enable: true
                            },
                            key: {
                                url: "xUrl"
                            },
                        },
                        callback:{
                            onCheck: vm.setDId
                        },
                        showLine: true,

                    };
                    var zTreeNodes = eval(data.zTreeNodes);
                    zTree = $.fn.zTree.init($("#leftTree"), setting, zTreeNodes);
                }
            }).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                $("#showform").show();
                $("#jiazai").hide();
            });


        },
		getOrganizationIds:function(){
			var allArr=new Array();
			if(undefined==vm.INFORMANTS||null==vm.INFORMANTS){
				vm.INFORMANTS='';
			}
				var temInformants=vm.INFORMANTS.split(",");
				$.each(temInformants,function(i,inId){
					if(inId!=''){
					 allArr.push(inId);
					}
				});
				var allChecked=$(".list_bottom label input[type='checkbox']:checked");
				var notChecked=$(".list_bottom label input[type='checkbox']:not(:checked)");
				var temRemove=new Array();
				$.each(notChecked,function(j,nele){
					temRemove.push($(nele).val());
				});
				_.pullAll(allArr, temRemove)
				$.each(allChecked,function(j,cEle){
					allArr.push($(cEle).val());
				});
				
				var allSet=new Set(allArr);
				vm.INFORMANTS="";
				for (var x of allSet) { // 遍历Set
				 vm.INFORMANTS+=(x+",");
				}
			
		},
		setOrganizationIds:function(){
			$(".list_bottom label input[type='checkbox']").prop("checked", false);
			var ids=vm.INFORMANTS;
			if(ids==""){
				$(".list_bottom label input[type='checkbox']").prop("checked",false);
			}else{
				var allDids=ids.split(",");
				var allChecek=$(".list_bottom label input[type='checkbox']");
				$.each(allDids,function(i,oId){
					$.each(allChecek,function(i,ele){
						if(oId==$(ele).val()){
							$(ele).prop("checked", true);
						}
					})
				});	
			}
		
		},
        getDepartmentIds:function(nodes){
            vm.INFORMANTS='';
            $.each(nodes,function(pIndex,pEle){
                var res=0;
                if(pEle.children!=undefined&&pEle.children!=null&&pEle.children.length!=0){
                    $.each(pEle.children,function(cIndex,cEle){
                        if(!cEle.checked){
                            res=1;
                        }
                    });
                    if(res==0){
                        vm.INFORMANTS+=(pEle.id+",");
                    }
                }else{
                    if(pEle.checked){
                        vm.INFORMANTS+=(pEle.id+",");
                    }
                }
            });
            if(vm.INFORMANTS!=null&&vm.INFORMANTS!=''){
                vm.INFORMANTS=vm.INFORMANTS.substring(0,vm.INFORMANTS.length-1);
            }
        },
        //根据主键ID获取数据
        getData: function(){
			var _self=this;
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'inform/goEdit',
                data: {ID:this.ID,tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        vm.pd = data.pd;							//参数map
                        //富文本编辑器:
                        var ue = UE.getEditor('editor');//初始化对象
                        var proinfo=data.pd.CONTENT;
                        ue.ready(function() {//编辑器初始化完成再赋值
                            ue.setContent(proinfo);  //赋值给UEditor
                        });
						vm.INFORMANTS=data.pd.INFORMANTS;
						vm.CHECKEDNUM = data.pd.CHECKEDNUM;
						// vm.getListTreeReceiver();
                        vm.attachment=data.pd.ATTACHMENT;
                        vm.TYPE=data.pd.TYPE;
						// console.log("pd___________");
						// console.log(vm.pd);
						// vm.INFORMTABLE_ID=data.pd.TABLE_ID;
						// vm.selectedTableTitle="已选择"+$("#"+vm.INFORMTABLE_ID).text();
						// $(".table_title").css("color","black").css("font-weight","normal");
						// $("#"+vm.INFROMTABLE_ID).css("color","#097373").css("weight","bold ");
						// setTimeout(function(){
						//     vm.setOrganizationIds();
						// },200);
						debugger;
						var allnodes_json = eval(data.allnodes_json);
						_self.zNodes = allnodes_json;
						_self.$options.methods.freshArea(_self);//zTree初始化
						
                        $("#TYPE").val(vm.TYPE);
                        if(vm.attachment!=""){
                            vm.hasFile=true;
                        }
                        vm.apd=data.apd;
                        var ap=vm.apd;
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
                        showException("通知",data.exception);	//显示异常
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

        getUser:function(){
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'inform/getUser',
                data: {tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        vm.pd=data.pd;					//参数map
                    }else if ("exception" == data.result){
                        showException("通知",data.exception);	//显示异常
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

        //获取数据字典数据
        getDict: function (){
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'dictionaries/getLevelsByNameEn',
                data: {NAME_EN:'INFORM_TYPE',tm:new Date().getTime()},//请假类型
                dataType:'json',
                success: function(data){
                    $("#TYPE").html('<option value="">通知类型</option>');
                    $.each(data.list, function(i, dvar){
                        if(dvar.NAME==vm.TYPE){
                            $("#TYPE").append("<option value="+dvar.NAME+" selected>"+dvar.NAME+"</option>");
                        }
                        $("#TYPE").append("<option value="+dvar.NAME+">"+dvar.NAME+"</option>");
                    });
                }
            });
			$.ajax({
			    xhrFields: {
			        withCredentials: true
			    },
			    type: "POST",
			    url: httpurl+'dictionaries/getLevelsByNameEn',
			    data: {NAME_EN:'DISTRICT',tm:new Date().getTime()},//请假类型
			    dataType:'json',
			    success: function(data){
					vm.districtList=data.list;
			    }
			});
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

layui.use(['transfer', 'layer', 'util'], function(){
  var $ = layui.$
  ,transfer = layui.transfer
  ,layer = layui.layer
  ,util = layui.util;
  
  //模拟数据
  var data1 = [
    {"value": "1", "title": "李白"}
    ,{"value": "2", "title": "杜甫"}
    ,{"value": "3", "title": "苏轼"}
    ,{"value": "4", "title": "李清照"}
    ,{"value": "5", "title": "鲁迅", "disabled": true}
    ,{"value": "6", "title": "巴金"}
    ,{"value": "7", "title": "冰心"}
    ,{"value": "8", "title": "矛盾"}
    ,{"value": "9", "title": "贤心"}
  ]
  
  ,data2 = [
    {"value": "1", "title": "瓦罐汤"}
    ,{"value": "2", "title": "油酥饼"}
    ,{"value": "3", "title": "炸酱面"}
    ,{"value": "4", "title": "串串香", "disabled": true}
    ,{"value": "5", "title": "豆腐脑"}
    ,{"value": "6", "title": "驴打滚"}
    ,{"value": "7", "title": "北京烤鸭"}
    ,{"value": "8", "title": "烤冷面"}
    ,{"value": "9", "title": "毛血旺", "disabled": true}
    ,{"value": "10", "title": "肉夹馍"}
    ,{"value": "11", "title": "臊子面"}
    ,{"value": "12", "title": "凉皮"}
    ,{"value": "13", "title": "羊肉泡馍"}
    ,{"value": "14", "title": "冰糖葫芦", "disabled": true}
    ,{"value": "15", "title": "狼牙土豆"}
  ]
 
 
  //显示搜索框
  transfer.render({
    elem: '#test4'
    ,data: data1
    ,title: ['文本墨客', '获奖文人']
    ,showSearch: true
  });
 
 
 
  
});


layui.use('form', function(){
  var form = layui.form
   ,layer = layui.layer
    ,layedit = layui.layedit
    ,laydate = layui.laydate;
});
layui.use('upload', function() {
    var $ = layui.jquery
        , upload = layui.upload;
    var ids="";
    //多文件列表示例
    var demoListView = demoListView1=$('#demoList')
        ,uploadListIns = upload.render({
        url: httpurl+'/inform/attachmentLoad',
        elem: '#testList'
        ,accept: 'file',
        multiple: true
        ,auto: false
        ,bindAction: '#sub',
        size: max_file_size  //限制单个文件的大小不能超过50兆
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
                if(vm.attachment==""||vm.attachment==undefined){
                    vm.attachment=ids;
                }else{
                    vm.attachment+=(","+ids);
                }
                vm.hasFile=true;

            }
            if(obj.aborted!=0){
                var msg="有"+obj.aborted+"个图片上传失败";
                if(obj.aborted==0){
                    msg="出现错误";
                }
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

function zTreeOnCheck(event, treeId, treeNode) {
			//var checked = treeNode.checked;
			//console.log((treeNode?treeNode.name:"root") + "checked " +(checked?"true":"false"));
			refreshLayers();
			clearCheckedOldNodes();
		};
		//刷新图层的显示情况
		var layers;
		var checkedNum;
		var checkedNodeName;
		function refreshLayers() {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var changedNodes = zTree.getChangeCheckedNodes();
			var nodeNum = zTree.getCheckedNodes();
			checkedNum = nodeNum.length;
			debugger;
			for ( var i=0 ; i < nodeNum.length ; i++ ){
				var treeNode = nodeNum[i];
				if(treeNode.pId != null && treeNode.pId != ''){
					// layers = map.getLayersByName(treeNode.name);
					// if(layers!=null && layers[0]!=null){
					// 	layers[0].setVisibility(treeNode.checked);
					// }
					checkedNodeName += treeNode.name + ',';
					checkedNodeName += "<br>";
					console.log((treeNode?treeNode.name:"root")  + (treeNode.checked?"选中":"false"));
				}else{
					checkedNum--; 
				}
					
				// console.log((treeNode?treeNode.name:"root") + "checked " +(treeNode.checked?"选中":"false"));				
			}
					console.log(checkedNum);
					vm.CHECKEDNUM = checkedNum;
					vm.CHECKEDNODENAME = checkedNodeName;
		}
		//清理善后工作
		function clearCheckedOldNodes() {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
			nodes = zTree.getChangeCheckedNodes();
			for (var i=0, l=nodes.length; i<l; i++) {
				nodes[i].checkedOld = nodes[i].checked;
			}
		};
		
function deleteFile(id) {
    $("#demoList").on('click', '.demo-delete', function () {
        var tr=$(this);

        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            url: httpurl+'inform/deleteFileById',
            data: {
                ID:id,
            },
            success: function(data){
                if("success" == data.result){
                    tr.closest('tr').remove();
                    var newatt=vm.attachment.split(",");
                    newatt=_.pull(newatt, id+'');
                    vm.attachment=_.join(newatt, [separator=','])
                }else if ("exception" == data.result){
                    showException("文章管理",data.exception);//显示异常
                }
            }
        }).done().fail(function(){
            swal("登录失效!", "请求服务器无响应，稍后再试", "warning");

        });

    });

    //删除

}

