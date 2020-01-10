package org.fh.controller.formdata.pxscbasicinfotable;

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
import org.fh.service.formdata.pxscbasicinfotable.PxScBasicInfoTableService;

/** 
 * 说明：培训学校个人基本情况表
 * 作者：FH Admin QQ313596790
 * 时间：2019-12-07
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/pxscbasicinfotable")
public class PxScBasicInfoTableController extends BaseController {
	
	@Autowired
	private PxScBasicInfoTableService pxscbasicinfotableService;


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
		pd.put("PXSCBASICINFOTABLE_ID", this.get32UUID());	//主键
		pxscbasicinfotableService.save(pd);
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("PXSCBASICINFOTABLE_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("PXSCBASICINFOTABLE_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pxscbasicinfotableService.delete(pd);
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
		pxscbasicinfotableService.edit(pd);
		PageData findApproveForm=new PageData();
		findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
		PageData approveFormRes = approveFormService.findById(findApproveForm);
		approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
		approveFormService.edit(approveFormRes);
		map.put("RES_ID",pd.get("PXSCBASICINFOTABLE_ID"));
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
		List<PageData>	varList = pxscbasicinfotableService.list(page);	//列出PxScBasicInfoTable列表
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
		pd = pxscbasicinfotableService.findById(pd);	//根据ID读取
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
			pxscbasicinfotableService.deleteAll(ArrayDATA_IDS);
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
	public ModelAndView exportExcel() throws Exception{
		ModelAndView mv = new ModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		List<String> titles = new ArrayList<String>();
		titles.add("姓名");	//1
		titles.add("性别");	//2
		titles.add("年龄");	//3
		titles.add("学历");	//4
		titles.add("身份证号");	//5
		titles.add("职称");	//6
		titles.add("培训机构拟任职务");	//7
		titles.add("从事教育教学工作年限");	//8
		titles.add("从事专业");	//9
		titles.add("健康情况");	//10
		titles.add("是否退休");	//11
		titles.add("原工作单位及职务");	//12
		titles.add("单位电话");	//13
		titles.add("原单位手机");	//14
		titles.add("现家庭住址");	//15
		titles.add("邮政编码");	//16
		titles.add("住宅电话");	//17
		titles.add("工作简历");	//18
		titles.add("所在单位人事部门意见");	//19
		dataMap.put("titles", titles);
		List<PageData> varOList = pxscbasicinfotableService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("SEX"));	    //2
			vpd.put("var3", varOList.get(i).getString("AGE"));	    //3
			vpd.put("var4", varOList.get(i).getString("EDUCATION"));	    //4
			vpd.put("var5", varOList.get(i).getString("ID_NUMBER"));	    //5
			vpd.put("var6", varOList.get(i).getString("TITLE"));	    //6
			vpd.put("var7", varOList.get(i).getString("DUTY"));	    //7
			vpd.put("var8", varOList.get(i).getString("YEAR_OF_NUMBER"));	    //8
			vpd.put("var9", varOList.get(i).getString("MAJOR"));	    //9
			vpd.put("var10", varOList.get(i).getString("HEALTHY_CONDITION"));	    //10
			vpd.put("var11", varOList.get(i).getString("RETIRE"));	    //11
			vpd.put("var12", varOList.get(i).getString("ORIGINAL_COMPANY_AND_DUTY"));	    //12
			vpd.put("var13", varOList.get(i).getString("ORIGINAL_COMPANY_TEL"));	    //13
			vpd.put("var14", varOList.get(i).getString("ORIGINAL_COMPANY_PHONE"));	    //14
			vpd.put("var15", varOList.get(i).getString("NOW_ADDRESS"));	    //15
			vpd.put("var16", varOList.get(i).getString("POST"));	    //16
			vpd.put("var17", varOList.get(i).getString("HOMEPHONE"));	    //17
			vpd.put("var18", varOList.get(i).getString("JOB_RESUME"));	    //18
			vpd.put("var19", varOList.get(i).getString("DEPT_OPINION"));	    //19
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
		User user=Jurisdiction.getUser();
		if(null!=user){
			map.put("FULLDATA_BY",user.getNAME());
		}else{
			map.put("FULLDATA_BY","");
		}
		map.put("result",errInfo);
		return map;
	}

}
