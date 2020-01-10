package org.fh.service.category;

import java.util.List;

import org.fh.entity.Category;
import org.fh.entity.PageData;

/** 
 * 说明： 栏目管理接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-07-15
 * 官网：www.fhadmin.org
 * @version
 */
public interface CategoryService{
	/**新增栏目
	 * @param Category
	 * @throws Exception
	 */
	public void addCategory(Category Category) throws Exception;

	/**保存修改栏目
	 * @param category
	 * @throws Exception
	 */
	public void edit(Category category) throws Exception;

	/**获取最大的栏目ID
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findMaxId(PageData pd) throws Exception;

	/**获取所有栏目并填充每个栏目的子栏目列表(系统栏目列表)
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public List<Category> listAllCategoryQx(String id) throws Exception;

	/**通过ID获取其子一级栏目
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	public List<Category> listSubCategoryByParentId(String parentId)throws Exception;

	/**获取所有栏目并填充每个栏目的子栏目列表(栏目管理)(
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public List<Category> listAllCategory(String id) throws Exception;




	/**获取所有栏目并填充每个栏目的子栏目列表(系统栏目列表)
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData getCategoryById(PageData pd) throws Exception;

	/**删除栏目
	 * @param id
	 * @throws Exception
	 */
	public void deleteCategoryById(String id) throws Exception;

	/**保存栏目图标
	 * @param pd
	 * @throws Exception
	 */
	List<PageData> listAllCategory(PageData pageData);

	public List<Category> listSubCategoryByName(String name);
	
}

