var attachment="";
var vm=new Vue({
	el: '#app',
	data:{
		hasFile:false,   //判断是否已经上传了扫描件
		EXAMINATION_ID:'', //年检id
		PROC_INST_ID:''  ,//流程id
		BOOKINGUSER_ID:'',//预约id
	},
	methods:{
		init(){
			var EID=this.getUrlKey('EID');
			var PID=this.getUrlKey('PROC_INST_ID');
			if(EID!=null&&EID!=''&&EID!=undefined){
				this.EXAMINATION_ID=EID;
			}
			if(PID!=null&&PID!=''&&PID!=undefined){
				this.PROC_INST_ID=PID;
			}
			
			/**
			 * 获取预约id
			 */
			this.getBookingUserId();
		},
		save:function(){
			
			if(attachment == '' || attachment == undefined){
				$("#ATTACHMENT_IDS").tips({
					side:3,
			        msg:'请上传扫描件',
			        bg:'#AE81FF',
			        time:2
			    });
				attachment = '';
				this.$refs.ATTACHMENT_IDS.focus();
			return false;
			}
			
			$("#showform").hide();
			$("#jiazai").show();
			//发送 post 请求
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'examination/uploadScanning',
				data: {
					EXAMINATION_ID:this.EXAMINATION_ID,  //年检id
					ATTACHMENT_IDS:attachment,   	//添加的附件id
					PROC_INST_ID:this.PROC_INST_ID,   //流程id
					BOOKINGUSER_ID:this.BOOKINGUSER_ID,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
			         if("success" == data.result){
						swal("", "上传成功", "success");
						setTimeout(function(){
							top.Dialog.close();//关闭弹窗
						},1000);
			         }else if ("exception" == data.result){
			         	showException("扫描件上传",data.exception);	//显示异常
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
		},
		getBookingUserId:function(){
			
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'bookinguser/getBookingUserId',
				data: {
					PROC_INST_ID:this.PROC_INST_ID,   //流程id
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
			         if("success" == data.result){
						vm.BOOKINGUSER_ID=data.BOOKINGUSER_ID;
			         }else if ("exception" == data.result){
			         	showException("扫描件上传",data.exception);	//显示异常
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
	},
	mounted(){
	    this.init();
	}
	
});
layui.use('upload', function() {
        var $ = layui.jquery
            , upload = layui.upload;
        var ids="";
        //多文件列表示例
        var demoListView = demoListView1=$('#demoList')
            ,uploadListIns = upload.render({
            url: httpurl+'/examination/attachmentLoad',
            elem: '#testList'
            ,accept: 'file',
            multiple: true,
			data: {
				
				P_TYPE: '1',   //表示为年度审批
				C_TYPE: '2'    //表示为扫描件
				} 
            ,auto: false
            ,bindAction: '#sub',
            size: max_file_size   //限制大小为50M
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
                    layer.msg(msg);
                    alert(msg);
                }
				console.log(attachment);
            }
            ,error: function(index, upload){
                var tr = demoListView.find('tr#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
            }
        });

    });