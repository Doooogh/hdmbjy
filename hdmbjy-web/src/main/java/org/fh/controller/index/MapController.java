package org.fh.controller.index;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fh.controller.base.BaseController;
import org.fh.entity.Category;
import org.fh.entity.PageData;
import org.fh.service.category.CategoryService;
import org.fh.service.index.MapService;
import org.fh.service.organization.OrganizationService;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/** 
 * 说明：首页地图显示
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-27
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/mapHtml")
public class MapController extends BaseController {
	/**
	 * 栏目
	 */
	@Autowired
	private CategoryService categoryService;
	
	@Autowired
	private MapService mapService;
	// 机构信息
	@Autowired
	private OrganizationService organizationService;
	
	/**
	 * 详细页面文章列表
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/listMapAll")
	@ResponseBody
	public Object listWenZhang() throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		String errInfo = "success";
		//栏目
		List<Category> listCategory = categoryService.listSubCategoryByParentId("0");
		PageData pd = new PageData();
		pd = this.getPageData();
		String KEYWORDS = pd.getString("KEYWORDS");						//关键词检索条件
		if(Tools.notEmpty(KEYWORDS)) {
			pd.put("KEYWORDS", KEYWORDS.trim());
		}else {
			pd.put("KEYWORDS", null);
		}
		//List<PageData> list = mapService.listAll(pd);
		List<PageData> list = organizationService.listAllMap(pd);
		
		
		
		
		map.put("listCategory", listCategory);
		map.put("list", list);
		map.put("result", errInfo);
		return map;
	}
	
	
	
}
