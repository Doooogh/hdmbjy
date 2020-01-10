package org.fh.controller.formdata.basicsituation;

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
import org.fh.service.formdata.basicsituation.BasicSituationService;

/** 
 * 说明：民办学校校长、(董事长、理事长）、法定代表人基本情况表
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-12
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/basicsituation")
public class BasicSituationController extends BaseController {
	
	@Autowired
	private BasicSituationService basicsituationService;

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
		pd.put("BASICSITUATION_ID", this.get32UUID());	//主键
		basicsituationService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("BASICSITUATION_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("BASICSITUATION_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}



	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("basicsituation:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		basicsituationService.delete(pd);
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
		basicsituationService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("BASICSITUATION_ID"));
		map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("basicsituation:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = basicsituationService.list(page);	//列出BasicSituation列表
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
		pd = basicsituationService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("basicsituation:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			basicsituationService.deleteAll(ArrayDATA_IDS);
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
		titles.add("姓名");	//1
		titles.add("性别");	//2
		titles.add("民族");	//3
		titles.add("出生日期_年");	//4
		titles.add("出生日期_月");	//5
		titles.add("出生日期_日");	//6
		titles.add("政治面貌");	//7
		titles.add("职称");	//8
		titles.add("文化程度");	//9
		titles.add("身份证号码");	//10
		titles.add("健康状况");	//11
		titles.add("是否退休");	//12
		titles.add("原工作单位及职务");	//13
		titles.add("电话手机");	//14
		titles.add("现家庭住址");	//15
		titles.add("邮政编码");	//16
		titles.add("工作简历");	//17
		titles.add("本人意见");	//18
		titles.add("本人意见日期");	//19
		titles.add("本人关系所在单位人事部门意见");	//20
		titles.add("本人关系所在单位人事部门意见日期");	//21
		dataMap.put("titles", titles);
		List<PageData> varOList = basicsituationService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("SEX"));	    //2
			vpd.put("var3", varOList.get(i).getString("NATION"));	    //3
			vpd.put("var4", varOList.get(i).getString("BIRTHDAY_YEAR"));	    //4
			vpd.put("var5", varOList.get(i).getString("BIRTHDAY_MONTH"));	    //5
			vpd.put("var6", varOList.get(i).getString("BIRTHDAY_DAY"));	    //6
			vpd.put("var7", varOList.get(i).getString("POLITICS_STATUS"));	    //7
			vpd.put("var8", varOList.get(i).getString("TITLE"));	    //8
			vpd.put("var9", varOList.get(i).getString("EDUCATION"));	    //9
			vpd.put("var10", varOList.get(i).getString("ID_NUMBER"));	    //10
			vpd.put("var11", varOList.get(i).getString("HEALTH_CONDITION"));	    //11
			vpd.put("var12", varOList.get(i).getString("ISRETIREMENT"));	    //12
			vpd.put("var13", varOList.get(i).getString("ORIGINAL_WORK_AND_POSITION"));	    //13
			vpd.put("var14", varOList.get(i).getString("PHONE"));	    //14
			vpd.put("var15", varOList.get(i).getString("ADDRESS"));	    //15
			vpd.put("var16", varOList.get(i).getString("POST"));	    //16
			vpd.put("var17", varOList.get(i).getString("JOB_RESUME"));	    //17
			vpd.put("var18", varOList.get(i).getString("MY_OPINION"));	    //18
			vpd.put("var19", varOList.get(i).getString("MY_OPINION_DATE"));	    //19
			vpd.put("var20", varOList.get(i).getString("DEPARTMENT_OPINION"));	    //20
			vpd.put("var21", varOList.get(i).getString("DEPARTMENT_OPINION_DATE"));	    //21
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
