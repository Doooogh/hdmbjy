package org.fh.controller.formdata.basicinfo;

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
import org.fh.service.formdata.basicinfo.BasicInfoService;

/** 
 * 说明：决策机构成员个人基本情况表
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-20
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/basicinfo")
public class BasicInfoController extends BaseController {
	
	@Autowired
	private BasicInfoService basicinfoService;


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
		pd.put("BASICINFO_ID", this.get32UUID());	//主键
		basicinfoService.save(pd);

		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("BASICINFO_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("BASICINFO_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("basicinfo:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		basicinfoService.delete(pd);
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
		basicinfoService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("BASICINFO_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("basicinfo:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = basicinfoService.list(page);	//列出BasicInfo列表
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
		pd = basicinfoService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("basicinfo:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			basicinfoService.deleteAll(ArrayDATA_IDS);
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
		titles.add("备注1");	//1
		titles.add("姓名");	//2
		titles.add("性别");	//3
		titles.add("民族");	//4
		titles.add("出生日期");	//5
		titles.add("政治面貌");	//6
		titles.add("职称");	//7
		titles.add("文化程度");	//8
		titles.add("身份证号");	//9
		titles.add("健康状况");	//10
		titles.add("是否退休");	//11
		titles.add("原工作单位及职务");	//12
		titles.add("电话");	//13
		titles.add("现家庭住址");	//14
		titles.add("邮政编码");	//15
		titles.add("个人简历");	//16
		titles.add("本人意见");	//17
		titles.add("备注18");	//18
		titles.add("备注19");	//19
		titles.add("备注20");	//20
		titles.add("备注21");	//21
		titles.add("备注22");	//22
		dataMap.put("titles", titles);
		List<PageData> varOList = basicinfoService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("BASICINFO_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("NAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("SEX"));	    //3
			vpd.put("var4", varOList.get(i).getString("NATIONALITY"));	    //4
			vpd.put("var5", varOList.get(i).getString("BIRTHDAY"));	    //5
			vpd.put("var6", varOList.get(i).getString("POLITICS_STATUS"));	    //6
			vpd.put("var7", varOList.get(i).getString("TITLE"));	    //7
			vpd.put("var8", varOList.get(i).getString("STANDARD_ULTURE"));	    //8
			vpd.put("var9", varOList.get(i).getString("ID_NUMBER"));	    //9
			vpd.put("var10", varOList.get(i).getString("HEALTH_CONDITION"));	    //10
			vpd.put("var11", varOList.get(i).getString("ISRETIREMENT"));	    //11
			vpd.put("var12", varOList.get(i).getString("ORIGINAL_WORK"));	    //12
			vpd.put("var13", varOList.get(i).getString("PHONE"));	    //13
			vpd.put("var14", varOList.get(i).getString("ADDRESS"));	    //14
			vpd.put("var15", varOList.get(i).getString("POST_CODE"));	    //15
			vpd.put("var16", varOList.get(i).getString("RESUME"));	    //16
			vpd.put("var17", varOList.get(i).getString("OPINION"));	    //17
			vpd.put("var18", varOList.get(i).getString("FIELD1"));	    //18
			vpd.put("var19", varOList.get(i).getString("FIELD2"));	    //19
			vpd.put("var20", varOList.get(i).getString("FIELD3"));	    //20
			vpd.put("var21", varOList.get(i).getString("FIELD4"));	    //21
			vpd.put("var22", varOList.get(i).getString("FIELD5"));	    //22
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
