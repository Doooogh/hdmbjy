
var vm=new Vue({
    el:'#main',
    data:{
		
        ID:'',
		content:'',
		hasContent:false
    },
    methods:{
        init(){
            var aId=this.getUrlKey("INFORM_ID");
            if(aId!=null&&aId!=''&&aId!=undefined){
                this.ID=aId;
                this.getData();
            }
        },
        getData:function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'inform/goEdit',
                data: {
                    ID:this.ID,
                    tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
						if(data.pd.CONTENT!=''){
							vm.hasContent=true;
						}
                      vm.content=data.pd.CONTENT;
                    }else if ("exception" == data.result){
                        showException("按钮权限",data.exception);		//显示异常
                    }
                }
            })
        },
       
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }
    },
    mounted() {
        this.init();
    }

});
