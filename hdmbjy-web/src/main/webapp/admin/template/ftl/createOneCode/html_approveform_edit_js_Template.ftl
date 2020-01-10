
var vm = new Vue({
	el: '#app',
	data:{
        ${objectNameUpper}_ID: '',	//主键ID
		pd: [],						//存放字段参数
        msg:'add',
		APPROVE_ID:''  ,//审批的id  ,
		APPROVE_TYPE:'',   //审批的类型
		FORM_ID:'',   //表单的id
		isPreview:false,   //是否是从审批预览页面查看预览
		SUB_STATUS:'',  //是否为暂存状态   1 是   0 否
		APPROVEFORM_ID:'',

    },

	methods: {

        //初始执行
        init() {
            var FID = this.getUrlKey('FID');	//为该表单的id
        	var FDID = this.getUrlKey('FDID');	//为该表单存储的id   如果为null 就是添加  否则为编辑
        	var AFT = this.getUrlKey('AFT');	//为该表单存储的审批类型
        	var AID = this.getUrlKey('AID');	//为该表单存储的审批id
        	var isPre = this.getUrlKey('isPre');	//为该表单存储的审批id
			var AF_ID = this.getUrlKey('AFID');	//为该表单存储的id

        	if(null != FDID){
        		this.msg = 'edit';
        		this.${objectNameUpper}_ID = FDID;
        		this.getData();   //获取数据
        	}
			if(null != FID){
				this.FORM_ID=FID;
			}
			if(null != AF_ID){
				this.APPROVEFORM_ID=AF_ID;
			}
			if(null != AFT){
				this.APPROVE_TYPE=AFT;
			}
			if(null != AID){
				this.APPROVE_ID=AID;
			}
			if(null!=isPre){
				this.isPreview=true;
			}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },

        //去保存
    	save: function (status){
			vm.pd=[];
 			vm.getValue();
			vm.SUB_STATUS=status;
			if(status==0){
<#list fieldList as var>
            if(this.pd.${var[0]} == '' || this.pd.${var[0]} == undefined){
                    $("#${var[0]}").tips({
                        side:3,
                        msg:'请输入${var[2] }',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.${var[0]} = '';
                    this.$refs.${var[0]}.focus();
                return false;
                }
</#list>
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'${objectNameLower}/'+this.msg,
			    	data: {
${objectNameUpper}_ID:this.${objectNameUpper}_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,

			<#list fieldList as var>
				<#if var[3] == "是">
					<#if var[7] != 'null'>
						${var[0]}:this.${var[0]},
					<#else>
						${var[0]}:this.pd.${var[0]},
					</#if>

				</#if>
			</#list>
			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.${objectNameUpper}_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("${TITLE}",data.exception);//显示异常
                        }
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
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
				url: httpurl+'${objectNameLower}/goEdit',
		    	data: {
                    ${objectNameUpper}_ID:this.${objectNameUpper}_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                        <#list fieldList as var>
                            <#if var[3] == "是">
                                <#if var[7] != 'null'>
                                                vm.${var[0]} = data.pd.${var[0]};
                                <#elseif var[1] == 'Date'>
                                                $("#${var[0]}").val(data.pd.${var[0]});
                                </#if>
                            </#if>
                        </#list>
                     }else if ("exception" == data.result){
                     	showException("${TITLE}",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
        <#list fieldList as var>
            <#if var[3] == "是">
                <#if var[7] != 'null'>
                    ${var[0]}:this.${var[0]},
                <#else>
                    var ${var[0]}=$("#${var[0]}").text();
                    if(null!=${var[0]}&&undefined!=${var[0]}&&''!=${var[0]}){
                        vm.pd.${var[0]}=${var[0]};
                    }
                </#if>
            </#if>
        </#list>
        },
    	//获取数据字典数据
		getDict: function (){
<#list fieldList as var>
    <#if var[3] == "是">
        <#if var[1] == 'String'>
            <#if var[7] != 'null'>
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
			    	data: {DICTIONARIES_ID:'${var[7]}'},
					dataType:'json',
					success: function(data){
						 $("#${var[0]}").append("<option value=''>请选择${var[2]}</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.${var[0]} == dvar.BIANMA){
							  	$("#${var[0]}").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#${var[0]}").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
            </#if>
        </#if>
    </#if>
</#list>
		},
		//验证日期是否正确  可以允许是否为''
		verifyDate:function(allDate){
					var result={      	//返回值
						isNull:false,   //是否为isNull
						isTrue:true,      //格式是否正确
						msg:"",
					};
					var dateArr =allDate.split("/");
						if(allDate.length==2){
							result.isNull=true;
							result.msg="日期不能为空!";
							return result;
						}
						var year=dateArr[0];
						if(year.length!=4||year>9999||year<1000){
							result.isTrue=false;
							result.msg="日期格式不正确!";
							return result
						}
						var month=dateArr[1];
						if(!(month<=12&&month>0)){
							result.isTrue=false;
							result.msg="日期格式不正确!";
							return result
						}
						var day=dateArr[2];
						if(!(day<=30&&day>0)){
							result.isTrue=false;
							result.msg="日期格式不正确!";
							return result
						}
						return result;

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