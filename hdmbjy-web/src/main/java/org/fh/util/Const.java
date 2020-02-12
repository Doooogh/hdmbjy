package org.fh.util;

import java.util.HashMap;
import java.util.Map;

/**
 * 说明：常量
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class Const {
	
	public static final String SESSION_USER = "SESSION_USER";						//session用的用户
	public static final String SESSION_USERROL = "SESSION_USERROL";					//用户对象(包含角色信息)
	public static final String SESSION_ROLE_RIGHTS = "SESSION_ROLE_RIGHTS";			//角色菜单权限
	public static final String SHIROSET = "SHIROSET";								//菜单权限标识
	public static final String SESSION_USERNAME = "USERNAME";						//用户名
	public static final String SESSION_U_NAME = "SESSION_U_NAME";					//用户姓名
	public static final String SESSION_ROLE = "SESSION_ROLE";						//主职角色信息
	public static final String SESSION_RNUMBERS = "RNUMBERS";						//角色编码数组
	public static final String SESSION_ALLMENU = "SESSION_ALLMENU";					//全部菜单
	public static final String SKIN = "SKIN";										//用户皮肤
	
	public static final String SYSSET = "config/sysSet.ini";						//系统设置配置文件路径
	public static final String SYSNAME = "sysName";									//系统名称
	public static final String SHOWCOUNT = "showCount";								//每页条数
	
	public static final String FILEPATHFILE = "uploadFiles/file/";					//文件上传路径
	public static final String FILEPATHIMG = "uploadFiles/imgs/";					//图片上传路径
	
	public static final String FILEACTIVITI = "uploadFiles/activitiFile/";			//工作流生成XML和PNG目录
	
	public static final String FILEPATH = "D:/hdmbjy/file/groupImg/";              //栏目、文章、富文本图片上传路径

	public static final String ATTACHMENTPATH = "D:/hdmbjy/file/attachment/";				//文章附件上传路径

	public static final String PROCESSPATH = "D:/hdmbjy/file/process/";				//流程附件上传路径

	public static final String ARTICLE_IMAGEPATH = "http://58.119.9.67:8088/";     //栏目、文章、富文本图片请求路径

	public static final String ROTARYPATH = "D:/hdmbjy/file/rotaryImg/"; //轮播图片的存储路径

	public static  final String PRE_IMG="groupImg/";      //图片存储本地父目录
	
	public static  final String PDF_PATH="D:/hdmbjy/file/pdfpath/";      //pdf存储本地父目录
	
	public static  final String WORD_PATH="D:/hdmbjy/file/wordpath/";    //转pdf源文件存储本地父目录
	
	public static  final String NGINX_PATH="D:/hdmbjy/file/";    //nginx 本地文件目录
	
	
	public static  final String ARCHIVE_PATH="D:/hdmbjy/file/archive/";    //文档存储路径

	public static  final String CONTRACT_PATH="D:/hdmbjy/file/contract/";    //合同存储路径

	public static final  String ATT_PTYPE_EXAMINATION="1";  //附件父类型  1 年审类型

	public static final  String ATT_PTYPE_GOVERNMENT="2";  //附件父类型  1 行政审批类型

	public static final  String ATT_PTYPE_USER_INFO="3";  //附件父类型  3 机构用户信息


	public static final  String ATT_CTYPE_SCANNING="1";  //附件子类型 1扫描件

	public static final  String ATT_CTYPE_GENERAL="2";  //附件子类型 2普通附件

	public static final  String ATT_CTYPE_USER_CONTRACT="1";  //附件子类型   机构用户合同

	public static final  String BOOKINGUSER_TYPE_EXAMINATION="1";  //预约类型为年审

	public static final  String BOOKINGUSER_TYPE_GOVERNMENT="2";  //预约类型为行政审批


	public static final  String EXAMINATION_ADMIN_ROLE="R20190911223045";   //年审管理员角色

	public static final  String GOVERNMENT_ADMIN_ROLE="R20190917222933";    //行政审批管理员角色

	public static final  String EXAMINATION_USER_ROLE="R20190911973328";    //年审用户角色

	public static final  String GOVERNMENT_USER_ROLE="R20190917334633";		 //行政审批用户角色

	public static final  String HEADMAN_ROLE="R20191002954414";		 //机构管理员角色

	public static final  String DEFAULT_HEADMAN_ROLE_ID="caccde40866144f59054d9d5f1f5bcb9";		 //机构负责人默认角色  在添加时使用

	public static final  String ADMIN_USERNAME="admin,gadmin,sheguanke,mbadmin,iadmin,jwlingdao,cjadmin,kz,sgk,jw,sjs,sjxh";		 //系统管理员和普通管理员


	public static final  String TEM_PDF_PATH="D:/hdmbjy/file/tempdfpath/";
	
	
	public static  final String APPROVAL_PATH="D:/hdmbjy/file/approval/";// 审批确认文件

	public static  final String GENERAL_TEACHER="1";    //机构人员为普通老师
	public static  final String FULLTIME_TEACHER="2";   //机构人员为专职老师
	public static  final String HEADMAN_TEACHER="3";		//机构人员为负责人
	//富文本本地图片路径
	public static  final String UE_PATH="D:/hdmbjy/file/uepath/";
	//NGINXURL 路径
	public static  final String NGINXURL="http://127.0.0.1:8088/";

	public static final  String ADMIN_ID="1";
	
	public static final  String TEMP_ZIP_PATH="D:/hdmbjy/file/zippath/";   //临时压缩文件位置

	public static final  String ZIP_PATH="D:/hdmbjy/file/zippath/";   //压缩文件位置

	public static final  String EXAMINAMTION_ZIP_PATH="D:/hdmbjy/file/zippath/examination/";   //流程审批压缩文件位置

	public static final  String GOVERNMENT_ZIP_PATH="D:/hdmbjy/file/zippath/government/";   //流程审批压缩文件位置

	public static String USER_NAME="";

	public static Map<String,Object> LOGIN_SUCCESS_USERS=new HashMap<>();  //用于登录用户在有权限接口处从session 中获取不到user 使用

	public static final String EXAMINATION_APPROVE_TYPE="db1aac2909fa4f499bff0035f4c20c36";


	//停止计划任务
	public static String STATUS_RUNNING_STOP = "stop";
	//开启计划任务
	public static String STATUS_RUNNING_START = "start";

	public static final String MINBAN_KINDERGARTEN_SCHOOL="MINBAN_KINDERGARTEN_SCHOOL";
	public static final String NO_EDUCATIONAL_ADMINISTRATION="NO_EDUCATIONAL_ADMINISTRATION";
	public static final String BOARDING_DEPARTMENT_APPROVAL="BOARDING_DEPARTMENT_APPROVAL";
	public static final String MINBAN_MIDDLE_AND_PRIMARY_SCHOOL="MINBAN_MIDDLE_AND_PRIMARY_SCHOOL";
	public static final String MINBAN_CULTIVATE_SCHOOL="MINBAN_CULTIVATE_SCHOOL";
	public static final String ALL_ORGANIZATION="ALL_ORGANIZATION";

	public static final String INDEX_DOWNLOAD_ID="3892e047b0c04d6397efa7c3a5a26395";  //首页下载使用手册附件的id
}
