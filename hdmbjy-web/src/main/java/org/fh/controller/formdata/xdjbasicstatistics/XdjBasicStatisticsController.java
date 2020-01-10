package org.fh.controller.formdata.xdjbasicstatistics;

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
import org.fh.service.formdata.xdjbasicstatistics.XdjBasicStatisticsService;

/** 
 * 说明：校长、董事长（理事长）、举办者个人基本情况
 * 作者：FH Admin QQ313596790
 * 时间：2019-12-06
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/xdjbasicstatistics")
public class XdjBasicStatisticsController extends BaseController {
	
	@Autowired
	private XdjBasicStatisticsService xdjbasicstatisticsService;

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
		pd.put("XDJBASICSTATISTICS_ID", this.get32UUID());	//主键
		xdjbasicstatisticsService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("XDJBASICSTATISTICS_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("XDJBASICSTATISTICS_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("xdjbasicstatistics:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		xdjbasicstatisticsService.delete(pd);
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
		xdjbasicstatisticsService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("XDJBASICSTATISTICS_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("xdjbasicstatistics:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = xdjbasicstatisticsService.list(page);	//列出XdjBasicStatistics列表
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
		pd = xdjbasicstatisticsService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("xdjbasicstatistics:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			xdjbasicstatisticsService.deleteAll(ArrayDATA_IDS);
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
		titles.add("标题名称");	//1
		titles.add("姓名");	//2
		titles.add("性别");	//3
		titles.add("年龄");	//4
		titles.add("学历");	//5
		titles.add("身份证号");	//6
		titles.add("职称");	//7
		titles.add("政治面貌");	//8
		titles.add("培训机构拟任职务");	//9
		titles.add("专职兼职");	//10
		titles.add("从事教育教学工作年限");	//11
		titles.add("从教专业");	//12
		titles.add("健康状况");	//13
		titles.add("是否退休");	//14
		titles.add("原工作单位及职务");	//15
		titles.add("单位电话");	//16
		titles.add("手机");	//17
		titles.add("现家庭住址");	//18
		titles.add("邮政编码");	//19
		titles.add("住宅电话");	//20
		titles.add("工作简历");	//21
		titles.add("本人意见");	//22
		titles.add("本人意见日期");	//23
		titles.add("所在单位人事部门意见");	//24
		titles.add("所在单位人事部门意见日期");	//25
		titles.add("证件照");	//26
		dataMap.put("titles", titles);
		List<PageData> varOList = xdjbasicstatisticsService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("TITLE_NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("NAME"));	    //2
			vpd.put("var3", varOList.get(i).getString("SEX"));	    //3
			vpd.put("var4", varOList.get(i).getString("AGE"));	    //4
			vpd.put("var5", varOList.get(i).getString("EDUCATION"));	    //5
			vpd.put("var6", varOList.get(i).getString("IDCARD"));	    //6
			vpd.put("var7", varOList.get(i).getString("POSITIONAL_TITLE"));	    //7
			vpd.put("var8", varOList.get(i).getString("POLITIC_COUNTENANCE"));	    //8
			vpd.put("var9", varOList.get(i).getString("PXJG_JOB"));	    //9
			vpd.put("var10", varOList.get(i).getString("FULL_PART_JOB"));	    //10
			vpd.put("var11", varOList.get(i).getString("TEACH_YEAR"));	    //11
			vpd.put("var12", varOList.get(i).getString("TEACH_PROFESSION"));	    //12
			vpd.put("var13", varOList.get(i).getString("HEALTH"));	    //13
			vpd.put("var14", varOList.get(i).getString("IS_RETIRE"));	    //14
			vpd.put("var15", varOList.get(i).getString("ORIGINAL_WORK"));	    //15
			vpd.put("var16", varOList.get(i).getString("WORK_PHONE"));	    //16
			vpd.put("var17", varOList.get(i).getString("MOBILE_PHONE"));	    //17
			vpd.put("var18", varOList.get(i).getString("NOW_HOUSEADDRESS"));	    //18
			vpd.put("var19", varOList.get(i).getString("POSTAL_CODE"));	    //19
			vpd.put("var20", varOList.get(i).getString("HOUSE_PHONE"));	    //20
			vpd.put("var21", varOList.get(i).getString("WORK_RESUME"));	    //21
			vpd.put("var22", varOList.get(i).getString("MY_OPINION"));	    //22
			vpd.put("var23", varOList.get(i).getString("MO_DATE"));	    //23
			vpd.put("var24", varOList.get(i).getString("PERSON_DEPT_OPINION"));	    //24
			vpd.put("var25", varOList.get(i).getString("PDP_DATE"));	    //25
			vpd.put("var26", varOList.get(i).getString("PASSPORT_PHOTO"));	    //26
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
