package org.fh.controller.organization;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.Dictionaries;
import org.fh.service.organization.OrganizationService;
import org.fh.service.scuser.ScuserService;
import org.fh.service.system.DictionariesService;
import org.fh.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import net.sf.json.JSONArray;

/** 
 * 说明：民办学校机构
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-27
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/organization")
public class OrganizationController extends BaseController {
	
	@Autowired
	private OrganizationService organizationService;

	@Autowired
	private ScuserService scuserService;

	@Autowired
	private DictionariesService dictionariesService;


	/**
	 * 机构列表ztree
	 * @return
	 */
	@RequestMapping(value="/listAllOrganization")
	@RequiresPermissions("organization:list")
	@ResponseBody
	public Object listAllOrganization()throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		List<PageData> parentList=new ArrayList<>();
		PageData pageData=new PageData();
		pageData=this.getPageData();
		parentList=organizationService.listAllOrganization(pageData);
		JSONArray arr = JSONArray.fromObject(parentList);
		String json = arr.toString();
		map.put("zTreeNodes", json);
		map.put("userName", Jurisdiction.getUsername());
		map.put("result", errInfo);
		return map;
	}
	
	/**
	 * 机构列表ztree 用于通知
	 * @return
	 */
	@RequestMapping(value="/listAllOrganizationForInform")
	@RequiresPermissions("organization:list")
	@ResponseBody
	public Object listAllOrganizationForInform()throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		List<PageData> parentList = new ArrayList<>();
		PageData pageData = new PageData();
		pageData = this.getPageData();
		parentList = organizationService.listAllOrganization(pageData);
		if(parentList != null && parentList .size() > 0) {
			for (int i = 0; i < parentList.size(); i++) {
				parentList.get(i).remove("url");
				parentList.get(i).remove("target");
			}
		}
		JSONArray arr = JSONArray.fromObject(parentList);
		String json = arr.toString();
		
		map.put("zTreeNodes", json);
		map.put("userName", Jurisdiction.getUsername());
		map.put("result", errInfo);
		return map;
	}
	/**
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/pdOrganizationID")
	@ResponseBody
	public Object pdOrganizationID()throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		
		List<PageData> list = organizationService.findByUserId(Jurisdiction.getUser().getUSER_ID());
		if (list.size()>0) {
			map.put("id", list.get(0).getString("ORGANIZATION_ID"));
		}
		map.put("name", Jurisdiction.getUsername());
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 显示列表ztree
	 * @return
	 */
	@RequestMapping(value="/listTreeAll")
	@RequiresPermissions("organization:list")
	@ResponseBody
	public Object listTreeAll()throws Exception{
		PageData pageData=new PageData();
		pageData=this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		List<PageData> all = organizationService.listAllTree(pageData);
		if(!StringUtils.isBlank((String)(pageData.get("ID")))){
			PageData inform = organizationService.findById(pageData);
			String ORGANIZATION_IDS= (String) inform.get("DEPARTMENT_ID");
			String[] split = ORGANIZATION_IDS.split(",");
			for (PageData data : all) {
				for (String s : split) {
					String dId=(String)data.get("id");
					if(dId.equals(s)){
						data.put("checked",true);
					}
				}
			}
		}
		JSONArray arr = JSONArray.fromObject(all);
		String json = arr.toString();
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		return map;
	}



	/**
	 * 请求新增菜单页面
	 * @return
	 */
	@RequestMapping(value="/toAdd")
	@RequiresPermissions("organization:add")
	@ResponseBody
	public Object toAdd()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String ORGANIZATION_ID = (null == pd.get("ORGANIZATION_ID") || "".equals(pd.get("ORGANIZATION_ID").toString()))?"0":pd.get("ORGANIZATION_ID").toString();//接收传过来的上级菜单ID,如果上级为顶级就取值“0”
		pd.put("ORGANIZATION_ID",ORGANIZATION_ID);
		map.put("pds", organizationService.findById(pd));	//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("organization:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("ORGANIZATION_ID", this.get32UUID());	//主键

/*
		//根据机构的信息中的负责人和负责人电话  查询是否有该负责人
		PageData headman=new PageData();
		headman.put("NAME",pd.getString("HEADMAN"));
		headman.put("PHONE",pd.getString("HEADMAN_PHONE"));
		PageData headmanInfo = scuserService.findByHeadmanInfo(headman);
		if(null!=headmanInfo){
			pd.put("HEADMAN_ID",headman.get("SCUSER_ID"));
		}else{
			errInfo="exception";
			map.put("result",errInfo);
			return map;
		}*/
		organizationService.save(pd);
		map.put("result", errInfo);
		return map;
	}


	/**
	 *功能描述
	 *  判断该部门是否已经有负责人 一个机构只能有一个机构
	 * @author li long
	 * @date 2019/10/11
	 * @param  * @param
	 * @return java.lang.Object
	 */
	@RequestMapping(value="/hasHeadman")
	@RequiresPermissions("organization:list")
	@ResponseBody
	public Object hasHeadman() throws Exception {
		Map<String, String> map = new HashMap<String, String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData organization = organizationService.findById(pd);
		if(null!=organization.get("HEADMAN")&&null!=organization.get("HEADMAN_ID")){
			map.put("res","true");    //如果没有负责人 就返回true
		}else{
			map.put("res","false");   //如果已经有负责人 就返回false
		}
		map.put("result",errInfo);
		return map;
	}

	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("organization:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		organizationService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("organization:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		organizationService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("organization:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());

		String ORGANIZATION_ID= (String) pd.get("ORGANIZATION_ID");

		pd.put("ORGANIZATION_ID",ORGANIZATION_ID);
		page.setPd(pd);
		List<PageData> organizationList = organizationService.listSubOrganizationByParentId(page);
		map.put("pd", organizationService.findById(pd));									//传入父菜单所有信息
		map.put("MSG", null == pd.get("MSG")?"'list'":pd.get("MSG").toString()); 	//MSG=change 则为编辑或删除后跳转过来的
//		List<PageData>	varList = organizationService.list(page);	//列出Organization列表
		map.put("varList", organizationList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}


	public static void main(String[] args) {

	}
	/**列表
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/allList")
//	@RequiresPermissions("organization:list")
	@ResponseBody
	public Object allList() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.getString("TYPE");
		List<PageData> allList=new ArrayList<>();
		if(null==DataCache.CACHEDATA.get(pd.getString("TYPE"))){
			allList = organizationService.listAll(pd);  //获得到筛选后的集合
			DataCache.CACHEDATA.put(pd.getString("TYPE"),allList);
		}else{
			allList= (List<PageData>) DataCache.CACHEDATA.get(pd.getString("TYPE"));
		}
		map.put("result",errInfo);
		map.put("list",allList);
		return map;
	}
	
	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("organization:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = organizationService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 请求编辑菜单页面
	 * @param
	 * @return
	 */
	@RequestMapping(value="/toEdit")
	@RequiresPermissions("organization:edit")
	@ResponseBody
	public Object toEdit()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = organizationService.findById(pd);						//读取此ID的菜单数据
		map.put("pd", pd);
		pd.put("ORGANIZATION_ID",pd.get("PARENT_ID").toString());		//用作读取父菜单信息
		map.put("pds", organizationService.findById(pd));			//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("organization:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			organizationService.deleteAll(ArrayDATA_IDS);
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
		titles.add("名字");	//2
		titles.add("英文名");	//3
		titles.add("许可证号");	//4
		titles.add("父id");	//5
		titles.add("父ids");	//6
		titles.add("负责人姓名");	//7
		titles.add("负责人id");	//8
		titles.add("历史负责人");	//9
		titles.add("电话");	//10
		titles.add("简介");	//11
		titles.add("开办专业s");	//12
		titles.add("编制");	//13
		titles.add("地址");	//14
		titles.add("岗位s");	//15
		titles.add("创建时间");	//16
		titles.add("备注17");	//17
		titles.add("备注18");	//18
		titles.add("备注19");	//19
		titles.add("备注20");	//20
		titles.add("备注21");	//21
		titles.add("备注22");	//22
		dataMap.put("titles", titles);
		List<PageData> varOList = organizationService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("ORGANIZATION_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("NAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("NAME_EN"));	    //3
			vpd.put("var4", varOList.get(i).getString("LICENCE"));	    //4
			vpd.put("var5", varOList.get(i).getString("PARENT_ID"));	    //5
			vpd.put("var6", varOList.get(i).getString("PARENT_IDS"));	    //6
			vpd.put("var7", varOList.get(i).getString("HEADMAN"));	    //7
			vpd.put("var8", varOList.get(i).getString("HEADMAN_ID"));	    //8
			vpd.put("var9", varOList.get(i).getString("HIS_HEADMANS"));	    //9
			vpd.put("var10", varOList.get(i).getString("TEL"));	    //10
			vpd.put("var11", varOList.get(i).getString("INTRO"));	    //11
			vpd.put("var12", varOList.get(i).getString("MAJOR"));	    //12
			vpd.put("var13", varOList.get(i).getString("ISACTIVE"));	    //13
			vpd.put("var14", varOList.get(i).getString("ADDRESS"));	    //14
			vpd.put("var15", varOList.get(i).getString("POSTS"));	    //15
			vpd.put("var16", varOList.get(i).getString("CREATE_TIME"));	    //16
			vpd.put("var17", varOList.get(i).getString("FIELD1"));	    //17
			vpd.put("var18", varOList.get(i).getString("FIELD2"));	    //18
			vpd.put("var19", varOList.get(i).getString("FIELD3"));	    //19
			vpd.put("var20", varOList.get(i).getString("FIELD4"));	    //20
			vpd.put("var21", varOList.get(i).getString("FIELD5"));	    //21
			vpd.put("var22", varOList.get(i).getString("FIELD6"));	    //22
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
	
	@RequestMapping(value="/readExcel")
	@RequiresPermissions("fromExcel")
	@SuppressWarnings("unchecked")
	@ResponseBody
	public Object readExcel(@RequestParam(value="excel",required=false) MultipartFile file) throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if (null != file && !file.isEmpty()) {
			String filePath = PathUtil.getProjectpath() + Const.FILEPATHFILE;								//文件上传路径
			String fileName =  FileUpload.fileUp(file, filePath, "organizationexcel");								//执行上传
			List<PageData> listPd = (List)ObjectExcelRead.readExcel(filePath, fileName, 2, 0, 0);			//执行读EXCEL操作,读出的数据导入List 2:从第3行开始；0:从第A列开始；0:第0个sheet
			PageData pdtype = dictionariesService.findById(pd);
			pd.put("CREATE_TIME", DateUtil.date2Str(new Date()));
			pd.put("INTRO", "暂无数据");
			pd.put("BIANZHI", "");
			pd.put("PARENT_ID", pdtype.getString("DICTIONARIES_ID"));//var2 :学区
			/**
			 * var0 :机构名称
			 * var1 :类型
			 * var2 :学区
			 * var3 :许可证号
			 * var4 :联系方式
			 * var5 :地址
			 */
			for(int i=0;i<listPd.size();i++){	
				if(listPd.get(i).containsKey("var0")&&listPd.get(i).containsKey("var1")&&listPd.get(i).containsKey("var2")&&listPd.get(i).containsKey("var3")&&listPd.get(i).containsKey("var4")) {
				}else {
					continue;
				}
				
				pd.put("ORGANIZATION_ID", this.get32UUID());										
				String var0 = listPd.get(i).getString("var0").replaceAll("\\s*", "");//机构名称
				String var1 = listPd.get(i).getString("var1").replaceAll("\\s*", "");//类型
				String var2 = listPd.get(i).getString("var2").replaceAll("\\s*", "");//许可证号
				String var3 = listPd.get(i).getString("var3").replaceAll("\\s*", "");//联系方式
				String var4 = listPd.get(i).getString("var4").replaceAll("\\s*", "");//地址
				
				if (Tools.notEmpty(var0)) {
				}else {
					throw new Exception("机构名称为空，请检查文件");
				}
				
				if (Tools.notEmpty(var1)) {
				}else {
					throw new Exception("【"+var0+"】的机构类型为空，请检查文件");
				}
			
				if (Tools.notEmpty(var2)) {
				}else {
					throw new Exception("【"+var0+"】的许可证号为空，请检查文件");
				}
				
				if (Tools.notEmpty(var3)) {
				}else {
					throw new Exception("【"+var0+"】的联系方式为空，请检查文件");
				}
				
				if (Tools.notEmpty(var4)) {
				}else {
					throw new Exception("【"+var0+"】的地址为空，请检查文件");
				}
				
				pd.put("NAME", var0);//var0 :机构名称
				
				pd.put("TYPE", pdtype.getString("BIANMA"));
				pd.put("LICENCE", var2);//var3 :许可证号
				pd.put("TEL", var3);//var4 :联系方式
				pd.put("ADDRESS", var4);//var5 :地址
				if(organizationService.findByLicence(pd) != null){
					pd.clear();
					pd.put("CREATE_TIME", DateUtil.date2Str(new Date()));
					pd.put("INTRO", "暂无数据");
					pd.put("BIANZHI", "");
					pd.put("PARENT_ID", pdtype.getString("DICTIONARIES_ID"));
					continue;
				}
				organizationService.save(pd);
				pd.clear();
				pd.put("CREATE_TIME", DateUtil.date2Str(new Date()));
				pd.put("INTRO", "暂无数据");
				pd.put("PARENT_ID", pdtype.getString("DICTIONARIES_ID"));
				pd.put("BIANZHI", "");
			}
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**下载模版
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/downExcel")
	public void downExcel(HttpServletResponse response)throws Exception{
		FileDownload.fileDownload(response, PathUtil.getProjectpath() + Const.FILEPATHFILE + "Organization.xls", "Organization.xls");
	}
	
}
