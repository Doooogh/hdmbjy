var vm=new Vue({
    el:'#main',
    data:{
        TID:'',  //回执单内容id
		TDID:'',   //保存回执单内容项数据id
        pd:[],
        varList:[],
		userList:[],
		isUser:true,
		hasInformTable:true,  //是否有回执单  默认没有
		// informTable:[],  //回执单信息
		informTable:[],
		tableDataInfo:[],  //反馈表内容项数据
		options:[],
		isPreviewInformTable:false,  //是否为预览
		},
	methods:{
		init(){
		    var tId=this.getUrlKey("TABLE_ID");
		    var tdId=this.getUrlKey("TABLEDATA_ID");
		    if(tId!=null&&tId!=''&&tId!=undefined){
		        this.TID=tId;
		        this.TDID=tdId;
				this.getInformTableInfo();
		    }
			},
		//获取回执单内容项
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
						}
					}else if ("exception" == data.result){
						showException("获取回执单内容",data.exception);		//显示异常
					}
				}
			})
		},
		
		//获取回执单内具体内容信息
		getInformTableInfo:function(){
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl+'inform/getInformTableInfo',
				data: {
					TABLE_ID:this.TID,
					TABLEDATA_ID:this.TDID,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
					if("success" == data.result){
						vm.informTable=data.informTable;
						vm.options=data.options;
						var tableDataStr=data.tableData;
						if(null!=tableDataStr&&undefined!=tableDataStr&&''!=tableDataStr){
							vm.tableDataInfo=JSON.parse(tableDataStr);
							setTimeout(function(){
							   $.each(vm.tableDataInfo,function(i,tData){
							   	var id=tData.id;
							   	var pinyin=tData.pinyin;
							   	var name=tData.name;
							   	var value=tData.value;
							   	var ele=$("#"+id);
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
						}else{
							vm.isPreviewInformTable=true;
						}
						
						
						
					}else if ("exception" == data.result){
						showException("获取回执单内容",data.exception);		//显示异常
					}
				}
			});
		},
		getUrlKey: function (name) {
		    return decodeURIComponent(
		        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
		},
	},
	mounted() {
	        this.init();
	    },
	
	});