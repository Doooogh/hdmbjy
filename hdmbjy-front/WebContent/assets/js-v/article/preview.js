var vm=new Vue({
    el:'#main',
    data:{
        ID:'',
        REMARKS:'',
        pd:[],
        varList:[]
    },
    methods:{
        init(){
            var aId=this.getUrlKey("ARTICLE_ID");
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
                url: httpurl+'article/getById',
                data: {
                    ID:this.ID,
                    tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                      vm.pd=data.pd;
                      vm.varList=data.varList
                    }else if ("exception" == data.result){
                        showException("按钮权限",data.exception);		//显示异常
                    }
                }
            })
        },
        downloadAtt:function(id,url){
            window.location.href=httpurl+"article/download?ID="+id+"&URL="+url;
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

