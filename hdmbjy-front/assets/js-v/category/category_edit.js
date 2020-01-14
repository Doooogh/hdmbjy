var imageFile;
window.onload = function (){
    var vm = new Vue({
        el: '#app',
        data:{
            id: '',	 //主键ID
            type: '',  //类型
            iscont: '',  //是否直接显示内容
            parentId: '',	 //上级ID
            name: '',	 //栏目名称
            url: '#',	 //栏目链接
            image: '',	 //栏目图片
            order: '',	 //栏目序号
            description: '',	 //栏目描述
            pds: [],
            msg:'add',
            nginxurl:nginxurl,
            hasImage:false

        },

        methods: {

            //初始执行
            init() {
                this.id = this.getUrlKey('id');  //id 添加时表示的是 父id  在编辑的时候表示的是本id
                var msg = this.getUrlKey('msg');
                if(null!=this.id&&""!=this.id&&msg=='edit'){
                    this.msg = msg;
                    this.edit=true;
                    this.getData();//修改获取数据
                }else if(null!=this.id&&""!=this.id&&msg=='add'){
                    this.getGoAdd();//新增获取数据
                }
				
				setTimeout(function(){
					vm.getDict();
				},200);

            },

            //去保存
            save: function (){
                    if(this.name == ""){
                        $("#name").tips({
                            side:3,
                            msg:'请输入栏目名称',
                            bg:'#AE81FF',
                            time:2
                        });
                        this.$refs.name.focus();
                        return false;
                    }
                if(this.url == ""){
                    $("#url").tips({
                        side:3,
                        msg:'请输入栏目链接',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.$refs.url.focus();
                    return false;
                }
                if(this.type == ""){
                    $("#type").tips({
                        side:3,
                        msg:'请输入栏目类型',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.$refs.type.focus();
                    return false;
                }
                if(this.iscont == ""){
                	$("#iscont").tips({
                		side:3,
                		msg:'请输入栏目类型',
                		bg:'#AE81FF',
                		time:2
                	});
                	this.$refs.iscont.focus();
                	return false;
                }


                if(this.order == ""||this.order==undefined){
                    $("#order").tips({
                        side:3,
                        msg:'请输入栏目序号',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.$refs.order.focus();
                    return false;
                }else{
                    if(!/^\d+$/.test(this.order)){
                        this.order="";
                        $("#order").tips({
                            side:3,
                            msg:'请输入大于0的数字',
                            bg:'#AE81FF',
                            time:2
                        });
                        this.$refs.order.focus();
                        return false;
                    }

                }

                if(this.description == ""){
                    $("#description").tips({
                        side:3,
                        msg:'请输入栏目描述',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.$refs.description.focus();
                    return false;
                }

                if(this.msg!='edit'){
                    if(!this.hasImage){
                        $("#image").tips({
                            side:3,
                            msg:'请选择图片',
                            bg:'#AE81FF',
                            time:2
                        });
                        this.$refs.image.focus();
                        return false;
                    }
                }


                $("#showform").hide();
                $("#jiazai").show();
                var form = new FormData();
                if(vm.msg=='edit'){
                    if(imageFile!=null){
                        form.append("file",imageFile);
                    }
                }else{
                    form.append("file",imageFile);
                }
                form.append("id",this.id);
                form.append("name",this.name);
                form.append("url",this.url);
                form.append("parentId",this.parentId);
                form.append("type",this.type);
                form.append("iscont",this.iscont);
                form.append("order",this.order);
                form.append("description",this.description);
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'category/'+this.msg,
                    data:form,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data){
                        if("success" == data.result){
                            swal("", "保存成功", "success");
                            setTimeout(function(){
                                vm.goback(vm.PARENT_ID,'ok');
                            },1000);
                        }else if ("exception" == data.result){
                            showException("栏目模块",data.exception);//显示异常
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

            //根据主键ID获取数据(新增时)
            getGoAdd: function(){
                //发送 post 请求
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'category/toAdd',
                    data: {
                        id:this.id,
                        tm:new Date().getTime()
                    },
                    dataType:"json",
                    success: function(data){
                        if("success" == data.result){
                            vm.pds = data.pds;
                            vm.parentId = vm.id;
							 
                        }else if ("exception" == data.result){
                            showException("新增栏目",data.exception);	//显示异常
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

            //根据主键ID获取数据(修改时)
            getData: function(){
                //发送 post 请求
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'category/toEdit',
                    data: {id:this.id,tm:new Date().getTime()},
                    dataType:"json",
                    success: function(data){
                        if("success" == data.result){
                            vm.parentId = data.pd.PARENT_ID ;
                            vm.pds = data.pds;
                            vm.type=data.pd.TYPE,	 //主键ID
                                vm.name=data.pd.NAME,	 //主键ID
                                vm.url=data.pd.URL,	 //主键ID
                                vm.order=data.pd.ORDER,	 //主键ID
                                vm.description=data.pd.DESCRIPTION	 //主键ID
                                vm.image=data.pd.IMAGE	 //主键ID
                                vm.iscont=data.pd.ISCONT	 //主键ID
                        }else if ("exception" == data.result){
                            showException("修改栏目",data.exception);	//显示异常
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

            //跳转
            goback: function (id,FMSG){
                window.location.href="category_list.html?id="+this.parentId+"&FMSG="+FMSG;
            },

            //根据url参数名称获取参数值
            getUrlKey: function (name) {
                return decodeURIComponent(
                    (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
            },
			//获取数据字典数据
			getDict: function (){
				console.info(this.iscont);
				if('1'==this.iscont){
					  $("#iscont").html("<option value='1' selected>显示</option><option value='2'>不显示</option>");
				 }else if('2'==this.iscont){
					 $("#iscont").html("<option value='2' selected>不显示</option><option value='1'>显示</option>");
				 }else{
					 $("#iscont").html("<option value=''>请选择</option><option value='1'>显示</option><option value='2'>不显示</option>"); 
				 }
				$.ajax({
					xhrFields: {
			            withCredentials: true
			        },
					type: "POST",
					url: httpurl+'dictionaries/getLevelsByNameEn',
					data: {NAME_EN:'CATEGORY_TYPE',tm:new Date().getTime()},//类型
					dataType:'json',
					success: function(data){
						$("#type").html('<option value="">栏目类型</option>');
						 $.each(data.list, function(i, dvar){
							 if(dvar.BIANMA==vm.type){
								  $("#type").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
							 $("#type").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
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
            auto:false,
            accept: 'images' //只允许上传图片
            ,acceptMime: 'image/*' //只筛选图片,
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

    });
}
