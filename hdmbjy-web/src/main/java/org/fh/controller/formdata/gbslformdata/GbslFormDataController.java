package org.fh.controller.formdata.gbslformdata;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fh.service.approveform.ApproveFormService;
import org.fh.service.approvetype.ApproveTypeService;
import org.fh.service.fulldata.FulldataService;
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
import org.fh.service.formdata.gbslformdata.GbslFormDataService;

/** 
 * 说明：审批表单填报(公办幼儿园设立举办者基本信息)
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-17
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/gbslformdata")
public class GbslFormDataController extends BaseController {
	
	@Autowired
	private GbslFormDataService gbslformdataService;

	@Autowired
	private ApproveFormService approveFormService;

	@Autowired
	private FulldataService fulldataService;

	@Autowired
	private ApproveTypeService approveTypeService;
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
		pd.put("CREATE_TIME",new Date());
		pd.put("GBSLFORMDATA_ID", this.get32UUID());	//主键
		gbslformdataService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("GBSLFORMDATA_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
/*		PageData findApproveType=new PageData();
		findApproveType.put("APPROVETYPE_ID",pd.get("FORM_TYPE"));
		//根据填入的表单 的审批类型id  获取该表单页面的html路径 allPath  和顶级的approveType类型id
		PageData approveTypeAndAllPath = approveTypeService.getTopApproveTypeAndAllPath(findApproveType);*/
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		/*PageData fulldata = fulldataService.findById(findFullData);
		if(null!=fulldata){
			approveForm.put("FORMDATA_URL",fulldata.get("PAGE_NAME"));
		}*/
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("GBSLFORMDATA_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("gbslformdata:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		gbslformdataService.delete(pd);
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
		gbslformdataService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("GBSLFORMDATA_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("gbslformdata:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = gbslformdataService.list(page);	//列出GbslFormData列表
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
		pd = gbslformdataService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("gbslformdata:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			gbslformdataService.deleteAll(ArrayDATA_IDS);
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
		titles.add("学校名称");	//2
		titles.add("备注3");	//3
		titles.add("地址");	//4
		titles.add("邮政编码");	//5
		titles.add("法人");	//6
		titles.add("法人类型");	//7
		titles.add("注册资金");	//8
		titles.add("现有总资金");	//9
		titles.add("开户银行");	//10
		titles.add("提供办学资金");	//11
		titles.add("银行账户");	//12
		titles.add("创建时间");	//13
		titles.add("更新时间");	//14
		dataMap.put("titles", titles);
		List<PageData> varOList = gbslformdataService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("GBSLFORMDATA_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("SCHOOL_NAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("PHONE"));	    //3
			vpd.put("var4", varOList.get(i).getString("ADDRESS"));	    //4
			vpd.put("var5", varOList.get(i).getString("POSTCODE"));	    //5
			vpd.put("var6", varOList.get(i).getString("LEGALPERSON"));	    //6
			vpd.put("var7", varOList.get(i).getString("LEGALPERSON_TYPE"));	    //7
			vpd.put("var8", varOList.get(i).getString("REGISTERED_FUND"));	    //8
			vpd.put("var9", varOList.get(i).getString("TOTAL_EXISTING_FUNDS"));	    //9
			vpd.put("var10", varOList.get(i).getString("DEPOSIT_BANK"));	    //10
			vpd.put("var11", varOList.get(i).getString("FUNDING_FOR_SCHOOL"));	    //11
			vpd.put("var12", varOList.get(i).getString("BANK_ACCOUNT"));	    //12
			vpd.put("var13", varOList.get(i).getString("CREATE_TIME"));	    //13
			vpd.put("var14", varOList.get(i).getString("UPDATE_TIME"));	    //14
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
