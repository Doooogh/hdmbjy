/**
 * @FH Admin  
 * QQ:313596790
 * 官网：www.fhadmin.org
*/	

var httpurl = httpurlTools;

var arField = new Array();
var index = 0;
var varData = '';	//字段参数总集合

var vm = new Vue({
	el: '#app',
	
	data:{
		CREATECODE_ID: '',		//主键ID
		TITLE: '',				//模块说明
		FHTYPE: 'single',		//类型(单表、主从表、树形表)
		PACKAGENAME: '',		//上级包名
		faobjectid: '',			//主表ID
		OBJECTNAME: '',			//处理类
		tabletop:	'',			//表前缀
		varList: [],			//主表结构的列表
		msg: false,				//true为新增(或者反向进入), flase为修改
		loading:false			//加载状态
    },
	
	methods: {
		
		//初始执行
        init() {
        	var FID = this.getUrlKey('CREATECODE_ID');	//链接参数
        	if(null != FID && 'add' != FID){
        		this.CREATECODE_ID = FID;
        	}else{
        		this.CREATECODE_ID = 'add';
        		this.msg = true;
        	}
        	var FR = this.getUrlKey('fromRecreate');	//反向进入
        	if(null != FR){
        		var table = this.getUrlKey('table');				//表名
        		var dbtype = this.getUrlKey('dbtype');				//数据库类型
        		var dbAddress = this.getUrlKey('dbAddress');		//数据库地址
        		var dbport = this.getUrlKey('dbport');				//端口
        		var username = this.getUrlKey('username');			//用用户名
        		var password = this.getUrlKey('password');			//密码
        		var databaseName = this.getUrlKey('databaseName');	//表名
        		this.getFieldlist(table,dbtype,dbAddress,dbport,username,password,databaseName);					//映射出字段属性
        	}
        	this.getData();
        },
        
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'createCode/goProductCode',
		    	data: {CREATECODE_ID:this.CREATECODE_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	if(!vm.msg){
                    		vm.TITLE = data.pd.TITLE;
                    		if(data.pd.FHTYPE == 'sontable'){
                    			vm.FHTYPE = 'single';
                    		}else{
                    			vm.FHTYPE = data.pd.FHTYPE;
                    		}
                    		vm.PACKAGENAME = data.pd.PACKAGENAME;
                    		vm.OBJECTNAME = data.pd.OBJECTNAME;
                    		vm.reductionFields(data.pd.FIELDLIST+'');
                    		vm.tabletop = (data.pd.TABLENAME+'').split(',fh,')[0];
                    	}else{
                    		vm.tabletop = 'TB_';
                    	}
                     	vm.varList = data.varList;
                     }else if ("exception" == data.result){
                     	showException("代码生成器",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},
    	
    	//反向进入,映射出字段属性
    	getFieldlist: function(table,dbtype,dbAddress,dbport,username,password,databaseName){
    		this.loading = true;
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'recreateCode/getFieldlist',
		    	data: {table:table,dbtype:dbtype,dbAddress:dbAddress,dbport:dbport,username:username,password:password,databaseName:databaseName,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
					 vm.loading = false
                     if("success" == data.result){
                    	vm.reductionFields(data.FIELDLIST);
                     }else if ("exception" == data.result){
                     	showException("代码生成器反向",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},
    	
    	//追加属性列表
    	appendC: function (value){
    		var fieldarray = value.split(',fh,');
    		$("#fields").append(
    			'<tr>'+
    			'<td>'+Number(index+1)+'</td>'+
    			'<td>'+fieldarray[0]+'<input type="hidden" name="field0'+index+'" value="'+fieldarray[0]+'"></td>'+
    			'<td>'+fieldarray[1]+'<input type="hidden" name="field1'+index+'" value="'+fieldarray[1]+'"></td>'+
    			'<td>'+fieldarray[5]+'<input type="hidden" name="field5'+index+'" value="'+fieldarray[5]+'"></td>'+
    			'<td>'+fieldarray[6]+'<input type="hidden" name="field6'+index+'" value="'+fieldarray[6]+'"></td>'+
    			'<td>'+fieldarray[2]+'<input type="hidden" name="field2'+index+'" value="'+fieldarray[2]+'"></td>'+
    			'<td>'+fieldarray[3]+'<input type="hidden" name="field3'+index+'" value="'+fieldarray[3]+'"></td>'+
    			'<td>'+fieldarray[4]+'<input type="hidden" name="field4'+index+'" value="'+fieldarray[4]+'"></td>'+
    			'<td>'+
    				'<input type="hidden" name="field'+index+'" id="zfield'+index+'" value="'+value+'">'+
    				'<a title="编辑" onclick="vm.editField(\''+value+'\',\''+index+'\')" style="cursor:pointer;"><i class="feather icon-edit-2"></i></a></a>&nbsp;'+
    				'<a title="删除" onclick="vm.removeField(\''+index+'\')" style="cursor:pointer;"><i class="feather icon-x"></i></a>'+
    			'</td>'+
    			'</tr>'
    		);
    		index++;
    		$("#zindex").val(index);
    	},
    	
    	//获取参数总集合varData
    	gerVarData: function(){
    		for(var n=0;n<Number($("#zindex").val());n++){
    			varData += $("#zfield"+n).val() + '-FH-';
    		}
    		return varData;
    	},
    	
    	//修改时还原属性列表
    	reductionFields: function (nowarField){
    		var fieldarray = nowarField.split('Q313596790');
    		for(var i=0;i<fieldarray.length;i++){
    			if(fieldarray[i] != ''){
    			this.appendC(fieldarray[i]);
    			arField[i] = fieldarray[i];
    			}
    		}
    	},
    	
    	//生成
    	save: function (){
    		
    		if($("#TITLE").val()==""){
    			$("#TITLE").tips({
    				side:3,
    	            msg:'输入说明',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			$("#TITLE").focus();
    			return false;
    		}
    		if($("#packageName").val()==""){
    			$("#packageName").tips({
    				side:3,
    	            msg:'输入包名',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			$("#packageName").focus();
    			return false;
    		}else{
    		/* 	var pat = new RegExp("^[A-Za-z]+$");
    			if(!pat.test($("#packageName").val())){
    				$("#packageName").tips({
    					side:3,
    		            msg:'只能输入字母',
    		            bg:'#AE81FF',
    		            time:2
    		        });
    				$("#packageName").focus();
    				return false;
    			} */
    		}
    		if($("#objectName").val()==""){
    			$("#objectName").tips({
    				side:3,
    	            msg:'输入类名',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			$("#objectName").focus();
    			return false;
    		}else{
    			var headstr = $("#objectName").val().substring(0,1);
    			var pat = new RegExp("^[a-z0-9]+$");
    			if(pat.test(headstr)){
    				$("#objectName").tips({
    					side:3,
    		            msg:'类名首字母必须为大写字母或下划线',
    		            bg:'#AE81FF',
    		            time:2
    		        });
    				$("#objectName").focus();
    				return false;
    			}
    		}
    		if($("#fields").html() == ''){
    			$("#table_report").tips({
    				side:3,
    	            msg:'请添加属性',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			return false;
    		}
    		swal({
    			title: '',
                text: "确定要生成 吗?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	var strArField = '';
            		for(var i=0;i<arField.length;i++){
            			strArField = strArField + arField[i] + "Q313596790";
            		}
            		
            		var FIELDLIST = strArField+''; 						//属性集合
            		var varDatas = this.gerVarData();					//总参数集合
            		var faobject =  $("#faobject").val();				//主表名	
            		var TITLE = $("#TITLE").val();						//说明	
            		var packageName = $("#packageName").val();			//包名
            		var objectName = $("#objectName").val();			//类名
            		var tabletop = $("#tabletop").val();				//表前缀
            		
            		$("#objectName").val('');
             		$("#fields").html('');
             		$("#showform").hide();
             		$("#jiazai").show();
            		
                    $.ajax({
                    	xhrFields: {
                            withCredentials: true
                        },
        				type: "POST",
        				url: httpurl+'createCode/proCode',
        		    	data: {
        		    		FIELDLIST:FIELDLIST,
        		    		varDatas:varDatas,
        		    		faobject:faobject,
        		    		FHTYPE:this.FHTYPE,
        		    		TITLE:TITLE,
        		    		packageName:packageName,
        		    		objectName:objectName,
        		    		tabletop:tabletop,
        		    		tm:new Date().getTime()},
        				dataType:"json",
        				success: function(data){
                             if("success" == data.result){
                         		window.location.href = httpurl+'createCode/downloadCode';	//去下载
                         		vm.timer(9);
                         		setTimeout("top.Dialog.close()",10000);
                             }else if ("errer" == data.result){
                            	 swal("生成失败!", "检查下硬盘文件写入权限!", "error");
                             }else if ("exception" == data.result){
                             	showException("代码生成器",data.exception);	//显示异常
                             }
                          }
        			})
        			
                }
            });
    	},
    	
    	//倒计时
    	timer: function (intDiff){
    		window.setInterval(function(){
    		$('#second_show').html('<s></s>'+intDiff+'秒');
    		intDiff--;
    		}, 1000);
    	}, 
    	
    	//input启用
    	inpOpen: function (){
    		$("#TITLE").attr("readonly",false);
    		$("#packageName").attr("readonly",false);
    		$("#objectName").attr("readonly",false);
    		$("#tabletop").attr("readonly",false);
    	},
    	
    	//input禁用
    	inpClose: function (){
    		$("#TITLE").attr("readonly",true);
    		$("#packageName").attr("readonly",true); 
    		$("#objectName").attr("readonly",true); 
    		$("#tabletop").attr("readonly",true); 
    	},
    	
    	//清空引用数据字典
    	deldid: function (){
    		$("#dictionariesid").val('');
    	},
    	
    	//保存编辑属性
    	saveD: function (){
    		var dname = $("#dname").val(); 	 		 			//属性名
    		var dtype = $("#dtype").val(); 	 		 			//类型
    		var dbz	  = $("#dbz").val();   	 		 			//备注
    		var isQian = $("#isQian").val(); 		 			//是否前台录入
    		var ddefault = $("#ddefault").val(); 	 			//默认值
    		var msgIndex = $("#msgIndex").val(); 	 			//msgIndex不为空时是修改
    		var flength = $("#flength").val(); 	 				//长度
    		var decimal = $("#decimal").val(); 	 	 			//小数
    		var dictionariesid = $("#dictionariesid").val(); 	//数据字典ID
    		if(dname==""){
    			$("#dname").tips({
    				side:3,
    	            msg:'输入属性名',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			$("#dname").focus();
    			return false;
    		}else{
    			dname = dname.toUpperCase();		//转化为大写
    			if(this.isSame(dname)){
    				var headstr = dname.substring(0,1);
    				var pat = new RegExp("^[0-9]+$");
    				if(pat.test(headstr)){
    					$("#dname").tips({
    						side:3,
    			            msg:'属性名首字母必须为字母或下划线',
    			            bg:'#AE81FF',
    			            time:2
    			        });
    					$("#dname").focus();
    					return false;
    				}
    			}else{
    				if(msgIndex != ''){
    					var hcdname = $("#hcdname").val();
    					if(hcdname != dname){
    						if(!this.isSame(dname)){
    							$("#dname").tips({
    								side:3,
    					            msg:'属性名重复',
    					            bg:'#AE81FF',
    					            time:2
    					        });
    							$("#dname").focus();
    							return false;
    						};
    					};
    				}else{
    					$("#dname").tips({
    						side:3,
    			            msg:'属性名重复',
    			            bg:'#AE81FF',
    			            time:2
    			        });
    					$("#dname").focus();
    					return false;
    				}
    			}
    		}
    		if(dbz==""){
    			$("#dbz").tips({
    				side:3,
    	            msg:'输入备注',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			$("#dbz").focus();
    			return false;
    		}
    		
    		if((0-flength >=0) || flength==""){
    			$("#flength").tips({
    				side:3,
    	            msg:'输入长度',
    	            bg:'#AE81FF',
    	            time:2
    	        });
    			$("#flength").focus();
    			return false;
    		}
    		
    		if('' == decimal) decimal = 0;
    		dbz = dbz == '' ? '无':dbz;
    		ddefault = ddefault == '' ? '无':ddefault;
    		
    		if(dictionariesid != ''){
    			dtype = 'String';
    			flength = '100';
    		}else{
    			dictionariesid = 'null';	//数据字典不引用的时候值为 null
    		}
    		var fields = dname + ',fh,' + dtype + ',fh,' + dbz + ',fh,' + isQian + ',fh,' + ddefault + ',fh,' + flength + ',fh,' + decimal + ',fh,' + dictionariesid;
    		if(msgIndex == ''){
    			this.arrayField(fields);
    		}else{
    			this.editArrayField(fields,msgIndex);
    		}
    		$("#dialog-add").css("display","none");
    	},
    	
    	//选择数据字典
    	selectDid: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag = true;
    		 diag.Title = "数据字典";
    		 diag.URL = '../dictionaries/dictionaries_ztree_windows.html',
    		 diag.Width = 339;
    		 diag.Height = 438;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag.CancelEvent = function(){ //关闭事件
    			 var dictionariesid = diag.innerFrame.contentWindow.document.getElementById('DICTIONARIES_ID').value;
    			 if("" != dictionariesid){
    				$("#dictionariesid").val(dictionariesid); //引入数据字典ID
    			}
    			diag.close();
    		 };
    		 diag.show();
    	},
    	
    	//打开编辑属性(新增)
    	dialog_open: function (){
    		$("#dialog-add").css("display","block");
    		$("#dname").val('');
    		$("#dbz").val('');
    		$("#ddefault").val('');
    		$("#msgIndex").val('');
    		$("#dtype").val('String');
    		$("#isQian").val('是');
    		$("#form-field-radio1").attr("checked",true);
    		$("#form-field-radio1").click();
    		$("#form-field-radio4").attr("checked",true);
    		$("#form-field-radio4").click();
    		$("#flength").val(255);
    		$("#ddefault").attr("disabled",true);
    		$("#dictionariesid").val('');
    	},
    	
    	//打开编辑属性(修改)
    	editField: function (value,msgIndex){
    		$("#dialog-add").css("display","block");
    		var efieldarray = value.split(',fh,');
    		$("#dname").val(efieldarray[0]);			//属性名
    		$("#hcdname").val(efieldarray[0]);			//属性名 备份一份
    		$("#dbz").val(efieldarray[2]);				//备注
    		$("#msgIndex").val(msgIndex);				//数组ID 
    		if(efieldarray[1] == 'String'){				//类型
    			$("#form-field-radio1").attr("checked",true);
    			$("#form-field-radio1").click();
    			$("#dtype").val('String');
    		}else if(efieldarray[1] == 'Integer'){
    			$("#form-field-radio2").attr("checked",true);
    			$("#form-field-radio2").click();
    			$("#dtype").val('Integer');
    		}else if(efieldarray[1] == 'Double'){
    			$("#form-field-radio33").attr("checked",true);
    			$("#form-field-radio33").click();
    			$("#dtype").val('Double');
    		}else{
    			$("#form-field-radio3").attr("checked",true);
    			$("#form-field-radio3").click();
    			$("#dtype").val('Date');
    		}
    		if(efieldarray[3] == '是'){
    			$("#form-field-radio4").attr("checked",true);
    			$("#form-field-radio4").click();
    			$("#isQian").val('是');
    		}else{
    			$("#form-field-radio5").attr("checked",true);
    			$("#form-field-radio5").click();
    			$("#isQian").val('否');
    		}
    		$("#flength").val(efieldarray[5]);				//长度
    		$("#decimal").val(efieldarray[6]);				//小数点
    		if(efieldarray[7] == 'null'){
    			$("#dictionariesid").val('');				//数据字典ID
    		}else{
    			$("#dictionariesid").val(efieldarray[7]);	//数据字典ID
    		}
    		$("#ddefault").val(efieldarray[4]);				//默认值
    	},
    	
    	//关闭编辑属性
    	cancel_pl: function (){
    		$("#dialog-add").css("display","none");
    	},
    	
    	//赋值类型
    	setType: function (value){
    		$("#dtype").val(value);
    		$("#decimal").val('');
    		$("#decimal").attr("disabled",true);
    		$("#flength").attr("readonly",false);
    		 if(value == 'Integer'){
    			if(Number($("#flength").val())-0>11){
    				$("#flength").val(11);
    			}
    		}else if(value == 'Date'){
    			$("#flength").val(32);
    			$("#flength").attr("readonly",true);
    		}else if(value == 'Double'){
    			if(Number($("#flength").val())-0>11){
    				$("#flength").val(11);
    			}
    			$("#decimal").val(2);
    			$("#decimal").attr("disabled",false);
    		}else{
    			$("#flength").val(255);
    		}
    	},
    	
    	//检测长度
    	inspect: function (){
    		var dtype = $("#dtype").val();
    		if(dtype == 'Integer'){
    			if(Number($("#flength").val())-0>11){
    				$("#flength").val(11);
    				$("#flength").tips({
        				side:3,
        	            msg:'长度超限',
        	            bg:'#AE81FF',
        	            time:2
        	        });
    			}
    		}else if(dtype == 'Double'){
    			if(Number($("#flength").val())-0>11){
    				$("#flength").val(11);
    				$("#flength").tips({
        				side:3,
        	            msg:'长度超限',
        	            bg:'#AE81FF',
        	            time:2
        	        });
    			}
    		}else{
    			if(Number($("#flength").val())-0>4000){
    				$("#flength").val(4000);
    				$("#flength").tips({
        				side:3,
        	            msg:'长度超限',
        	            bg:'#AE81FF',
        	            time:2
        	        });
    			}
    		}
    	},
    	
    	//赋值是否前台录入
    	isQian: function (value){
    		if(value == '是'){
    			$("#isQian").val('是');
    			$("#ddefault").val("无");
    			$("#ddefault").attr("disabled",true);
    		}else{
    			$("#isQian").val('否');
    			$("#ddefault").val('');
    			$("#ddefault").attr("disabled",false);
    		}
    	},
    	
    	//保存属性后往数组添加元素
    	arrayField: function (value){
    		arField[index] = value;
    		this.appendC(value);
    	},
    	
    	//修改属性
    	editArrayField: function (value,msgIndex){
    		arField[msgIndex] = value;
    		index = 0;
    		$("#fields").html('');
    		for(var i=0;i<arField.length;i++){
    			this.appendC(arField[i]);
    		}
    	},
    	
    	//删除数组添加元素并重组列表
    	removeField: function (value){
    		index = 0;
    		$("#fields").html('');
    		arField.splice(value,1);
    		for(var i=0;i<arField.length;i++){
    			this.appendC(arField[i]);
    		}
    	},
    	
    	//判断属性名是否重复
    	isSame: function (value){
    		for(var i=0;i<arField.length;i++){
    			var array0 = arField[i].split(',fh,')[0];
    			if(array0 == value){
    				return false;
    			}
    		}
    		return true;
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


//选择类型
function selectType(value){
	if("sontable" == value){
		$("#faobjectid").removeAttr("disabled");
		$("#faobjectid").css("background","white");
	}else{
		$("#faobjectid").attr("disabled","disabled");  
		$("#faobjectid").css("background","#F5F5F5");
		$("#faobjectid").val("");
		vm.inpOpen();
	};
}

//选择主表
function selectFa (CREATECODE_ID){
	if("" != CREATECODE_ID){
		vm.inpClose();
		$.ajax({
			xhrFields: {
                withCredentials: true
            },
			type: "POST",
			url: httpurl+'/createCode/findById',
	    	data: {CREATECODE_ID:CREATECODE_ID,tm:new Date().getTime()},
			dataType:'json',
			success: function(data){
				$("#TITLE").val(data.pd.TITLE + '(明细)');
				$("#packageName").val(data.pd.PACKAGENAME);
				$("#objectName").val(data.pd.OBJECTNAME+"Mx");
				var tb = data.pd.TABLENAME.split(",fh,");
				$("#tabletop").val(tb[0]);
				$("#faobject").val(data.pd.OBJECTNAME);
			}
		});
	}else{
		vm.inpOpen();
	}
}
	
	


	
	
/**
 * @FH Admin  
 * QQ: 3 1 3 5 96 790
 * 官网：www.fhadmin.org
*/	