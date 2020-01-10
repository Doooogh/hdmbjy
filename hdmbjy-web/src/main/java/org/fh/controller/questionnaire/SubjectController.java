package org.fh.controller.questionnaire;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.util.DateUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.fh.entity.PageData;
import org.fh.service.questionnaire.SubjectService;

/** 
 * 说明：问卷题库
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-29
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/subject")
public class SubjectController extends BaseController {
	
	@Autowired
	private SubjectService subjectService;
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("subject:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("SUBJECT_ID", this.get32UUID());	//主键
		pd.put("CREATETIME", DateUtil.date2Str(new Date()));	//创建时间
		pd.put("UPDATETIME", DateUtil.date2Str(new Date()));	//修改时间
		pd.put("CREATEUSER", Jurisdiction.getUsername());	//创建人
		subjectService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("subject:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		subjectService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("subject:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("CREATETIME", DateUtil.date2Str(new Date()));	//创建时间
		pd.put("UPDATETIME", DateUtil.date2Str(new Date()));	//修改时间
		pd.put("CREATEUSER", Jurisdiction.getUsername());
		subjectService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表 (分页)
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("subject:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = subjectService.list(page);	//列出Subject列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}
	
	
	@RequestMapping(value="/listAll")
	@RequiresPermissions("subject:list")
	@ResponseBody
	public Object listAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		String idss = pd.getString("idss");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		List<PageData>	varList = subjectService.listAll(pd);	//列出Subject列表
		if (Tools.notEmpty(idss)) {
			for (int i = 0; i < varList.size(); i++) {
				if ((int) idss.indexOf(varList.get(i).getString("SUBJECT_ID"))!= -1) {
					varList.get(i).put("CHECKBOXTYPE", true);
				}
			}	
		}else {
			for (int i = 0; i < varList.size(); i++) {
				varList.get(i).put("CHECKBOXTYPE", false);
			}	
		}
		
		map.put("varList", varList);
		map.put("result", errInfo);
		return map;
	}
	
	
	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("subject:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = subjectService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("subject:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			subjectService.deleteAll(ArrayDATA_IDS);
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
		titles.add("序号（题目排序）");	//1
		titles.add("题目");	//2
		titles.add("题目类型(单选，多选，简答等)");	//3
		titles.add("选项A");	//4
		titles.add("选项B");	//5
		titles.add("选项C");	//6
		titles.add("选项D");	//7
		titles.add("选项E");	//8
		titles.add("选项F");	//9
		titles.add("选项G");	//10
		titles.add("选项H");	//11
		titles.add("备注");	//12
		titles.add("创建时间");	//13
		titles.add("创建人");	//14
		titles.add("修改时间");	//15
		dataMap.put("titles", titles);
		List<PageData> varOList = subjectService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("SORT"));	    //1
			vpd.put("var2", varOList.get(i).getString("TITLE"));	    //2
			vpd.put("var3", varOList.get(i).getString("TYPE"));	    //3
			vpd.put("var4", varOList.get(i).getString("OPTIONA"));	    //4
			vpd.put("var5", varOList.get(i).getString("OPTIONB"));	    //5
			vpd.put("var6", varOList.get(i).getString("OPTIONC"));	    //6
			vpd.put("var7", varOList.get(i).getString("OPTIOND"));	    //7
			vpd.put("var8", varOList.get(i).getString("OPTIONE"));	    //8
			vpd.put("var9", varOList.get(i).getString("OPTIONF"));	    //9
			vpd.put("var10", varOList.get(i).getString("OPTIONG"));	    //10
			vpd.put("var11", varOList.get(i).getString("OPTIONH"));	    //11
			vpd.put("var12", varOList.get(i).getString("BZ"));	    //12
			vpd.put("var13", varOList.get(i).getString("CREATETIME"));	    //13
			vpd.put("var14", varOList.get(i).getString("CREATEUSER"));	    //14
			vpd.put("var15", varOList.get(i).getString("UPDATETIME"));	    //15
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
	@RequestMapping(value="/getSort")
	@ResponseBody
	public Object getSort() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pdo = new PageData();
		PageData pdn = new PageData();
		pdo = this.getPageData();
		pdn = subjectService.findByLast();
		if (pdn == null) {
			pdo.put("SORT", 1);
		}else {
			int sort = (int)pdn.get("SORT");
			pdo.put("SORT", sort + 1);
		}
		map.put("pd", pdo);
		map.put("result", errInfo);	//返回结果
		return map;
	}
	
	
}
