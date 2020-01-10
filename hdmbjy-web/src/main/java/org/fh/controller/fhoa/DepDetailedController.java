package org.fh.controller.fhoa;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.fhoa.DepDetailedService;
import org.fh.util.DateUtil;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/** 
 * 说明：机构详细信息
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-18
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/depdetailed")
public class DepDetailedController extends BaseController {
	
	@Autowired
	private DepDetailedService depdetailedService;
	
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
		pd.put("DEPDETAILED_ID", this.get32UUID());	//主键
		pd.put("CREATOR_DATE", DateUtil.date2Str(new Date()));	//创建时间
		depdetailedService.save(pd);
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
		depdetailedService.delete(pd);
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
		depdetailedService.edit(pd);
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
		List<PageData>	varList = depdetailedService.list(page);	//列出DepDetailed列表
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
		pd = depdetailedService.findById(pd);	//根据ID读取
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
			depdetailedService.deleteAll(ArrayDATA_IDS);
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
		titles.add("举办者");	//1
		titles.add("举办者电话");	//2
		titles.add("联系人");	//3
		titles.add("联系人电话");	//4
		titles.add("学校电话");	//5
		titles.add("变更前校名");	//6
		titles.add("招生对象");	//7
		titles.add("举办内容");	//8
		titles.add("备注");	//9
		titles.add("创建时间");	//10
		titles.add("台账");	//11
		titles.add("意向登记表");	//12
		dataMap.put("titles", titles);
		List<PageData> varOList = depdetailedService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("ORGANIZER"));	    //1
			vpd.put("var2", varOList.get(i).getString("OPHONE"));	    //2
			vpd.put("var3", varOList.get(i).getString("CONTACTS"));	    //3
			vpd.put("var4", varOList.get(i).getString("CPHONE"));	    //4
			vpd.put("var5", varOList.get(i).getString("SCHOOLTEL"));	    //5
			vpd.put("var6", varOList.get(i).getString("SCHOOLNAME"));	    //6
			vpd.put("var7", varOList.get(i).getString("RECRUIT"));	    //7
			vpd.put("var8", varOList.get(i).getString("CONTENT"));	    //8
			vpd.put("var9", varOList.get(i).getString("BZ"));	    //9
			vpd.put("var10", varOList.get(i).getString("CREATOR_DATE"));	    //10
			vpd.put("var11", varOList.get(i).getString("LEDGER"));	    //11
			vpd.put("var12", varOList.get(i).getString("REGISTER"));	    //12
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
	
	@RequestMapping(value="/getDep")
	@ResponseBody
	public Object getDep() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = depdetailedService.findByDepId(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	@RequestMapping(value="/getDepAll")
	@ResponseBody
	public Object getDepAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = depdetailedService.findByDepAllId(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	
}
