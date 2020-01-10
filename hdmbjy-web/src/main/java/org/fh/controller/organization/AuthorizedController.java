package org.fh.controller.organization;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.organization.AuthorizedService;
import org.fh.service.scuser.ScuserService;
import org.fh.util.Const;
import org.fh.util.Jurisdiction;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/** 
 * 说明：编制管理
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-23
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/authorized")
public class AuthorizedController extends BaseController {
	
	@Autowired
	private AuthorizedService authorizedService;
	@Autowired
	private ScuserService scuserService;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("authorized:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("AUTHORIZED_ID", this.get32UUID());	//主键
		
		PageData scuser=new PageData();
		scuser.put("SCUSER_ID",Jurisdiction.getUser().getUSER_ID());
		PageData fuser=scuserService.findById(scuser);
		
		pd.put("ORGANIZATION_ID", fuser.getString("ORGANIZATION_ID"));	//机构id
		pd.put("USER_ID", Jurisdiction.getUser().getUSER_ID());	//负责人
		pd.put("BZ_AAA", "");	//备注字段
		pd.put("BZ_AAB", "");	//备注字段
		authorizedService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("authorized:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		authorizedService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("authorized:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		authorizedService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("authorized:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		if (Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())) {
			pd.put("ORGANIZATION_ID",null);	//机构id
			pd.put("USER_ID", null);
			map.put("userName", false);
		}else {
			PageData scuser=new PageData();
			scuser.put("SCUSER_ID",Jurisdiction.getUser().getUSER_ID());
			PageData fuser=scuserService.findById(scuser);
			pd.put("ORGANIZATION_ID", fuser.getString("ORGANIZATION_ID"));	//机构id
			pd.put("USER_ID", Jurisdiction.getUser().getUSER_ID());
			map.put("userName", true);
		}
		
		
		page.setPd(pd);
		List<PageData>	varList = authorizedService.list(page);	//列出Authorized列表
		
		
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
	@RequiresPermissions("authorized:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = authorizedService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("authorized:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			authorizedService.deleteAll(ArrayDATA_IDS);
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
		titles.add("名称");	//1
		titles.add("数量");	//2
		titles.add("机构id");	//3
		titles.add("负责人");	//4
		titles.add("备注字段");	//5
		titles.add("备注字段");	//6
		titles.add("备注字段");	//7
		dataMap.put("titles", titles);
		List<PageData> varOList = authorizedService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("NAME"));	    //1
			vpd.put("var2", varOList.get(i).getString("BZ_COUNT"));	    //2
			vpd.put("var3", varOList.get(i).getString("ORGANIZATION_ID"));	    //3
			vpd.put("var4", varOList.get(i).getString("USER_ID"));	    //4
			vpd.put("var5", varOList.get(i).getString("BZ_AAA"));	    //5
			vpd.put("var6", varOList.get(i).getString("BZ_AAB"));	    //6
			vpd.put("var7", varOList.get(i).getString("BZ_AAC"));	    //7
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
