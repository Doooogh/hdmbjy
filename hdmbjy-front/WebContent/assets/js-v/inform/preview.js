
var vm=new Vue({
    el:'#main',
    data:{
        ID:'',
        OPTABLE_ID:'',
        ATTACHMENT:'',
        pd:[],
        varList:[],
		userList:[],
		isUser:true,
		hasInformTable:true,  //是否有回执单  默认没有
		informTable:[],  //回执单信息
		hasTableDataInfo:false,  //是否已经填写过回执单信息
		tableDataInfo:[],  //用户填报的回执单信息数据
		options:[], 	//回执单选项信息
    },
    methods:{
        init(){
            var aId=this.getUrlKey("INFORM_ID");
            var tid = this.getUrlKey("TABLE_ID");
            if(aId!=null&&aId!=''&&aId!=undefined){
                this.ID=aId;
                this.OPTABLE_ID = tid;
                this.getData();
				this.initTable();
				this.getInformTable();
				
            }
			
			//先查看该通知有无 回执表 （通过table_table 表查找）
			//如果有   
				//通过inform_id和用户id 查找
			//如果没有
				
        },
        getData:function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'inform/getById',
                data: {
                    ID:this.ID,
                    tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                      vm.pd=data.pd;
					  var reg=new RegExp("<br>","g");
					  var regSpace=new RegExp("&nbsp;","g");
					  vm.pd.CONTENT = vm.pd.CONTENT.replace(reg,"\n");
					  vm.pd.CONTENT = vm.pd.CONTENT.replace(regSpace," ");
					  
                      vm.varList=data.varList;
					  vm.isUser=data.isUser;
                    }else if ("exception" == data.result){
                        showException("通知内容查看",data.exception);		//显示异常
                    }
                }
            })
        },
       //导出excel
		goExcel: function (){
			
			swal({
               	title: '',
                text: '确定要导出到excel吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	window.location.href = httpurl+'table/excel?ID='+ this.ID+"&TABLE_ID="+this.OPTABLE_ID;            	
                }
            });
		},
        downloadAtt:function(id,url){
            window.location.href=httpurl+"inform/download?ID="+id+"&URL="+url;
        },
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
		//获取回执单内容
		getInformTable:function(){
			$.ajax({
			    xhrFields: {
			        withCredentials: true
			    },
			    type: "POST",
			    url: httpurl+'inform/getInformTable',
				data: {
			        ID:this.ID,
			        tm:new Date().getTime()
					},
			    dataType:"json",
			    success: function(data){
			        if("success" == data.result){
						if(data.hasInformTable){
							vm.hasInformTable=true;
							vm.informTable=data.informTable;
							vm.options=data.options;
							if(data.hasTableDataInfo){
								vm.hasTableDataInfo=true;
								var tableDataInfoStr=data.tableDataInfo;
								vm.tableDataInfo=JSON.parse(tableDataInfoStr);
								setTimeout(function(){
									 
									//遍历回显数据
									$.each(vm.tableDataInfo,function(i,tData){
										var id=tData.id;
										var pinyin=tData.pinyin;
										var name=tData.name;
										var value=tData.value;
										var ele=$("#"+id);
										console.log(ele);
										var oType=$("#"+id).attr("c_type");
										
										if(oType=="INPUT"){
											$(ele).text(value);
											$(ele).attr("contentEditable",false);
										}else if(oType=="RADIO"){
											var radios=$(ele).find(".option_value");  //获取radio 数组
											$.each(radios,function(i,radio){
												$(radio).attr("disabled","disabled");
												if(value==$(radio).attr("id")){
													$(radio).attr("checked",true);
												}
											});
										}else if(oType=="CHECKBOX"){
											var checkboxs=$(ele).find(".option_value");  //获取radio 数组
											var checkbox_values=value.split(",");
											$.each(checkboxs,function(i,checkbox){
												$(checkbox).attr("disabled","disabled");
												$.each(checkbox_values,function(i,c_value){
													if($(checkbox).attr("id")==c_value){
														$(checkbox).attr("checked",true);
													}
												});
											});
										}else if(oType=="TEXTAREA"){
											$(ele).text(value);
											$(ele).attr("contentEditable",false);
										}
									});
								},200);
								
								
								
							}
						}
			        }else if ("exception" == data.result){
			            showException("获取回执单内容",data.exception);		//显示异常
			        }
			    }
			})
		},
		//提交
		submitInformTable:function(){
			var tableValues;
			var tableOptions=$(".table_options");
			var tableOptionsValue=[];
			$.each(tableOptions,function(i,ele){
				var tableOptionValue={
					id:'',
					pinyin:'',
					name:'',
					value:'',
				}
				var optionName=$(ele).find(".option_name").text();
				var optionValue;
				var cType=$(ele).find(".option_type").attr("c_type");
				var cName=$(ele).find(".option_type").attr("c_name");
				if(cType=="INPUT"){
					optionValue=$(ele).find(".option_value").text();
				}else if(cType=="RADIO"){
					optionValue=$("input[name="+cName+"]:checked").val();
				}else if(cType=="CHECKBOX"){
					var op=$("input[name="+cName+"]:checked");
					optionValue="";
					$.each(op,function(i,el){
						optionValue+=($(el).val()+",");
					});
					if(optionValue!=""){
						optionValue=optionValue.substring(0,optionValue.length-1)
					}
				}else if(cType=="TEXTAREA"){
					optionValue=$(ele).find(".option_value").text();
				}
				tableOptionValue.id=cName;
				tableOptionValue.pinyin=cName;
				tableOptionValue.name=optionName;
				tableOptionValue.value=optionValue;
				tableOptionsValue.push(tableOptionValue);
				tableValues=JSON.stringify(tableOptionsValue)
			});
			
			$.ajax({
			    xhrFields: {
			        withCredentials: true
			    },
			    type: "POST",
			    url: httpurl+'tabledata/add',
				data: {
			        TABLE_ID:vm.informTable.TABLE_ID,
					VALUE:tableValues,
					INFORM_ID:this.ID,  //通知id
			        tm:new Date().getTime()
					},
			    dataType:"json",
			    success: function(data){
					 
			        if("success" == data.result){
						vm.hasTableDataInfo=true;
						var tableOptions=$(".table_options");
						/* $.each(tableOptions,function(i,ele){
							var cType=$(ele).find(".option_type").attr("c_type");
							if(cType=="INPUT"){
								optionValue=$(".option_value").text();
							}else if(cType=="RADIO"){
								optionValue=$("input[name="+cName+"]:checked").val();
							}else if(cType=="CHECKBOX"){
								var op=$("input[name="+cName+"]:checked");
								optionValue="";
								$.each(op,function(i,el){
									optionValue+=($(el).val()+",");
								});
								if(optionValue!=""){
									optionValue=optionValue.substring(0,optionValue.length-1)
								}
							}else if(cType=="TEXTAREA"){
								optionValue=$(".option_value").text();
							}
						}); */
						swal("", "保存成功", "success");
						
			        }else if ("exception" == data.result){
			            showException("获取回执单内容",data.exception);		//显示异常
			        }
			    }
			})
			
			
		},
	
		initTable:function(){
			$.ajax({
			    xhrFields: {
			        withCredentials: true
			    },
			    type: "POST",
			    url: httpurl+'inform/findInformUser',
			    data: {
			        ID:this.ID,
			        tm:new Date().getTime()
					},
			    dataType:"json",
			    success: function(data){
			        if("success" == data.result){
			          vm.userList=data.users;
					  $('#exampleTable')
					         .bootstrapTable(
					             {
									method: 'get', // 服务器数据的请求方式 get or post
									iconSize: 'outline',
									striped: true, // 设置为true会有隔行变色效果
									dataType: "json", // 服务器返回的数据类型
									singleSelect: false, // 设置为true将禁止多选
									pageSize: 5, // 如果设置了分页，每页数据条数
									pageNumber: 1, // 如果设置了分布，首页页码
									sortable: true,
									pagination: true,
									fixedColumns: true,
									fixedNumber: 2,
									showLoading:false,
									sidePagination: "client", // 设置在哪里进行分页，可选值为"client" 或者 "server",
									data:vm.userList,
									responseHandler: function (data) {
										return data;
									},
									columns: 
									[
										{
											field: 'USER_ID',
											title: '序号',
											formatter: function (value, row, index) {
												return index+1;
											}
										},
										{
											field: 'NAME',
											title: '用户名',
											formatter: function (value, row, index) {
												return "<span style='color:black'>"+value+"</span>";
											}
										},
										{
											field: 'READ_DATE',
											title: '查看时间',
											formatter: function (value, row, index) {
												if(null==value||undefined==value){
													return "暂未查看";
												}
												return "<span style='color:black'>"+value+"</span>";
											}
										},
										{
											field: 'TABLE_ID',
											title: '回执单id',
											hidden:true
										},
										{
											field: 'TABLEDATA_ID',
											title: '回执单存储id',
											hidden:true
										},
										{
											field: 'USER_ID',
											title: '查看回执',
											formatter: function (value, row, index) {
												if(null==row.TABLEDATA_ID||undefined==row.TABLEDATA_ID){
													// return "<button  type='button'  class='layui-btn layui-btn-disabled layui-btn-sm' onclick='seeInformTable("+row.TABLEDATA_ID+","+row.TABLE_ID+")'>查看回执</button>";
													return '<button class="layui-btn layui-btn-disabled layui-btn-sm" href="###"  disabled="disabled" onclick="seeInformTable(\''
													                                + row.TABLEDATA_ID+ '\',\''+row.TABLE_ID
													                                + '\')">查看回执</button> '
												}
												// return "<button  type='button'  class='layui-btn layui-btn-sm' onclick='seeInformTable("+row.TABLEDATA_ID+","+row.TABLE_ID+")'>查看回执</button>";
												return '<button class="layui-btn layui-btn-sm" href="###"   onclick="seeInformTable(\''
													                                + row.TABLEDATA_ID+ '\',\''+row.TABLE_ID
													                                + '\')">查看回执</button> '
											}
										},
										{
											field: 'READ',
											title: '状态',
											formatter: function (value, row, index) {
												if(value=='0'){
													return "<span style='font-weight:bold'>未查看</span>";
												}else{
													return "<span >已查看</span>";
												}
											}
										},
									],
									data:vm.userList
					  								
					             });
								 $('#exampleTable').bootstrapTable('hideColumn', 'TABLE_ID');
								 $('#exampleTable').bootstrapTable('hideColumn', 'TABLEDATA_ID');
								 $("#exampleTable").bootstrapTable('hideLoading');
			        }else if ("exception" == data.result){
			            showException("按钮权限",data.exception);		//显示异常
			        }
			    }
			});

		}
    },
    mounted() {
        this.init();
    }

});

function seeInformTable(TABLEDATA_ID,TABLE_ID){
	var diag = new top.Dialog();
	diag.Drag=true;
	diag.Title ="回执单预览";
	diag.URL = '../../inform/inform/informtable.html?TABLE_ID='+TABLE_ID+'&TABLEDATA_ID='+TABLEDATA_ID;
	diag.Width = 1000;
	diag.Height = 600;
	diag.Modal = true;				//有无遮罩窗口
	diag. ShowMaxButton = true;	//最大化按钮
	diag.ShowMinButton = true;		//最小化按钮
	diag.CancelEvent = function(){ //关闭事件
	 diag.close();
	};
	diag.show();
}
