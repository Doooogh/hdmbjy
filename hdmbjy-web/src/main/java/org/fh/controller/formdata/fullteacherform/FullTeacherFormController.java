package org.fh.controller.formdata.fullteacherform;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import org.fh.service.approveform.ApproveFormService;
import org.fh.service.formdata.fullteacherdetail.FullTeacherDetailService;
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
import org.fh.service.formdata.fullteacherform.FullTeacherFormService;

/** 
 * 说明：幼儿园专职教师名册
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-05
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/fullteacherform")
public class FullTeacherFormController extends BaseController {
	
	@Autowired
	private FullTeacherFormService fullteacherformService;

	@Autowired
	private ApproveFormService approveFormService;

	@Autowired
	private FullTeacherDetailService fullTeacherDetailService;

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
		String FULLTEACHERFORM_ID=this.get32UUID();
		pd.put("FULLTEACHERFORM_ID", FULLTEACHERFORM_ID);	//主键
//		pd.put("TYPE_NAME","民办中小学");
		JSONArray jsonArray = JSONArray.fromObject(pd.get("members"));//把String转换为json
		List<PageData> members=new ArrayList<>();
		members = JSONArray.toList(jsonArray,PageData.class);//这里的t是Class<T>
		for (PageData pageData : members) {
			pageData.put("FULLTEACHERDETAIL_ID", this.get32UUID());	//主键
			pageData.put("FULLTEACHERFORM_ID",FULLTEACHERFORM_ID);
		}
		try{
			fullteacherformService.save(pd);
			fullTeacherDetailService.batchSave(members);
		}catch (Exception e){
			errInfo="exception";
			e.printStackTrace();
		}

		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("FULLTEACHERFORM_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		PageData findFullData=new PageData();
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("FULLTEACHERFORM_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}

	
	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("fullteacherform:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		fullteacherformService.delete(pd);
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
		String FULLTEACHERFORM_ID=pd.getString("FULLTEACHERFORM_ID");
		JSONArray jsonArray = JSONArray.fromObject(pd.get("members"));//把String转换为json
		List<PageData> members=new ArrayList<>();
		members = JSONArray.toList(jsonArray,PageData.class);//这里的t是Class<T>
		for (PageData pageData : members) {
			pageData.put("FULLTEACHERDETAIL_ID", this.get32UUID());	//主键
			pageData.put("FULLTEACHERFORM_ID",FULLTEACHERFORM_ID);
		}
		try{
			PageData delete=new PageData();
			delete.put("FULLTEACHERFORM_ID",FULLTEACHERFORM_ID);
			fullteacherformService.edit(pd);
			fullTeacherDetailService.deleteByFullTeacherFormId(delete);
			fullTeacherDetailService.batchSave(members);
			PageData findApproveForm=new PageData();
			findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
            PageData approveFormRes = approveFormService.findById(findApproveForm);
            approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
            approveFormService.edit(approveFormRes);
            map.put("RES_ID",pd.get("FULLTEACHERFORM_ID"));
            map.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
        }catch (Exception e){
			errInfo="exception";
			e.printStackTrace();
		}
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("fullteacherform:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = fullteacherformService.list(page);	//列出FullTeacherForm列表
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
		pd = fullteacherformService.findById(pd);	//根据ID读取
		PageData find=new PageData();
		find.put("FULLTEACHERFORM_ID",pd.get("FULLTEACHERFORM_ID"));
		List<PageData> members = fullTeacherDetailService.findByFullTeacherFormId(find);
		map.put("pd", pd);
		map.put("members",members);
		map.put("result", errInfo);
		return map;
	}
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("fullteacherform:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			fullteacherformService.deleteAll(ArrayDATA_IDS);
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
		titles.add("填表人");	//1
		titles.add("联系电话");	//2
		titles.add("日期");	//3
		dataMap.put("titles", titles);
		List<PageData> varOList = fullteacherformService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("FULLDATA_BY"));	    //1
			vpd.put("var2", varOList.get(i).getString("PHONE"));	    //2
			vpd.put("var3", varOList.get(i).getString("DATE"));	    //3
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
