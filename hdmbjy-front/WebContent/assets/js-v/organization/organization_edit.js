
var vm = new Vue({
	el: '#app',
	data:{
		ORGANIZATION_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		PARENT_ID:'',
		pds:[],
		TYPE:'',   //学校机构类型
		DISTRICT:'',   //学区 
		DISTRICT_NAME:'',    //学区名字   
		TYPE_NAME:'',    //机构分类
		TYPE_ID:'',    //机构分类
    },
	
	methods: {
		
        //初始执行
        init() {
			
			   this.ORGANIZATION_ID = this.getUrlKey('oId');  //id 添加时表示的是 父id  在编辑的时候表示的是本id
			   var msg = this.getUrlKey('msg');
			   var PID=this.getUrlKey("pId");
			   if(null!=PID&&undefined!=PID){
				   this.PARENT_ID=PID;
			   }
			   if(null!=this.ORGANIZATION_ID&&""!=this.ORGANIZATION_ID&&msg=='edit'){
			       this.msg = msg;
			       // this.edit=true;
			       this.getData();//修改获取数据
				   
			   }else if(null!=this.ORGANIZATION_ID&&""!=this.ORGANIZATION_ID&&msg=='add'){
			       this.getGoAdd();//新增获取数据
			   }
			   
			   setTimeout(function(){
			   	vm.getDict();
			   },300);
				


        },
        
        //去保存
    	save: function (){
    		
	
			if(this.pd.NAME == '' || this.pd.NAME == undefined){
				$("#NAME").tips({
					side:3,
		            msg:'请输入名字',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NAME = '';
				this.$refs.NAME.focus();
			return false;
			}
			/* if(this.pd.HEADMAN == '' || this.pd.HEADMAN == undefined){
				$("#HEADMAN").tips({
					side:3,
			        msg:'请输入负责人姓名',
			        bg:'#AE81FF',
			        time:2
			    });
				this.pd.HEADMAN = '';
				this.$refs.HEADMAN.focus();
			return false;
			}
		
			
			var myreg = /^(((13[0-9]{1})|159)+\d{8})$/;
			if(this.pd.HEADMAN_PHONE == '' || this.pd.HEADMAN_PHONE == undefined){
				$("#HEADMAN_PHONE").tips({
					side:3,
			        msg:'输入联系方式',
			        bg:'#AE81FF',
			        time:3
			    });
				this.pd.HEADMAN_PHONE = '';
				this.$refs.HEADMAN_PHONE.focus();
				return false;
			}else if(this.pd.HEADMAN_PHONE.length != 11 && !myreg.test(this.pd.HEADMAN_PHONE)){
				$("#HEADMAN_PHONE").tips({
					side:3,
			        msg:'负责人联系方式格式不正确',
			        bg:'#AE81FF',
			        time:3
			    });
				this.$refs.HEADMAN_PHONE.focus();
				return false;
			} */
			
			/*if(this.TYPE == '' || this.TYPE == undefined){
				$("#HEADMAN").tips({
					side:3,
			        msg:'请选择学校类型',
			        bg:'#AE81FF',
			        time:2
			    });
				this.TYPE = '';
				this.$refs.TYPE.focus();
			return false;
			}*/
		
		/* 	if(this.DISTRICT == '' || this.DISTRICT == undefined){
				$("#DISTRICT").tips({
					side:3,
					msg:'请选择学区',
					bg:'#AE81FF',
					time:2
				});
				this.DISTRICT = '';
				this.$refs.DISTRICT.focus();
			return false;
			} */
			if(this.pd.LICENCE == '' || this.pd.LICENCE == undefined){
				$("#LICENCE").tips({
					side:3,
					msg:'请输入许可证号',
					bg:'#AE81FF',
					time:2
				});
				this.pd.LICENCE = '';
				this.$refs.LICENCE.focus();
			return false;
			}
		/* 	if(this.pd.BIANZHI == '' || this.pd.BIANZHI == undefined){
				$("#BIANZHI").tips({
					side:3,
					msg:'请输入机构编制',
					bg:'#AE81FF',
					time:2
				});
				this.pd.BIANZHI = '';
				this.$refs.BIANZHI.focus();
			return false;
			} */
			var myreg = /^(((13[0-9]{1})|159)+\d{8})$/;
			if(this.pd.TEL == '' || this.pd.TEL == undefined){
				$("#TEL").tips({
					side:3,
			        msg:'输入联系方式',
			        bg:'#AE81FF',
			        time:3
			    });
				this.pd.TEL = '';
				this.$refs.TEL.focus();
				return false;
			}else if(this.pd.TEL.length != 11 && !myreg.test(this.pd.TEL)){
				$("#TEL").tips({
					side:3,
			        msg:'联系方式格式不正确',
			        bg:'#AE81FF',
			        time:3
			    });
				this.$refs.TEL.focus();
				return false;
			}
			
			if(this.pd.INTRO == '' || this.pd.INTRO == undefined){
				$("#INTRO").tips({
					side:3,
		            msg:'请输入简介',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.INTRO = '';
				this.$refs.INTRO.focus();
			return false;
			}
		
		
			if(this.pd.ADDRESS == '' || this.pd.ADDRESS == undefined){
				$("#ADDRESS").tips({
					side:3,
		            msg:'请输入地址',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.ADDRESS = '';
				this.$refs.ADDRESS.focus();
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
					url: httpurl+'organization/'+this.msg,
			    	data: {
					ORGANIZATION_ID:this.ORGANIZATION_ID,
				    NAME:this.pd.NAME,
				    NAME_EN:this.pd.NAME_EN,
				    PARENT_ID:this.PARENT_ID,
				    // HEADMAN:this.pd.HEADMAN,
					TYPE:this.TYPE,
					// HEADMAN_PHONE:this.pd.HEADMAN_PHONE,
					DISTRICT:this.DISTRICT,  //学区
				    LICENCE:this.pd.LICENCE,
				    TEL:this.pd.TEL,
				    INTRO:this.pd.INTRO,
				    ADDRESS:this.pd.ADDRESS,
				    CREATE_TIME:this.pd.CREATE_TIME,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        	    vm.goback(vm.PARENT_ID,'ok');
                        	},1000);
                        }else if ("exception" == data.result){
                        	showException("民办学校机构添加",data.exception);//显示异常
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
    	
    	//根据主键ID获取数据  修改时
    	getData: function(){
    		//发送 post 请求
			
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'organization/goEdit',
		    	data: {ORGANIZATION_ID:this.ORGANIZATION_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
						 vm.PARENT_ID = data.pd.PARENT_ID ;
						 vm.pds = data.pds;  //父级信息
						 vm.pd = data.pd;    //当前修改 信息				 			
						 // vm.PARENT_ID=data.PARENT_ID;
						 vm.DISTRICT=data.pd.DISTRICT;
						 vm.TYPE=data.pd.TYPE;
						$("#CREATE_TIME").val(data.pd.CREATE_TIME);
                     }else if ("exception" == data.result){
                     	showException("民办学校机构",data.exception);	//显示异常
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
		        url: httpurl+'organization/toAdd',
		        data: {
		            ORGANIZATION_ID:this.ORGANIZATION_ID,
		            tm:new Date().getTime()
		        },
		        dataType:"json",
		        success: function(data){
		            if("success" == data.result){
		                vm.pds = data.pds;
		                vm.PARENT_ID = vm.ORGANIZATION_ID;
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
		//跳转
		goback: function (id,FMSG){
		    window.location.href="organization_list.html?oId="+this.PARENT_ID+"&FMSG="+FMSG;
		},
    	//获取数据字典数据
		getDict: function (){
			//学区类型
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'DISTRICT',tm:new Date().getTime()},//类型
				dataType:'json',
				success: function(data){
					$("#DISTRICT").html('<option value="">请选择学区</option>');
					 $.each(data.list, function(i, dvar){
						 if(dvar.BIANMA==vm.DISTRICT){  
							  $("#DISTRICT").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
						 }else{
						 $("#DISTRICT").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
						 }
						/*if(dvar.DICTIONARIES_ID==vm.ORGANIZATION_ID&&vm.msg=='add'){
							vm.DISTRICT=vm.ORGANIZATION_ID;
							vm.DISTRICT_NAME=dvar.NAME;
						}else if(vm.msg=='edit'&&dvar.DICTIONARIES_ID==vm.DISTRICT){
							vm.DISTRICT_NAME=dvar.NAME;
						}*/
					 });
				}
			});
			//机构类型  
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl+'dictionaries/getLevelsByNameEn',
				data: {NAME_EN:'ORGANIZATION_TYPE',tm:new Date().getTime()},//类型
				dataType:'json',
				success: function(data){
					//$("#TYPE").html('<option value="">请选择机构类型</option>');
					 $.each(data.list, function(i, dvar){
						 /*if(dvar.BIANMA==vm.TYPE){  
							  $("#TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
						 }else{
						 $("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
						 }*/
						 if(dvar.DICTIONARIES_ID==vm.ORGANIZATION_ID&&vm.msg=='add'){
								vm.TYPE=dvar.BIANMA;
								//vm.TYPE_ID=vm.ORGANIZATION_ID;
								vm.TYPE_NAME=dvar.NAME;
								//$("#TYPE").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							}else if(vm.msg=='edit'&&dvar.BIANMA==vm.TYPE){
							     vm.TYPE_NAME=dvar.NAME;
								 //$("#TYPE").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
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