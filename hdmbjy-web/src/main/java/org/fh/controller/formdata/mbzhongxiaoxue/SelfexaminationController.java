package org.fh.controller.formdata.mbzhongxiaoxue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.formdata.mbzhongxiaoxue.SelfexaminationService;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/** 
 * 说明：海淀区民办中小学年检自查表
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-13
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/selfexamination")
public class SelfexaminationController extends BaseController {
	
	@Autowired
	private SelfexaminationService selfexaminationService;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("selfexamination:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("SELFEXAMINATION_ID", this.get32UUID());	//主键
		selfexaminationService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("selfexamination:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		selfexaminationService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("selfexamination:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		selfexaminationService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("selfexamination:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = selfexaminationService.list(page);	//列出Selfexamination列表
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
	@RequiresPermissions("selfexamination:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = selfexaminationService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("selfexamination:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			selfexaminationService.deleteAll(ArrayDATA_IDS);
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
		titles.add("遵守法律、法规和国家政策的情况");	//1
		titles.add("党团组织建设、和谐校园建设、安全稳定工作情况");	//2
		titles.add("办学场地、校舍、教育教学设施等办学条件基本情况");	//3
		titles.add("按照章程开展教育教学活动情况（6分）");	//4
		titles.add("依法办理各种证件情况");	//5
		titles.add("依法进行审批、核准、备案、公告等事项的手续履行情况");	//6
		titles.add("内部管理机构设置及人员配备情况");	//7
		titles.add("教师队伍建设和人员聘用情况");	//8
		titles.add("收费公示、经费监管、财务状况、资金来源和使用情况");	//9
		titles.add("法人财产权的落实和资产管理情况");	//10
		titles.add("法定代表人意见");	//11
		titles.add("签字");	//12
		titles.add("填表人");	//13
		titles.add("填表日期");	//14
		dataMap.put("titles", titles);
		List<PageData> varOList = selfexaminationService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("POLICY"));	    //1
			vpd.put("var2", varOList.get(i).getString("BUILD"));	    //2
			vpd.put("var3", varOList.get(i).getString("BASIC"));	    //3
			vpd.put("var4", varOList.get(i).getString("RULES"));	    //4
			vpd.put("var5", varOList.get(i).getString("PAPERS"));	    //5
			vpd.put("var6", varOList.get(i).getString("PROCESS"));	    //6
			vpd.put("var7", varOList.get(i).getString("PROVIDE"));	    //7
			vpd.put("var8", varOList.get(i).getString("ENGAGE"));	    //8
			vpd.put("var9", varOList.get(i).getString("EMPLOY"));	    //9
			vpd.put("var10", varOList.get(i).getString("PROPERTY"));	    //10
			vpd.put("var11", varOList.get(i).getString("DEPUTY"));	    //11
			vpd.put("var12", varOList.get(i).getString("SIGNATURE"));	    //12
			vpd.put("var13", varOList.get(i).getString("USER"));	    //13
			vpd.put("var14", varOList.get(i).getString("DATE"));	    //14
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
