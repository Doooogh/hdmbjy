package org.fh.controller.fulldata;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.fh.service.approvetype.ApproveTypeService;
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
import org.fh.service.fulldata.FulldataService;

/** 
 * 说明：填报数据
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-15
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/fulldata")
public class FulldataController extends BaseController {
	
	@Autowired
	private FulldataService fulldataService;

	@Autowired
	private ApproveTypeService approveTypeService;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("fulldata:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("FULLDATA_ID", this.get32UUID());	//主键
		if(pd.getString("TYPE").equals("1")){
			PageData approveTypeAndAllPath = approveTypeService.getTopApproveTypeAndAllPath(pd);
			pd.put("ALLURL",approveTypeAndAllPath.getString("allPath")+pd.get("PAGE_NAME"));
		}
		pd.put("CREATE_DATE",DateUtil.date2Str(new Date()));
		fulldataService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("fulldata:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		fulldataService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("fulldata:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(pd.getString("TYPE").equals("1")){
			PageData approveTypeAndAllPath = approveTypeService.getTopApproveTypeAndAllPath(pd);
			pd.put("ALLURL",approveTypeAndAllPath.getString("allPath")+pd.get("PAGE_NAME"));
		}
		fulldataService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("fulldata:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if(StringUtils.isNotBlank(pd.getString("APPROVE_ID"))&&pd.getString("APPROVE_ID").equals("0")){
			pd.remove("APPROVE_ID");
		}
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = fulldataService.list(page);	//列出Fulldata列表
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
	@RequiresPermissions("fulldata:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = fulldataService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("fulldata:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			fulldataService.deleteAll(ArrayDATA_IDS);
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
		titles.add("审批类型id");	//2
		titles.add("类型 1 表单  2 附件");	//3
		titles.add("名字");	//4
		titles.add("url 位置");	//5
		titles.add("备注6");	//6
		titles.add("备注7");	//7
		titles.add("备注8");	//8
		dataMap.put("titles", titles);
		List<PageData> varOList = fulldataService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("FULLDATA_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("APPROVE_ID"));	    //2
			vpd.put("var3", varOList.get(i).getString("TYPE"));	    //3
			vpd.put("var4", varOList.get(i).getString("NAME"));	    //4
			vpd.put("var5", varOList.get(i).getString("URL"));	    //5
			vpd.put("var6", varOList.get(i).getString("FIELD1"));	    //6
			vpd.put("var7", varOList.get(i).getString("FIELD2"));	    //7
			vpd.put("var8", varOList.get(i).getString("FIELD3"));	    //8
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}


	/**列表 根据审批类型查询
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/listByApproveId")
	@ResponseBody
	public Object listByApproveId() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		List<PageData>	varList = fulldataService.listByApproveId(pd);	//列出Fulldata列表
		List<PageData> formList=new ArrayList<>();
		List<PageData> attachmentList=new ArrayList<>();
		for (PageData pageData : varList) {
			if(pageData.get("TYPE").equals("1")){
				formList.add(pageData);
			}else{
				attachmentList.add(pageData);
			}
		}
		map.put("formList", formList);
		map.put("attachmentList", attachmentList);
		map.put("result", errInfo);
		return map;
	}
	
}
