var vm = new Vue({
	el: '#app',
	
	data:{
		INDUSTRY_ID: '',	//主键ID
		pd: [],						//存放字段参数
		//IS_START: '',
		editor1: '',
		msg:'add',
		type:'',
		USER_ID:''
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	var types = this.getUrlKey('type');
        	this.type = types;
        	if(null != FID){
        		this.msg = 'edit';
        		this.INDUSTRY_ID = FID;
        		this.getData();
        	}
        	/*setTimeout(function(){
        		vm.getDict();
            },200);*/
        	 var E = window.wangEditor
             var editor = new E('#editor')
        	 this.editor1 = editor;
             // 或者 var editor = new E( document.getElementById('editor') )
        	 editor.customConfig.menus = [
        		 'head',  // 标题
        		    'bold',  // 粗体
        		    'fontSize',  // 字号
        		    'fontName',  // 字体
        		    'italic',  // 斜体
        		    'underline',  // 下划线
        		    'strikeThrough',  // 删除线
        		    'foreColor',  // 文字颜色
        		    'backColor',  // 背景颜色
        		    'link',  // 插入链接
        		    'list',  // 列表
        		    'justify',  // 对齐方式
        		    'quote',  // 引用
        		    //'emoticon',  // 表情
        		    'image',  // 插入图片
        		    'table',  // 表格
        		    //'video',  // 插入视频
        		    'code',  // 插入代码
        		    'undo',  // 撤销
        		    'redo'  // 重复
        	 ]
        	 editor.customConfig.uploadImgHeaders = {
        		    'Accept': 'text/x-json'
        	 }
        	 editor.customConfig.withCredentials = true
        	 editor.customConfig.uploadImgShowBase64 = true
        	 editor.create()
        },
        
        //去保存
    	save: function (){
    		
			if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				$("#TITLE").tips({
					side:3,
		            msg:'请输入标题',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITLE = '';
				this.$refs.TITLE.focus();
			return false;
			}
			if(this.pd.SORT == '' || this.pd.SORT == undefined){
				$("#SORT").tips({
					side:3,
		            msg:'请输入排序',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.SORT = '';
				this.$refs.SORT.focus();
			return false;
			}
			/*if(this.IS_START == ''){
				$("#IS_START").tips({
					side:3,
		            msg:'请输入是否显示',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.IS_START = '';
				this.$refs.IS_START.focus();
			return false;
			}*/
    		
    		$("#showform").hide();
    		$("#jiazai").show();
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'industry/'+this.msg,
			    	data: {INDUSTRY_ID:this.INDUSTRY_ID,
				    TITLE:this.pd.TITLE,
				    CONTENT:this.editor1.txt.html(),
				    TYPE:this.type,
				    USER_ID:this.USER_ID,
				    SORT:this.pd.SORT,
					/*IS_START:this.IS_START,*/
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("行业协会",data.exception);//显示异常
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
				url: httpurl+'industry/goEdit',
		    	data: {INDUSTRY_ID:this.INDUSTRY_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						/*vm.IS_START = data.pd.IS_START;*/
                     	vm.USER_ID = data.pd.USER_ID;
						vm.editor1.txt.html(data.pd.CONTENT)
                     }else if ("exception" == data.result){
                     	showException("行业协会",data.exception);	//显示异常
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
					url: httpurl+'dictionaries/getLevelsByNameEn?tm='+new Date().getTime(),
			    	data: {NAME_EN:'display'},
					dataType:'json',
					success: function(data){
						 $("#IS_START").append("<option value=''>请选择是否显示</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.IS_START == dvar.BIANMA){
							  	$("#IS_START").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#IS_START").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
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
				