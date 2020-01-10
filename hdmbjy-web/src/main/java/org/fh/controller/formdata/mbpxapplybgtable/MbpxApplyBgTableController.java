package org.fh.controller.formdata.mbpxapplybgtable;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fh.entity.system.User;
import org.fh.service.approveform.ApproveFormService;
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
import org.fh.service.formdata.mbpxapplybgtable.MbpxApplyBgTableService;

/** 
 * 说明：海淀区民办培训学校申请变更审批表
 * 作者：FH Admin QQ313596790
 * 时间：2019-12-06
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/mbpxapplybgtable")
public class MbpxApplyBgTableController extends BaseController {
	
	@Autowired
	private MbpxApplyBgTableService mbpxapplybgtableService;

	@Autowired
	private ApproveFormService approveFormService;

	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("MBPXAPPLYBGTABLE_ID", this.get32UUID());	//主键
		mbpxapplybgtableService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("MBPXAPPLYBGTABLE_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("MBPXAPPLYBGTABLE_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		mbpxapplybgtableService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		mbpxapplybgtableService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("MBPXAPPLYBGTABLE_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = mbpxapplybgtableService.list(page);	//列出MbpxApplyBgTable列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}
	
	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = mbpxapplybgtableService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			mbpxapplybgtableService.deleteAll(ArrayDATA_IDS);
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
		titles.add("海教社变号");	//1
		titles.add("学校全称");	//2
		titles.add("教民号1");	//3
		titles.add("教民号2");	//4
		titles.add("校长及电话");	//5
		titles.add("联系人及电话");	//6
		titles.add("校名");	//7
		titles.add("校址");	//8
		titles.add("举办者变更");	//9
		titles.add("变更前");	//10
		titles.add("变更后");	//11
		titles.add("变更理由");	//12
		titles.add("举办者意见");	//13
		titles.add("举办者意见日期");	//14
		titles.add("教育行政部门审批意见");	//15
		titles.add("教育行政部门审批意见日期");	//16
		titles.add("交件人");	//17
		titles.add("交件日期");	//18
		titles.add("受理人");	//19
		titles.add("受理日期");	//20
		titles.add("审核人");	//21
		titles.add("审核日期");	//22
		titles.add("复审人");	//23
		titles.add("复审日期");	//24
		titles.add("备注");	//25
		dataMap.put("titles", titles);
		List<PageData> varOList = mbpxapplybgtableService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("NUMBER"));	    //1
			vpd.put("var2", varOList.get(i).getString("SCHOOL_NAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("J_NUMBER1"));	    //3
			vpd.put("var4", varOList.get(i).getString("J_NUMBER2"));	    //4
			vpd.put("var5", varOList.get(i).getString("PRINCIPAL_AND_PHONE"));	    //5
			vpd.put("var6", varOList.get(i).getString("LINKMAN_AND_PHONE"));	    //6
			vpd.put("var7", varOList.get(i).getString("TO_SCHOOL_NAME"));	    //7
			vpd.put("var8", varOList.get(i).getString("TO_SCHOOL_ADDRESS"));	    //8
			vpd.put("var9", varOList.get(i).getString("TO_ORGANIZER"));	    //9
			vpd.put("var10", varOList.get(i).getString("CHANGE_BEFORE"));	    //10
			vpd.put("var11", varOList.get(i).getString("CHANGE_AFTER"));	    //11
			vpd.put("var12", varOList.get(i).getString("REASON"));	    //12
			vpd.put("var13", varOList.get(i).getString("ORGANIZER_OPINION"));	    //13
			vpd.put("var14", varOList.get(i).getString("ORGANIZER_OPINION_DATE"));	    //14
			vpd.put("var15", varOList.get(i).getString("DEPT_OPINION"));	    //15
			vpd.put("var16", varOList.get(i).getString("DEPT_OPINION_DATE"));	    //16
			vpd.put("var17", varOList.get(i).getString("SENDER"));	    //17
			vpd.put("var18", varOList.get(i).getString("SENDER_DATE"));	    //18
			vpd.put("var19", varOList.get(i).getString("RECEIVER"));	    //19
			vpd.put("var20", varOList.get(i).getString("RECEIVER_DATE"));	    //20
			vpd.put("var21", varOList.get(i).getString("AUDITOR"));	    //21
			vpd.put("var22", varOList.get(i).getString("AUDITOR_DATE"));	    //22
			vpd.put("var23", varOList.get(i).getString("AGAIN_AUDITOR"));	    //23
			vpd.put("var24", varOList.get(i).getString("AGAIN_AUDITOR_DATE"));	    //24
			vpd.put("var25", varOList.get(i).getString("BEIZHU"));	    //25
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}


	@ResponseBody
	@RequestMapping("/getFullDataUser")
	public Object getFullDataUser(){
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		User user= Jurisdiction.getUser();
		if(null!=user){
			map.put("FULLDATA_BY",user.getNAME());
		}else{
			map.put("FULLDATA_BY","");
		}
		map.put("result",errInfo);
		return map;
	}
	
}
