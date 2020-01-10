package org.fh.controller.act.fhmodel;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.act.AcBaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.act.FHModelService;
import org.fh.util.Jurisdiction;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：工作流模型管理
 * 作者：FH Admin Q313-596790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/fhmodel")
public class FHModelController extends AcBaseController{
	
	@Autowired
	private FHModelService fHModelService;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("fhmodel:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("keywords", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData> varList = fHModelService.list(page);
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	 /**获取当前用户
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/getAuthor")
	@ResponseBody
	public Object getAuthor()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		map.put("process_author", Jurisdiction.getName());	//流程作者
		map.put("result", errInfo);							//返回结果
		return map;
	}
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("fhmodel:add")
	@ResponseBody
	public Object add() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String process_author = pd.getString("process_author");	//流程作者
		String name  = pd.getString("name");					//流程名称
		String process_id  = pd.getString("process_id");		//流程标识
		String modelname  = pd.getString("modelname");			//模型名称
		String description  = pd.getString("description");		//模型描述
		String category  = pd.getString("category");			//模型分类
		String modelId = createModel(process_id,process_author,name,modelname,description,category);
		map.put("sunval",modelId);
		map.put("result", errInfo);								//返回结果
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("fhmodel:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		PageData pd = new PageData();
		pd = this.getPageData();
		deleteModel(pd.getString("ID_"));
		map.put("result", "success");				//返回结果
		return map;
	}
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("fhmodel:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			for(int i=0;i<ArrayDATA_IDS.length;i++){
				deleteModel(ArrayDATA_IDS[i]);
			}
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**部署流程定义
	 * @return 
	 */
	@RequestMapping(value="/deployment")
	@RequiresPermissions("fhmodel:edit")
	@ResponseBody
	public Object deployment(){
		Map<String,Object> map = new HashMap<String,Object>();
		String result = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		try{
			deploymentProcessDefinitionFromModelId(pd.getString("modelId"));//部署流程定义
		}catch (Exception e){
			result = "error";
		}finally{
			map.put("result", result);
		}
		return map;
	}
	
	/**判断能否正常根据模型ID导出xml文件
	 * @return 
	 */
	@RequestMapping(value="/isCanexportXml")
	@RequiresPermissions("fhmodel:cha")
	@ResponseBody
	public Object isCanexportXml(HttpServletResponse response){
		Map<String,Object> map = new HashMap<String,Object>();
		String result = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		try{
			isCanexportXmlFromModelId(response,pd.getString("modelId"));
		}catch (Exception e){
			result = "error";
		}finally{
			map.put("result", result);
		}
		return map;
	}
	
	/**获取预览XML页面code
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/getXmlView")
	@RequiresPermissions("fhmodel:cha")
	@ResponseBody
	public Object getXmlView()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String result = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String code = viewXmlFromModelId(pd.getString("modelId"));
		map.put("code", code);
		map.put("result", result);
		return map;
	}
	
	/**正式根据模型ID导出xml文件
	 * @return 
	 * @throws Exception 
	 */
	@RequestMapping(value="/exportXml")
	@RequiresPermissions("fhmodel:cha")
	public void exportXml(HttpServletResponse response) throws Exception{
		PageData pd = new PageData();
		pd = this.getPageData();
		exportXmlFromModelId(response,pd.getString("modelId"));	//导出xml文件
	}
	
	 /**去修改类型页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@ResponseBody
	public Object goEdit()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String result = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = fHModelService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", result);
		return map;
	}
	
	/**修改类型
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("fhmodel:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String result = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		fHModelService.edit(pd);
		map.put("result", result);
		return map;
	}

	 /**从流程定义映射模型
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/saveModelFromPro")
	@RequiresPermissions("fhmodel:add")
	@ResponseBody
	public Object saveModelFromPro(){
		Map<String,Object> map = new HashMap<String,Object>();
		String result = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String processDefinitionId = pd.getString("processDefinitionId"); 		//流程定义ID
		try {
			saveModelFromPro(processDefinitionId);
		} catch (Exception e) {
			result = "errer";
		}
		map.put("result", result);
		return map;
	}
	
}
