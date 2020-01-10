package org.fh.controller.index;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Category;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.article.ArticleService;
import org.fh.service.category.CategoryService;
import org.fh.service.index.ComplaintService;
import org.fh.util.Const;
import org.fh.util.DateUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.ManyDownloadFile;
import org.fh.util.ObjectExcelView;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/** 
 * 说明：投诉管理
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-18
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/complaint")
public class ComplaintController extends BaseController {
	
	@Autowired
	private ComplaintService complaintService;
	@Autowired
	private CategoryService categoryService;
	@Autowired
	private ArticleService articleService;
	
	
	@RequestMapping(value = "/listAll")
	@ResponseBody
	public Object list() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		List<Category> listCategory = categoryService.listSubCategoryByParentId("0");
		map.put("listCategory", listCategory);
		map.put("result", errInfo);
		return map;
	}
	
	
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
		HttpServletRequest request = this.getRequest();
		pd = this.getPageData();
		String id = this.get32UUID();
		pd.put("COMPLAINT_ID", id);	//主键
		pd.put("PROCESS", 1); //1初次提交 2 正在处理中 3处理完成并发布
		pd.put("NOCOUNT",id.toUpperCase());
		pd.put("JB_USER", pd.getString("JB_USER").substring(0, 1)+"**");
		pd.put("TJ_TIME", DateUtil.date2Str(new Date()));
		String ip = "";
		if (request.getHeader("x-forwarded-for") == null) {  
			ip = request.getRemoteAddr();  
	    }else{
	    	ip = request.getHeader("x-forwarded-for");  
	    }
		pd.put("IP",ip );
		complaintService.save(pd);
		map.put("result", errInfo);
		map.put("NOCOUNT",id.toUpperCase());
		map.put("id", id);
		return map;
	}
	
	@RequestMapping(value="/findById")
	@ResponseBody
	public Object findById() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = complaintService.findById(pd);
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("complaint:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		complaintService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("complaint:edit")
	@ResponseBody
	public Object edit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("BZ_CB", Jurisdiction.getUsername());
		pd.put("PROCESS", 3);
		pd.put("NOCOUNT", pd.getString("COMPLAINT_ID").toUpperCase());
		pd.put("CL_TIME", DateUtil.date2Str(new Date()));
		complaintService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("complaint:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = complaintService.list(page);	//列出Complaint列表
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
	@RequiresPermissions("complaint:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = complaintService.findById(pd);	//根据ID读取
		pd.put("PROCESS", 2);
		complaintService.edit(pd);
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("complaint:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			complaintService.deleteAll(ArrayDATA_IDS);
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
		titles.add("举报人");	//1
		titles.add("举报人电话");	//2
		titles.add("举报类型");	//3
		titles.add("被举报单位");	//4
		titles.add("举报原由");	//5
		titles.add("进程");	//6
		titles.add("备注字段");	//7
		titles.add("备注字段");	//8
		titles.add("备注字段");	//9
		dataMap.put("titles", titles);
		List<PageData> varOList = complaintService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("JB_USER"));	    //1
			vpd.put("var2", varOList.get(i).getString("JB_TEL"));	    //2
			vpd.put("var3", varOList.get(i).getString("TYPE"));	    //3
			vpd.put("var4", varOList.get(i).getString("UNIT"));	    //4
			vpd.put("var5", varOList.get(i).getString("REASON"));	    //5
			vpd.put("var6", varOList.get(i).getString("PROCESS"));	    //6
			vpd.put("var7", varOList.get(i).getString("NO"));	    //7
			vpd.put("var8", varOList.get(i).getString("BZ_CB"));	    //8
			vpd.put("var9", varOList.get(i).getString("REPLY"));	    //9
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	/**
	 * @param zipBasePath 临时压缩文件基础路径
	 * @param zipName 临时压缩文件名称
	 * @param zipFilePath 临时压缩文件完整路径
	 * @param filePaths 需要压缩的文件路径集合
	 * @param request
	 * @param res
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/downloadFiles")
	public Object downloadFilesTest(HttpServletRequest request,HttpServletResponse res) throws Exception{
		PageData pd = new PageData();
		pd = this.getPageData();
		String attIds = pd.getString("ATTACHMENT");
		 List<PageData> fjList=new ArrayList<>();
			if(null!=attIds&&!attIds.toString().equals("")){
				fjList=articleService.findAttachmentByIds(pd);
		 }
		
		String zipBasePath = Const.ZIP_PATH;
		String zipName = this.get32UUID()+".zip";
		List<String> filePaths = new ArrayList<String>();
		for (int i = 0; i < fjList.size(); i++) {
			String path = fjList.get(i).getString("URL");
			filePaths.add(path);
		}
		
		String ss = ManyDownloadFile.downloadFilesTest(request, res, zipBasePath, zipName, filePaths);
		return ss; 
	}

	
	
	
}
