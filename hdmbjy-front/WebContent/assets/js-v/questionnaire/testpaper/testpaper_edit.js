var vm = new Vue({
	el: '#app',
	
	data:{
		TESTPAPER_ID: '',	//主键ID
		pd: [],						//存放字段参数
		TYPE: '',          //试卷类型
		SUBJECT_IDS: '',   //题目id集合
		SUBJECT_NAMES: '', //题目名称集合
		STATUS : '', //是否启用
		SORT : '', //排序
		msg:'add'
    },
	
	methods: {
		
        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.TESTPAPER_ID = FID;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict();
        		vm.getSort();
            },200);
        },
        chooseSTATUS: function(STATUS){
        	this.pd.STATUS = STATUS;
        },
        //去保存
    	save: function (){
    		
			if(this.pd.NAME == '' || this.pd.NAME == undefined){
				$("#NAME").tips({
					side:3,
		            msg:'请输入问卷名称',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NAME = '';
				this.$refs.NAME.focus();
			return false;
			}
			if(this.SORT == '' || this.SORT == undefined){
				$("#SORT").tips({
					side:3,
		            msg:'请输入排序',
		            bg:'#AE81FF',
		            time:2
		        });
				this.SORT = '';
				this.$refs.SORT.focus();
			return false;
			}
			if(this.TYPE == ''){
				$("#TYPE").tips({
					side:3,
		            msg:'请输入试卷类型',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}
			if(this.pd.BZ == '' || this.pd.BZ == undefined){
				$("#BZ").tips({
					side:3,
		            msg:'请输入备注',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.BZ = '';
				this.$refs.BZ.focus();
			return false;
			}
			if(this.pd.STATUS == ''){
				$("#STATUS").tips({
					side:3,
		            msg:'请输入是否启用',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.STATUS = '';
				this.$refs.STATUS.focus();
			return false;
			}
			if(this.SUBJECT_IDS == '' || this.SUBJECT_IDS == undefined){
				$("#SUBJECT_IDS").tips({
					side:3,
		            msg:'请输入试卷题目',
		            bg:'#AE81FF',
		            time:2
		        });
				this.SUBJECT_IDS = '';
				this.$refs.SUBJECT_IDS.focus();
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
					url: httpurl+'testpaper/'+this.msg,
			    	data: {TESTPAPER_ID:this.TESTPAPER_ID,
				    NAME:this.pd.NAME,
				    SORT:this.SORT,
					TYPE:this.TYPE,
				    BZ:this.pd.BZ,
				    STATUS:this.pd.STATUS,
				    SUBJECT_IDS:this.SUBJECT_IDS,
				    SUBJECT_NAMES:this.SUBJECT_NAMES,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("问卷试卷",data.exception);//显示异常
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
				url: httpurl+'testpaper/goEdit',
		    	data: {TESTPAPER_ID:this.TESTPAPER_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.TYPE = data.pd.TYPE;
						vm.STATUS = data.pd.STATUS;
						vm.SUBJECT_IDS = data.pd.SUBJECT_IDS;
						vm.SUBJECT_NAMES = data.pd.SUBJECT_NAMES
						vm.SORT = data.pd.SORT
                     }else if ("exception" == data.result){
                     	showException("问卷试卷",data.exception);	//显示异常
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
			    	data: {NAME_EN:'Types of Examination Papers'},
					dataType:'json',
					success: function(data){
						 $("#TYPE").append("<option value=''>请选择试卷类型</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.TYPE == dvar.BIANMA){
							  	$("#TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
		},
		getSort: function (){
			$.ajax({
				xhrFields: {
                withCredentials: true
            	},
				type: "POST",
				url: httpurl+'testpaper/getSort?tm='+new Date().getTime(),
				dataType:'json',
				success: function(data){
					 console.info(data.pd.SORT);
					
					 vm.SORT = data.pd.SORT;
				}
			});
	},
		//选择题目
		goSubjectIds :function (){
			 var typeIds =  this.SUBJECT_IDS;
			
			 var diag = new top.Dialog();
	   		 diag.Drag=true;
	   		 diag.Title ="题库";
	   		 diag.URL = '../../questionnaire/subject/subject_choice.html?TYPEIDS='+typeIds;
	   		 diag.Width = 800;
	   		 diag.Height = 700;
	   		 diag.Modal = true;				//有无遮罩窗口
	   		 diag. ShowMaxButton = true;	//最大化按钮
	   	     diag.ShowMinButton = true;		//最小化按钮 
	   		 diag.CancelEvent = function(){ //关闭事件
	   			 var titlename = diag.innerFrame.contentWindow.document.getElementById('titlename').value;
	   			 var ids = diag.innerFrame.contentWindow.document.getElementById('ids').value;
	   			 vm.SUBJECT_IDS = ids;
	   			 vm.SUBJECT_NAMES = titlename;
	   			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
	   			 if(varSon != null && varSon.style.display == 'none'){
	   				
	   			 }
	   			 diag.close();
	   		 };
	   		 diag.show(); 
	   		 
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