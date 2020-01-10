package org.fh.controller.approvetype;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import org.apache.commons.lang3.StringUtils;
import org.fh.entity.system.User;
import org.fh.service.scuser.ScuserService;
import org.fh.util.Jurisdiction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.fh.entity.PageData;
import org.fh.service.approvetype.ApproveTypeService;

/** 
 * 说明：审批类型
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-14
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/approvetype")
public class ApproveTypeController extends BaseController {
	
	@Autowired
	private ApproveTypeService approveTypeService;

	@Autowired
	private ScuserService scuserService;


	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("approvetype:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("APPROVETYPE_ID", this.get32UUID());	//主键
		approveTypeService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("approvetype:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		approveTypeService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("approvetype:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		approveTypeService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("approvetype:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		String APPROVETYPE_ID= (String) pd.get("APPROVETYPE_ID");
		pd.put("APPROVETYPE_ID",APPROVETYPE_ID);
		page.setPd(pd);
		List<PageData> approveList = approveTypeService.listSubApproveTypeByParentId(page);
		map.put("pd", approveTypeService.findById(pd));									//传入父菜单所有信息
		map.put("MSG", null == pd.get("MSG")?"'list'":pd.get("MSG").toString()); 	//MSG=change 则为编辑或删除后跳转过来的
//		List<PageData>	varList = organizationService.list(page);	//列出Organization列表
		map.put("varList", approveList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}
	
	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("approvetype:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = approveTypeService.findById(pd);						//读取此ID的菜单数据
		map.put("pd", pd);
		pd.put("APPROVETYPE_ID",pd.get("PARENT_ID").toString());		//用作读取父菜单信息
		map.put("pds", approveTypeService.findById(pd));			//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}


	/**
	 * 请求新增菜单页面
	 * @return
	 */
	@RequestMapping(value="/toAdd")
	@RequiresPermissions("approvetype:add")
	@ResponseBody
	public Object toAdd()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String APPROVETYPE_ID = (null == pd.get("APPROVETYPE_ID") || "".equals(pd.get("APPROVETYPE_ID").toString()))?"0":pd.get("APPROVETYPE_ID").toString();//接收传过来的上级菜单ID,如果上级为顶级就取值“0”
		pd.put("APPROVETYPE_ID",APPROVETYPE_ID);
		map.put("pds", approveTypeService.findById(pd));	//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("approvetype:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			approveTypeService.deleteAll(ArrayDATA_IDS);
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
		titles.add("父id");	//2
		titles.add("英文名");	//3
		titles.add("类型名");	//4
		titles.add("备注5");	//5
		titles.add("备注6");	//6
		titles.add("备注7");	//7
		titles.add("备注8");	//8
		dataMap.put("titles", titles);
		List<PageData> varOList = approveTypeService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("APPROVETYPE_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("PARENT_ID"));	    //2
			vpd.put("var3", varOList.get(i).getString("NAME_EN"));	    //3
			vpd.put("var4", varOList.get(i).getString("NAME"));	    //4
			vpd.put("var5", varOList.get(i).getString("FIELD1"));	    //5
			vpd.put("var6", varOList.get(i).getString("FIELD2"));	    //6
			vpd.put("var7", varOList.get(i).getString("FIELD3"));	    //7
			vpd.put("var8", varOList.get(i).getString("FIELD4"));	    //8
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}



	/**
	 * 审批类型列表ztree
	 * @return
	 */
	@RequestMapping(value="/listAllApproveType")
	@RequiresPermissions("approvetype:list")
	@ResponseBody
	public Object listAllApproveType()throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		List<PageData> parentList=new ArrayList<>();
		PageData pageData=new PageData();
		pageData=this.getPageData();
		parentList= approveTypeService.listAllApproveType(pageData);
		JSONArray arr = JSONArray.fromObject(parentList);
		String json = arr.toString();
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 显示列表ztree
	 * @return
	 */
	@RequestMapping(value="/listTreeAll")
	@RequiresPermissions("approvetype:list")
	@ResponseBody
	public Object listTreeAll()throws Exception{
		PageData pageData=new PageData();
		pageData=this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		List<PageData> all = approveTypeService.listAllTree(pageData);
		if(!StringUtils.isBlank((String)(pageData.get("ID")))){
			PageData inform = approveTypeService.findById(pageData);
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
	 *根据审批id 或者父审批类型id   获取子审批类型
	 *
	 * @author li long
	 * @date 2019/10/15
	 * @param  * @param
	 * @return java.lang.Object
	 */
	@RequestMapping(value="/getApproveType")
	@ResponseBody
	public Object getApproveType(Page page)throws Exception{
		PageData pageData=new PageData();
		pageData=this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		User user = Jurisdiction.getUser();
		PageData findApprove=new PageData();
		if(StringUtils.isBlank(pageData.getString("APPROVE_PID"))){  //如果审批id为空  说明为进入页面时 根据机构类型 进行获取父审批类型
			PageData findUser=new PageData();
			findUser.put("SCUSER_ID",user.getUSER_ID());
			PageData findOrganzationRes = scuserService.findOrganizationByScuser(findUser);
			findApprove.put("APPROVETYPE_ID",findOrganzationRes.get("TYPE_ID"));
		}else{  //不为空 则是通过审批父类型获取子审批类型列表
			findApprove.put("APPROVETYPE_ID",pageData.get("APPROVE_PID"));
		}
		findApprove.put("TYPE",pageData.get("TYPE"));
		page.setPd(findApprove);
		List<PageData> approveList = approveTypeService.listSubApproveTypeByParentId(page);
		map.put("approveList",approveList);
		map.put("result",errInfo);
		return map;
	}

	/**
	 *获取年审审批类型 父类型 和子类型
	 *
	 * @author li long
	 * @date 2019/10/15
	 * @param  * @param
	 * @return java.lang.Object
	 */
	@RequestMapping(value="/getApproveTypesOfExamination")
	@ResponseBody
	public Object getApproveTypesOfExamination(Page page)throws Exception{
		PageData pageData=new PageData();
		pageData=this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		User user = Jurisdiction.getUser();
		PageData findApprove=new PageData();
		if(StringUtils.isBlank(pageData.getString("APPROVE_PID"))){
			PageData findUser=new PageData();
			findUser.put("SCUSER_ID",user.getUSER_ID());
			PageData findOrganzationRes = scuserService.findOrganizationByScuser(findUser);
			findApprove.put("APPROVETYPE_ID",findOrganzationRes.get("TYPE_ID"));
			findApprove.put("TYPE","2");
		}
		page.setPd(findApprove);
		//父类型
		List<PageData> approveList = approveTypeService.listSubApproveTypeByParentId(page);
		String appType1="";
		String appType2="";
		if(approveList.size()!=0){
			//父类型
			 appType1=approveList.get(0).getString("APPROVETYPE_ID");
		}
		findApprove.put("APPROVETYPE_ID",appType1);
		findApprove.put("TYPE","2");
		page.setPd(findApprove);
		List<PageData> approveList2 = approveTypeService.listSubApproveTypeByParentId(page);
		if(approveList.size()!=0){
			//子类型
			appType2=approveList2.get(0).getString("APPROVETYPE_ID");
		}
		map.put("appType1",appType1);
		map.put("appType2",appType2);
		map.put("result",errInfo);
		return map;
	}


	@RequestMapping(value="/getAllFormInfoByApproveId")
	@ResponseBody
	public Object getAllPathByApproveId()throws Exception{
		PageData pageData=new PageData();
		pageData=this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		User user = Jurisdiction.getUser();
		PageData findUser=new PageData();
		findUser.put("SCUSER_ID",user.getUSER_ID());
		PageData findOrganzationRes = scuserService.findOrganizationByScuser(findUser);
		String allPath = approveTypeService.getAllPathByApproveTypeId(pageData);
		String organizationType=findOrganzationRes.getString("BIANMA");
		//TODO 根据机构类型 获取不同的文件夹

			if(organizationType.equals("MINBAN_CULTIVATE_SCHOOL")){  //民办培训学校
				allPath="../../approvefulldata/government/mbpeixun/"+allPath;
			}else if(organizationType.equals("MINBAN_KINDERGARTEN_SCHOOL")){  //民办幼儿园
				allPath="../../approvefulldata/government/mbyoueryuan/"+allPath;
			}else if(organizationType.equals("NO_EDUCATIONAL_ADMINISTRATION")){  //公办幼儿园
				allPath="../../approvefulldata/government/gbyoueryuan/"+allPath;
			}else if(organizationType.equals("BOARDING_DEPARTMENT_APPROVAL")){  //寄宿部审批
				allPath="../../approvefulldata/government/jsbshenpi/"+allPath;
			}else if(organizationType.equals("MINBAN_MIDDLE_AND_PRIMARY_SCHOOL\t")){  //民办中小学
				allPath="../../approvefulldata/government/mbzhongxiaoxue/"+allPath;
			}
		String errInfo = "success";
		map.put("result",errInfo);
		map.put("path",allPath);
		return map;
	}










}
