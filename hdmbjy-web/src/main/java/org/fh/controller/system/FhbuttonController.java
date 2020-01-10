package org.fh.controller.system;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.system.FHlogService;
import org.fh.service.system.FhButtonService;
import org.fh.util.Jurisdiction;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：按钮管理处理类
 * 作者：FH Admin Q313596-790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/fhbutton")
public class FhbuttonController extends BaseController {
	
	@Autowired
	private FhButtonService fhButtonService;
	@Autowired
    private FHlogService FHLOG;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list", produces="application/json;charset=UTF-8")
	@RequiresPermissions("fhbutton:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");				//关键词检索条件
		if(Tools.notEmpty(KEYWORDS)){
			pd.put("KEYWORDS", KEYWORDS.trim());
		}
		page.setPd(pd);
		List<PageData>	varList = fhButtonService.list(page);	//列出Fhbutton列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**新增
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("fhbutton:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("FHBUTTON_ID", this.get32UUID());	//主键
		fhButtonService.save(pd);
		FHLOG.save(Jurisdiction.getUsername(), "新增按钮："+pd.getString("NAME"));				//记录日志
		map.put("result", errInfo);
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("fhbutton:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		fhButtonService.edit(pd);
		FHLOG.save(Jurisdiction.getUsername(), "修改按钮："+pd.getString("NAME"));				//记录日志
		map.put("result", errInfo);
		return map;
	}
	
	 /**去修改页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("fhbutton:edit")
	@ResponseBody
	public Object goEdit()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = fhButtonService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	@RequiresPermissions("fhbutton:del")
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		PageData pd = new PageData();
		pd = this.getPageData();
		fhButtonService.delete(pd);
		map.put("result", "success");				//返回结果
		FHLOG.save(Jurisdiction.getUsername(), "删除按钮的ID为："+pd.getString("FHBUTTON_ID"));				//记录日志
		return map;
	}
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@ResponseBody
	@RequiresPermissions("fhbutton:del")
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();		
		pd = this.getPageData();
		String errInfo = "success";
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			fhButtonService.deleteAll(ArrayDATA_IDS);
			FHLOG.save(Jurisdiction.getUsername(), "批量删除按钮");				//记录日志
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
}
