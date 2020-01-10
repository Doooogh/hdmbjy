package org.fh.service.system;

import java.util.List;

import org.fh.entity.PageData;
import org.fh.entity.system.Menu;

/**
 * 说明：菜单服务接口
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface MenuService {
	
	/**新增菜单
	 * @param menu
	 * @throws Exception
	 */
	public void addMenu(Menu menu) throws Exception;
	
	/**保存修改菜单
	 * @param menu
	 * @throws Exception
	 */
	public void edit(Menu menu) throws Exception;
	
	/**获取最大的菜单ID
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findMaxId(PageData pd) throws Exception;
	
	/**获取所有菜单并填充每个菜单的子菜单列表(系统菜单列表)
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	public List<Menu> listAllMenuQx(String MENU_ID) throws Exception;
	
	/**通过ID获取其子一级菜单
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	public List<Menu> listSubMenuByParentId(String parentId)throws Exception;
	
	/**获取所有菜单并填充每个菜单的子菜单列表(菜单管理)(
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	public List<Menu> listAllMenu(String MENU_ID) throws Exception;
	
	/**获取所有菜单并填充每个菜单的子菜单列表(系统菜单列表)
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData getMenuById(PageData pd) throws Exception;
	
	/**删除菜单
	 * @param MENU_ID
	 * @throws Exception
	 */
	public void deleteMenuById(String MENU_ID) throws Exception;
	
	/**保存菜单图标
	 * @param pd
	 * @throws Exception
	 */
	public void editicon(PageData pd) throws Exception;

	/**
	 *功能描述
	 * 通过菜单名查找菜单
	 * @author li long
	 * @date 2019/10/11
	 * @param  * @param pd
	 * @return org.fh.entity.system.Menu
	 */
	Menu findByMenuName(PageData pd);


}
