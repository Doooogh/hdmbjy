var vm = new Vue({
	el: '#app',
	
	data:{
	
	EXAMINATION_ID:'',    //行政审批id
	pd:[],    //详细信息 
	hasApproveForm:false,
	hasAttachment:false,  
	varList:[],  //  历史变量
	hitaskList:[],  //历史审批过程列表
	attList:[],  //附件列表
	approveFormList:[],   //表单列表
	status:'',  //审批状态
	hiddenStatus:true,  //是否隐藏流畅状态
    },
	mixins: [formatDate],	//混入模块
	methods: {
		
        //初始执行
        init() {
        	var EID=this.getUrlKey("EID");
			if(null!=EID&&''!=EID&&undefined!=EID){
				this.EXAMINATION_ID=EID;
				this.getInfo();
			}
			
        },
		
		//根据行政id  获取详细信息    完成(可以查看自己上传的资料)或者中途结束的 给个提示信息
		getInfo:function(){
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'examination/getDetail',
				data: {
					EXAMINATION_ID:this.EXAMINATION_ID,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
				 if("success" == data.result){
					 vm.varList=data.varList;
					 vm.attList=data.attList;
					 if(vm.attList.length!=0){
					 	 vm.hasAttachment=true;
					 }
					 vm.approveFormList=data.approveFormList;
					 if(vm.approveFormList.length!=0){
						 vm.hasApproveForm=true;
					 }
					 vm.hitaskList=data.hitaskList;
					 vm.status=data.status;
					 vm.hiddenStatus=false;
				 }else if ("exception" == data.result){
			     	showException("删除自动增加数据",data.exception);		//显示异常
			     }
				}
			})
		},
		formatDate: function (time){
			let date = new Date(time);
			return this.formatDateUtil(date, "yyyy-MM-dd hh:mm:ss");
		},
		downloadAtt:function(id,url){
		    window.location.href=httpurl+"examination/download?ID="+id+"&URL="+url;
		},
		//预览表单
		previewForm:function (url,dataform_id) {
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="预览";
			 diag.URL = url+"?FDID="+dataform_id+"&isPre=true";
			 diag.Width = 950;
			 diag.Height = 850;
			 diag.Modal = false;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
			     diag.close();
			 };
			 diag.show();
		},
		/**
		 * 预览文件
		 */
		preview:function(id,url){
		
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'rutask/proview',
				data: {
					ID:id,
					URL:url,  //需要预览文件的路径
					tm:new Date().getTime()
					},	//这个TYPE这里的值是 email
				dataType:'json',
				success: function(data){
					if(data.result == 'success'){
						vm.pdf=data.pdf;
						if(vm.pdf!=''){
							var diag = new top.Dialog();
							diag.Drag=true;
							diag.Title ="预览";
							diag.URL = '../../act/rutask/file_preview.html?pdf='+vm.pdf;
							diag.Width = 950;
							diag.Height = 850;
							diag.Modal = false;			//有无遮罩窗口
							diag.CancelEvent = function(){ //关闭事件
							    diag.close();
							};
							diag.show();
						}
						
					}else{
			       		swal("", "预览文件出现错误", "error");
					}
				},
				error:function () {
					swal("", "预览文件时出现系统错误！", "error");
				}
			});
		},
		//根据url参数名称获取参数值
		getUrlKey: function (name) {
		    return decodeURIComponent(
		        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
		},
		},
		
	mounted(){
	    this.init();
	}
		
	});
		