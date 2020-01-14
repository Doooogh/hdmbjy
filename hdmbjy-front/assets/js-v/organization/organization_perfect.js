var vm = new Vue({
	el: '#app',
	
	data:{
		ORGANIZATION_ID: '',	//主键ID
		PARENT_ID:'',    //父id 
		pd: [],						//存放字段参数
		msg:'add',
		
		
		
    },
	
	methods: {
			init(){
				var OID=this.getUrlKey('oId');
				var PID=this.getUrlKey('pId');
				if(null!=OID&&undefined!=OID){
					this.ORGANIZATION_ID=OID;
				}
				if(null!=PID&&undefined!=PID){
					this.PARENT_ID=PID;
				}
				
			},
			
			/**
			 * 返回上一级
			 */
			goback:function(){
				window.location.href="organization_list.html?oId="+vm.PARENT_ID;
			},
			/**
			 * 保存
			 */
			save:function(){
				
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