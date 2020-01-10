package org.fh.mapper.dsno1.category;

import java.util.List;

import org.fh.entity.Category;
import org.fh.entity.PageData;

/** 
 * 说明： 栏目管理Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2019-07-15
 * 官网：www.fhadmin.org
 * @version
 */
public interface CategoryMapper{

	/**新增菜单
	 * @param Category
	 */
	void addCategory(Category Category);

	/**保存修改菜单
	 * @param category
	 */
	void edit(Category category);

	/**
	 * 通过菜单ID获取数据
	 * @param pd
	 * @return
	 */
	PageData getCategoryById(PageData pd);

	/**获取最大的菜单ID
	 * @param pd
	 * @return
	 */
	PageData findMaxId(PageData pd);

	/**通过ID获取其子一级菜单
	 * @param parentId
	 * @return
	 */
	List<Category> listSubCategoryByParentId(String parentId);

	/**获取所有菜单并填充每个菜单的子菜单列表(菜单管理)
	 * @param id
	 * @return
	 */

	List<Category> listAllCategory(PageData pageData);

	/**删除菜单
	 * @param id
	 */
	void deleteCategoryById(String id);
	/**
	 * 通过栏目名称查询
	 * @param name
	 * @return
	 */
	List<Category> listSubCategoryByName(String name);

	/**保存菜单图标
	 * @param pd
	 * @return
	 */
//	void editicon(PageData pd);


}

