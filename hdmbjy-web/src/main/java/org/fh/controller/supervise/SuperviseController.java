package org.fh.controller.supervise;

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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.util.Const;
import org.fh.util.DateUtil;
import org.fh.util.FileUpload;
import org.fh.util.Jurisdiction;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.fh.entity.PageData;
import org.fh.service.supervise.SuperviseService;

/** 
 * 说明：日常监管
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-08
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/supervise")
public class SuperviseController extends BaseController {
	
	@Autowired
	private SuperviseService superviseService;
	
	/**
	 * 文件上传
	 * @param file
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/upload")
	@ResponseBody
	public Object upload(@RequestParam(value = "FIMG", required = false) MultipartFile file) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String fileName = ""; 
		if (null != file && !file.isEmpty()) {
			String filePath = Const.UE_PATH; // 文件上传路径
			fileName = FileUpload.fileUp(file, filePath, this.get32UUID());
		}
		pd.put("imgUrl", "uepath/"+fileName);
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}
	
	
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("supervise:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("SUPERVISE_ID", this.get32UUID());	//主键
		//pd.put("TYPE", "");	//类型
		pd.put("USER_ID", Jurisdiction.getUser().getUSER_ID());	//备用字段
		pd.put("BY_SB", "");	//备用字段
		pd.put("BY_SC", "");	//备用字段
		pd.put("CREATION_DATE", DateUtil.date2Str(new Date()));	//创建时间
		superviseService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("supervise:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		superviseService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("supervise:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		superviseService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**修改排序
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/editSort")
	@ResponseBody
	public Object editSort() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData pdId = superviseService.findById(pd);
		pdId.put("SORT", pd.getString("SORT"));
		superviseService.edit(pdId);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("supervise:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String userName = Jurisdiction.getUsername();
		if(Const.ADMIN_USERNAME.contains(userName)) {
			pd.put("userName", null);
		}else {
			pd.put("userName", Jurisdiction.getUser().getUSER_ID());
		}
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = superviseService.list(page);	//列出Supervise列表
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
	@RequiresPermissions("supervise:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = superviseService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("supervise:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			superviseService.deleteAll(ArrayDATA_IDS);
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
		titles.add("标题");	//1
		titles.add("内容");	//2
		titles.add("类型");	//3
		titles.add("备用字段");	//4
		titles.add("备用字段");	//5
		titles.add("备用字段");	//6
		titles.add("创建时间");	//7
		titles.add("是否启用");	//8
		titles.add("排序");	//9
		dataMap.put("titles", titles);
		List<PageData> varOList = superviseService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("TITLE"));	    //1
			vpd.put("var2", varOList.get(i).getString("CONTENT"));	    //2
			vpd.put("var3", varOList.get(i).getString("TYPE"));	    //3
			vpd.put("var4", varOList.get(i).getString("USER_ID"));	    //4
			vpd.put("var5", varOList.get(i).getString("BY_SB"));	    //5
			vpd.put("var6", varOList.get(i).getString("BY_SC"));	    //6
			vpd.put("var7", varOList.get(i).getString("CREATION_DATE"));	    //7
			vpd.put("var8", varOList.get(i).getString("IS_START"));	    //8
			vpd.put("var9", varOList.get(i).getString("SORT"));	    //9
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
