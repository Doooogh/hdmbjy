
var vm = new Vue({
	el: '#app',
	data:{
        SELFEXAMINATION_ID: '',	//主键ID
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
        		this.SELFEXAMINATION_ID = FDID;
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
 			vm.getValue();
			vm.SUB_STATUS=status;
			if(status==0){
				
            if(this.pd.POLICY_A1 == '' || this.pd.POLICY_A1 == undefined){
                    $("#POLICY_A1").tips({
                        side:3,
                        msg:'请输入遵守法律、法规和国家政策的情况',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.POLICY_A1 = '';
                    this.$refs.POLICY_A1.focus();
                return false;
             }
            if(this.pd.POLICY_A2 == '' || this.pd.POLICY_A2 == undefined){
            	$("#POLICY_A2").tips({
            		side:3,
            		msg:'请输入遵守法律、法规和国家政策的情况',
            		bg:'#AE81FF',
            		time:2
            	});
            	this.pd.POLICY_A2 = '';
            	this.$refs.POLICY_A2.focus();
            	return false;
            }
            if(this.pd.POLICY_A3 == '' || this.pd.POLICY_A3 == undefined){
            	$("#POLICY_A3").tips({
            		side:3,
            		msg:'请输入遵守法律、法规和国家政策的情况',
            		bg:'#AE81FF',
            		time:2
            	});
            	this.pd.POLICY_A3 = '';
            	this.$refs.POLICY_A3.focus();
            	return false;
            }
            if(this.pd.POLICY_A4 == '' || this.pd.POLICY_A4 == undefined){
            	$("#POLICY_A4").tips({
            		side:3,
            		msg:'请输入遵守法律、法规和国家政策的情况',
            		bg:'#AE81FF',
            		time:2
            	});
            	this.pd.POLICY_A4 = '';
            	this.$refs.POLICY_A4.focus();
            	return false;
            }
            if(this.pd.POLICY_A5 == '' || this.pd.POLICY_A5 == undefined){
            	$("#POLICY_A5").tips({
            		side:3,
            		msg:'请输入遵守法律、法规和国家政策的情况',
            		bg:'#AE81FF',
            		time:2
            	});
            	this.pd.POLICY_A5 = '';
            	this.$refs.POLICY_A5.focus();
            	return false;
            }
            if(this.pd.POLICY_A6 == '' || this.pd.POLICY_A6 == undefined){
            	$("#POLICY_A6").tips({
            		side:3,
            		msg:'请输入遵守法律、法规和国家政策的情况',
            		bg:'#AE81FF',
            		time:2
            	});
            	this.pd.POLICY_A6 = '';
            	this.$refs.POLICY_A6.focus();
            	return false;
            }
            
            if(this.pd.POLICY_C1 == '' || this.pd.POLICY_C1 == undefined){
                $("#POLICY_C1").tips({
                    side:3,
                    msg:'请输入遵守法律、法规和国家政策的情况',
                    bg:'#AE81FF',
                    time:2
                });
                this.pd.POLICY_C1 = '';
                this.$refs.POLICY_C1.focus();
            return false;
         }
        if(this.pd.POLICY_C2 == '' || this.pd.POLICY_C2 == undefined){
        	$("#POLICY_C2").tips({
        		side:3,
        		msg:'请输入遵守法律、法规和国家政策的情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.POLICY_C2 = '';
        	this.$refs.POLICY_C2.focus();
        	return false;
        }
        if(this.pd.POLICY_C3 == '' || this.pd.POLICY_C3 == undefined){
        	$("#POLICY_C3").tips({
        		side:3,
        		msg:'请输入遵守法律、法规和国家政策的情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.POLICY_C3 = '';
        	this.$refs.POLICY_C3.focus();
        	return false;
        }
        if(this.pd.POLICY_C4 == '' || this.pd.POLICY_C4 == undefined){
        	$("#POLICY_C4").tips({
        		side:3,
        		msg:'请输入遵守法律、法规和国家政策的情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.POLICY_C4 = '';
        	this.$refs.POLICY_C4.focus();
        	return false;
        }
        if(this.pd.POLICY_C5 == '' || this.pd.POLICY_C5 == undefined){
        	$("#POLICY_C5").tips({
        		side:3,
        		msg:'请输入遵守法律、法规和国家政策的情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.POLICY_C5 = '';
        	this.$refs.POLICY_C5.focus();
        	return false;
        }
        if(this.pd.POLICY_C6 == '' || this.pd.POLICY_C6 == undefined){
        	$("#POLICY_C6").tips({
        		side:3,
        		msg:'请输入遵守法律、法规和国家政策的情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.POLICY_C6 = '';
        	this.$refs.POLICY_C6.focus();
        	return false;
        }
        
        if(this.pd.POLICY_B == '' || this.pd.POLICY_B == undefined){
        	$("#POLICY_B").tips({
        		side:3,
        		msg:'请输入遵守法律、法规和国家政策的情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.POLICY_B = '';
        	this.$refs.POLICY_B.focus();
        	return false;
        }
        
        if(this.pd.POLICY_D == '' || this.pd.POLICY_D == undefined){
        	$("#POLICY_D").tips({
        		side:3,
        		msg:'请输入遵守法律、法规和国家政策的情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.POLICY_D = '';
        	this.$refs.POLICY_D.focus();
        	return false;
        }
            
            
            
          if(this.pd.BUILD_A1 == '' || this.pd.BUILD_A1 == undefined){
                   $("#BUILD_A1").tips({
                       side:3,
                       msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
                       bg:'#AE81FF',
                       time:2
                   });
                   this.pd.BUILD_A1 = '';
                   this.$refs.BUILD_A1.focus();
               return false;
           }
        if(this.pd.BUILD_A2 == '' || this.pd.BUILD_A2 == undefined){
        	$("#BUILD_A2").tips({
        		side:3,
        		msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BUILD_A2 = '';
        	this.$refs.BUILD_A2.focus();
        	return false;
        }
        if(this.pd.BUILD_A3 == '' || this.pd.BUILD_A3 == undefined){
        	$("#BUILD_A3").tips({
        		side:3,
        		msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BUILD_A3 = '';
        	this.$refs.BUILD_A3.focus();
        	return false;
        }
        if(this.pd.BUILD_A4 == '' || this.pd.BUILD_A4 == undefined){
        	$("#BUILD_A4").tips({
        		side:3,
        		msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BUILD_A4 = '';
        	this.$refs.BUILD_A4.focus();
        	return false;
        }
        if(this.pd.BUILD_B == '' || this.pd.BUILD_B == undefined){
        	$("#BUILD_B").tips({
        		side:3,
        		msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BUILD_B = '';
        	this.$refs.BUILD_B.focus();
        	return false;
        }
        if(this.pd.BUILD_D == '' || this.pd.BUILD_D == undefined){
        	$("#BUILD_D").tips({
        		side:3,
        		msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BUILD_D = '';
        	this.$refs.BUILD_D.focus();
        	return false;
        }
        if(this.pd.BUILD_C1 == '' || this.pd.BUILD_C1 == undefined){
        	$("#BUILD_C1").tips({
        		side:3,
        		msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BUILD_C1 = '';
        	this.$refs.BUILD_C1.focus();
        	return false;
        }
        if(this.pd.BUILD_C2 == '' || this.pd.BUILD_C2 == undefined){
        	$("#BUILD_C2").tips({
        		side:3,
        		msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BUILD_C2 = '';
        	this.$refs.BUILD_C2.focus();
        	return false;
        }
        if(this.pd.BUILD_C3 == '' || this.pd.BUILD_C3 == undefined){
        	$("#BUILD_C3").tips({
        		side:3,
        		msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BUILD_C3 = '';
        	this.$refs.BUILD_C3.focus();
        	return false;
        }
        if(this.pd.BUILD_C4 == '' || this.pd.BUILD_C4 == undefined){
        	$("#BUILD_C4").tips({
        		side:3,
        		msg:'请输入党团组织建设、和谐校园建设、安全稳定工作情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BUILD_C4 = '';
        	this.$refs.BUILD_C4.focus();
        	return false;
        }
        
          
            if(this.pd.BASIC_A1 == '' || this.pd.BASIC_A1 == undefined){
                    $("#BASIC_A1").tips({
                        side:3,
                        msg:'请输入办学场地、校舍、教育教学设施等办学条件基本情况',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.BASIC_A1 = '';
                    this.$refs.BASIC_A1.focus();
                return false;
             }
        if(this.pd.BASIC_A2 == '' || this.pd.BASIC_A2 == undefined){
        	$("#BASIC_A2").tips({
        		side:3,
        		msg:'请输入办学场地、校舍、教育教学设施等办学条件基本情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BASIC_A2 = '';
        	this.$refs.BASIC_A2.focus();
        	return false;
        }
        if(this.pd.BASIC_A3 == '' || this.pd.BASIC_A3 == undefined){
        	$("#BASIC_A3").tips({
        		side:3,
        		msg:'请输入办学场地、校舍、教育教学设施等办学条件基本情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BASIC_A3 = '';
        	this.$refs.BASIC_A3.focus();
        	return false;
        }
        if(this.pd.BASIC_B == '' || this.pd.BASIC_B == undefined){
        	$("#BASIC_B").tips({
        		side:3,
        		msg:'请输入办学场地、校舍、教育教学设施等办学条件基本情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BASIC_B = '';
        	this.$refs.BASIC_B.focus();
        	return false;
        }
        if(this.pd.BASIC_D == '' || this.pd.BASIC_D == undefined){
        	$("#BASIC_D").tips({
        		side:3,
        		msg:'请输入办学场地、校舍、教育教学设施等办学条件基本情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BASIC_D = '';
        	this.$refs.BASIC_D.focus();
        	return false;
        }
        if(this.pd.BASIC_C1 == '' || this.pd.BASIC_C1 == undefined){
        	$("#BASIC_C1").tips({
        		side:3,
        		msg:'请输入办学场地、校舍、教育教学设施等办学条件基本情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BASIC_C1 = '';
        	this.$refs.BASIC_C1.focus();
        	return false;
        }
        if(this.pd.BASIC_C2 == '' || this.pd.BASIC_C2 == undefined){
        	$("#BASIC_C2").tips({
        		side:3,
        		msg:'请输入办学场地、校舍、教育教学设施等办学条件基本情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BASIC_C2 = '';
        	this.$refs.BASIC_C2.focus();
        	return false;
        }
        if(this.pd.BASIC_C3 == '' || this.pd.BASIC_C3 == undefined){
        	$("#BASIC_C3").tips({
        		side:3,
        		msg:'请输入办学场地、校舍、教育教学设施等办学条件基本情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.BASIC_C3 = '';
        	this.$refs.BASIC_C3.focus();
        	return false;
        }
        
        
        if(this.pd.RULES_A1 == '' || this.pd.RULES_A1 == undefined){
            $("#RULES_A1").tips({
                side:3,
                msg:'请输入按照章程开展教育教学活动情况（6分）',
                bg:'#AE81FF',
                time:2
            });
            this.pd.RULES_A1 = '';
            this.$refs.RULES_A1.focus();
        return false;
        } 
        if(this.pd.RULES_A2 == '' || this.pd.RULES_A2 == undefined){
        	$("#RULES_A2").tips({
        		side:3,
        		msg:'请输入按照章程开展教育教学活动情况（6分）',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.RULES_A2 = '';
        	this.$refs.RULES_A2.focus();
        	return false;
        } 
        if(this.pd.RULES_A3 == '' || this.pd.RULES_A3 == undefined){
        	$("#RULES_A3").tips({
        		side:3,
        		msg:'请输入按照章程开展教育教学活动情况（6分）',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.RULES_A3 = '';
        	this.$refs.RULES_A3.focus();
        	return false;
        } 
            
        if(this.pd.RULES_B == '' || this.pd.RULES_B == undefined){
        	$("#RULES_B").tips({
        		side:3,
        		msg:'请输入按照章程开展教育教学活动情况（6分）',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.RULES_B = '';
        	this.$refs.RULES_B.focus();
        	return false;
        } 
        
        if(this.pd.RULES_D == '' || this.pd.RULES_D == undefined){
        	$("#RULES_D").tips({
        		side:3,
        		msg:'请输入按照章程开展教育教学活动情况（6分）',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.RULES_D = '';
        	this.$refs.RULES_D.focus();
        	return false;
        } 
        
        if(this.pd.RULES_C1 == '' || this.pd.RULES_C1 == undefined){
        	$("#RULES_C1").tips({
        		side:3,
        		msg:'请输入按照章程开展教育教学活动情况（6分）',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.RULES_C1 = '';
        	this.$refs.RULES_C1.focus();
        	return false;
        }     
        if(this.pd.RULES_C2 == '' || this.pd.RULES_C2 == undefined){
        	$("#RULES_C2").tips({
        		side:3,
        		msg:'请输入按照章程开展教育教学活动情况（6分）',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.RULES_C2 = '';
        	this.$refs.RULES_C2.focus();
        	return false;
        }     
        if(this.pd.RULES_C3 == '' || this.pd.RULES_C3 == undefined){
        	$("#RULES_C3").tips({
        		side:3,
        		msg:'请输入按照章程开展教育教学活动情况（6分）',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.RULES_C3 = '';
        	this.$refs.RULES_C3.focus();
        	return false;
        }     
            
           
        if(this.pd.PAPERS_A1 == '' || this.pd.PAPERS_A1 == undefined){
            $("#PAPERS_A1").tips({
                side:3,
                msg:'请输入依法办理各种证件情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PAPERS_A1 = '';
            this.$refs.PAPERS_A1.focus();
        return false;
        }
        if(this.pd.PAPERS_A2 == '' || this.pd.PAPERS_A2 == undefined){
        	$("#PAPERS_A2").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_A2 = '';
        	this.$refs.PAPERS_A2.focus();
        	return false;
        }
        if(this.pd.PAPERS_A3 == '' || this.pd.PAPERS_A3 == undefined){
        	$("#PAPERS_A3").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_A3 = '';
        	this.$refs.PAPERS_A3.focus();
        	return false;
        }
        if(this.pd.PAPERS_A4 == '' || this.pd.PAPERS_A4 == undefined){
        	$("#PAPERS_A4").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_A4 = '';
        	this.$refs.PAPERS_A4.focus();
        	return false;
        }
        if(this.pd.PAPERS_A5 == '' || this.pd.PAPERS_A5 == undefined){
        	$("#PAPERS_A5").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_A5 = '';
        	this.$refs.PAPERS_A5.focus();
        	return false;
        }
        if(this.pd.PAPERS_A6 == '' || this.pd.PAPERS_A6 == undefined){
        	$("#PAPERS_A6").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_A6 = '';
        	this.$refs.PAPERS_A6.focus();
        	return false;
        }

        if(this.pd.PAPERS_C1 == '' || this.pd.PAPERS_C1 == undefined){
        	$("#PAPERS_C1").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_C1 = '';
        	this.$refs.PAPERS_C1.focus();
        	return false;
        }
        if(this.pd.PAPERS_C2 == '' || this.pd.PAPERS_C2 == undefined){
        	$("#PAPERS_C2").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_C2 = '';
        	this.$refs.PAPERS_C2.focus();
        	return false;
        }
        if(this.pd.PAPERS_C3 == '' || this.pd.PAPERS_C3 == undefined){
        	$("#PAPERS_C3").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_C3 = '';
        	this.$refs.PAPERS_C3.focus();
        	return false;
        }
        if(this.pd.PAPERS_C4 == '' || this.pd.PAPERS_C4 == undefined){
        	$("#PAPERS_C4").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_C4 = '';
        	this.$refs.PAPERS_C4.focus();
        	return false;
        }
        if(this.pd.PAPERS_C5 == '' || this.pd.PAPERS_C5 == undefined){
        	$("#PAPERS_C5").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_C5 = '';
        	this.$refs.PAPERS_C5.focus();
        	return false;
        }
        if(this.pd.PAPERS_C6 == '' || this.pd.PAPERS_C6 == undefined){
        	$("#PAPERS_C6").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_C6 = '';
        	this.$refs.PAPERS_C6.focus();
        	return false;
        }
        if(this.pd.PAPERS_B == '' || this.pd.PAPERS_B == undefined){
        	$("#PAPERS_B").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_B = '';
        	this.$refs.PAPERS_B.focus();
        	return false;
        }
        if(this.pd.PAPERS_D == '' || this.pd.PAPERS_D == undefined){
        	$("#PAPERS_D").tips({
        		side:3,
        		msg:'请输入依法办理各种证件情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PAPERS_D = '';
        	this.$refs.PAPERS_D.focus();
        	return false;
        }
        
        if(this.pd.PROCESS_A1 == '' || this.pd.PROCESS_A1 == undefined){
            $("#PROCESS_A1").tips({
                side:3,
                msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROCESS_A1 = '';
            this.$refs.PROCESS_A1.focus();
        return false;
        }
        if(this.pd.PROCESS_A2 == '' || this.pd.PROCESS_A2 == undefined){
            $("#PROCESS_A2").tips({
                side:3,
                msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROCESS_A2 = '';
            this.$refs.PROCESS_A2.focus();
        return false;
        }
        
        if(this.pd.PROCESS_A3 == '' || this.pd.PROCESS_A3 == undefined){
            $("#PROCESS_A3").tips({
                side:3,
                msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROCESS_A3 = '';
            this.$refs.PROCESS_A3.focus();
        return false;
        }
        
        if(this.pd.PROCESS_A4 == '' || this.pd.PROCESS_A4 == undefined){
            $("#PROCESS_A4").tips({
                side:3,
                msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROCESS_A4 = '';
            this.$refs.PROCESS_A4.focus();
        return false;
        }
        
        if(this.pd.PROCESS_C1 == '' || this.pd.PROCESS_C1 == undefined){
            $("#PROCESS_C1").tips({
                side:3,
                msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROCESS_C1 = '';
            this.$refs.PROCESS_C1.focus();
        return false;
        }
        
        if(this.pd.PROCESS_C2 == '' || this.pd.PROCESS_C2 == undefined){
            $("#PROCESS_C2").tips({
                side:3,
                msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROCESS_C2 = '';
            this.$refs.PROCESS_C2.focus();
        return false;
        }
        if(this.pd.PROCESS_C3 == '' || this.pd.PROCESS_C3 == undefined){
        	$("#PROCESS_C3").tips({
        		side:3,
        		msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROCESS_C3 = '';
        	this.$refs.PROCESS_C3.focus();
        	return false;
        }
        
        if(this.pd.PROCESS_C4 == '' || this.pd.PROCESS_C4 == undefined){
        	$("#PROCESS_C4").tips({
        		side:3,
        		msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROCESS_C4 = '';
        	this.$refs.PROCESS_C4.focus();
        	return false;
        }
        if(this.pd.PROCESS_D == '' || this.pd.PROCESS_D == undefined){
        	$("#PROCESS_D").tips({
        		side:3,
        		msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROCESS_D = '';
        	this.$refs.PROCESS_D.focus();
        	return false;
        }
        if(this.pd.PROCESS_B == '' || this.pd.PROCESS_B == undefined){
        	$("#PROCESS_B").tips({
        		side:3,
        		msg:'请输入依法进行审批、核准、备案、公告等事项的手续履行情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROCESS_B = '';
        	this.$refs.PROCESS_B.focus();
        	return false;
        }
        
        if(this.pd.PROVIDE_A1 == '' || this.pd.PROVIDE_A1 == undefined){
            $("#PROVIDE_A1").tips({
                side:3,
                msg:'请输入内部管理机构设置及人员配备情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROVIDE_A1 = '';
            this.$refs.PROVIDE_A1.focus();
        return false;
        }
        
        
        if(this.pd.PROVIDE_A2 == '' || this.pd.PROVIDE_A2 == undefined){
            $("#PROVIDE_A2").tips({
                side:3,
                msg:'请输入内部管理机构设置及人员配备情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROVIDE_A2 = '';
            this.$refs.PROVIDE_A2.focus();
        return false;
        }
        
        
        if(this.pd.PROVIDE_A3 == '' || this.pd.PROVIDE_A3 == undefined){
            $("#PROVIDE_A3").tips({
                side:3,
                msg:'请输入内部管理机构设置及人员配备情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROVIDE_A3 = '';
            this.$refs.PROVIDE_A3.focus();
        return false;
        }
        
        if(this.pd.PROVIDE_A4 == '' || this.pd.PROVIDE_A4 == undefined){
            $("#PROVIDE_A4").tips({
                side:3,
                msg:'请输入内部管理机构设置及人员配备情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROVIDE_A4 = '';
            this.$refs.PROVIDE_A4.focus();
        return false;
        }
        if(this.pd.PROVIDE_A5 == '' || this.pd.PROVIDE_A5 == undefined){
        	$("#PROVIDE_A5").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_A5 = '';
        	this.$refs.PROVIDE_A5.focus();
        	return false;
        }
        
        if(this.pd.PROVIDE_A6 == '' || this.pd.PROVIDE_A6 == undefined){
        	$("#PROVIDE_A6").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_A6 = '';
        	this.$refs.PROVIDE_A6.focus();
        	return false;
        }
        
        if(this.pd.PROVIDE_C1 == '' || this.pd.PROVIDE_C1 == undefined){
        	$("#PROVIDE_C1").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_C1 = '';
        	this.$refs.PROVIDE_C1.focus();
        	return false;
        }
        
        if(this.pd.PROVIDE_C2 == '' || this.pd.PROVIDE_C2 == undefined){
        	$("#PROVIDE_C2").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_C2 = '';
        	this.$refs.PROVIDE_C2.focus();
        	return false;
        }
        
        if(this.pd.PROVIDE_C3 == '' || this.pd.PROVIDE_C3 == undefined){
        	$("#PROVIDE_C3").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_C3 = '';
        	this.$refs.PROVIDE_C3.focus();
        	return false;
        }
        
        if(this.pd.PROVIDE_C4 == '' || this.pd.PROVIDE_C4 == undefined){
        	$("#PROVIDE_C4").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_C4 = '';
        	this.$refs.PROVIDE_C4.focus();
        	return false;
        }    
        if(this.pd.PROVIDE_C5 == '' || this.pd.PROVIDE_C5 == undefined){
        	$("#PROVIDE_C5").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_C5 = '';
        	this.$refs.PROVIDE_C5.focus();
        	return false;
        }    
        if(this.pd.PROVIDE_C6 == '' || this.pd.PROVIDE_C6 == undefined){
        	$("#PROVIDE_C6").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_C6 = '';
        	this.$refs.PROVIDE_C6.focus();
        	return false;
        }    
        if(this.pd.PROVIDE_B == '' || this.pd.PROVIDE_B == undefined){
        	$("#PROVIDE_B").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_B = '';
        	this.$refs.PROVIDE_B.focus();
        	return false;
        }    
        if(this.pd.PROVIDE_D == '' || this.pd.PROVIDE_D == undefined){
        	$("PROVIDE_D").tips({
        		side:3,
        		msg:'请输入内部管理机构设置及人员配备情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.PROVIDE_D = '';
        	this.$refs.PROVIDE_D.focus();
        	return false;
        }    
         
           
        if(this.pd.ENGAGE_A1 == '' || this.pd.ENGAGE_A1 == undefined){
            $("#ENGAGE_A1").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_A1 = '';
            this.$refs.ENGAGE_A1.focus();
        return false;
        }     
        if(this.pd.ENGAGE_A2 == '' || this.pd.ENGAGE_A2 == undefined){
            $("#ENGAGE_A2").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_A2 = '';
            this.$refs.ENGAGE_A2.focus();
        return false;
        }      
        if(this.pd.ENGAGE_A3 == '' || this.pd.ENGAGE_A3 == undefined){
            $("#ENGAGE_A3").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_A3 = '';
            this.$refs.ENGAGE_A3.focus();
        return false;
        }       
        if(this.pd.ENGAGE_A4 == '' || this.pd.ENGAGE_A4 == undefined){
            $("#ENGAGE_A4").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_A4 = '';
            this.$refs.ENGAGE_A4.focus();
        return false;
        }   
        if(this.pd.ENGAGE_C1 == '' || this.pd.ENGAGE_C1 == undefined){
            $("#ENGAGE_C1").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_C1 = '';
            this.$refs.ENGAGE_C1.focus();
        return false;
        }  
        
        if(this.pd.ENGAGE_C2 == '' || this.pd.ENGAGE_C2 == undefined){
            $("#ENGAGE_C2").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_C2 = '';
            this.$refs.ENGAGE_C2.focus();
        return false;
        }  
        if(this.pd.ENGAGE_C3 == '' || this.pd.ENGAGE_C3 == undefined){
            $("#ENGAGE_C3").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_C3 = '';
            this.$refs.ENGAGE_C3.focus();
        return false;
        }  
        
        if(this.pd.ENGAGE_C4 == '' || this.pd.ENGAGE_C4 == undefined){
            $("#ENGAGE_C4").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_C4 = '';
            this.$refs.ENGAGE_C4.focus();
        return false;
        }  
        
        if(this.pd.ENGAGE_D == '' || this.pd.ENGAGE_D == undefined){
            $("#ENGAGE_D").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_D = '';
            this.$refs.ENGAGE_D.focus();
        return false;
        }  
        if(this.pd.ENGAGE_B == '' || this.pd.ENGAGE_B == undefined){
        	$("#ENGAGE_B").tips({
        		side:3,
        		msg:'请输入教师队伍建设和人员聘用情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.ENGAGE_B = '';
        	this.$refs.ENGAGE_B.focus();
        	return false;
        }  
            
        if(this.pd.ENGAGE_A1 == '' || this.pd.ENGAGE_A1 == undefined){
            $("#ENGAGE_A1").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_A1 = '';
            this.$refs.ENGAGE_A1.focus();
        return false;
        }
        if(this.pd.ENGAGE_A2 == '' || this.pd.ENGAGE_A2 == undefined){
            $("#ENGAGE_A2").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_A2 = '';
            this.$refs.ENGAGE_A2.focus();
        return false;
        }
        if(this.pd.ENGAGE_A3 == '' || this.pd.ENGAGE_A3 == undefined){
            $("#ENGAGE_A3").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_A3 = '';
            this.$refs.ENGAGE_A3.focus();
        return false;
        }    
        if(this.pd.ENGAGE_A4 == '' || this.pd.ENGAGE_A4 == undefined){
            $("#ENGAGE_A4").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_A4 = '';
            this.$refs.ENGAGE_A4.focus();
        return false;
        }    	
        if(this.pd.ENGAGE_C1 == '' || this.pd.ENGAGE_C1 == undefined){
            $("#ENGAGE_C1").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_C1 = '';
            this.$refs.ENGAGE_C1.focus();
        return false;
        } 
        if(this.pd.ENGAGE_C2 == '' || this.pd.ENGAGE_C2 == undefined){
            $("#ENGAGE_C2").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_C2 = '';
            this.$refs.ENGAGE_C2.focus();
        return false;
        } 
        if(this.pd.ENGAGE_C3 == '' || this.pd.ENGAGE_C3 == undefined){
            $("#ENGAGE_C3").tips({
                side:3,
                msg:'请输入教师队伍建设和人员聘用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.ENGAGE_C3 = '';
            this.$refs.ENGAGE_C3.focus();
        return false;
        } 
        if(this.pd.ENGAGE_C4 == '' || this.pd.ENGAGE_C4 == undefined){
        	$("#ENGAGE_C4").tips({
        		side:3,
        		msg:'请输入教师队伍建设和人员聘用情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.ENGAGE_C4 = '';
        	this.$refs.ENGAGE_C4.focus();
        	return false;
        } 
        if(this.pd.ENGAGE_D == '' || this.pd.ENGAGE_D == undefined){
        	$("#ENGAGE_D").tips({
        		side:3,
        		msg:'请输入教师队伍建设和人员聘用情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.ENGAGE_D = '';
        	this.$refs.ENGAGE_D.focus();
        	return false;
        } 
        if(this.pd.ENGAGE_B == '' || this.pd.ENGAGE_B == undefined){
        	$("#ENGAGE_B").tips({
        		side:3,
        		msg:'请输入教师队伍建设和人员聘用情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.ENGAGE_B = '';
        	this.$refs.ENGAGE_B.focus();
        	return false;
        } 
            
        if(this.pd.EMPLOY_A1 == '' || this.pd.EMPLOY_A1 == undefined){
            $("#EMPLOY_A1").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_A1 = '';
            this.$refs.EMPLOY_A1.focus();
        return false;
        }    
            
        if(this.pd.EMPLOY_A2 == '' || this.pd.EMPLOY_A2 == undefined){
            $("#EMPLOY_A2").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_A2 = '';
            this.$refs.EMPLOY_A2.focus();
        return false;
        }    
        if(this.pd.EMPLOY_A3 == '' || this.pd.EMPLOY_A3 == undefined){
            $("#EMPLOY_A3").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_A3 = '';
            this.$refs.EMPLOY_A3.focus();
        return false;
        }      
        if(this.pd.EMPLOY_A4 == '' || this.pd.EMPLOY_A4 == undefined){
            $("#EMPLOY_A4").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_A4 = '';
            this.$refs.EMPLOY_A4.focus();
        return false;
        }     
        if(this.pd.EMPLOY_A5 == '' || this.pd.EMPLOY_A5 == undefined){
            $("#EMPLOY_A5").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_A5 = '';
            this.$refs.EMPLOY_A5.focus();
        return false;
        }   
        if(this.pd.EMPLOY_A6 == '' || this.pd.EMPLOY_A6 == undefined){
            $("#EMPLOY_A6").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_A6 = '';
            this.$refs.EMPLOY_A6.focus();
        return false;
        } 
        if(this.pd.EMPLOY_A7 == '' || this.pd.EMPLOY_A7 == undefined){
            $("#EMPLOY_A7").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_A7 = '';
            this.$refs.EMPLOY_A7.focus();
        return false;
        } 
        if(this.pd.EMPLOY_C1 == '' || this.pd.EMPLOY_C1 == undefined){
            $("#EMPLOY_C1").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_C1 = '';
            this.$refs.EMPLOY_C1.focus();
        return false;
        }
        if(this.pd.EMPLOY_C2 == '' || this.pd.EMPLOY_C2 == undefined){
            $("#EMPLOY_C2").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_C2 = '';
            this.$refs.EMPLOY_C2.focus();
        return false;
        }
        if(this.pd.EMPLOY_C3 == '' || this.pd.EMPLOY_C3 == undefined){
            $("#EMPLOY_C3").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_C3 = '';
            this.$refs.EMPLOY_C3.focus();
        return false;
        }
        if(this.pd.EMPLOY_C4 == '' || this.pd.EMPLOY_C4 == undefined){
            $("#EMPLOY_C4").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_C4 = '';
            this.$refs.EMPLOY_C4.focus();
        return false;
        }
        if(this.pd.EMPLOY_C5 == '' || this.pd.EMPLOY_C5 == undefined){
            $("#EMPLOY_C5").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_C5 = '';
            this.$refs.EMPLOY_C5.focus();
        return false;
        }
        if(this.pd.EMPLOY_C6 == '' || this.pd.EMPLOY_C6 == undefined){
            $("#EMPLOY_C6").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_C6 = '';
            this.$refs.EMPLOY_C6.focus();
        return false;
        }
        if(this.pd.EMPLOY_C7 == '' || this.pd.EMPLOY_C7 == undefined){
            $("#EMPLOY_C7").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_C7 = '';
            this.$refs.EMPLOY_C7.focus();
        return false;
        }
        if(this.pd.EMPLOY_B == '' || this.pd.EMPLOY_B == undefined){
            $("#EMPLOY_B").tips({
                side:3,
                msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.EMPLOY_B = '';
            this.$refs.EMPLOY_B.focus();
        return false;
        }
        if(this.pd.EMPLOY_D == '' || this.pd.EMPLOY_D == undefined){
        	$("#EMPLOY_D").tips({
        		side:3,
        		msg:'请输入收费公示、经费监管、财务状况、资金来源和使用情况',
        		bg:'#AE81FF',
        		time:2
        	});
        	this.pd.EMPLOY_D = '';
        	this.$refs.EMPLOY_D.focus();
        	return false;
        }
	
        if(this.pd.PROPERTY_A1 == '' || this.pd.PROPERTY_A1 == undefined){
            $("#PROPERTY_A1").tips({
                side:3,
                msg:'请输入法人财产权的落实和资产管理情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROPERTY_A1 = '';
            this.$refs.PROPERTY_A1.focus();
        return false;
        }    
        if(this.pd.PROPERTY_A2 == '' || this.pd.PROPERTY_A2 == undefined){
            $("#PROPERTY_A2").tips({
                side:3,
                msg:'请输入法人财产权的落实和资产管理情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROPERTY_A2 = '';
            this.$refs.PROPERTY_A2.focus();
        return false;
        }  
        if(this.pd.PROPERTY_A3 == '' || this.pd.PROPERTY_A3 == undefined){
            $("#PROPERTY_A3").tips({
                side:3,
                msg:'请输入法人财产权的落实和资产管理情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROPERTY_A3 = '';
            this.$refs.PROPERTY_A3.focus();
        return false;
        }   
        if(this.pd.PROPERTY_C1 == '' || this.pd.PROPERTY_C1 == undefined){
            $("#PROPERTY_C1").tips({
                side:3,
                msg:'请输入法人财产权的落实和资产管理情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROPERTY_C1 = '';
            this.$refs.PROPERTY_C1.focus();
        return false;
        }    
        if(this.pd.PROPERTY_C2 == '' || this.pd.PROPERTY_C2 == undefined){
            $("#PROPERTY_C2").tips({
                side:3,
                msg:'请输入法人财产权的落实和资产管理情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROPERTY_C2 = '';
            this.$refs.PROPERTY_C2.focus();
        return false;
        }   
        if(this.pd.PROPERTY_C3 == '' || this.pd.PROPERTY_C3 == undefined){
            $("#PROPERTY_C3").tips({
                side:3,
                msg:'请输入法人财产权的落实和资产管理情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROPERTY_C3 = '';
            this.$refs.PROPERTY_C3.focus();
        return false;
        }  
        if(this.pd.PROPERTY_D == '' || this.pd.PROPERTY_D == undefined){
            $("#PROPERTY_D").tips({
                side:3,
                msg:'请输入法人财产权的落实和资产管理情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROPERTY_D = '';
            this.$refs.PROPERTY_D.focus();
        return false;
        }
        if(this.pd.PROPERTY_B == '' || this.pd.PROPERTY_B == undefined){
            $("#PROPERTY_B").tips({
                side:3,
                msg:'请输入法人财产权的落实和资产管理情况',
                bg:'#AE81FF',
                time:2
            });
            this.pd.PROPERTY_B = '';
            this.$refs.PROPERTY_B.focus();
        return false;
        }
          
            if(this.pd.DEPUTY == '' || this.pd.DEPUTY == undefined){
                    $("#DEPUTY").tips({
                        side:3,
                        msg:'请输入法定代表人意见',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DEPUTY = '';
                    this.$refs.DEPUTY.focus();
                return false;
                }
            if(this.pd.SIGNATURE == '' || this.pd.SIGNATURE == undefined){
                    $("#SIGNATURE").tips({
                        side:3,
                        msg:'请输入签字',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.SIGNATURE = '';
                    this.$refs.SIGNATURE.focus();
                return false;
                }
            if(this.pd.USER == '' || this.pd.USER == undefined){
                    $("#USER").tips({
                        side:3,
                        msg:'请输入填表人',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.USER = '';
                    this.$refs.USER.focus();
                return false;
                }
            if(this.pd.DATE == '' || this.pd.DATE == undefined){
                    $("#DATE").tips({
                        side:3,
                        msg:'请输入填表日期',
                        bg:'#AE81FF',
                        time:2
                    });
                    this.pd.DATE = '';
                    this.$refs.DATE.focus();
                return false;
                }
}
		 //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'selfexamination/'+this.msg,
			    	data: {
			    		SELFEXAMINATION_ID:this.SELFEXAMINATION_ID,
						APPROVE_ID:this.APPROVE_ID,   //审批id
						FORM_TYPE:this.APPROVE_TYPE,   //审批类型
						FULLDATA_ID:this.FORM_ID,   //需要填写的表单id
						SUB_STATUS:status,  	 	//暂存为草稿
						APPROVEFORM_ID:this.APPROVEFORM_ID,
						POLICY_A1:this.pd.POLICY_A1,
						POLICY_A2:this.pd.POLICY_A2,
						POLICY_A3:this.pd.POLICY_A3,
						POLICY_A4:this.pd.POLICY_A4,
						POLICY_A5:this.pd.POLICY_A5,
						POLICY_A6:this.pd.POLICY_A6,
						POLICY_B:this.pd.POLICY_B,
						POLICY_D:this.pd.POLICY_D,
						POLICY_C1:this.pd.POLICY_C1,
						POLICY_C2:this.pd.POLICY_C2,
						POLICY_C3:this.pd.POLICY_C3,
						POLICY_C4:this.pd.POLICY_C4,
						POLICY_C5:this.pd.POLICY_C5,
						POLICY_C6:this.pd.POLICY_C6,
						
						BUILD_A1:this.pd.BUILD_A1,
						BUILD_A2:this.pd.BUILD_A2,
						BUILD_A3:this.pd.BUILD_A3,
						BUILD_A4:this.pd.BUILD_A4,
						BUILD_B:this.pd.BUILD_B,
						BUILD_D:this.pd.BUILD_D,
						BUILD_C1:this.pd.BUILD_C1,
						BUILD_C2:this.pd.BUILD_C2,
						BUILD_C3:this.pd.BUILD_C3,
						BUILD_C4:this.pd.BUILD_C4,

						BASIC_A1:this.pd.BASIC_A1,
						BASIC_A2:this.pd.BASIC_A2,
						BASIC_A3:this.pd.BASIC_A3,
						BASIC_B:this.pd.BASIC_B,
						BASIC_D:this.pd.BASIC_D,
						BASIC_C1:this.pd.BASIC_C1,
						BASIC_C2:this.pd.BASIC_C2,
						BASIC_C3:this.pd.BASIC_C3,

						RULES_A1:this.pd.RULES_A1,
						RULES_A2:this.pd.RULES_A2,
						RULES_A3:this.pd.RULES_A3,
						RULES_C1:this.pd.RULES_C1,
						RULES_C2:this.pd.RULES_C2,
						RULES_C3:this.pd.RULES_C3,
						RULES_B:this.pd.RULES_B,
						RULES_D:this.pd.RULES_D,
						
						
						PAPERS_A1:this.pd.PAPERS_A1,
						PAPERS_A2:this.pd.PAPERS_A2,
						PAPERS_A3:this.pd.PAPERS_A3,
						PAPERS_A4:this.pd.PAPERS_A4,
						PAPERS_A5:this.pd.PAPERS_A5,
						PAPERS_A6:this.pd.PAPERS_A6,
						PAPERS_C1:this.pd.PAPERS_C1,
						PAPERS_C2:this.pd.PAPERS_C2,
						PAPERS_C3:this.pd.PAPERS_C3,
						PAPERS_C4:this.pd.PAPERS_C4,
						PAPERS_C5:this.pd.PAPERS_C5,
						PAPERS_C6:this.pd.PAPERS_C6,
						PAPERS_B:this.pd.PAPERS_B,
						PAPERS_D:this.pd.PAPERS_D,
						
						PROCESS_A1:this.pd.PROCESS_A1,
						PROCESS_A2:this.pd.PROCESS_A2,
						PROCESS_A3:this.pd.PROCESS_A3,
						PROCESS_A4:this.pd.PROCESS_A4,
						PROCESS_C1:this.pd.PROCESS_C1,
						PROCESS_C2:this.pd.PROCESS_C2,
						PROCESS_C3:this.pd.PROCESS_C3,
						PROCESS_C4:this.pd.PROCESS_C4,
						PROCESS_D:this.pd.PROCESS_D,
						PROCESS_B:this.pd.PROCESS_B,
						
						PROVIDE_A1:this.pd.PROVIDE_A1,
						PROVIDE_A2:this.pd.PROVIDE_A2,
						PROVIDE_A3:this.pd.PROVIDE_A3,
						PROVIDE_A4:this.pd.PROVIDE_A4,
						PROVIDE_A5:this.pd.PROVIDE_A5,
						PROVIDE_A6:this.pd.PROVIDE_A6,
						PROVIDE_C1:this.pd.PROVIDE_C1,
						PROVIDE_C2:this.pd.PROVIDE_C2,
						PROVIDE_C3:this.pd.PROVIDE_C3,
						PROVIDE_C4:this.pd.PROVIDE_C4,
						PROVIDE_C5:this.pd.PROVIDE_C5,
						PROVIDE_C6:this.pd.PROVIDE_C6,
						PROVIDE_B:this.pd.PROVIDE_B,
						PROVIDE_D:this.pd.PROVIDE_D,
						
						ENGAGE_A1:this.pd.ENGAGE_A1,
						ENGAGE_A2:this.pd.ENGAGE_A2,
						ENGAGE_A3:this.pd.ENGAGE_A3,
						ENGAGE_A4:this.pd.ENGAGE_A4,
						ENGAGE_C1:this.pd.ENGAGE_C1,
						ENGAGE_C2:this.pd.ENGAGE_C2,
						ENGAGE_C3:this.pd.ENGAGE_C3,
						ENGAGE_C4:this.pd.ENGAGE_C4,
						ENGAGE_D:this.pd.ENGAGE_D,
						ENGAGE_B:this.pd.ENGAGE_B,

						EMPLOY_A1:this.pd.EMPLOY_A1,
						EMPLOY_A2:this.pd.EMPLOY_A2,
						EMPLOY_A3:this.pd.EMPLOY_A3,
						EMPLOY_A4:this.pd.EMPLOY_A4,
						EMPLOY_A5:this.pd.EMPLOY_A5,
						EMPLOY_A6:this.pd.EMPLOY_A6,
						EMPLOY_A7:this.pd.EMPLOY_A7,
						EMPLOY_C1:this.pd.EMPLOY_C1,
						EMPLOY_C2:this.pd.EMPLOY_C2,
						EMPLOY_C3:this.pd.EMPLOY_C3,
						EMPLOY_C4:this.pd.EMPLOY_C4,
						EMPLOY_C5:this.pd.EMPLOY_C5,
						EMPLOY_C6:this.pd.EMPLOY_C6,
						EMPLOY_C7:this.pd.EMPLOY_C7,
						EMPLOY_B:this.pd.EMPLOY_B,
						EMPLOY_D:this.pd.EMPLOY_D,
						
						PROPERTY_A1:this.pd.PROPERTY_A1,
						PROPERTY_A2:this.pd.PROPERTY_A2,
						PROPERTY_A3:this.pd.PROPERTY_A3,
						PROPERTY_C1:this.pd.PROPERTY_C1,
						PROPERTY_C2:this.pd.PROPERTY_C2,
						PROPERTY_C3:this.pd.PROPERTY_C3,
						PROPERTY_D:this.pd.PROPERTY_D,
						PROPERTY_B:this.pd.PROPERTY_B,

						DEPUTY:this.pd.DEPUTY,

						SIGNATURE:this.pd.SIGNATURE,

						USER:this.pd.USER,

						DATE:this.pd.DATE,

			    	    tm:new Date().getTime()
                    },
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            vm.SELFEXAMINATION_ID=data.RES_ID;
							vm.APPROVEFORM_ID=data.APPROVEFORM_ID;
                        	swal("", "暂存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("海淀区民办中小学年检自查表",data.exception);//显示异常
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
				url: httpurl+'selfexamination/goEdit',
		    	data: {
                    SELFEXAMINATION_ID:this.SELFEXAMINATION_ID,
                    tm:new Date().getTime()
                },
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("海淀区民办中小学年检自查表",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
               });
    	},
        getValue:function(){
        	
		        	var POLICY_A1=$("#POLICY_A1").text();
			        if(null!=POLICY_A1&&undefined!=POLICY_A1&&''!=POLICY_A1){
			            vm.pd.POLICY_A1=POLICY_A1;
			        }
					var POLICY_A2=$("POLICY_A2").text();
                    if(null!=POLICY_A2&&undefined!=POLICY_A2&&''!=POLICY_A2){
                        vm.pd.POLICY_A2=POLICY_A2;
                    }
					var POLICY_A3=$("#POLICY_A3").text();
                    if(null!=POLICY_A3&&undefined!=POLICY_A3&&''!=POLICY_A3){
                        vm.pd.POLICY_A3=POLICY_A3;
                    }
					var POLICY_A4=$("#POLICY_A4").text();
                    if(null!=POLICY_A4&&undefined!=POLICY_A4&&''!=POLICY_A4){
                        vm.pd.POLICY_A4=POLICY_A4;
                    }
					var POLICY_A5=$("#POLICY_A5").text();
                    if(null!=POLICY_A5&&undefined!=POLICY_A5&&''!=POLICY_A5){
                        vm.pd.POLICY_A5=POLICY_A5;
                    }
					var POLICY_A6=$("#POLICY_A6").text();
                    if(null!=POLICY_A6&&undefined!=POLICY_A6&&''!=POLICY_A6){
                        vm.pd.POLICY_A6=POLICY_A6;
                    }
					var POLICY_B=$("#POLICY_B").text();
                    if(null!=POLICY_B&&undefined!=POLICY_B&&''!=POLICY_B){
                        vm.pd.POLICY_B=POLICY_B;
                    }
					var POLICY_D=$("#POLICY_D").text();
                    if(null!=POLICY_D&&undefined!=POLICY_D&&''!=POLICY_D){
                        vm.pd.POLICY_D=POLICY_D;
                    }
					var POLICY_C1=$("#POLICY_C1").text();
                    if(null!=POLICY_C1&&undefined!=POLICY_C1&&''!=POLICY_C1){
                        vm.pd.POLICY_C1=POLICY_C1;
                    }
					var POLICY_C2=$("#POLICY_C2").text();
                    if(null!=POLICY_C2&&undefined!=POLICY_C2&&''!=POLICY_C2){
                        vm.pd.POLICY_C2=POLICY_C2;
                    }
					var POLICY_C3=$("#POLICY_C3").text();
                    if(null!=POLICY_C3&&undefined!=POLICY_C3&&''!=POLICY_C3){
                        vm.pd.POLICY_C3=POLICY_C3;
                    }
					var POLICY_C4=$("#POLICY_C4").text();
                    if(null!=POLICY_C4&&undefined!=POLICY_C4&&''!=POLICY_C4){
                        vm.pd.POLICY_C4=POLICY_C4;
                    }
					var POLICY_C5=$("#POLICY_C5").text();
                    if(null!=POLICY_C5&&undefined!=POLICY_C5&&''!=POLICY_C5){
                        vm.pd.POLICY_C5=POLICY_C5;
                    }
					var POLICY_C6=$("#POLICY_C6").text();
                    if(null!=POLICY_C6&&undefined!=POLICY_C6&&''!=POLICY_C6){
                        vm.pd.POLICY_C6=POLICY_C6;
                    }
                    
                    var BUILD_A1=$("#BUILD_A1").text();
                    if(null!=BUILD_A1&&undefined!=BUILD_A1&&''!=BUILD_A1){
                        vm.pd.BUILD_A1=BUILD_A1;
                    }
                    var BUILD_A2=$("#BUILD_A2").text();
                    if(null!=BUILD_A2&&undefined!=BUILD_A2&&''!=BUILD_A2){
                        vm.pd.BUILD_A2=BUILD_A2;
                    }
                    var BUILD_A3=$("#BUILD_A3").text();
                    if(null!=BUILD_A3&&undefined!=BUILD_A3&&''!=BUILD_A3){
                        vm.pd.BUILD_A3=BUILD_A3;
                    }
                    var BUILD_A4=$("#BUILD_A4").text();
                    if(null!=BUILD_A4&&undefined!=BUILD_A4&&''!=BUILD_A4){
                        vm.pd.BUILD_A4=BUILD_A4;
                    }
                    var BUILD_B=$("#BUILD_B").text();
                    if(null!=BUILD_B&&undefined!=BUILD_B&&''!=BUILD_B){
                        vm.pd.BUILD_B=BUILD_B;
                    }
                    var BUILD_D=$("#BUILD_D").text();
                    if(null!=BUILD_D&&undefined!=BUILD_D&&''!=BUILD_D){
                    	vm.pd.BUILD_D=BUILD_D;
                    }
                    var BUILD_C1=$("#BUILD_C1").text();
                    if(null!=BUILD_C1&&undefined!=BUILD_C1&&''!=BUILD_C1){
                    	vm.pd.BUILD_C1=BUILD_C1;
                    }
                    var BUILD_C2=$("#BUILD_C2").text();
                    if(null!=BUILD_C2&&undefined!=BUILD_C2&&''!=BUILD_C2){
                    	vm.pd.BUILD_C2=BUILD_C2;
                    }
                    var BUILD_C3=$("#BUILD_C3").text();
                    if(null!=BUILD_C3&&undefined!=BUILD_C3&&''!=BUILD_C3){
                    	vm.pd.BUILD_C3=BUILD_C3;
                    }
                    var BUILD_C4=$("#BUILD_C4").text();
                    if(null!=BUILD_C4&&undefined!=BUILD_C4&&''!=BUILD_C4){
                    	vm.pd.BUILD_C4=BUILD_C4;
                    }
                    var BASIC_A1=$("#BASIC_A1").text();
                    if(null!=BASIC_A1&&undefined!=BASIC_A1&&''!=BASIC_A1){
                        vm.pd.BASIC_A1=BASIC_A1;
                    }
                    var BASIC_A2=$("#BASIC_A2").text();
                    if(null!=BASIC_A2&&undefined!=BASIC_A2&&''!=BASIC_A2){
                        vm.pd.BASIC_A2=BASIC_A2;
                    }
                    var BASIC_A3=$("#BASIC_A3").text();
                    if(null!=BASIC_A3&&undefined!=BASIC_A3&&''!=BASIC_A3){
                        vm.pd.BASIC_A3=BASIC_A3;
                    }
                    var BASIC_B=$("#BASIC_B").text();
                    if(null!=BASIC_B&&undefined!=BASIC_B&&''!=BASIC_B){
                        vm.pd.BASIC_B=BASIC_B;
                    }
                    var BASIC_D=$("#BASIC_D").text();
                    if(null!=BASIC_D&&undefined!=BASIC_D&&''!=BASIC_D){
                        vm.pd.BASIC_D=BASIC_D;
                    }
                    var BASIC_C1=$("#BASIC_C1").text();
                    if(null!=BASIC_C1&&undefined!=BASIC_C1&&''!=BASIC_C1){
                        vm.pd.BASIC_C1=BASIC_C1;
                    }
                    var BASIC_C2=$("#BASIC_C2").text();
                    if(null!=BASIC_C2&&undefined!=BASIC_C2&&''!=BASIC_C2){
                        vm.pd.BASIC_C2=BASIC_C2;
                    }
                    var BASIC_C3=$("#BASIC_C3").text();
                    if(null!=BASIC_C3&&undefined!=BASIC_C3&&''!=BASIC_C3){
                        vm.pd.BASIC_C3=BASIC_C3;
                    }
                    var RULES_A1=$("#RULES_A1").text();
                    if(null!=RULES_A1&&undefined!=RULES_A1&&''!=RULES_A1){
                        vm.pd.RULES_A1=RULES_A1;
                    }
                    var RULES_A2=$("#RULES_A2").text();
                    if(null!=RULES_A2&&undefined!=RULES_A2&&''!=RULES_A2){
                        vm.pd.RULES_A2=RULES_A2;
                    }
                    var RULES_A3=$("#RULES_A3").text();
                    if(null!=RULES_A3&&undefined!=RULES_A3&&''!=RULES_A3){
                        vm.pd.RULES_A3=RULES_A3;
                    }
                    var RULES_C1=$("#RULES_C1").text();
                    if(null!=RULES_C1&&undefined!=RULES_C1&&''!=RULES_C1){
                        vm.pd.RULES_C1=RULES_C1;
                    }
                    var RULES_C2=$("#RULES_C2").text();
                    if(null!=RULES_C2&&undefined!=RULES_C2&&''!=RULES_C2){
                        vm.pd.RULES_C2=RULES_C2;
                    }
                    var RULES_C3=$("#RULES_C3").text();
                    if(null!=RULES_C3&&undefined!=RULES_C3&&''!=RULES_C3){
                        vm.pd.RULES_C3=RULES_C3;
                    }
                    var RULES_B=$("#RULES_B").text();
                    if(null!=RULES_B&&undefined!=RULES_B&&''!=RULES_B){
                        vm.pd.RULES_B=RULES_B;
                    }
                    var RULES_D=$("#RULES_D").text();
                    if(null!=RULES_D&&undefined!=RULES_D&&''!=RULES_D){
                    	vm.pd.RULES_D=RULES_D;
                    }
                  
                    var PAPERS_A1=$("#PAPERS_A1").text();
                    if(null!=PAPERS_A1&&undefined!=PAPERS_A1&&''!=PAPERS_A1){
                        vm.pd.PAPERS_A1=PAPERS_A1;
                    }
                    var PAPERS_A2=$("#PAPERS_A2").text();
                    if(null!=PAPERS_A2&&undefined!=PAPERS_A2&&''!=PAPERS_A2){
                        vm.pd.PAPERS_A2=PAPERS_A2;
                    }
                    var PAPERS_A3=$("#PAPERS_A3").text();
                    if(null!=PAPERS_A3&&undefined!=PAPERS_A3&&''!=PAPERS_A3){
                        vm.pd.PAPERS_A3=PAPERS_A3;
                    }
                    var PAPERS_A4=$("#PAPERS_A4").text();
                    if(null!=PAPERS_A4&&undefined!=PAPERS_A4&&''!=PAPERS_A4){
                        vm.pd.PAPERS_A4=PAPERS_A4;
                    }
                    var PAPERS_A5=$("#PAPERS_A5").text();
                    if(null!=PAPERS_A5&&undefined!=PAPERS_A5&&''!=PAPERS_A5){
                        vm.pd.PAPERS_A5=PAPERS_A5;
                    }
                    var PAPERS_A6=$("#PAPERS_A6").text();
                    if(null!=PAPERS_A6&&undefined!=PAPERS_A6&&''!=PAPERS_A6){
                        vm.pd.PAPERS_A6=PAPERS_A6;
                    }
                    
					/*PAPERS_C1:this.pd.,
					PAPERS_C2:this.pd.PAPERS_C2,
					PAPERS_C3:this.pd.PAPERS_C3,
					PAPERS_C4:this.pd.PAPERS_C4,
					PAPERS_C5:this.pd.PAPERS_C5,
					PAPERS_C6:this.pd.PAPERS_C6,
					PAPERS_B:this.pd.PAPERS_B,
					PAPERS_D:this.pd.PAPERS_D,*/
                    
                   
                    
                    var PROCESS=$("#PROCESS").text();
                    if(null!=PROCESS&&undefined!=PROCESS&&''!=PROCESS){
                        vm.pd.PROCESS=PROCESS;
                    }
                    
                    var PROVIDE=$("#PROVIDE").text();
                    if(null!=PROVIDE&&undefined!=PROVIDE&&''!=PROVIDE){
                        vm.pd.PROVIDE=PROVIDE;
                    }
                    
                    var ENGAGE=$("#ENGAGE").text();
                    if(null!=ENGAGE&&undefined!=ENGAGE&&''!=ENGAGE){
                        vm.pd.ENGAGE=ENGAGE;
                    }
                    
                    var EMPLOY=$("#EMPLOY").text();
                    if(null!=EMPLOY&&undefined!=EMPLOY&&''!=EMPLOY){
                        vm.pd.EMPLOY=EMPLOY;
                    }
                    
                    var PROPERTY=$("#PROPERTY").text();
                    if(null!=PROPERTY&&undefined!=PROPERTY&&''!=PROPERTY){
                        vm.pd.PROPERTY=PROPERTY;
                    }
                    
                    var DEPUTY=$("#DEPUTY").text();
                    if(null!=DEPUTY&&undefined!=DEPUTY&&''!=DEPUTY){
                        vm.pd.DEPUTY=DEPUTY;
                    }
                    
                    var SIGNATURE=$("#SIGNATURE").text();
                    if(null!=SIGNATURE&&undefined!=SIGNATURE&&''!=SIGNATURE){
                        vm.pd.SIGNATURE=SIGNATURE;
                    }
                    
                    var USER=$("#USER").text();
                    if(null!=USER&&undefined!=USER&&''!=USER){
                        vm.pd.USER=USER;
                    }
                    
                    var DATE=$("#DATE").text();
                    if(null!=DATE&&undefined!=DATE&&''!=DATE){
                        vm.pd.DATE=DATE;
                    }
        },
    	//获取数据字典数据
		getDict: function (){
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