package org.fh.controller.formdata.sponsorbasicinfo;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fh.service.approveform.ApproveFormService;
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
import org.fh.service.formdata.sponsorbasicinfo.SponsorBasicInfoService;

/** 
 * 说明：幼儿园举办单位基本情况表
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-21
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/sponsorbasicinfo")
public class SponsorBasicInfoController extends BaseController {
	
	@Autowired
	private SponsorBasicInfoService sponsorbasicinfoService;

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
		pd.put("SPONSORBASICINFO_ID", this.get32UUID());	//主键
		sponsorbasicinfoService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("SPONSORBASICINFO_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("SPONSORBASICINFO_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("sponsorbasicinfo:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		sponsorbasicinfoService.delete(pd);
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
		sponsorbasicinfoService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("SPONSORBASICINFO_ID"));
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
		List<PageData>	varList = sponsorbasicinfoService.list(page);	//列出SponsorBasicInfo列表
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
		pd = sponsorbasicinfoService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("sponsorbasicinfo:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			sponsorbasicinfoService.deleteAll(ArrayDATA_IDS);
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
		titles.add("举办单位名称");	//2
		titles.add("电话传真");	//3
		titles.add("举办单位地址");	//4
		titles.add("邮政编码");	//5
		titles.add("举办单位法定代表人");	//6
		titles.add("举办单位法人类型");	//7
		titles.add("举办单位注册资金");	//8
		titles.add("举办单位现有总资金");	//9
		titles.add("举办单位开户银行");	//10
		titles.add("举办单位银行账号");	//11
		titles.add("举办者提供办学资金");	//12
		titles.add("举办者提供办学地址");	//13
		titles.add("举办单位提供办学设备");	//14
		titles.add("举办单位意见");	//15
		titles.add("法人代表签字日期");	//16
		titles.add("举办单位上级部门意见");	//17
		titles.add("上级部门法人签字时间");	//18
		titles.add("备注19");	//19
		titles.add("备注20");	//20
		dataMap.put("titles", titles);
		List<PageData> varOList = sponsorbasicinfoService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("SPONSORBASICINFO_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("SPONSOR_NAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("SPONSOR_TELEFACSIMILE"));	    //3
			vpd.put("var4", varOList.get(i).getString("NAME_ADDRESS"));	    //4
			vpd.put("var5", varOList.get(i).getString("POSTCODE"));	    //5
			vpd.put("var6", varOList.get(i).getString("LEGAL_PERSON"));	    //6
			vpd.put("var7", varOList.get(i).getString("LEGAL_PERSON_TYPE"));	    //7
			vpd.put("var8", varOList.get(i).getString("REGISTERED_FUND"));	    //8
			vpd.put("var9", varOList.get(i).getString("EXISTING_FUNDS"));	    //9
			vpd.put("var10", varOList.get(i).getString("DEPOSIT_BANK"));	    //10
			vpd.put("var11", varOList.get(i).getString("BANK_ACCOUNT"));	    //11
			vpd.put("var12", varOList.get(i).getString("FUNDS_FOR_SCHOOL"));	    //12
			vpd.put("var13", varOList.get(i).getString("RUN_SCHOOL_ADDRESS"));	    //13
			vpd.put("var14", varOList.get(i).getString("EQUIPMENT"));	    //14
			vpd.put("var15", varOList.get(i).getString("OPINION"));	    //15
			vpd.put("var16", varOList.get(i).getString("OPINION_DATE"));	    //16
			vpd.put("var17", varOList.get(i).getString("SUPERIOR_OPINION"));	    //17
			vpd.put("var18", varOList.get(i).getString("SUPERIOR_OPINION_DATE"));	    //18
			vpd.put("var19", varOList.get(i).getString("FIELD1"));	    //19
			vpd.put("var20", varOList.get(i).getString("FIELD2"));	    //20
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
