 var zuulUrl = 'http://127.0.0.1:8081/';					//zuul网关路由服务host

var httpurl = 'http://127.0.0.1:8081/';					//zuul网关路由服务host
 var nginxurl ='http://127.0.0.1:8088/';
 
 var CONTRACT_PATH='E:/hdmbjy/file/contract/';   //合同上传路径
 var RECORD_PATH='E:/hdmbjy/file/record/';     //档案上传路径
 var RESUME_PATH='E:/hdmbjy/file/resume/';     //简历 上传路径
 
 var GENERAL_TEACHER='1';    //机构人员为普通老师
 var FULLTIME_TEACHER='2'   //机构人员为专职老师
 var HEADMAN_TEACHER='3';		//机构人员为负责人
 var MENU_NAME='通知公告';    //需要打开的通知页面名
 
 var MINBAN_SCHOOL='MINBAN_SCHOOL';   //	民办培训学校
 var MINBAN_KINDERGARTEN_SCHOOL='MINBAN_KINDERGARTEN_SCHOOL'; //	民办幼儿园
 var NO_EDUCATIONAL_ADMINISTRATION='NO_EDUCATIONAL_ADMINISTRATION';  //公办幼儿园
 var BOARDING_DEPARTMENT_APPROVAL='BOARDING_DEPARTMENT_APPROVAL';  //寄宿部审批
 var MINBAN_MIDDLE_AND_PRIMARY_SCHOOL='MINBAN_MIDDLE_AND_PRIMARY_SCHOOL';  //民办中小学 
 
 var EXAMINATION_APPROVE_TYPE="8feb665b4cb24f15abefb2562a904610";  //默认年检审批类型
 
 var max_file_size="51200";  //限制上传文件大小不能超过50m
 
 var httpurlBootAdmin = zuulUrl;	//监控中心服务
 var httpurlDbsync	 = zuulUrl;			//表同步微服务
 var httpurlSystem	 = zuulUrl;							//系统服务   +'fh-system/'
 var httpurlIm		 = zuulUrl;				//即时通讯IM服务
 var httpurlActiviti  = zuulUrl;			//工作流服务
 var httpurlOa  	= zuulUrl;				//OA办公服务
 var httpurlTools  	 = zuulUrl;				//系统工具服务		
 var httpurlDbmanage  = zuulUrl;			//数据库管理服务
 
 
var eurekaServer1 = 'http://127.0.0.1:8761/';			//eureka注册中心1
var eurekaServer2 = 'http://127.0.0.1:8762/';			//eureka注册中心2

var eurekaServers = new Array(eurekaServer1,eurekaServer2);	//创建数组存放eurekaServer地址

var httpurlZipkin = 'http://127.0.0.1:8003/';			//分布式跟踪服务

/* var httpurlBootAdmin = zuulUrl+'fhcloud-boot-admin/';	//监控中心服务
var httpurlDbsync	 = zuulUrl+'fh-dbsync/';			//表同步微服务
var httpurlSystem	 = zuulUrl;							//系统服务   +'fh-system/'
var httpurlIm		 = zuulUrl+'fh-im/';				//即时通讯IM服务
var httpurlActiviti  = zuulUrl+'fh-activiti/';			//工作流服务
var httpurlOa  		 = zuulUrl+'fh-oa/';				//OA办公服务
var httpurlTools  	 = zuulUrl+'fh-tools/';				//系统工具服务		
var httpurlDbmanage  = zuulUrl+'fh-dbmanage/';			//数据库管理服务 */
	
var wsname = new Array(httpurlDbsync,httpurlSystem,httpurlIm,httpurlActiviti,httpurlOa,httpurlTools,httpurlDbmanage);	//退出登录时用于清理各个微服务session缓存(根据情况添加相应微服务)
 
/* //显示异常
 function showException(modular,exception){
	 swal("["+modular+"]程序异常!", "抱歉！您访问的页面出现异常，请稍后重试或联系管理员 "+exception, "warning");
 } */
 function showException(modular,exception){
 	 swal("服务器错误!", "抱歉！您访问的页面出现异常，请稍后重试或联系管理员", "warning");
 }