package org.fh.service.category.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.fh.entity.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.category.CategoryMapper;
import org.fh.service.category.CategoryService;

/** 
 * 说明： 栏目管理接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-07-15
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class CategoryServiceImpl implements CategoryService{

	@Autowired
	private CategoryMapper categoryMapper;
	
	/**新增菜单
	 * @param Category
	 * @throws Exception
	 */
	@CacheEvict(value="categorycache", allEntries=true)
	public void addCategory(Category Category) throws Exception{
		categoryMapper.addCategory(Category);
	}

	/**保存修改菜单
	 * @param category
	 * @throws Exception
	 */
	@CacheEvict(value="categorycache", allEntries=true)
	public void edit(Category category) throws Exception{
		categoryMapper.edit(category);
	}

	/**
	 * 通过菜单ID获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData getCategoryById(PageData pd) throws Exception {
		return categoryMapper.getCategoryById(pd);
	}

	/**获取最大的菜单ID
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findMaxId(PageData pd) throws Exception{
		return categoryMapper.findMaxId(pd);
	}

	/**
	 * 通过ID获取其子一级菜单
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	@Cacheable(key="'category-'+#parentId",value="categorycache")
	public List<Category> listSubCategoryByParentId(String parentId) throws Exception {
		return categoryMapper.listSubCategoryByParentId(parentId);
	}

	/**
	 * 获取所有菜单并填充每个菜单的子菜单列表(菜单管理)(递归处理)
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public List<Category> listAllCategory(String id) throws Exception {
		List<Category> categoryList = this.listSubCategoryByParentId(id);
		for(Category category : categoryList){
			category.setUrl("category_list.html?id="+category.getId());
			List<Category> childrenList = this.listAllCategory(category.getId());
			if(!(childrenList.size()==0)){
				category.setSubCategory(childrenList);
			}
			category.setTarget("treeFrame");
		}

		return categoryList;
	}


	/**
	 * 获取所有菜单并填充每个菜单的子菜单列表(系统菜单列表)(递归处理)
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public List<Category> listAllCategoryQx(String id) throws Exception {
		List<Category> CategoryList = this.listSubCategoryByParentId(id);
		for(Category Category : CategoryList){
			Category.setSubCategory(this.listAllCategoryQx(Category.getId()));
			Category.setTarget("treeFrame");
		}
		return CategoryList;
	}

	/**删除菜单
	 * @param id
	 * @throws Exception
	 */
	@CacheEvict(value="categorycache", allEntries=true)
	public void deleteCategoryById(String id) throws Exception{
		categoryMapper.deleteCategoryById(id);
	}

	@Override
	public List<PageData> listAllCategory(PageData pageData) {
		List<Category> categoryList = categoryMapper.listAllCategory(pageData);
		String type= (String) pageData.get("type");
		String url="";
		PageData node=new PageData();
		node.put("id","0");
		node.put("name","顶级节点");
		node.put("pId","-1");
		node.put("target","treeFrame");
		if(!StringUtils.isBlank(type)){
			if(type.equals("category")){
				url="category_list.html?id=";
				node.put("url","category_list.html?id=0");
			}else if(type.equals("article")){
				url="article_list.html?cId=";
				node.put("url","article_list.html?cId=0");
			}
		}
		List<PageData> all=new ArrayList<>();
		all.add(node);
		for (Category category : categoryList) {
			PageData pd=new PageData();
			pd.put("id",category.getId());
			pd.put("name",category.getName());
			pd.put("pId",category.getParentId());
			pd.put("url",url+category.getId());
			pd.put("target","treeFrame");
			all.add(pd);
		}

		return all;
	}

	@Override
	public List<Category> listSubCategoryByName(String name) {
		return categoryMapper.listSubCategoryByName(name);
	}


	
}

