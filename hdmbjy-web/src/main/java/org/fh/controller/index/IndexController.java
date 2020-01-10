package org.fh.controller.index;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fh.controller.base.BaseController;
import org.fh.entity.Category;
import org.fh.entity.PageData;
import org.fh.service.article.ArticleService;
import org.fh.service.category.CategoryService;
import org.fh.service.rotaryimg.RotaryimgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/** 
 * 说明：首页信息显示
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-27
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/indexHtml")
public class IndexController extends BaseController {
	/**
	 * 栏目
	 */
	@Autowired
	private CategoryService categoryService;
	/**
	 * 轮播图片
	 */
	@Autowired
	private RotaryimgService rotaryimgService;
	/**
	 * 文章管理
	 */
	@Autowired
	private ArticleService articleService;
	/**
	 * 日常监管
	
	@Autowired
	private SuperviseService superviseService;
	*
	 *  协会管理
	 *
	@Autowired
	private IndustryService industryService;
	 */
	/**
	 * 栏目查询
	 * 
	 * @throws Exception
	 */
	@RequestMapping(value = "/listAll")
	@ResponseBody
	public Object list() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		//PageData pageData=new PageData();
		//pageData= this.getPageData();
		//栏目
		List<Category> listCategory = categoryService.listSubCategoryByParentId("0");
		
		//轮播图片
		PageData pageData=new PageData();
		pageData= this.getPageData();
		List<PageData> listRotaryimg = rotaryimgService.listAllType(pageData);
		
		List<PageData> listArticles = new ArrayList<PageData>();
		List<PageData> listXinWen = new ArrayList<PageData>();
		//首页热门推荐
		if (listCategory.size()>0) {
		 List<Category> listName = categoryService.listSubCategoryByName("热门推荐");
		 PageData pdcategoryId = new PageData();
		 pdcategoryId = this.getPageData();
		 pdcategoryId.put("id", listName.get(0).getId());
		 pdcategoryId.put("count", 3);
		 listArticles = articleService.findBycategoryId(pdcategoryId);
		 
		 PageData pdcategoryIdOrDate = new PageData();
		 pdcategoryIdOrDate = this.getPageData();
		 pdcategoryIdOrDate.put("id", listName.get(0).getId());
		 pdcategoryIdOrDate.put("count", 8);
		 listXinWen = articleService.findBycategoryIdOrDate(pdcategoryIdOrDate);
		}
		//工作管理(日常监管的工作方案)
		List<Category> listName1 = categoryService.listSubCategoryByName("工作方案");
		//List<PageData> listGzgl = superviseService.findByTypeSup("2",8);
		PageData pdName1 = new PageData();
		pdName1 = this.getPageData();
		pdName1.put("id", listName1.get(0).getId());
		pdName1.put("count", 8);
		List<PageData> listGzgl = articleService.findBycategoryIdOrDate(pdName1);
		//公示公告(协会通知)
		List<Category> listName2 = categoryService.listSubCategoryByName("协会工作通知");
		PageData pdName2 = new PageData();
		pdName2 = this.getPageData();
		pdName2.put("id", listName2.get(0).getId());
		pdName2.put("count", 8);
		List<PageData> listGzgg = articleService.findBycategoryIdOrDate(pdName2);
		//List<PageData> listGzgg = industryService.findByTypeInd("3",8);
		//党务公开
		List<Category> listCategoryName = categoryService.listSubCategoryByName("党务公告");
		List<PageData> listDwgk  = new ArrayList<PageData>();
		if (listCategoryName.size()>0) {
			PageData pdName3 = new PageData();
			pdName3 = this.getPageData();
			pdName3.put("id", listCategoryName.get(0).getId());
			pdName3.put("count", 2);
			listDwgk = articleService.findBycategoryIdOrDate(pdName3);
		}
		//专题专栏
		List<Category> listCategoryZT = categoryService.listSubCategoryByName("专题专栏");
		List<PageData> listZtzl  = new ArrayList<PageData>();
		if (listCategoryZT.size()>0) {
			PageData pdName4 = new PageData();
			pdName4 = this.getPageData();
			pdName4.put("id", listCategoryZT.get(0).getId());
			pdName4.put("count", 8);
			listZtzl = articleService.findBycategoryIdOrDate(pdName4);
		}
		
		//栏目
		map.put("listCategory", listCategory);
		//轮播图
		map.put("listRotaryimg", listRotaryimg);
		//首页热门推荐
		map.put("listArticles", listArticles);
		//新闻动态
		map.put("listXinWen", listXinWen);
		//工作管理(日常监管的工作方案)
		map.put("listGzgl", listGzgl);
		//公示公告(协会通知)
		map.put("listGzgg", listGzgg);
		//党务公开
		map.put("listDwgk", listDwgk);
		//专题专栏
		map.put("listZtzl", listZtzl);
		map.put("result", errInfo);
		return map;
	}
	
	/**
	 * 新闻动态列表页
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/xinwenList")
	@ResponseBody
	public Object xinwenList() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData zongNavPd = new PageData();
		//栏目总
		List<Category> listCategory = categoryService.listSubCategoryByParentId("0");
		//新闻动态子目录
		List<Category> listCategoryById = categoryService.listSubCategoryByName(pd.getString("titleName"));
		zongNavPd.put("zongNav", pd.getString("titleName"));
		List<Category> listCategoryZi = new ArrayList<Category>();
		List<PageData> list = new ArrayList<PageData>();
		String ziNav = null;
		if (listCategoryById.size()>0) {
			listCategoryZi = categoryService.listSubCategoryByParentId(listCategoryById.get(0).getId());
			//文章
			if (listCategoryZi.size()>0) {
				ziNav = listCategoryZi.get(0).getName();
				PageData pd1 = new PageData();
				pd1 = this.getPageData();
				pd1.put("id", listCategoryZi.get(0).getId());
				pd1.put("count", 10000000);
				list = articleService.findBycategoryIdOrDate(pd1);
			}
		}
		
		//栏目总
		map.put("listCategory", listCategory);
		//新闻动态子目录
		map.put("listCategoryZi", listCategoryZi);
		//文章
		map.put("listWenZhang", list);
		//页面导航
		map.put("zongNavPd",zongNavPd );
		map.put("ziNav", ziNav);
		map.put("result", errInfo);
		return map;
	}
	
	@RequestMapping(value = "/xinwenListZi")
	@ResponseBody
	public Object xinwenListZi() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData pd1 = new PageData();
		pd1 = this.getPageData();
		pd1.put("id",pd.getString("id"));
		pd1.put("count", 10000000);
		List<PageData> list = articleService.findBycategoryIdOrDate(pd1);
		map.put("listWenZhang", list);
		//页面导航
		PageData ziNavPd = new PageData();
		ziNavPd.put("ziNavPd", pd.getString("name"));
		map.put("ziNavPd", ziNavPd);
		map.put("result", errInfo);
		return map;
	}
	/**
	 * 列表页详细
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/wenzhang")
	@ResponseBody
	public Object wenzhang() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData list = articleService.findById(pd);
		//附件
		 List<PageData> fjList=new ArrayList<>();
			if(null!=list.getString("ATTACHMENT")&&!list.getString("ATTACHMENT").toString().equals("")){
				fjList=articleService.findAttachmentByIds(list);
		 }
		//附件
		map.put("count", fjList.size());
		map.put("fjList", fjList);
		map.put("pdWenZhang", list);
		map.put("result", errInfo);
		return map;
	}
	/**
	 * 文章详细
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/wenZhangCont")
	@ResponseBody
	public Object wenZhangCont() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		List<Category> listCategory = categoryService.listSubCategoryByParentId("0");
		PageData list = articleService.findById(pd);
		//附件
		 List<PageData> fjList=new ArrayList<>();
			if(null!=list.getString("ATTACHMENT")&&!list.getString("ATTACHMENT").toString().equals("")){
				fjList=articleService.findAttachmentByIds(list);
		 }
		
		
		
		String category_id = list.getString("CATEGORY_ID");
		PageData pdd = new PageData();
		pdd.put("id", category_id);
		PageData pdz = categoryService.getCategoryById(pdd);
		PageData pdc = new PageData();
		pdc.put("id", pdz.getString("PARENT_ID"));
		PageData pdf = categoryService.getCategoryById(pdc);
		List<Category> listpda = categoryService.listSubCategoryByParentId(pdf.getString("ID"));
		map.put("count", fjList.size());
		map.put("listCategory", listCategory);
		map.put("pdWenZhang", list);
		//子集栏目
		map.put("pdz", pdz);
		//父栏目
		map.put("pdf", pdf);
		//所有子集
		map.put("listpda", listpda);
		//附件
		map.put("fjList", fjList);
		
		map.put("result", errInfo);
		return map;
	}
	/**
	 * 详细页面文章列表
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/listWenZhang")
	@ResponseBody
	public Object listWenZhang() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		PageData pd1 = new PageData();
		pd1 = this.getPageData();
		pd1.put("id",pd.getString("id"));
		pd1.put("count", 10000000);
		List<PageData> list = articleService.findBycategoryIdOrDate(pd1);
		map.put("listWenZhang", list);
		map.put("result", errInfo);
		return map;
	}
	
	
	
}
