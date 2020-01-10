package org.fh.controller.category;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.fh.controller.base.BaseController;
import org.fh.entity.Category;
import org.fh.entity.PageData;
import org.fh.service.category.CategoryService;
import org.fh.service.system.FHlogService;
import org.fh.util.Const;
import org.fh.util.FileUpload;
import org.fh.util.FileUtil;
import org.fh.util.Jurisdiction;
import org.fh.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import net.sf.json.JSONArray;

/** 
 * 说明：栏目管理
 * 作者：FH Admin QQ313596790
 * 时间：2019-07-15
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/category")
public class CategoryController extends BaseController {
	
	@Autowired
	private CategoryService categoryService;



	@Autowired
	private FHlogService FHLOG;

	/**
	 * 栏目列表ztree
	 * @return
	 */
	@RequestMapping(value="/listAllCategory")
	@RequiresPermissions("category:list")
	@ResponseBody
	public Object listAllCategory()throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		List<PageData> parentList=new ArrayList<>();
		PageData pageData=new PageData();
		pageData=this.getPageData();
		parentList=categoryService.listAllCategory(pageData);
		JSONArray arr = JSONArray.fromObject(parentList);
		String json = arr.toString();
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		return map;
	}




	/**
	 * 菜单列表
	 * @return
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("category:list")
	@ResponseBody
	public Object list(String id)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		id = Tools.isEmpty(id)?"0":id;
		List<Category> categoryList = categoryService.listSubCategoryByParentId(id);
		map.put("pd", categoryService.getCategoryById(pd));									//传入父菜单所有信息
		map.put("MSG", null == pd.get("MSG")?"'list'":pd.get("MSG").toString()); 	//MSG=change 则为编辑或删除后跳转过来的
		map.put("categoryList", categoryList);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 请求新增菜单页面
	 * @return
	 */
	@RequestMapping(value="/toAdd")
	@RequiresPermissions("category:add")
	@ResponseBody
	public Object toAdd()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String id = (null == pd.get("id") || "".equals(pd.get("id").toString()))?"0":pd.get("id").toString();//接收传过来的上级菜单ID,如果上级为顶级就取值“0”
		pd.put("id",id);
		map.put("pds", categoryService.getCategoryById(pd));	//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 新增栏目
	 * @param category
	 * @return
	 */
	@RequestMapping(value="/add")
	@RequiresPermissions("category:add")
	@ResponseBody
	@Transactional
	public Object add(Category category,@RequestParam(value = "file",required = false) MultipartFile file)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		String filePath = Const.FILEPATH;	//文件上传路径
		String fileName = this.get32UUID();				//执行上传
		try{
			fileName=FileUpload.fileUp(file,filePath,fileName);
			category.setId(this.get32UUID());
			category.setImage(Const.PRE_IMG+fileName);													//默认无菜单图标
			category.setCreateDate(new Date());
			categoryService.addCategory(category); 												//新增菜单
			FHLOG.save(Jurisdiction.getUsername(), "新增菜单:"+category.getName());	//记录日志
			map.put("result", errInfo);
		}catch (Exception e){
			e.printStackTrace();
		}
		return map;
	}

	/**
	 * 请求编辑菜单页面
	 * @param
	 * @return
	 */
	@RequestMapping(value="/toEdit")
	@RequiresPermissions("category:edit")
	@ResponseBody
	public Object toEdit(String id)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = categoryService.getCategoryById(pd);						//读取此ID的菜单数据
		map.put("pd", pd);
		pd.put("id",pd.get("PARENT_ID").toString());		//用作读取父菜单信息
		map.put("pds", categoryService.getCategoryById(pd));			//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 保存编辑
	 * @param
	 * @return
	 */
	@RequestMapping(value="/edit")
	@RequiresPermissions("category:edit")
	@ResponseBody
	public Object edit(Category category,@RequestParam(value = "file",required = false) MultipartFile file)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pageData=new PageData();
		pageData.put("id",category.getId());
		PageData oldCategory=categoryService.getCategoryById(pageData);
		String oldImage= (String) oldCategory.get("image");
		try{
			if(file!=null){
				FileUtil.delFile(Const.FILEPATH+oldImage);
				String fileName=this.get32UUID();
				fileName=FileUpload.fileUp(file,Const.FILEPATH,fileName);
				category.setImage(Const.PRE_IMG+fileName);
			}
			category.setUpdateDate(new Date());
			categoryService.edit(category);
			FHLOG.save(Jurisdiction.getUsername(), "修改菜单:"+category.getName());				//记录日志
			map.put("result", errInfo);
		}catch (Exception e){
			e.printStackTrace();
		}
		return map;
	}

	/**
	 * 删除菜单
	 * @param id
	 * @param
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	@RequiresPermissions("category:del")
	public Object delete(@RequestParam String id)throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		if(categoryService.listSubCategoryByParentId(id).size() > 0){//判断是否有子菜单，是：不允许删除
			errInfo = "error";
		}else{
			categoryService.deleteCategoryById(id);
			errInfo = "success";
			FHLOG.save(Jurisdiction.getUsername(), "删除的菜单ID为:"+id);				//记录日志
		}
		map.put("result", errInfo);
		return map;
	}

}
