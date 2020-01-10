package org.fh.controller.article;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Category;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.service.article.ArticleService;
import org.fh.service.attachment.AttachmentService;
import org.fh.service.category.CategoryService;
import org.fh.util.Const;
import org.fh.util.FileUpload;
import org.fh.util.FileUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.ObjectExcelView;
import org.fh.util.SmsServiceUtil;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

/** 
 * 说明：文章管理
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-01
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/article")
public class ArticleController extends BaseController {
	
	@Autowired
	private ArticleService articleService;

	@Autowired
	private AttachmentService attachmentService;
	@Autowired
	private CategoryService categoryService;
	




	@GetMapping("/test")
	@ResponseBody
	public String  test1(){
		PageData pageData=new PageData();
		attachmentService.save(pageData);
		return "2";
	}

	/**删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("article:del")
	@ResponseBody
	@Transactional
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("IDS",pd.get("ID"));
		Map map1 = articleService.deleteAllAndAttachment(pd);
		if(!map1.get("result").toString().equals("success")){
			errInfo="exception";
		}
		map.put("result", errInfo);
		//返回结果
		return map;
	}

	@RequestMapping(value="/deleteFileById")
	@RequiresPermissions("article:del")
	@ResponseBody
	public Object deleteFileById() throws Exception {
		Map<String,String> map = new HashMap<String,String>();
		PageData pd = new PageData();
		String errInfo = "success";
		pd = this.getPageData();
		PageData oneById = attachmentService.getOneById(pd);
		if(null!=oneById) {
			try{
				articleService.deleteFileById(pd);
				FileUtil.delFile((String) oneById.get("URL"));
			}catch (Exception e){
				errInfo="exception";
				e.printStackTrace();
			}
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("article:edit")
	@ResponseBody
	public Object edit(@RequestParam(required = false) MultipartFile file) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		try{
			if(null!=file){
				String fileName = this.get32UUID();
				String filePath = Const.FILEPATH;	//文件上传路径
				fileName=FileUpload.fileUp(file,filePath,fileName); //执行上传
				pd.put("COVER_IMAGE",Const.PRE_IMG+fileName);
			}
			pd.put("UPDATE_DATE",new Date());
			pd.put("STATUS","0");
//			pd.put("KEYWORDS","0");
			pd.put("UPDATE_BY",Jurisdiction.getUsername());
			articleService.edit(pd);
			map.put("result", errInfo);
		}catch (Exception e){
			e.printStackTrace();
		}
		return map;
	}


	/**
	 * 获取根据文章id 获取附件
	 * @param
	 * @return
	 */
	@RequestMapping(value="/getPreAttachment")
	@RequiresPermissions("article:list")
	@ResponseBody
	public Object getPreAttachment() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = articleService.findById(pd);	//根据ID读取
		List<PageData> varList=articleService.findAttachmentByIds(pd);
		map.put("varList",varList);
		map.put("result", errInfo);
		return map;
	}
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("article:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		page.setPd(pd);
		List<PageData>	varList = articleService.list(page);	//列出Article列表
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
	@RequiresPermissions("article:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = articleService.findById(pd);	//根据ID读取
		if(!pd.get("ATTACHMENT").toString().equals("")){
			List<PageData> apd=articleService.findAttachmentByIds(pd);
			map.put("apd", apd);  //查询出来的附件名字集合
		}
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@RequiresPermissions("article:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();		
		pd = this.getPageData();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			pd.put("IDS",DATA_IDS);
			Map map1 = articleService.deleteAllAndAttachment(pd);
			if(!map1.get("result").toString().equals("success")){
				errInfo = "error";
			}
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
		titles.add("编号");	//1
		titles.add("栏目编号");	//2
		titles.add("标题");	//3
		titles.add("文章链接");	//4
		titles.add("文章图片");	//5
		titles.add("关键字");	//6
		titles.add("描述、摘要");	//7
		titles.add("权重，越大越靠前");	//8
		titles.add("附件");	//9
		titles.add("内容");	//10
		titles.add("创建者");	//11
		titles.add("创建时间");	//12
		titles.add("更新者");	//13
		titles.add("更新时间");	//14
		dataMap.put("titles", titles);
		List<PageData> varOList = articleService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("ID"));	    //1
			vpd.put("var2", varOList.get(i).getString("CATEGORY_ID"));	    //2
			vpd.put("var3", varOList.get(i).getString("TITLE"));	    //3
			vpd.put("var4", varOList.get(i).getString("LINK"));	    //4
			vpd.put("var5", varOList.get(i).getString("COVER_IMAGE"));	    //5
			vpd.put("var6", varOList.get(i).getString("KEYWORDS"));	    //6
			vpd.put("var7", varOList.get(i).getString("DESCRIPTION"));	    //7
			vpd.put("var8", varOList.get(i).get("ORDER").toString());	//8
			vpd.put("var9", varOList.get(i).getString("ATTACHMENT"));	    //9
			vpd.put("var10", varOList.get(i).getString("REMARKS"));	    //10
			vpd.put("var11", varOList.get(i).getString("CREATE_BY"));	    //11
			vpd.put("var12", varOList.get(i).getString("CREATE_DATE"));	    //12
			vpd.put("var13", varOList.get(i).getString("UPDATE_BY"));	    //13
			vpd.put("var14", varOList.get(i).getString("UPDATE_DATE"));	    //14
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}


	@RequestMapping("/add")
	@RequiresPermissions("article:add")
	@ResponseBody
	public Map articelAdd(@RequestParam(required = false) MultipartFile file) throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();

		try{
		    if(null!=file){
                String filePath = Const.FILEPATH;	//文件上传路径
                String fileName = this.get32UUID();
                fileName=FileUpload.fileUp(file,filePath,fileName); //执行上传
                pd.put("COVER_IMAGE",Const.PRE_IMG+fileName);
            }
            pd.put("CREATE_DATE",new Date());
			pd.put("STATUS","0");
//			pd.put("KEYWORDS","0");
			pd.put("CREATE_BY",Jurisdiction.getName());
			pd.put("ID",this.get32UUID());
			/*
			 * String remarks = stripHtml(pd.getString("REMARKS")); List<Category> list =
			 * categoryService.listSubCategoryByName("协会工作通知"); if (list.size()>0) { for
			 * (int i = 0; i < list.size(); i++) { if
			 * (list.get(i).getId().equals(pd.getString("CATEGORY_ID"))) {
			 * SmsServiceUtil.sendSms("协会通知",remarks.substring(0,20)+"...","手机号"); }else{
			 * throw new Exception("通知用户不存在"); } } }
			 */
			articleService.save(pd);
			map.put("result", errInfo);
		}catch (Exception e){
			e.printStackTrace();
		}
		return map;
	}



//    @RequiresPermissions("article:add")
    @RequestMapping("/attachmentLoad")
    @ResponseBody
    public Object attachmentLoad(@RequestParam("file") MultipartFile file){
        Map<String,Object> map=new HashMap<>();
        PageData pageData=new PageData();
        pageData=this.getPageData();
        String ids="";
        //文件的原名字
        String originalName = file.getOriginalFilename();
        //文件的现名字 当前时间精确到毫秒
        String fileName=(new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()))+ UUID.randomUUID().toString().substring(5,10);
        //根据操作系统获取上传文件路径
        String filePath = Const.ATTACHMENTPATH;
        try {
            fileName=FileUpload.fileUp(file, filePath, fileName);
            String url=filePath+fileName;
            pageData.put("URL",url);
            pageData.put("NAME",fileName);
            pageData.put("ORIGINAL_NAME",originalName);
            pageData.put("CREATE_DATE",new Date());
            pageData.put("CREATE_BY",Const.USER_NAME);
            attachmentService.save(pageData);
            Object id1= pageData.get("ID");
            if(null!=id1){
                String id2=id1.toString();
//                ids+=id+",";
                map.put("code",0);
				map.put("ids",id2);
            }else{
                map.put("code",1);
            }

           /* if(",".equals(ids.charAt(ids.length()-1))){
            	ids=ids.substring(0,ids.length()-1);
			}*/

        } catch (Exception e) {
            e.printStackTrace();
            map.put("code",1);
            return  map;
        }
        return map;
    }


	@RequestMapping(value = "/imgUpdate")
	@ResponseBody
	@RequiresPermissions("article:add")
	public Map imgUpdate(MultipartFile file) {
		Map<String, Object> params = new HashMap<String, Object>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("msg","success");
		if (file.isEmpty()) {
			return map;
		}
		String fileName = file.getOriginalFilename();
		fileName =this.get32UUID();
		try {
			fileName =FileUpload.fileUp(file, Const.FILEPATH, fileName);
			params.put("code",0);
			params.put("state", "SUCCESS");
			params.put("url", Const.ARTICLE_IMAGEPATH+Const.PRE_IMG+fileName);
			params.put("size", file.getSize());
			params.put("original", fileName);
			params.put("type", file.getContentType());
			return params;
		} catch (Exception e) {
			e.printStackTrace();

		}
		return params;
	}

	@RequestMapping(value = "/getById")
	@ResponseBody
	@RequiresPermissions("article:list")
	public Object getById() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = articleService.findById(pd);	//根据ID读取
		List<PageData> varList=new ArrayList<>();
		if(null!=pd.get("ATTACHMENT")&&!pd.get("ATTACHMENT").toString().equals("")){
			varList=articleService.findAttachmentByIds(pd);

		}
		map.put("varList", varList);
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}

	@RequestMapping(value = "/download")
	@ResponseBody
	@RequiresPermissions("article:list")
	public Object download(HttpServletRequest request,HttpServletResponse response) throws UnsupportedEncodingException {
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData attachment = attachmentService.getOneById(pd);
		String url="";
		String fileName="";
		if(attachment!=null){
			url= (String) attachment.get("URL");
			fileName= (String) attachment.get("ORIGINAL_NAME");
		}else{
			errInfo="exception";
			map.put("result", errInfo);
			return map;
		}
		String userAgent = request.getHeader("User-Agent");
		if (/* IE 8 至 IE 10 */
				userAgent.toUpperCase().contains("MSIE") ||
						/* IE 11 */
						userAgent.contains("Trident/7.0")) {
			try {
				fileName = URLEncoder.encode(fileName, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		} else if (userAgent.toUpperCase().contains("MOZILLA") ||
				userAgent.toUpperCase().contains("CHROME")) {
			fileName = new String(fileName.getBytes(), "ISO-8859-1");
		} else {
			fileName = URLEncoder.encode(fileName, "UTF-8");
		}
		if (fileName != null) {
			//设置文件路径
			File file = new File(url);
			if (file.exists()) {
				response.setCharacterEncoding("UTF-8");
				response.setContentType("application/force-download");// 设置强制下载不打开
				response.setHeader("Content-Disposition", "attachment;fileName=" + fileName);// 设置文件名
				byte[] buffer = new byte[1024];
				FileInputStream fis = null;
				BufferedInputStream bis = null;
				try {
					fis = new FileInputStream(file);
					bis = new BufferedInputStream(fis);
					OutputStream os = response.getOutputStream();
					int i = bis.read(buffer);
					while (i != -1) {
						os.write(buffer, 0, i);
						i = bis.read(buffer);
					}
					os.close();
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					if (bis != null) {
						try {
							bis.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
					if (fis != null) {
						try {
							fis.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
		return map;
	}


	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/listType")
	@RequiresPermissions("article:list")
	@ResponseBody
	public Object listType(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS))pd.put("KEYWORDS", KEYWORDS.trim());
		String name = Jurisdiction.getUsername();
		if (Const.ADMIN_USERNAME.contains(name)) {
			pd.put("CREATE_BY", null);
		}else {
			pd.put("CREATE_BY", name);
		}
		
		page.setPd(pd);
		List<PageData>	varList = articleService.listType(page);	//列出Article列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/lmType")
	@ResponseBody
	public Object lmType(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		List<Category> list =  categoryService.listSubCategoryByName(pd.getString("lmName"));
		map.put("CATEGORY_ID", list.get(0).getId());
		map.put("result", errInfo);
		return map;
	}
	
	 public static String stripHtml(String htmlStr) {
		/*
		 * String txtcontent = content.replaceAll("</?[^>]+>", ""); //剔出<html>的标签
		 * txtcontent = txtcontent.replaceAll("<a>\\s*|\t|\r|\n</a>",
		 * "");//去除字符串中的空格,回车,换行符,制表符 txtcontent = txtcontent.replaceAll("/\\r\\n/ig",
		 * "");//去除字符串中的空格,回车,换行符,制表符
		 * 
		 * return txtcontent;
		 */
		 String script = "<script[^>]*?>[\\s\\S]*?<\\/script>";
	        String style = "<style[^>]*?>[\\s\\S]*?<\\/style>";
	        String html = "<[^>]+>";
	        String space = "(\r?\n(\\s*\r?\n)+)";
	        String white = "&nbsp;";
	        Pattern pScript = Pattern.compile(script, 2);
	        Matcher mScript = pScript.matcher(htmlStr);
	        htmlStr = mScript.replaceAll("");
	        Pattern pStyle = Pattern.compile(style, 2);
	        Matcher mStyle = pStyle.matcher(htmlStr);
	        htmlStr = mStyle.replaceAll("");
	        Pattern pHtml = Pattern.compile(html, 2);
	        Matcher mHtml = pHtml.matcher(htmlStr);
	        htmlStr = mHtml.replaceAll("");
	        Pattern pSpace = Pattern.compile(space, 2);
	        Matcher mSpace = pSpace.matcher(htmlStr);
	        htmlStr = mSpace.replaceAll("");
	        htmlStr = htmlStr.replaceAll(white, "");
	        return htmlStr.trim();
		 
	    }
	
}
