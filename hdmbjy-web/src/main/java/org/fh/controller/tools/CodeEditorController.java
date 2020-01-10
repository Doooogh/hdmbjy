package org.fh.controller.tools;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.system.CodeEditorService;
import org.fh.util.DateUtil;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：代码生成器模版编辑
 * 作者：FH Admin Q313-596-790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping(value="/codeeditor")
public class CodeEditorController extends BaseController {
	
	@Autowired
	private CodeEditorService codeEditorService;
	
	/**获取code
	 * @return 
	 */
	@RequestMapping(value="/getCode")
	@RequiresPermissions("codeeditor:list")
	@ResponseBody
	public Object getCode() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();
		pd = this.getPageData();
		String errInfo = "success";
		String type = pd.getString("type");
		String ftlNmame = pd.getString("ftlNmame");
		String code = Tools.readFileAllContent("/admin/template/ftl/"+type+"/"+ftlNmame+".ftl");	//从原始模版获取
		map.put("code", code);
		map.put("result", errInfo);
		return map;
	}
	
	/**保存
	 * @return 
	 */
	@RequestMapping(value="/save")
	@RequiresPermissions("codeeditor:add")
	@ResponseBody
	public Object save() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String codeTxt =  pd.getString("codeTxt");
		String type = pd.getString("type");
		String ftlNmame = pd.getString("ftlNmame");
		Tools.writeFileCR("/admin/template/ftl/"+type+"/"+ftlNmame+".ftl",codeTxt);	//写入到文件
		pd.put("TYPE", type);
		pd.put("FTLNMAME", ftlNmame);
		pd.put("CODECONTENT", codeTxt);
		pd.put("CODEEDITOR_ID", this.get32UUID());		//主键
		pd.put("CTIME", DateUtil.date2Str(new Date()));	//创建时间
		codeEditorService.save(pd);						//记录存储到数据库
		map.put("result", errInfo);
		return map;
	}
	
	/**还原
	 * @return 
	 */
	@RequestMapping(value="/reduction")
	@RequiresPermissions("codeeditor:edit")
	@ResponseBody
	public Object reduction() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String type = pd.getString("type");
		String ftlNmame = pd.getString("ftlNmame");
		String msg = pd.getString("msg");
		String code = "";
		if("fromHistory".equals(msg)){
			code = codeEditorService.findById(pd).getString("CODECONTENT");								//从历史编辑获取
		}else{
			code = Tools.readFileAllContent("/admin/template/ftl_backups/"+type+"/"+ftlNmame+".ftl");	//从原始模版获取
		}
		Tools.writeFileCR("/admin/template/ftl/"+type+"/"+ftlNmame+".ftl",code);						//写入到现在模版
		map.put("code", code);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("codeeditor:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		page.setPd(pd);
		List<PageData>	varList = codeEditorService.list(page);	//列出CodeEditor列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}
	
	/**获取code
	 * @return 
	 */
	@RequestMapping(value="/getCodeFromView")
	@RequiresPermissions("codeeditor:list")
	@ResponseBody
	public Object getCodeFromView() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = codeEditorService.findById(pd);	//根据ID读取
		map.put("code", pd.getString("CODECONTENT"));
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("codeeditor:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		codeEditorService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("codeeditor:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();	
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			codeEditorService.deleteAll(ArrayDATA_IDS);
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}

}
