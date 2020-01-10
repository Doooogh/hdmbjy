package org.fh.controller.approve;

import java.util.ArrayList;
import java.util.Date;
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
import org.fh.util.DateUtil;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.fh.entity.PageData;
import org.fh.service.approve.ApproveService;

/** 
 * 说明：审批类型
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-14
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/approve")
public class ApproveController extends BaseController {
	
	@Autowired
	private ApproveService approveService;

	@Autowired
	private ScuserService scuserService;


	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("approve:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("APPROVE_ID", this.get32UUID());	//主键
		approveService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("approve:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		approveService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("approve:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		approveService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("approve:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		String APPROVE_ID= (String) pd.get("APPROVE_ID");
		APPROVE_ID = Tools.isEmpty(APPROVE_ID)?"0":APPROVE_ID;
		pd.put("APPROVE_ID",APPROVE_ID);
		page.setPd(pd);
		List<PageData> approveList = approveService.listSubApproveByParentId(page);
		map.put("pd", approveService.findById(pd));									//传入父菜单所有信息
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
	@RequiresPermissions("approve:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = approveService.findById(pd);						//读取此ID的菜单数据
		map.put("pd", pd);
		pd.put("APPROVE_ID",pd.get("PARENT_ID").toString());		//用作读取父菜单信息
		map.put("pds", approveService.findById(pd));			//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}


	/**
	 * 请求新增菜单页面
	 * @return
	 */
	@RequestMapping(value="/toAdd")
	@RequiresPermissions("approve:add")
	@ResponseBody
	public Object toAdd()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String APPROVE_ID = (null == pd.get("APPROVE_ID") || "".equals(pd.get("APPROVE_ID").toString()))?"0":pd.get("APPROVE_ID").toString();//接收传过来的上级菜单ID,如果上级为顶级就取值“0”
		pd.put("APPROVE_ID",APPROVE_ID);
		map.put("pds", approveService.findById(pd));	//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("approve:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			approveService.deleteAll(ArrayDATA_IDS);
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
		List<PageData> varOList = approveService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("APPROVE_ID"));	    //1
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
	@RequestMapping(value="/listAllApprove")
	@RequiresPermissions("approve:list")
	@ResponseBody
	public Object listAllOrganization()throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		List<PageData> parentList=new ArrayList<>();
		PageData pageData=new PageData();
		pageData=this.getPageData();
		parentList=approveService.listAllApprove(pageData);
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
	@RequiresPermissions("approve:list")
	@ResponseBody
	public Object listTreeAll()throws Exception{
		PageData pageData=new PageData();
		pageData=this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		List<PageData> all = approveService.listAllTree(pageData);
		if(!StringUtils.isBlank((String)(pageData.get("ID")))){
			PageData inform = approveService.findById(pageData);
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
	 *功能描述
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
		if(StringUtils.isBlank(pageData.getString("APPROVE_PID"))){
			PageData findUser=new PageData();
			findUser.put("SCUSER_ID",user.getUSER_ID());
			PageData findOrganzationRes = scuserService.findOrganizationByScuser(findUser);
			findApprove.put("APPROVE_ID",findOrganzationRes.get("TYPE_ID"));
		}else{
			findApprove.put("APPROVE_ID",pageData.get("APPROVE_PID"));
		}
		page.setPd(findApprove);
		List<PageData> approveList = approveService.listSubApproveByParentId(page);
		map.put("approveList",approveList);
		map.put("result",errInfo);
		return map;
	}


	@RequestMapping(value="/getAllPathByApproveId")
	@ResponseBody
	public Object getAllPathByApproveId()throws Exception{
		PageData pageData=new PageData();
		pageData=this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		User user = Jurisdiction.getUser();
		PageData findUser=new PageData();
		findUser.put("SCUSER_ID",user.getUSER_ID());
		PageData findOrganzationRes = scuserService.findOrganizationByScuser(findUser);
		String allPath = approveService.getAllPathByApproveId(pageData);
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
