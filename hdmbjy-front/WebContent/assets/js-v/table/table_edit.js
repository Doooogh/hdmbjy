var form;
var vm = new Vue({
	el: '#app',
	
	data:{
		TABLE_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		firstUUID:'',  //第一个框中的uuid
		options:[],  //反馈表结构列表
    },
	
	methods: {
		
        //初始执行
        init() {
			this.firstUUID=this.getUUID();
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.TABLE_ID = FID;
        		this.getData();
        	}
        	setTimeout(function(){
            },200);
        },
        
        //去保存
    	save: function (){
    	
		
			if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
				$("#TITLE").tips({
					side:3,
		            msg:'请输入反馈表标题',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.TITLE = '';
				this.$refs.TITLE.focus();
			return false;
			}
			vm.getTableOptions();
			if( this.options == undefined||this.options.length == 0 ){
				$("#options_add").tips({
					side:3,
			        msg:'请编辑反馈表内容',
			        bg:'#AE81FF',
			        time:2
			    });
				this.options = [];
				this.$refs.options_add.focus();
			return false;
			}
			var optionJson=JSON.stringify(vm.options);  //将数组转化为json串
    		 
    		$("#showform").hide();
    		$("#jiazai").show();
		
    		
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'table/'+this.msg,
			    	data: {
						TABLE_ID:this.TABLE_ID,
						TITLE:this.pd.TITLE,
						options:optionJson, // 回执单项目列表   需要树型结构  子结构名字为childOption  是一个数组
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
                        	showException("通知反馈表",data.exception);//显示异常
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
    	
		
		//获取反馈表结构内容
		getTableOptions:function(){
			var optionsGroup =$(".form-body").clone().find(".form-group");
			$.each(optionsGroup,function(i,optionEle){
				var option={};
				var pid=Math.uuid();
				var o_name1=$(optionEle).find(".control-label").text();
				var o_name=o_name1.substring(0,o_name1.length-1);  //要保存的option 名
				var o_type=$(optionEle).attr("c_type");  //获取类型  
				if(o_type!="head"){
					if(o_type=="radio"){
						var radios=$(optionEle).find("input");
						var radioArr =[];
						$.each(radios,function(i,radio){
							var cOption={};
							var id=Math.uuid();
							var name=$(radio).val();
							var type="RADIO";
							cOption.OPTION_ID=id;
							cOption.PARENT_ID=pid;
							cOption.NAME=name;
							cOption.TYPE=type;
							cOption.PINYIN=pinyin.getFullChars(name);
							radioArr.push(cOption);
						});
						option.childOption=JSON.stringify(JSON.stringify(radioArr));
					}else if(o_type=="checkbox"){
						var checkboxs=$(optionEle).find("input");
						var checkboxsArr=[];
						$.each(checkboxs,function(i,chcekbox){
							var cOption={};
							var id=Math.uuid();
							var name=$(chcekbox).attr("name");
							var type="CHECKBOX";
							cOption.OPTION_ID=id;
							cOption.PARENT_ID=pid;
							cOption.NAME=name;
							cOption.TYPE=type;
							cOption.PINYIN=pinyin.getFullChars(name);
							checkboxsArr.push(cOption);
						});
						option.childOption=JSON.stringify(JSON.stringify(checkboxsArr));
					}
					option.OPTION_ID=pid;
					option.NAME=o_name;
					option.TYPE=o_type.toUpperCase()
					option.PINYIN=pinyin.getFullChars(o_name);
					option.PARENT_ID="0";
					console.log(option);
					vm.options.push(option);
				}
			});
			console.log(vm.options);
			
		},
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'table/goEdit',
		    	data: {TABLE_ID:this.TABLE_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("通知反馈表",data.exception);	//显示异常
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
			    data: {NAME_EN:'INFORM_OUPLE_BACK',tm:new Date().getTime()},//请假类型
			    dataType:'json',
			    success: function(data){
					vm.options=data.list;
					$(".option_type").html('<option value="">选择类型</option>');
					$.each(vm.options, function(i, dvar){
					    $(".option_type").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
					});
					form.render();
			    }
			});
		},
		//获取uuid
		getUUID:function(){
			return Math.uuid();
		},
    	
    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
		test:function(){
			alert("123");
		}
        
	},
	
	mounted(){
        this.init();
    },
	watch:{
		/* options:function(oldValue,newValue){
			console.log(oldValue);
			console.log(newValue);
			$(".option_type").html('<option value="">通知类型</option>');
			$.each(vm.options, function(i, dvar){
			    $(".option_type").append("<option value="+dvar.NAME+">"+dvar.NAME+"</option>");
			});
		} */
	}
})

/* layui.use('form', function(){
   form = layui.form;
  
  //监听提交
  form.on('submit(formDemo)', function(data){
    layer.msg(JSON.stringify(data.field));
    return false;
  });
  
 form.on('select()', function(data){
   console.log(data.elem); //得到select原始DOM对象
    console.log(data.value); //得到被选中的值
    console.log(data.othis); //得到美化后的DOM对象
	var type=data.value;   //选择的选项类型
	var firstUUID=$(data.elem).attr("firstUUID");
	if(type=="RADIO"){
		console.log($(".all_add_radio"+firstUUID));
		$(".all_add_radio"+firstUUID).addClass("show_all").removeClass("hidden_all");
		form.render();
	}
	
	if(type=="CHECKBOX"){
		console.log($(".all_add_checkbox"+firstUUID));
		$(".all_add_checkbox"+firstUUID).addClass("show_all").removeClass("hidden_all");
		form.render();
	}
	
  }); 
});*/
				