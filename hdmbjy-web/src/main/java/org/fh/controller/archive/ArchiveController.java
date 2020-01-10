package org.fh.controller.archive;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.archive.ArchiveService;
import org.fh.service.fhoa.DepartmentService;
import org.fh.service.organization.OrganizationService;
import org.fh.service.scuser.ScuserService;
import org.fh.service.system.UsersService;
import org.fh.util.Const;
import org.fh.util.DateUtil;
import org.fh.util.DelFileUtil;
import org.fh.util.FileDownload;
import org.fh.util.Jurisdiction;
import org.fh.util.ManyDownloadFile;
import org.fh.util.PathUtil;
import org.fh.util.ToPdf;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import net.sf.json.JSONArray;

/** 
 * 说明：文件系统
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-04
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/archive")
public class ArchiveController extends BaseController {
	//文件系统
	@Autowired
	private ArchiveService archiveService;
	//用户
	@Autowired
	private UsersService usersService;
	//组织机构
	@Autowired
	private DepartmentService departmentService;
	//用户
	@Autowired
	private ScuserService scuserService;
	//机构管理类
	@Autowired
	private OrganizationService organizationService;
	
	
	/**
	 * 判断文件是否纯在
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/isFile")
	@ResponseBody
	public Object isFile(HttpServletResponse response)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();
		pd = this.getPageData();
		String errInfo = "success";
		File file = new File(Const.NGINX_PATH + pd.getString("URL"));
		
		if (!file.exists()) {
			map.put("result", errInfo);
		}else {
			map.put("result", "update");
		}
		
		return map;
	}
	
	@RequestMapping(value="/isFileAll")
	@ResponseBody
	public Object isFileAll(HttpServletResponse response)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		PageData pd = new PageData();		
		pd = this.getPageData();
		String errInfo = "success";
		String DATA_IDS = pd.getString("DATA_IDS");
		String ArrayDATA_IDS[] = DATA_IDS.split(",");
		List<PageData> pds =  archiveService.findInById(ArrayDATA_IDS);
		List<PageData> pdss = new ArrayList<PageData>();
		int count = 0;
		for (int i = 0; i < pds.size(); i++) {
			String path = pds.get(i).getString("PATH");
			File file = new File(Const.NGINX_PATH+path);
			if (!file.exists()) {
				PageData pdt = new PageData();
				String title = pds.get(i).getString("TITLE");
				pdt.put("title", title);
				pdt.put("count", i);
				pdss.add(pdt);
				map.put("result", errInfo);
				count+=1;
			}
		}
		map.put("pdss", pdss);
		map.put("countZ", pds.size());
		map.put("count", count);
		return map;
	}
	
	
	
	/**
	 * 下载
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/download")
	public void downExcel(HttpServletResponse response)throws Exception{
		PageData pd = new PageData();
		pd = this.getPageData();
		//String extName = pd.getString("URL").substring(pd.getString("URL").lastIndexOf("."));
		FileDownload.fileDownload(response, Const.NGINX_PATH + pd.getString("URL"),pd.getString("NAME"));
	}
	/**
	 * 批量下载
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/downloadAll")
	public Object downloadAll(HttpServletRequest request,HttpServletResponse res) throws Exception{
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		String ArrayDATA_IDS[] = DATA_IDS.split(",");
		List<PageData> pds =  archiveService.findInById(ArrayDATA_IDS);
		
		List<PageData> filePaths = new ArrayList<PageData>();
		
		String[] nameAll = new String [pds.size()]; 
		
		for (int i = 0; i < pds.size(); i++) {
			String path = pds.get(i).getString("PATH");
			PageData pdpath = new PageData();
			pdpath.put("path",Const.NGINX_PATH+path);
			String extName = path.substring(path.lastIndexOf("."));
			if (Arrays.asList(nameAll).contains(pds.get(i).getString("FILE_NAME"))) {
				pdpath.put("name",pds.get(i).getString("TITLE")+Tools.getRandomNum()+extName);
			}else {
				pdpath.put("name",pds.get(i).getString("FILE_NAME"));
			}
			filePaths.add(pdpath);
			nameAll[i] = pds.get(i).getString("FILE_NAME");
		}
		String ss = ManyDownloadFile.downloadFilesPd(request, res, Const.ZIP_PATH, "download.zip", filePaths);
		return ss;
	}	
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("archive:add")
	@ResponseBody
	public Object add(@RequestParam(value="FIMG",required=false) MultipartFile file) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("ARCHIVE_ID", this.get32UUID());	//主键
		if (file != null && !file.isEmpty()) {
			Map<String,Object> fileName = ToPdf.fileUp(file, this.get32UUID());	
			pd.put("PATH", fileName.get("source"));
			pd.put("PDF_PATH", fileName.get("pdf"));
			pd.put("FILE_NAME", file.getOriginalFilename());
		}
		pd.put("FIND_TYPE", "0");
		
		PageData pdscu = new PageData();
		pdscu.put("SCUSER_ID", Jurisdiction.getUser().getUSER_ID());
		PageData ps = scuserService.findById(pdscu);
		if(Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())){
			pd.put("NAME", Jurisdiction.getName());	//机构负责人
		}else{
			pd.put("DEPARTMENT_ID",ps.getString("ORGANIZATION_ID") );	//机构负责人
			pd.put("NAME", Jurisdiction.getName());	//机构负责人
		}
		pd.put("USER_ID", Jurisdiction.getUser().getUSER_ID());	//机构负责人id
		pd.put("CREATOR_DATE", DateUtil.date2Str(new Date()));	//创建时间
		pd.put("UPLOAD_USERNAME",Jurisdiction.getUsername());  //上传用户名
		archiveService.save(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("archive:del")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		archiveService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("archive:edit")
	@ResponseBody
	public Object edit(@RequestParam(value="FIMG",required=false) MultipartFile file) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if (file != null && !file.isEmpty()) {
			Map<String,Object> fileName = ToPdf.fileUp(file, this.get32UUID());	
			pd.put("PATH", fileName.get("source"));
			pd.put("PDF_PATH", fileName.get("pdf"));
			pd.put("FILE_NAME", file.getOriginalFilename());
		}
		pd.put("CREATOR_DATE", DateUtil.date2Str(new Date()));	//创建时间
		archiveService.edit(pd);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("archive:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");	//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		
		if (Const.ADMIN_USERNAME.contains(Jurisdiction.getUsername())) {
			String DEPARTMENT_ID = pd.getString("DEPARTMENT_ID");
			if (Tools.notEmpty(DEPARTMENT_ID)) {
				pd.put("DEPARTMENT_ID", DEPARTMENT_ID.trim());
			}else {
				pd.put("DEPARTMENT_ID", null);
			}
			pd.put("USER_ID", null);
			
		}else {
//			pd.put("USER_ID", Jurisdiction.getUser().getUSER_ID());
			PageData pdscu = new PageData();
			pdscu.put("SCUSER_ID", Jurisdiction.getUser().getUSER_ID());
			PageData ps = scuserService.findById(pdscu);
			pd.put("DEPARTMENT_ID", ps.getString("ORGANIZATION_ID"));
		}
		
		page.setPd(pd);
		List<PageData>	varList = archiveService.list(page);	//列出Archive列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		//当前用户
		map.put("username", Jurisdiction.getUsername());
		//管理员用户
		map.put("adminname", Const.ADMIN_USERNAME);
		
		return map;
	}
	/**
	 * 管理员时的树形机构菜单
	 * @param page
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/archiveTree")
	@ResponseBody
	public Object archiveTree(Page page) throws Exception{
	
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		List<PageData> parentList = new ArrayList<>();
		PageData pageData = new PageData();
		pageData=this.getPageData();
		parentList = organizationService.listTreeArchive(pageData);
		JSONArray arr = JSONArray.fromObject(parentList);
		String json = arr.toString();
		map.put("zTreeNodes", json);
		map.put("userName", Jurisdiction.getUsername());
		map.put("adminname", Const.ADMIN_USERNAME);
		map.put("result", errInfo);
		return map;
		
	}
	
	 /**去修改页面获取数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@RequiresPermissions("archive:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = archiveService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("archive:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			archiveService.deleteAll(ArrayDATA_IDS);
			errInfo = "success";
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**
	 * 上传文件删除
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/delWj")
	@ResponseBody
	public Object delImg() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String PATH = pd.getString("PATH");	
		if(Tools.notEmpty(pd.getString("PATH").trim())){								//文件路径
			DelFileUtil.delFolder(Const.WORD_PATH + pd.getString("PATH")); 	//删除硬盘中的文件
		}
		if(PATH != null){
			archiveService.delWj(pd);
		}	
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	
	/**
	 * 显示列表ztree
	 * @return
	 */
	@RequestMapping(value="/listTreeAll")
	@ResponseBody
	public Object listTreeAll()throws Exception{
		PageData pageData=new PageData();
		pageData=this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		List<PageData> all = departmentService.listTreeArchive(pageData);
		if(!StringUtils.isBlank((String)(pageData.get("ID")))){
			PageData inform = archiveService.findById(pageData);
			String DEPARTMENT_IDS= (String) inform.get("DEPARTMENT_ID");
			String[] split = DEPARTMENT_IDS.split(",");
			for (PageData data : all) {
				for (String s : split) {
					String dId=(String)data.get("id");
					if(dId.equals(s)){
						data.put("checked",true);
					}
				}
			}
		}
		
		
		JSONArray arr = JSONArray.fromObject(all);
		String json = arr.toString();
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		return map;
	}
	
	/**
	 * 获取用户
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/userType")
	@ResponseBody
	public Object userType()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		map.put("username", Jurisdiction.getUsername());
		map.put("result", errInfo);
		return map;
	}
	
}
