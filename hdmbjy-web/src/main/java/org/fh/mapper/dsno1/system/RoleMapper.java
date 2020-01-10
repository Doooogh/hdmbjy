package org.fh.mapper.dsno1.system;


import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.Role;

/**
 * 说明：角色Mapper
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface RoleMapper {
	
	/**通过角色ID获取数据
	 * @param pd
	 * @return
	 */
	PageData findById(PageData pd);
	
	/**通过id查找(返回角色对象)
	 * @param roleId
	 * @return
	 */
	Role getRoleById(String ROLE_ID);
	
	/**通过角色编码查找
	 * @param pd
	 * @return
	 */
	PageData getRoleByRnumber(PageData pd);
	
	/**通过组ID获取组下级角色列表
	 * @param pd
	 * @return
	 */
	List<Role> listAllRolesByPId(PageData pd);
	
	/**添加
	 * @param pd
	 */
	void add(PageData pd);
	
	/**保存修改
	 * @param pd
	 */
	void edit(PageData pd);
	
	/**删除角色
	 * @param ROLE_ID
	 * @throws Exception
	 */
	void deleteRoleById(String ROLE_ID);
	
	/**给当前角色附加菜单权限
	 * @param role
	 * @throws Exception
	 */
	void updateRoleRights(Role role);
	
	/**给全部子角色加菜单权限
	 * @param pd
	 * @throws Exception
	 */
	void setAllRights(PageData pd);
	
	/**权限(增删改查)
	 * @param msg 区分增删改查
	 * @param pd
	 * @throws Exception
	 */
	void addQx(PageData pd);
	
	/**权限(增删改查)
	 * @param msg 区分增删改查
	 * @param pd
	 * @throws Exception
	 */
	void delQx(PageData pd);
	
	/**权限(增删改查)
	 * @param msg 区分增删改查
	 * @param pd
	 * @throws Exception
	 */
	void editQx(PageData pd);
	
	/**权限(增删改查)
	 * @param msg 区分增删改查
	 * @param pd
	 * @throws Exception
	 */
	void chaQx(PageData pd);
	
	/**通过角色ID数组获取角色列表
	 * @param arryROLE_ID
	 * @throws Exception
	 */
	List<Role> listAllRolesByArryROLE_ID(String[] arryROLE_ID);
	
	/**角色列表(弹窗选择用)
	 * @param page
	 * @return
	 * @throws Exception
	 */
	List<PageData> roleWindowlistPage(Page page);

	List<PageData> getRolesForBooking(PageData pageData);
	
}
