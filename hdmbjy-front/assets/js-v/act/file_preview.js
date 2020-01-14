$(function(){
	
	$("#showform").hide();
	$("#jiazai").show();
	var pdfUrl=getUrlKey("pdf");
	if(null!=pdfUrl&&undefined!=pdfUrl&&''!=pdfUrl){
		$("#showform").show();
		$("#jiazai").hide();
		this.pdf=pdfUrl;
		// document.getElementById("media").href=nginxurl+pdfUrl;
		$(".media").attr("href",nginxurl+pdfUrl);   //映射pdf 的实际路径
	}else{
		alert("预览错误");
	}
	
	setTimeout(function(){
		$('a.media').media({width:900, height:790});
		$('a.mediase').media({width:900, height:750});
	},200);

});
function getUrlKey (name) {
		    return decodeURIComponent(
		        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
		}
		
		
		
/* var vm = new Vue({
	el: '#app',
	
	data:{
		pdf:''
    },
	methods:{
		init(){
			document.getElementById("media").width=1000;
			document.getElementById("media").height=800;
			document.getElementsByClassName(mediase)[0].width=1000;
			document.getElementsByClassName(mediase)[0].height=800;
			$('a.media').media({width:1000, height:800});
				$('a.mediase').media({width:1000, height:800}); 
				var pdfUrl=this.getUrlKey("pdf");
				if(null!=pdfUrl&&undefined!=pdfUrl&&''!=pdfUrl){
					this.pdf=pdfUrl;
					document.getElementById("media").href=nginxurl+pdfUrl;
					// $("#media").attr("href",nginxurl+pdfUrl);   //映射pdf 的实际路径
				}
				 
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
	}); */