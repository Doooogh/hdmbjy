package org.fh.controller.formdata.yexmycheck;

import java.util.*;

import net.sf.json.JSONArray;
import org.fh.service.approveform.ApproveFormService;
import org.fh.service.formdata.mark.MarkService;
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
import org.fh.service.formdata.yexmycheck.YexMycheckService;

/** 
 * 说明：海淀区民办幼儿园年检自查表
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-05
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/yexmycheck")
public class YexMycheckController extends BaseController {
	
	@Autowired
	private YexMycheckService yexmycheckService;

	@Autowired
	private ApproveFormService approveFormService;

	@Autowired
	private MarkService markService;

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
		String YEXMYCHECK_ID=this.get32UUID();
		pd.put("YEXMYCHECK_ID",YEXMYCHECK_ID);
		JSONArray jsonArray = JSONArray.fromObject(pd.get("marks"));//把String转换为json
		List<PageData> marks=new ArrayList<>();
		marks = JSONArray.toList(jsonArray,PageData.class);//这里的t是Class<T>
		for (PageData pageData : marks) {
			pageData.put("MARK_ID", this.get32UUID());	//主键
			pageData.put("YEXMYCHECK_ID",YEXMYCHECK_ID);
		}
		try{
			yexmycheckService.save(pd);
			markService.batchSave(marks);
		}catch (Exception e){
			errInfo="exception";
			e.printStackTrace();
		}
		PageData approveForm=new PageData();
		String APPROVEFORM_ID=this.get32UUID();
		approveForm.put("APPROVEFORM_ID",APPROVEFORM_ID);
		approveForm.put("FORMDATA_ID",pd.get("YEXMYCHECK_ID"));
		approveForm.put("APPROVE_ID",pd.get("APPROVE_ID"));
		approveForm.put("FORM_TYPE",pd.get("FORM_TYPE"));
		approveForm.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		PageData findFullData=new PageData();/**/
		findFullData.put("FULLDATA_ID",pd.get("FULLDATA_ID"));
		approveForm.put("CREATE_TIME",DateUtil.date2Str(new Date()));
		approveForm.put("SUB_STATUS",pd.get("SUB_STATUS"));  //暂存  1是
		approveFormService.save(approveForm);
		map.put("RES_ID",pd.get("YEXMYCHECK_ID"));
		map.put("APPROVEFORM_ID",APPROVEFORM_ID);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("yexmycheck:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		yexmycheckService.delete(pd);
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
		String YEXMYCHECK_ID=pd.getString("YEXMYCHECK_ID");
		JSONArray jsonArray = JSONArray.fromObject(pd.get("marks"));//把String转换为json
		List<PageData> marks=new ArrayList<>();
		marks = JSONArray.toList(jsonArray,PageData.class);//这里的t是Class<T>
		for (PageData pageData : marks) {
			pageData.put("MARK_ID", this.get32UUID());	//主键
			pageData.put("YEXMYCHECK_ID",YEXMYCHECK_ID);
		}
		try{
			PageData delete=new PageData();
			delete.put("YEXMYCHECK_ID",YEXMYCHECK_ID);
			yexmycheckService.edit(pd);
			markService.deleteByYexmyCheckId(delete);
			markService.batchSave(marks);
			PageData findApproveForm=new PageData();
			findApproveForm.put("APPROVEFORM_ID",pd.get("APPROVEFORM_ID"));
			PageData approveFormRes = approveFormService.findById(findApproveForm);
			approveFormRes.put("SUB_STATUS",pd.get("SUB_STATUS"));
			approveFormService.edit(approveFormRes);
			map.put("RES_ID",pd.get("YEXMYCHECK_ID"));
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
	@RequiresPermissions("yexmycheck:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = yexmycheckService.list(page);	//列出YexMycheck列表
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
		pd = yexmycheckService.findById(pd);	//根据ID读取
		PageData find=new PageData();
		find.put("YEXMYCHECK_ID",pd.get("YEXMYCHECK_ID"));
		//正序 排列
		List<PageData> marks = markService.findByYexmyCheckId(find);
		Collections.sort(marks, new Comparator<PageData>() {
			@Override
			public int compare(PageData o1, PageData o2) {
				return Integer.parseInt(o1.getString("ONE_ORDER"))-Integer.parseInt(o2.getString("ONE_ORDER"));
			}
		});
		map.put("marks",marks);
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("yexmycheck:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			yexmycheckService.deleteAll(ArrayDATA_IDS);
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
		titles.add("依法办园得分");	//2
		titles.add("财务管理得分");	//3
		titles.add("行政管理与办园条件得分");	//4
		titles.add("教学管理得分");	//5
		titles.add("卫生保健得分");	//6
		titles.add("法定代表人意见");	//7
		titles.add("填表日期");	//8
		titles.add("填表人");	//9
		dataMap.put("titles", titles);
		List<PageData> varOList = yexmycheckService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("YEXMYCHECK_ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("ONE_SCORE"));	    //2
			vpd.put("var3", varOList.get(i).getString("TWO_SCORE"));	    //3
			vpd.put("var4", varOList.get(i).getString("THREE_SCORE"));	    //4
			vpd.put("var5", varOList.get(i).getString("FOUR_SCORE"));	    //5
			vpd.put("var6", varOList.get(i).getString("FIVE_SCORE"));	    //6
			vpd.put("var7", varOList.get(i).getString("OPINION"));	    //7
			vpd.put("var8", varOList.get(i).getString("FULLDATA_DATE"));	    //8
			vpd.put("var9", varOList.get(i).getString("CREATE_BY"));	    //9
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
