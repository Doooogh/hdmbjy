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
        draft:0,
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
		selectedTableTitle:''
    },

    methods: {

        //初始执行
        init() {
            var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
            if(null != FID){
                this.msg = 'edit';
                this.ID = FID;
                this.getData();
                this.getUser();
            }else{
				this.getOrganization();
                this.getUser();
                // this.getTree();
            }

			this.getTableInfos();  //选择回执信息
            setTimeout(function(){
                vm.getDict();
            },200);
        },

        //去保存
        save: function (){
			
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
            vm.getDepartmentIds(nodes); 
			 vm.getOrganizationIds();
			 */
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
			var reg=new RegExp("\r\n","g");
			vm.pd.CONTENT= vm.pd.CONTENT.replace(reg,"\r\n");
			
			
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
                                ID:vm.pd.ID,
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
        			vm.getOrganizationIds();
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
			if(undefined==vm.INFORMANTS||null==vm.INFORMANTS){
				vm.INFORMANTS='';
			}
			var allChecked=$(".list_bottom label input[type='checkbox']:checked");
			$.each(allChecked,function(i,ele){
				 vm.INFORMANTS+=($(ele).val()+",");
			});
			/* if(vm.INFORMANTS!=null&&vm.INFORMANTS!=''){
			    vm.INFORMANTS=vm.INFORMANTS.substring(0,vm.INFORMANTS.length-1);
			} */
		},
		setOrganizationIds:function(){
			$(".list_bottom label input[type='checkbox']").prop("checked", false);
			var ids=vm.INFORMANTS;
			var allDids=ids.split(",");
			var allChecek=$(".list_bottom label input[type='checkbox']");
			$.each(allDids,function(i,oId){
				$.each(allChecek,function(i,ele){
					if(oId==$(ele).val()){
						$(ele).prop("checked", true);
					}
				})
			});
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
						
						vm.INFORMANTS=data.pd.INFORMANTS;
						vm.getOrganization();
                        vm.attachment=data.pd.ATTACHMENT;
                        vm.TYPE=data.pd.TYPE;
						
						vm.INFORMTABLE_ID=data.pd.TABLE_ID;
						vm.selectedTableTitle="已选择"+$("#"+vm.INFORMTABLE_ID).text();
						$(".table_title").css("color","black").css("font-weight","normal");
						$("#"+vm.INFROMTABLE_ID).css("color","#097373").css("weight","bold ");
						setTimeout(function(){
						    vm.setOrganizationIds();
						},200);
						
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

