package org.fh.controller.scuser;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.Dictionaries;
import org.fh.entity.system.User;
import org.fh.service.attachment.AttachmentService;
import org.fh.service.contract.ContractService;
import org.fh.service.fhoa.PostService;
import org.fh.service.fhoa.SpecialitiesService;
import org.fh.service.organization.OrganizationService;
import org.fh.service.scuser.ScuserService;
import org.fh.service.system.DictionariesService;
import org.fh.service.system.UsersService;
import org.fh.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.*;

/** 
 * 说明：民办机构用户
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-27
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/scuser")
public class ScuserController extends BaseController {
	
	@Autowired
	private ScuserService scuserService;

	@Autowired
	private ContractService contractService;

	@Autowired
	private AttachmentService attachmentService;

	@Autowired
	private UsersService usersService;

	@Autowired
	private DictionariesService dictionariesService;

	@Autowired
	private PostService postService;

	@Autowired
	private OrganizationService organizationService;

	@Autowired
	private SpecialitiesService specialitiesService;


	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("scuser:add")
	@ResponseBody
	public Object add(@RequestParam(required = false) MultipartFile file) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		
//		String  ENTRY_TIME= pd.getString("ENTRY_TIME");
		String TYPE=pd.getString("TYPE");
		String SCUSER_ID=get32UUID();  //生成id
		if(StringUtils.isNotBlank(TYPE)){
			if(TYPE.equals(Const.HEADMAN_TEACHER)){  //表示添加的用户为负责人   这时需要将负责人信息与系统管理原进行关联
				PageData organization=new PageData();
				organization.put("ORGANIZATION_ID",pd.get("ORGANIZATION_ID"));
				organization=organizationService.findById(organization);
				PageData sysUser=new PageData();  //系统用户
				sysUser.put("NAME",pd.get("NAME"));
//				sysUser.put("USER_ID",pd.get("SCUSER_ID"));
				sysUser.put("USER_ID",SCUSER_ID);
				sysUser.put("PASSWORD", new SimpleHash("SHA-1", pd.get("USERNAME"), pd.getString("PASSWORD")).toString());			//密码加密
				sysUser.put("USERNAME",pd.get("USERNAME"));
				sysUser.put("NUMBER",pd.getString("NUMBER"));
				sysUser.put("PHONE",pd.get("PHONE"));
				sysUser.put("EMAIL",pd.get("EMAIL"));
				sysUser.put("ROLE_ID",Const.DEFAULT_HEADMAN_ROLE_ID);
				sysUser.put("ROLE_IDS",Const.EXAMINATION_USER_ROLE+","+Const.GOVERNMENT_USER_ROLE);
				sysUser.put("LAST_LOGIN", "");						//最后登录时间
				sysUser.put("IP", "");								//IP
				sysUser.put("STATUS", "0");							//状态
				sysUser.put("DEPARTMENT_ID", pd.get("ORGANIZATION_ID"));							//状态
				sysUser.put("SKIN", "assets/windows/images/bg_01.jpg");		//用户默认皮肤
				usersService.saveUser(sysUser);
				
				organization.put("HEADMAN",pd.get("NAME"));
				organization.put("HEADMAN_ID",SCUSER_ID);
				organization.put("HEADMAN_PHONE",pd.get("PHONE"));
				organizationService.edit(organization);
			}else {
				PageData organization=new PageData();
				organization.put("ORGANIZATION_ID",pd.get("ORGANIZATION_ID"));
				organization=organizationService.findById(organization);

			}
		}
		//上传头像
		if(null!=file){
            String filePath = Const.FILEPATH;	//文件上传路径
            String fileName = this.get32UUID();
            fileName=FileUpload.fileUp(file,filePath,fileName); //执行上传
            pd.put("FIELD4",Const.PRE_IMG+fileName);  //备用字段4用作头像图片路径
        }
		
		
		pd.put("SCUSER_ID", SCUSER_ID);	//主键
		scuserService.save(pd);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 再添加时进行检测 (目的:一个机构只能有一个负责人)
	 * @return
	 */

	@RequestMapping("/checkAdd")
    @ResponseBody
	public Object checkAdd() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		List<PageData> pageData = scuserService.listAll(pd);
		if(pageData.size()>1){
			map.put("isOK",false);
		}else{
			map.put("isOK",true);
		}
		map.put("result",errInfo);
		return map;
	}

	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("scuser:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(StringUtils.isNotBlank(pd.getString("TYPE"))&&pd.getString("TYPE").equals(Const.HEADMAN_TEACHER)){
			PageData findOrganization=new PageData();
			findOrganization.put("HEADMAN_ID",pd.get("SCUSER_ID"));
			PageData originzation = organizationService.findByHeadmanId(findOrganization);
			originzation.remove("HEADMAN");
			originzation.remove("HEADMAN_ID");
			originzation.remove("HEADMAN_PHONE");
			originzation.put("tm",pd.get("tm"));
			organizationService.edit(originzation);
			pd.put("USER_ID",pd.getString("SCUSER_ID"));
			usersService.deleteUser(pd);
		}
		scuserService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("scuser:edit")
	@ResponseBody
	public Object edit(@RequestParam(required = false) MultipartFile file) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = scuserService.findById(pd);
		if(null!=file){
			String fileName = this.get32UUID();
			String filePath = Const.FILEPATH;	//文件上传路径
			fileName=FileUpload.fileUp(file,filePath,fileName); //执行上传
			pd.put("FIELD4",Const.PRE_IMG+fileName);
		}
		
		
		scuserService.edit(pd);
		if(pd.getString("TYPE").equals(Const.HEADMAN_TEACHER)){
			PageData editUser=new PageData();
			editUser.putAll(pd);
			editUser.put("USER_ID",pd.get("SCUSER_ID"));
			usersService.editUser(editUser);  //同时修改系统用户
			//修改与之绑定得机构中负责人的信息
			PageData editHeadman=new PageData();
			editHeadman.put("HEADMAN",pd.get("NAME"));
			editHeadman.put("HEADMAN_ID",pd.get("SCUSER_ID"));
			editHeadman.put("HEADMAN_PHONE",pd.get("PHONE"));
			organizationService.edit(new PageData());

		}
		map.put("result", errInfo);
		return map;
	}
	/**修改详细信息
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/editDetail")
	@RequiresPermissions("scuser:edit")
	@ResponseBody
	public Object editDetail() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		try{
			String SCUSER_ID=pd.getString("SCUSER_ID");
			PageData scuser=new PageData();
			scuser.put("SCUSER_ID",SCUSER_ID);
			PageData fuser=scuserService.findById(scuser);
			if(null==fuser){
				throw new Exception("没有查询到该用户");
			}
			//将查询出来的机构用户信息  放入新的 信息   因为合同 和 用户 属性名有相同的 不能直接使用pd
			String CONTRACT_ID=this.get32UUID();
			fuser.put("CONTRACT",CONTRACT_ID);
			fuser.put("RECORD",pd.get("RECORD_ID"));
			fuser.put("RESUME",pd.get("RESUME_ID"));
			scuserService.edit(fuser);  //进行更新
			PageData contract=new PageData();  //创建一个新的合同
			contract.put("CONTRACT_ID",CONTRACT_ID);
			contract.put("TITLE",pd.get("CONTRACT_OR_NAME"));
			contract.put("TYPE",pd.get("CONTRACT_TYPE"));
			contract.put("CONTRACT_NUMBER",pd.get("CONTRACT_NUMBER"));
			contract.put("START_TIME",pd.get("CONTRACT_START_TIME"));
			contract.put("END_TIME",pd.get("CONTRACT_END_TIME"));
			contract.put("CONTRACT_PATH",pd.get("CONTRACT_PATH"));
			contract.put("ENCLOSURE_ID",pd.get("CONTRACT_ID"));
			contract.put("CREATOR_DATE",new Date());
			contractService.save(contract);
		}catch (Exception e){
			e.printStackTrace();
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("scuser:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		
		PageData pdOid = new PageData();
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		if(Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())) {
			String ORGANIZATION_ID=pd.getString("ORGANIZATION_ID");
			if(StringUtils.isNotBlank(ORGANIZATION_ID)&&"0".equals(ORGANIZATION_ID)){
				pd.remove("ORGANIZATION_ID");
			}
		}else {
			//headman_id
			String userid = Jurisdiction.getUser().getUSER_ID();
			List<PageData> pds = organizationService.findByUserId(userid);
			pd.put("ORGANIZATION_ID", pds.get(0).get("ORGANIZATION_ID"));
			pdOid.put("ORGANIZATION_ID", pds.get(0).get("ORGANIZATION_ID"));
		}
		page.setPd(pd);
		List<PageData>	varList = scuserService.list(page);	//列出Scuser列表
		for (PageData pageData : varList) {
			pageData.put("SENIORITY",DateUtil.getTimeBeforeNowStringDate(pageData.get("ENTRY_TIME").toString().substring(0,pageData.get("ENTRY_TIME").toString().length()-2),new Date()));
		}
		if(Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername()) && !Jurisdiction.getUsername().equals("sjs")){
			map.put("isAdmin",true);
		}
		map.put("varList", varList);
		map.put("page", page);
		map.put("pdOid", pdOid);
		map.put("result", errInfo);

		return map;
	}




	@RequestMapping("/resetPS")
	@ResponseBody
	public Object resetPS() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(null==pd.get("SCUSER_ID")){
			errInfo="error";
			map.put("result",errInfo);
			return map;
		}
		Map map1 = scuserService.resetPS(pd);
		if(!"success".equals(map1.get("res"))){
			errInfo="error";
			map.put("result",errInfo);
			return map;
		}
		map.put("result",errInfo);
		return map;
	}
	/**获取用户详细信息
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/getData")
	@RequiresPermissions("scuser:list")
	@ResponseBody
	public Object getData() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = scuserService.getData(pd);	//根据ID读取
		PageData dic=new PageData();
		PageData dicRes=null;
		dic.put("POST_ID",null==pd.get("POST")?"":pd.get("POST"));
		dicRes=postService.findById(dic);
		//职位
		if(null!=dicRes){
			pd.put("POST",dicRes.getString("NAME"));
		}else{
			//throw new Exception("信息查询错误!");
			pd.put("POST",null);
		}
		dic.put("BIANMA",pd.get("EDUCATION"));
		dicRes=dictionariesService.findByBianma(dic);

		if(null!=dicRes){
			pd.put("EDUCATION",dicRes.getString("NAME"));
		}else{
			throw new Exception("信息查询错误!");
		}

		dic.put("BIANMA",pd.get("TITLE"));
		dicRes=dictionariesService.findByBianma(dic);
		//职称
		if(null!=dicRes){
			pd.put("TITLE",dicRes.getString("NAME"));
		}else{
			//throw new Exception("信息查询错误!");
			pd.put("TITLE",null);
		}
		//性别
		dic.put("BIANMA",pd.get("SEX"));
		dicRes=dictionariesService.findByBianma(dic);
		if(null!=dicRes){
			pd.put("SEX",dicRes.getString("NAME"));
		}else{
			//throw new Exception("信息查询错误!");
			pd.put("SEX",null);
		}

		PageData find=new PageData();
		PageData res=null;
		if(null!=pd.getString("C_ATT_ID")){
			find.put("ID",pd.get("C_ATT_ID"));
			res=attachmentService.getOneById(find);
			if(null!=res){
				pd.put("C_TITLE",res.get("ORIGINAL_NAME"));
				pd.put("C_ATT",res);
			}else{
				throw new Exception("用户详细信息获取失败");
			}
		}
		if(null!=pd.getString("RECORD")){
			find.put("ID",pd.get("RECORD"));
			res=attachmentService.getOneById(find);
			if(null!=res){
				pd.put("REC_TITLE",res.get("ORIGINAL_NAME"));
				pd.put("REC_ATT",res);

			}else{
				throw new Exception("用户详细信息获取失败");
			}
		}
		if(null!=pd.getString("RESUME")){
			find.put("ID",pd.get("RESUME"));
			res=attachmentService.getOneById(find);
			if(null!=res){
				pd.put("RES_TITLE",res.get("ORIGINAL_NAME"));
				pd.put("RES_ATT",res);
			}else{
				throw new Exception("用户详细信息获取失败");
			}
		}
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}


	/**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("scuser:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();

		pd = scuserService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}


	/**
	 *机构教师分析   根据教师类型查看各学历数量
	 * @author li long
	 * @date 2019/10/23
	 * @param  * @param
	 * @return java.lang.Object
	 */
	@RequestMapping(value="/defaultTeacherDataAnalysis")
	@RequiresPermissions("scuser:edit")
	@ResponseBody
	public Object defaultTeacherDataAnalysis() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}


	/**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("scuser:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			scuserService.deleteAll(ArrayDATA_IDS);
			if(StringUtils.isNotBlank(pd.getString("TYPE"))&&pd.getString("TYPE").equals(Const.HEADMAN_TEACHER)){
				usersService.deleteAllUser(ArrayDATA_IDS);
			}
			errInfo = "success";
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**导出到excel
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/excel")
	@RequiresPermissions("toExcel")
	public ModelAndView exportExcel() throws Exception{
		ModelAndView mv = new ModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		List<String> titles = new ArrayList<String>();
		titles.add("id");	//1
		titles.add("姓名");	//2
		titles.add("性别");	//3
		titles.add("年龄");	//4
		titles.add("手机号");	//5
		titles.add("email");	//6
		titles.add("机构");	//7
		titles.add("状态");	//8
		titles.add("岗位");	//9
		titles.add("是否在编  1 在编  0 未在编");	//10
		titles.add("合同");	//11
		titles.add("档案");	//12
		titles.add("简历");	//13
		titles.add("学历  字典表中");	//14
		titles.add("职称");	//15
		titles.add("工龄 自动计算");	//16
		titles.add("入职时间");	//17
		titles.add("类型 字典表");	//18
		titles.add("备注19");	//19
		titles.add("备注20");	//20
		titles.add("备注21");	//21
		titles.add("备注22");	//22
		titles.add("备注23");	//23
		dataMap.put("titles", titles);
		List<PageData> varOList = scuserService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("SCUSER_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("NAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("SEX"));	    //3
			vpd.put("var4", varOList.get(i).getString("AGE"));	    //4
			vpd.put("var5", varOList.get(i).getString("PHONE"));	    //5
			vpd.put("var6", varOList.get(i).getString("EMAIL"));	    //6
			vpd.put("var7", varOList.get(i).getString("DEPARTMENT_ID"));	    //7
			vpd.put("var8", varOList.get(i).getString("STATUS"));	    //8
			vpd.put("var9", varOList.get(i).getString("POST"));	    //9
			vpd.put("var10", varOList.get(i).getString("ISACTIVE"));	    //10
			vpd.put("var11", varOList.get(i).getString("CONTRACT"));	    //11
			vpd.put("var12", varOList.get(i).getString("RECORD"));	    //12
			vpd.put("var13", varOList.get(i).getString("RESUME"));	    //13
			vpd.put("var14", varOList.get(i).getString("EDUCATION"));	    //14
			vpd.put("var15", varOList.get(i).getString("TITLE"));	    //15
			vpd.put("var16", varOList.get(i).getString("SENIORITY"));	    //16
			vpd.put("var17", varOList.get(i).getString("ENTRY_TIME"));	    //17
			vpd.put("var18", varOList.get(i).getString("TYPE"));	    //18
			vpd.put("var19", varOList.get(i).getString("FIELD1"));	    //19
			vpd.put("var20", varOList.get(i).getString("FIELD2"));	    //20
			vpd.put("var21", varOList.get(i).getString("FIELD3"));	    //21
			vpd.put("var22", varOList.get(i).getString("FIELD4"));	    //22
			vpd.put("var23", varOList.get(i).getString("FIELD5"));	    //23
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
	 
	/**下载模版
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/downExcel")
	public void downExcel(HttpServletResponse response)throws Exception{
		FileDownload.fileDownload(response, PathUtil.getProjectpath() + Const.FILEPATHFILE + "Users.xls", "Users.xls");
	}
	
	@RequestMapping(value="/readExcel")
	@RequiresPermissions("fromExcel")
	@SuppressWarnings("unchecked")
	@ResponseBody
	public Object readExcel(@RequestParam(value="excel",required=false) MultipartFile file) throws Exception{
		
		Map<String,String> map = new HashMap<String,String>();
		Map<String,PageData> userMap = new HashMap<String,PageData>();
		
		//所有人员
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		
		  List<PageData> listpd = scuserService.listAll(pd); 
		  for (int i = 0; i <listpd.size(); i++) { 
			  String nameEn = GetPinyin.getPingYin(listpd.get(i).getString("NAME")); 
			  String phone = listpd.get(i).getString("PHONE"); 
			  PageData su = new PageData();
			  su.put("name", nameEn); 
			  su.put("phone", phone); 
			  userMap.put(nameEn, su); 
		  }
		
		
		if (null != file && !file.isEmpty()) {
			String filePath = PathUtil.getProjectpath() + Const.FILEPATHFILE;								//文件上传路径
			String fileName =  FileUpload.fileUp(file, filePath, "userexcel");								//执行上传
			//读取数据
			List<PageData> listPd = (List)ObjectExcelRead.readExcel(filePath, fileName, 2, 0, 0);			//执行读EXCEL操作,读出的数据导入List 2:从第3行开始；0:从第A列开始；0:第0个sheet
			//所有的机构信息
			List<PageData> ospd = organizationService.lists(pd);
			//数据字典的学历
			List<Dictionaries>	xlList = dictionariesService.listSubDictByParentNameEn("EDUCATION_TYPE");
			//性别
			List<Dictionaries>	sexList = dictionariesService.listSubDictByParentNameEn("SEX");
			
			//pd.put("CREATE_TIME", DateUtil.date2Str(new Date()));
			pd.put("TITLE", "ZC_QITA");
			pd.put("AGE", "未知");
			pd.put("ISACTIVE", "1");

			List<Map> headmanInfos=new ArrayList<>();
			int index=0;
			String ORGANIZATION_ID="";

			for(int i=0;i<listPd.size();i++){
				if(listPd.get(i).containsKey("var0")&&listPd.get(i).containsKey("var1")&&listPd.get(i).containsKey("var2")&&listPd.get(i).containsKey("var3")&&listPd.get(i).containsKey("var4")&&listPd.get(i).containsKey("var5")&&listPd.get(i).containsKey("var6")) {
				}else {
					continue;
				}
				String var0 = listPd.get(i).getString("var0").replaceAll("\\s*", "");// 姓名
				String var1 = listPd.get(i).getString("var1").replaceAll("\\s*", "");// 性别
				String var2 = listPd.get(i).getString("var2").replaceAll("\\s*", "");// 
				String var3 = listPd.get(i).getString("var3").replaceAll("\\s*", "");// 
				String var4 = listPd.get(i).getString("var4").replaceAll("\\s*", "");// 机构
				String var5 = listPd.get(i).getString("var5").replaceAll("\\s*", "");// 入职时间
				String var6 = listPd.get(i).getString("var6").replaceAll("\\s*", "");// 学历
				/*
				 * if (Tools.notEmpty(var0)
				 * &&Tools.notEmpty(var1)&&Tools.notEmpty(var2)&&Tools.notEmpty(var3)&&Tools.
				 * notEmpty(var4)&&Tools.notEmpty(var5)&&Tools.notEmpty(var6)) { }else {
				 * continue; }
				 */
				if (Tools.notEmpty(var0)) {
				}else {
					throw new Exception("姓名为空，请检查文件");
				}
				String nameEn = GetPinyin.getPingYin(var0);
				if (Tools.notEmpty(var1)) {
				}else {
					throw new Exception("【"+var0+"】的性别为空，请检查文件");
				}
				if (Tools.notEmpty(var2)) {
				}else {
					throw new Exception("【"+var0+"】的手机号为空，请检查文件");
				}
				if (Tools.notEmpty(var3)) {
					if(Tools.checkEmail(var3)) {
					}else {
						throw new Exception("【"+var0+"】邮箱格式不正确，请检查文件");
					}
				}else {
					throw new Exception("【"+var0+"】的邮箱为空，请检查文件");
				}
				if (Tools.notEmpty(var4)) {
				}else {
					throw new Exception("【"+var0+"】的机构为空，请检查文件");
				}
				if (Tools.notEmpty(var5)) {
				}else {
					throw new Exception("【"+var0+"】的入职时间为空，请检查文件");
				}
				if (Tools.notEmpty(var6)) {
				}else {
					throw new Exception("【"+var0+"】的学历为空，请检查文件");	
				}
				
				pd.put("NAME", var0);//姓名
				for (int j = 0; j < sexList.size(); j++) {
					  if(var1.equals(sexList.get(j).getNAME())) {
						  pd.put("SEX", sexList.get(j).getBIANMA());//学历
						  break;
					  }
				 }
				
				pd.put("PHONE",var2);//手机号
				if(Tools.checkEmail(var3)){						//邮箱格式不对就跳过
					pd.put("EMAIL", var3);						
				}else{
					continue;
				}
				 
				for (int j = 0; j < ospd.size(); j++) {
					if (ospd.get(j).getString("NAME").equals(var4)) {
						pd.put("ORGANIZATION_ID", ospd.get(j).getString("ORGANIZATION_ID"));//机构id
						if(StringUtils.isBlank(ORGANIZATION_ID)){
							ORGANIZATION_ID=pd.getString("ORGANIZATION_ID");
						}
						if (pd.getString("TYPE").equals("3")) {
							pd.put("SCUSER_ID", ospd.get(j).getString("LICENCE"));//id
						}else {
							pd.put("SCUSER_ID",this.get32UUID());//id
						}
						break;
						}
					}
				 pd.put("ENTRY_TIME", var5);//入职时间
				 for (int j = 0; j < xlList.size(); j++) {
					  if(var6.equals(xlList.get(j).getNAME())) {
						  pd.put("EDUCATION", xlList.get(j).getBIANMA());//学历
						  break;
					  }
				 }
				 if (pd.containsKey("ORGANIZATION_ID")) {
				 }else {
					 throw new Exception("【"+var4+"】机构还没有添加，请到机构中新增");
				 }
				 if (pd.containsKey("EDUCATION")) {
					 }else {
						 throw new Exception("【"+var6+"】该学历没有,请重新检查");	
				 }
				 
				/*
				 * if (null != userMap.get(nameEn)) { if
				 * (var2.equals(userMap.get(nameEn).get("phone"))) { String type =
				 * pd.getString("TYPE"); pd.clear(); pd.put("TYPE", type); continue; }else {
				 * nameEn = GetPinyin.getPingYin(var0)+Tools.getRandomNum(); } }
				 */
				 
				 if (pd.getString("TYPE").equals("3")) {
					 if ((null != scuserService.findById(pd))) {
						 continue; 
					 }
				 }else {
					  if (null != userMap.get(nameEn)) { 
						  if (var2.equals(userMap.get(nameEn).get("phone"))) { 
						  String type = pd.getString("TYPE"); pd.clear(); pd.put("TYPE", type);
						  continue; 
						  }else {
						  nameEn = GetPinyin.getPingYin(var0)+Tools.getRandomNum(); 
						  } 
					  }
				 }
				 
				 scuserService.save(pd);

				 if (pd.getString("TYPE").equals("3")) {
				 		String password=UuidUtil.getUUID(6);
					    PageData sysUser=new PageData();  //系统用户
						sysUser.put("NAME",var0);
						sysUser.put("USER_ID",pd.getString("SCUSER_ID"));
						//sysUser.put("NUMBER",pd.getString("NUMBER"));
						sysUser.put("PHONE",var2);
						sysUser.put("EMAIL",var3);
						sysUser.put("ROLE_ID",Const.DEFAULT_HEADMAN_ROLE_ID);
						sysUser.put("LAST_LOGIN", "");						//最后登录时间
						sysUser.put("IP", "");								//IP
						sysUser.put("STATUS", "0");							//状态
						sysUser.put("SKIN", "assets/windows/images/bg_01.jpg");		//用户默认皮肤
						sysUser.put("DEPARTMENT_ID", pd.getString("ORGANIZATION_ID"));		//用户默认皮肤
						sysUser.put("PASSWORD", new SimpleHash("SHA-1", pd.getString("SCUSER_ID"), password).toString());			//密码加密
						sysUser.put("USERNAME",pd.getString("SCUSER_ID"));
					    usersService.saveUser(sysUser);
						PageData pdoa = new PageData();
						pdoa.put("ORGANIZATION_ID", pd.getString("ORGANIZATION_ID"));
						PageData os = organizationService.findById(pdoa);
						os.put("HEADMAN", var0);
						os.put("HEADMAN_ID", pd.getString("SCUSER_ID"));
						os.put("HEADMAN_PHONE", var2);
						organizationService.edit(os);
						 //将生成的机构负责人密码进行存储，然后进行导出
						 Map<String,Object> headmanInfo=new HashMap<>();
						 headmanInfo.put("序号",String.valueOf(++index));
						 headmanInfo.put("机构名",var4);
						 headmanInfo.put("负责人",var0);
						 headmanInfo.put("用户名",pd.getString("SCUSER_ID"));
						 headmanInfo.put("密码",password);
						 headmanInfos.add(headmanInfo);
				  }
				 
				// PageData sc = new PageData();
				// sc.put("name", nameEn);
				// sc.put("phone", var2);
				// userMap.put(nameEn, sc);
				 String type = pd.getString("TYPE");
				 pd.clear();
				 pd.put("TYPE", type);
				 pd.put("TITLE", "ZC_QITA");
				 pd.put("AGE", "未知");
				 pd.put("ISACTIVE", "1");
				 
			}
			//将密码进行存储到本地
			if(headmanInfos.size()!=0){
				List<String> titles=new ArrayList<>();
				titles.add("序号");
				titles.add("机构名");
				titles.add("负责人");
				titles.add("用户名");
				titles.add("密码");
				PageData findOrganization=new PageData();
				findOrganization.put("ORGANIZATION_ID",ORGANIZATION_ID);
				PageData organization = organizationService.findById(findOrganization);
				findOrganization.put("DICTIONARIES_ID",organization.get("PARENT_ID"));
				PageData topParentOrganization = dictionariesService.findById(findOrganization);
				Map resMap = ObjectExcelView.exportExcelToLocal(titles, headmanInfos, "C:\\Users\\Public\\user"+topParentOrganization.get("NAME")+".xls");
				if(!"success".equals(resMap.get("result"))){
					File file1=new File("C:\\Users\\Public\\user.xls");
					file1.delete();
				}
			}
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}


	/**主页统计数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/getDetailData")
	@ResponseBody
	public Object getDetailData() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		boolean isUser=true;
		int exUserNum=0;
		int orNum=0;
		User user=Jurisdiction.getUser();
		pd = this.getPageData();
		//专业数量
		if(Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())){
			isUser=false;
		}
		PageData find=new PageData();
		if(isUser){
			PageData findUser=new PageData();
			findUser.put("SCUSER_ID",user.getUSER_ID());
			PageData organization = scuserService.findOrganizationByScuser(findUser);
			find.put("ORGANIZATION_ID",organization.getString("ORGANIZATION_ID"));
		} else{
			//合同即将到期人数
			exUserNum=scuserService.findExpirescUserCount(pd);
			orNum=organizationService.count(pd);
		}
		int majorNum=  specialitiesService.count(find);  //专业数量
		//岗位数量
		int postNum=postService.count(find);   //岗位信息
		//教师总人数
		int teacherNum = scuserService.countScuserNum(find);

		//机构总数.

		map.put("majorNum",majorNum);
		map.put("postNum",postNum);
		map.put("orNum",orNum);
		map.put("teacherNum",teacherNum);
		map.put("exUserNum",exUserNum);
		map.put("isUser",isUser);
		map.put("result", errInfo);
		return map;
	}
	
}
