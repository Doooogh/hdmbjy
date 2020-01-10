package org.fh.controller.table;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.option.OptionService;
import org.fh.service.table.TableService;
import org.fh.service.tabledata.TableDataService;
import org.fh.util.DateUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import net.sf.json.JSONArray;

/** 
 * 说明：通知反馈表
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-15
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/table")
public class TableController extends BaseController {
	
	@Autowired
	private TableService tableService;
	@Autowired
	private TableDataService tableDataService;

	@Autowired
	private OptionService optionService;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("table:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String TABLE_ID=this.get32UUID();
		pd.put("TABLE_ID", TABLE_ID);	//主键
		String CREATE_BY=Jurisdiction.getUser().getNAME();
		String CREATE_DATE=DateUtil.date2Str(new Date());
		pd.put("CREATE_BY",CREATE_BY);
		pd.put("CREATE_DATE",CREATE_DATE);
		tableService.save(pd);
		JSONArray jsonArray = JSONArray.fromObject(pd.get("options"));//把String转换为json
		List<PageData> options=new ArrayList<>();
		options =JSONArray.toList(jsonArray,PageData.class);//这里的t是Class<T>
		int order=1;
		for (PageData option : options) {
			/*String OPTION_ID=get32UUID();
			option.put("OPTION_ID",OPTION_ID);*/
			option.put("TABLE_ID",TABLE_ID);
			option.put("ORDER",order++);
//			option.put("PINYIN", ToPinyin.getPinYin(option.getString("NAME")));
			if(null!=option.get("childOption")){
                String  childOptionStr=option.getString("childOption");
                childOptionStr=childOptionStr.replaceAll("\\\\","");

                JSONArray childOptionsJson = JSONArray.fromObject(childOptionStr);
//				JSONArray childOptionsJson = JSONArray.fromObject(option.get("childOptions"));//把String转换为json
				List<PageData> childOptions = JSONArray.toList(childOptionsJson,PageData.class);//这里的t是Class<T>
				int cOrder=1;
				for (PageData childOption : childOptions) {
					childOption.put("TABLE_ID",TABLE_ID);
					childOption.put("ORDER",cOrder++);
				}
				optionService.batchSave(childOptions);// 将二级option 保存
			}
		}
		optionService.batchSave(options);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("table:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		tableService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改   如果此时在tabledata表中没有数据可以进行编辑
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("table:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String TABLE_ID=pd.getString("TABLE_ID");
		tableService.edit(pd);
		PageData deleteOptionByTableId=new PageData();
		deleteOptionByTableId.put("TABLE_ID",TABLE_ID);
		optionService.deleteByTableId(deleteOptionByTableId);
		JSONArray jsonArray = JSONArray.fromObject(pd.get("options"));//把String转换为json
		List<PageData> options=new ArrayList<>();
		options = JSONArray.toList(jsonArray,PageData.class);//这里的t是Class<T>
		for (PageData option : options) {
			String OPTION_ID=get32UUID();
			option.put("OPTION_ID",OPTION_ID);
			option.put("TABLE_ID",TABLE_ID);
			if(null!=option.get("childOption")){
				JSONArray childOptionsJson = JSONArray.fromObject(option.get("childOptions"));//把String转换为json
				List<PageData> childOptions = JSONArray.toList(childOptionsJson,PageData.class);//这里的t是Class<T>
				for (PageData childOption : childOptions) {
					childOption.put("OPTION_ID",get32UUID());
					childOption.put("TABLE_ID",TABLE_ID);
					childOption.put("PARENT_ID",OPTION_ID);
				}
				optionService.batchSave(childOptions);// 将二级option 保存
			}
		}
		optionService.batchSave(options);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("table:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		pd.put("CREATE_BY", Jurisdiction.getUser().getUSER_ID());
		page.setPd(pd);
		List<PageData>	varList = tableService.list(page);	//列出Table列表
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
	@RequiresPermissions("table:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = tableService.findById(pd);	//根据ID读取

		//通过TABLE_ID 查询 options   查询出来的数据需要有层级关系

		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}


	@GetMapping("/getTreeOption")
	@ResponseBody
	public 	 Object getTree() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		List<PageData> treeByTableId = optionService.findTreeByTableId(pd);
		map.put("tree",treeByTableId);
		map.put("result",errInfo);
		return map;
	}
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("table:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			tableService.deleteAll(ArrayDATA_IDS);
			errInfo = "success";
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**导出到excel
	 * @param @RequiresPermissions("toExcel")
	 * @throws Exception
	 */
	@RequestMapping(value="/excel")
	public ModelAndView exportExcel() throws Exception{
		ModelAndView mv = new ModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		
		
		PageData optionData=new PageData();
		optionData.put("TABLE_ID",pd.get("TABLE_ID"));
		List<PageData> listOption = optionService.findTreeByTableId(optionData);
		List<String> titles = new ArrayList<String>();
		titles.add("用户名");
		for (int i = 0; i < listOption.size(); i++) {
			titles.add(listOption.get(i).getString("NAME")); //1
		}
		
		dataMap.put("titles", titles);
		
		PageData findTableData=new PageData();
		findTableData.put("INFORM_ID",pd.get("ID"));
		//findTableData.put("HEADMAN_ID",null==Jurisdiction.getUser()?"":Jurisdiction.getUser().getUSER_ID());
		List<PageData> tableDataInfo = tableDataService.findByInformId(findTableData);//获取该用户的填报的回执单
		List<PageData> varList = new ArrayList<PageData>();
		for (int i = 0; i < tableDataInfo.size(); i++) {
			String dataValue = tableDataInfo.get(i).getString("VALUE");
			org.json.JSONArray objar = new org.json.JSONArray(dataValue);
	        List<Object>  list = objar.toList();
	        String username = tableDataInfo.get(i).getString("USERNAME");
	        PageData vpd = new PageData();
	        vpd.put("var1",username);
	        for (int j = 0; j < list.size(); j++) {
	        	 Map<String,Object> map = (HashMap<String,Object>)list.get(j);
				    vpd.put("var"+(j+2), map.get("name"));
				    PageData pdo = listOption.get(j);
				    if (pdo.getString("TYPE").equals("CHECKBOX")) {
				    	PageData pdPid = new PageData();
				    	pdPid.put("PARENT_ID", pdo.getString("OPTION_ID"));
				    	String name = "";
						List<PageData> listIds = optionService.findByPId(pdPid);
				    	for (int k = 0; k < listIds.size(); k++) {
							if (String.valueOf(map.get("value")).contains(listIds.get(k).getString("PINYIN"))) {
								if (k==(listIds.size()-1)) {
									name += listIds.get(k).getString("NAME");
								}else {
									name += listIds.get(k).getString("NAME")+"、";
								}
							}  
						}
				    	vpd.put("var"+(j+2), name);
					}else if(pdo.getString("TYPE").equals("INPUT")) {
						 vpd.put("var"+(j+2), map.get("value"));
					}else if(pdo.getString("TYPE").equals("RADIO")) {
						PageData pdPid = new PageData();
				    	pdPid.put("PARENT_ID", pdo.getString("OPTION_ID"));
				    	String name = "";
						List<PageData> listIds = optionService.findByPId(pdPid);
				    	for (int k = 0; k < listIds.size(); k++) {
							if (String.valueOf(map.get("value")).contains(listIds.get(k).getString("PINYIN"))) {
								name = listIds.get(k).getString("NAME");
							}  
						}
				    	vpd.put("var"+(j+2), name);
					}else {
						vpd.put("var"+(j+2), map.get("value"));
					}
			}
	        varList.add(vpd);
		}
		
		/*
		 * for(int i=0;i<varOList.size();i++){ PageData vpd = new PageData();
		 * vpd.put("var1", varOList.get(i).getString("INFORM_ID")); //1 vpd.put("var2",
		 * varOList.get(i).getString("CREATE_DATE")); //2 vpd.put("var3",
		 * varOList.get(i).getString("CREATE_BY")); //3 vpd.put("var4",
		 * varOList.get(i).getString("FIELD1")); //4 vpd.put("var5",
		 * varOList.get(i).getString("FIELD2")); //5 vpd.put("var6",
		 * varOList.get(i).getString("FIELD3")); //6 varList.add(vpd); }
		 */
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
}
