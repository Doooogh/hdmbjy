package org.fh.service.system.impl;

import org.fh.service.system.RoleService;

import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.Role;
import org.fh.mapper.dsno1.system.RoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 说明：角色服务接口实现类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class RoleServiceImpl implements RoleService {
	
	@Autowired
	private RoleMapper roleMapper;

	/**通过角色ID获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findById(PageData pd) throws Exception {
		return roleMapper.findById(pd);
	}
	
	/**通过id查找(返回角色对象)
	 * @param roleId
	 * @return
	 * @throws Exception
	 */
	public Role getRoleById(String ROLE_ID) throws Exception{
		return roleMapper.getRoleById(ROLE_ID);
	}
	
	/**通过角色编码查找
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData getRoleByRnumber(PageData pd) throws Exception{
		return roleMapper.getRoleByRnumber(pd);
	}

	/**通过组ID获取组下级角色列表
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<Role> listAllRolesByPId(PageData pd) throws Exception {
		return roleMapper.listAllRolesByPId(pd);
	}
	
	/**添加
	 * @param pd
	 * @throws Exception
	 */
	public void add(PageData pd) throws Exception{
		roleMapper.add( pd);
	}
	
	/**保存修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd) throws Exception{
		roleMapper.edit( pd);
	}
	
	/**删除角色
	 * @param ROLE_ID
	 * @throws Exception
	 */
	public void deleteRoleById(String ROLE_ID) throws Exception{
		roleMapper.deleteRoleById(ROLE_ID);
	}
	
	/**给当前角色附加菜单权限
	 * @param role
	 * @throws Exception
	 */
	public void updateRoleRights(Role role) throws Exception{
		roleMapper.updateRoleRights(role);
	}
	
	/**给全部子角色加菜单权限
	 * @param pd
	 * @throws Exception
	 */
	public void setAllRights(PageData pd) throws Exception{
		roleMapper.setAllRights(pd);
	}
	
	/**权限(增删改查)
	 * @param msg 区分增删改查
	 * @param pd
	 * @throws Exception
	 */
	public void saveB4Button(String msg,PageData pd) throws Exception{
		if("add_qx".equals(msg)){
			roleMapper.addQx(pd);
		}else if("del_qx".equals(msg)){
			roleMapper.delQx(pd);
		}else if("edit_qx".equals(msg)){
			roleMapper.editQx(pd);
		}else if("cha_qx".equals(msg)){
			roleMapper.chaQx(pd);
		}
	}
	
	/**通过角色ID数组获取角色列表
	 * @param arryROLE_ID
	 * @throws Exception
	 */
	public List<Role> getRoleByArryROLE_ID(String[] arryROLE_ID)throws Exception{
		return roleMapper.listAllRolesByArryROLE_ID(arryROLE_ID);
	}
	
	/**角色列表(弹窗选择用)
	 * @param page
	 * @return
	 * @throws Exception
	 */
	public List<PageData> roleListWindow(Page page)throws Exception{
		return roleMapper.roleWindowlistPage(page);
	}

	@Override
	public List<PageData> getRolesForBooking(PageData pageData) {
		return roleMapper.getRolesForBooking(pageData);
	}

}
