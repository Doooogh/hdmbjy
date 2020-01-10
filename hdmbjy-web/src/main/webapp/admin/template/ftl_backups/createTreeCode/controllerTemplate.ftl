package org.fh.controller.${packageName};

import net.sf.json.JSONArray;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.fh.util.DateUtil;
import org.fh.entity.PageData;
import org.fh.service.${packageName}.${objectName}Service;

/** 
 * 说明：${TITLE}
 * 作者：FH Admin QQ313596790
 * 时间：${nowDate?string("yyyy-MM-dd")}
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/${objectNameLower}")
public class ${objectName}Controller extends BaseController {
	
	@Autowired
	private ${objectName}Service ${objectNameLower}Service;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("${objectNameLower}:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("${objectNameUpper}_ID", this.get32UUID());	//主键
<#list fieldList as var>
	<#if var[3] == "否">
		<#if var[1] == 'Date'>
		pd.put("${var[0]}", Tools.date2Str(new Date()));	//${var[2]}
		<#elseif var[1] == 'Integer'>
		pd.put("${var[0]}", "${var[4]?replace("无",0)}");	//${var[2]}
		<#elseif var[1] == 'Double'>
		pd.put("${var[0]}", "${var[4]?replace("无",0)}");	//${var[2]}
		<#else>
		pd.put("${var[0]}", "${var[4]?replace("无","")}");	//${var[2]}
		</#if>
	</#if>
</#list>
		${objectNameLower}Service.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("${objectNameLower}:del")
	@ResponseBody
	public Object delete(@RequestParam String ${objectNameUpper}_ID) throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd.put("${objectNameUpper}_ID", ${objectNameUpper}_ID);
		if(${objectNameLower}Service.listByParentId(${objectNameUpper}_ID).size() > 0){		//判断是否有子级，是：不允许删除
			errInfo = "error";
		}else{
			${objectNameLower}Service.delete(pd);
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("${objectNameLower}:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		${objectNameLower}Service.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("${objectNameLower}:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");								//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		String ${objectNameUpper}_ID = null == pd.get("${objectNameUpper}_ID")?"":pd.get("${objectNameUpper}_ID").toString();
		pd.put("${objectNameUpper}_ID", ${objectNameUpper}_ID);					//当作上级ID
		page.setPd(pd);
		List<PageData>	varList = ${objectNameLower}Service.list(page);			//列出${objectName}列表
		if("".equals(${objectNameUpper}_ID) || "0".equals(${objectNameUpper}_ID)) {
			map.put("PARENT_ID", "0");											//上级ID
		}else {
			map.put("PARENT_ID", ${objectNameLower}Service.findById(pd).getString("PARENT_ID"));	//上级ID
		}
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 显示列表ztree
	 * @return
	 */
	@RequestMapping(value="/listTree")
	@RequiresPermissions("${objectNameLower}:list")
	@ResponseBody
	public Object listTree()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		JSONArray arr = JSONArray.fromObject(${objectNameLower}Service.listTree("0"));
		String json = arr.toString();
		json = json.replaceAll("${objectNameUpper}_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("NAME", "name").replaceAll("sub${objectName}", "nodes").replaceAll("has${objectName}", "checked").replaceAll("treeurl", "url");
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		return map;
	}
	
	/**去新增页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goAdd")
	@RequiresPermissions("${objectNameLower}:add")
	@ResponseBody
	public Object goAdd()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String ${objectNameUpper}_ID = null == pd.get("${objectNameUpper}_ID")?"":pd.get("${objectNameUpper}_ID").toString();
		pd.put("${objectNameUpper}_ID", ${objectNameUpper}_ID);					//上级ID
		map.put("pds",${objectNameLower}Service.findById(pd));					//传入上级所有信息
		map.put("result", errInfo);
		return map;
	}	
	
	 /**去修改页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("${objectNameLower}:edit")
	@ResponseBody
	public Object goEdit()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = ${objectNameLower}Service.findById(pd);									//根据ID读取		
		map.put("pd", pd);																//放入视图容器
		pd.put("${objectNameUpper}_ID",pd.get("PARENT_ID").toString());					//用作上级信息
		map.put("pds",${objectNameLower}Service.findById(pd));							//传入上级所有信息
		map.put("result", errInfo);
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
<#list fieldList as var>
		titles.add("${var[2]}");	//${var_index+1}
</#list>
		dataMap.put("titles", titles);
		List<PageData> varOList = ${objectNameLower}Service.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
<#list fieldList as var>
		<#if var[1] == 'Integer'>
			vpd.put("var${var_index+1}", varOList.get(i).get("${var[0]}").toString());	//${var_index+1}
		<#elseif var[1] == 'Double'>
			vpd.put("var${var_index+1}", varOList.get(i).get("${var[0]}").toString());	//${var_index+1}
		<#else>
			vpd.put("var${var_index+1}", varOList.get(i).getString("${var[0]}"));	    //${var_index+1}
		</#if>
</#list>
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
