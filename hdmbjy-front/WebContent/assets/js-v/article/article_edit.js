var imageFile;
var interval;
var remarks;
var attachment;
var demoListView1;
document.addEventListener("DOMContentLoaded",via, false);

function via(){
    $('#save').click(function(){
        vm.save();
    })
}

    var vm = new Vue({
        el: '#app',

        data:{
            ID: '',	//主键ID
            pd: [],						//存放字段参数
            msg:'add',
            serverurl: '',
            CATEGORY_ID:'',
            ATTACHMENT:'',
            REMARKS:'',
            hasImage:false,
            hasFile:false,
            hasRemarks:false,
            nginxurl:nginxurl,
            pad:[],
			TYPE:''   //文章类型

        },

        methods: {

            //初始执行
            init() {
                // this.exec_iframe();
                this.pd.TYPE=1;
                this.serverurl = httpurl;
                var CATEGORY_ID = this.getUrlKey('CATEGORY_ID');	//当接收过来的CATEGORY_ID不为null时,表示此页面是修改进来的
                var ID = this.getUrlKey('ID');	//当接收过来的CATEGORY_ID不为null时,表示此页面是修改进来的
                this.CATEGORY_ID=CATEGORY_ID;
                this.pd.LINK='#';
                if(null != ID&&''!=ID){
                    this.msg = 'edit';
                    this.ID=ID;
                    this.getData();
                }
                					
               
             

                setInterval(function () {
					 vm.getDict();
                    vm.getUData();
                },1000);
            },

            //去保存
            save: function (){
                // vm.getUData();
                this.REMARKS= remarks;
                this.ATTACHMENT=attachment;
                if(this.pd.TITLE == ""||this.pd.TITLE==undefined){
                    $("#TITLE").tips({
                        side:3,
                        msg:'请输入文章标题',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.$refs.TITLE.focus();
                    return false;
                }
				if(this.TYPE == ""||this.TYPE==undefined){
				    $("#TYPE").tips({
				        side:3,
				        msg:'请选择文章类型',
				        bg:'#AE81FF',
				        time:2
				    });
				    this.$refs.TYPE.focus();
				    return false;
				}
                if(this.pd.LINK == ""||this.pd.LINK==undefined){
                    $("#LINK").tips({
                        side:3,
                        msg:'请输入文章链接',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.$refs.LINK.focus();
                    return false;
                }
                if(this.pd.ORDER == ""||this.pd.ORDER==undefined){
                    $("#ORDER").tips({
                        side:3,
                        msg:'请输入文章权重',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.$refs.ORDER.focus();
                    return false;
                }else{
                    if(!/^\d+$/.test(this.pd.ORDER)){
                        this.pd.ORDER="";
                        $("#ORDER").tips({
                            side:3,
                            msg:'请输入大于0的数字',
                            bg:'#AE81FF',
                            time:2
                        });
                        this.$refs.ORDER.focus();
                        return false;
                    }

                }
                if(this.pd.DESCRIPTION == ""||this.pd.DESCRIPTION==undefined){
                    $("#DESCRIPTION").tips({
                        side:3,
                        msg:'请输入文章描述',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.$refs.DESCRIPTION.focus();
                    return false;
                }
                if(this.REMARKS==""||this.REMARKS==undefined){
                    layer.msg("请输入文章内容");
                    this.hasRemarks=false;
                    return false;
                }else{
                    this.hasRemarks=true;
                }

               
                var form = new FormData();
                if(imageFile!=null||imageFile!=undefined){
                    form.append("file",imageFile);
                }
                if(vm.hasImage&&vm.msg=="edit"){
                    if(imageFile==null||imageFile==undefined){
                        form.append("file",null);
                    }else{
                        form.append("file",imageFile);
                    }

                }
                if(!vm.hasImage){
                    form.append("file",null);
                }
                form.append("CATEGORY_ID",this.CATEGORY_ID);
                form.append("ID",this.ID);
                form.append("REMARKS",remarks);
                form.append("TITLE",this.pd.TITLE);
                form.append("TYPE",this.TYPE);
                form.append("LINK",this.pd.LINK);
                form.append("ORDER",this.pd.ORDER);
                if(this.ATTACHMENT==null||this.ATTACHMENT==undefined){
                    form.append("ATTACHMENT",null);
                }else {
                    form.append("ATTACHMENT",this.ATTACHMENT);
                }
                form.append("DESCRIPTION",this.pd.DESCRIPTION);

				$("#showform").hide();
				$("#jiazai").show();
                if(!vm.hasImage||!vm.hasFile){
                    layer.msg('图片或者附件还没有上传需要继续吗？', {
                        time: 0 //不自动关闭
                        ,btn: ['继续', '取消']
                        ,yes: function(index){
                            layer.close(index);
                            //发送 post 请求提交保存
                            // clearInterval(interval);
                            $.ajax({
                                xhrFields: {
                                    withCredentials: true
                                },
                                type: "POST",
                                url: httpurl+'article/'+vm.msg,
                                async: false,
                                cache: false,
                                contentType: false,
                                processData: false,
                                data: form,
                                success: function(data){
                                    if("success" == data.result){
                                        swal("", "保存成功", "success");
                                        setTimeout(function(){
                                            top.Dialog.close();//关闭弹窗
                                        },1000);
                                    }else if ("exception" == data.result){
                                        showException("文章管理",data.exception);//显示异常
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
                        }
                    });

                }else{
                    $("#showform").hide();
                    $("#jiazai").show();
                    //发送 post 请求提交保存
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: "POST",
                        url: httpurl+'article/'+vm.msg,
                        async: false,
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: form,
                        success: function(data){
                            if("success" == data.result){
                                swal("", "保存成功", "success");
                                setTimeout(function(){
                                    top.Dialog.close();//关闭弹窗
                                },1000);
                            }else if ("exception" == data.result){
                                showException("文章管理",data.exception);//显示异常
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
            exec_iframe:  function (){
                if(typeof(exec_obj)=='undefined'){
                    exec_obj = document.createElement('iframe');
                    exec_obj.name = 'tmp_frame';
                    exec_obj.src = httpurl+'plugins/ueditor/article_edit_mid.html';
                    exec_obj.id = "mid";
                    exec_obj.style.display = 'none';
                    document.body.appendChild(exec_obj);//动态创建一个iframe
                }else{
                    exec_obj.src = httpurl+'plugins/ueditor/article_edit_mid.html?' + Math.random();
                }
            },
            setUData:function(content){
                var ifr = document.getElementById('mid');
                var data={
                    content:remarks,
                    code:"1",  //表示设置数据
                };
                ifr.contentWindow.postMessage(data, "*");
                window.addEventListener('message', function(e) {
                },true);
            },
            getUData:function(){
                var ifr = document.getElementById('mid');
                var data={
                    code:"0",  //表示需要获取数据
                };
                ifr.contentWindow.postMessage(data, "*");
                window.addEventListener('message', function(e) {
                    remarks=e.data;
                },true);
            },
           //获取数据字典数据
           getDict: function (){
           	$.ajax({
           		xhrFields: {
                       withCredentials: true
                   },
           		type: "POST",
           		url: httpurl+'dictionaries/getLevelsByNameEn',
           		data: {NAME_EN:'ARTICLE_TYPE',tm:new Date().getTime()},//类型
           		dataType:'json',
           		success: function(data){
           			$("#TYPE").html('<option value="">文章类型</option>');
           			 $.each(data.list, function(i, dvar){
           				 if(dvar.BIANMA==vm.TYPE){
           					  $("#TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
           				 }else{
           				 $("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
						 }
           			 });
           		}
           	});
           },
            getData:function(){

                //发送 post 请求
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'article/goEdit',
                    data: {
                        ID:this.ID,
                        tm:new Date().getTime()},
                    dataType:"json",
                    success: function(data){
                        if("success" == data.result){
                            vm.CATEGORY_ID = data.pd.CATEGORY_ID ;
                            vm.pd=data.pd;
                            vm.ATTACHMENT=data.pd.ATTACHMENT;
							vm.TYPE=data.pd.TYPE;
                            attachment=data.pd.ATTACHMENT;
                            if(attachment!=""){
                                vm.hasFile=true;
                            }
                            vm.REMARKS=data.pd.REMARKS;
                            remarks=data.pd.REMARKS;
                            if(remarks!==""){
                                vm.hasRemarks=true;
                            }

                            vm.ID=data.pd.ID;
                            vm.pd.COVER_IMAGE=data.pd.COVER_IMAGE;
                            if(vm.pd.COVER_IMAGE!==""){
                              vm.hasImage=true;
                            }
                            vm.apd=data.apd;
                            var ap=vm.apd;
                            // vm.setUData();
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
            url: httpurl+'article/attachmentLoad',
            elem: '#testList'
            ,accept: 'file',
            multiple: true
            ,auto: false
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

                if(obj.aborted==0){
                    layer.msg("操作成功");
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
                    url: httpurl+'article/deleteFileById',
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
                            showException("文章管理",data.exception);//显示异常
                        }
                    }
                }).done().fail(function(){
                    swal("登录失效!", "请求服务器无响应，稍后再试", "warning");

                });

            });

            //删除
        }





