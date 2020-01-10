package org.fh.mapper.dsno1.system;

import java.util.List;

import org.fh.entity.PageData;
import org.fh.entity.system.Menu;

/**
 * 说明：菜单Mapper
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface MenuMapper {

	/**新增菜单
	 * @param menu
	 */
	void addMenu(Menu menu);

	/**保存修改菜单
	 * @param menu
	 */
	void edit(Menu menu);

	/**
	 * 通过菜单ID获取数据
	 * @param pd
	 * @return
	 */
	PageData getMenuById(PageData pd);

	/**获取最大的菜单ID
	 * @param pd
	 * @return
	 */
	PageData findMaxId(PageData pd);

	/**通过ID获取其子一级菜单
	 * @param parentId
	 * @return
	 */
	List<Menu> listSubMenuByParentId(String parentId);

	/**获取所有菜单并填充每个菜单的子菜单列表(菜单管理)
	 * @param MENU_ID
	 * @return
	 */
	List<Menu> listAllMenu(String MENU_ID);

	/**删除菜单
	 * @param MENU_ID
	 */
	void deleteMenuById(String MENU_ID);

	/**保存菜单图标
	 * @param pd
	 * @return
	 */
	void editicon(PageData pd);

	Menu findByMenuName(PageData pd);

}
