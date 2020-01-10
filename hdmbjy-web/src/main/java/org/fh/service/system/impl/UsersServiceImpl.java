package org.fh.service.system.impl;

import java.util.*;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.User;
import org.fh.mapper.dsno1.fhoa.DepartmentMapper;
import org.fh.mapper.dsno1.organization.OrganizationMapper;
import org.fh.mapper.dsno1.system.UsersMapper;
import org.fh.service.organization.OrganizationService;
import org.fh.service.system.UsersService;
import org.fh.util.Jurisdiction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 说明：用户服务接口实现类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class UsersServiceImpl implements UsersService {
	
	@Autowired
	private UsersMapper usersMapper;

	@Autowired
	private DepartmentMapper departmentMapper;

	@Autowired
	private OrganizationMapper organizationMapper;
	
	/**通过用户名获取用户信息
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findByUsername(PageData pd) throws Exception {
		return	usersMapper.findByUsername(pd);
	}
	
	/**通过用户ID获取用户信息
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return	usersMapper.findById(pd);
	}

	@Override
	public PageData findWithDepartmentById(PageData pd) throws Exception {
		return usersMapper.findWithDepartmentById(pd);
	}

	/**用户列表
	 * @param page
	 * @return
	 * @throws Exception
	 */
	public List<PageData> userlistPage(Page page) throws Exception {
		return	usersMapper.userlistPage(page);
	}
	
	/**通过用户ID获取用户信息和角色信息
	 * @param USER_ID
	 * @return
	 * @throws Exception
	 */
	public User getUserAndRoleById(String USER_ID) throws Exception {
		return	usersMapper.getUserAndRoleById(USER_ID);
	}

	/**保存用户IP
	 * @param pd
	 * @throws Exception
	 */
	public void saveIP(PageData pd) throws Exception {
		usersMapper.saveIP(pd);
	}

	/**通过邮箱获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findByEmail(PageData pd) throws Exception {
		return usersMapper.findByEmail(pd);
	}
	
	/**通过编码获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findByNumbe(PageData pd) throws Exception {
		return usersMapper.findByNumbe(pd);
	}
	
	/**列出某角色下的所有用户
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAllUserByRoldId(PageData pd) throws Exception{
		return usersMapper.listAllUserByRoldId(pd);
	}
	
	/**用户列表(全部)
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAllUser(PageData pd)throws Exception{
		return usersMapper.listAllUser(pd);
	}

	/**用户列表(弹窗选择用)
	 * @param page
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listUsersBystaff(Page page)throws Exception{
		return usersMapper.userBystafflistPage(page);
	}
	
	/**保存用户
	 * @param pd
	 * @throws Exception
	 */
	public void saveUser(PageData pd)throws Exception {
		usersMapper.saveUser(pd);
	}
	
	/**保存用户系统皮肤
	 * @param pd
	 * @throws Exception
	 */
	public void saveSkin(PageData pd)throws Exception{
		usersMapper.saveSkin(pd);
	}
	
	/**修改用户
	 * @param pd
	 * @throws Exception
	 */
	public void editUser(PageData pd)throws Exception{
		usersMapper.editUser(pd);
	}

	/**删除用户
	 * @param pd
	 * @throws Exception
	 */
	public void deleteUser(PageData pd)throws Exception{
		usersMapper.deleteUser(pd);
	}
	
	/**批量删除用户
	 * @param pd
	 * @throws Exception
	 */
	public void deleteAllUser(String[] USER_IDS)throws Exception{
		usersMapper.deleteAllUser(USER_IDS);
	}

	/**
	 * 通过部门机构id获取用户
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	@Override
	public List<PageData> listAllUserByDepartmentId(PageData pd) throws Exception {
		String ids= (String) pd.get("DEPARTMENT_ID");
		String[] split = ids.split(",");
		List<String> dIds=new ArrayList<>();
		Collections.addAll(dIds,split);
		pd.put("DEPARTMENT_IDS",dIds);
		return  usersMapper.listAllUserByDepartmentId(pd);
	}

	/**
	 * 添加时选机构
	 */
	@Override
	public void saveUserDep(PageData pd, PageData dep) throws Exception {
		usersMapper.saveUser(pd);
		departmentMapper.edit(dep);
	}
	
	/**
	 * 修改时机构变更
	 */
	@Override
	public void editUserDep(PageData pd, PageData dep) throws Exception {
		usersMapper.editUser(pd);
		departmentMapper.edit(dep);
	}

	/**
	 * 查询所有的机构id
	 */
	@Override
	public PageData listAllDepartmentid() throws Exception {
		return usersMapper.listAllDepartmentid();
	}

	@Override
	public List<PageData> listAllUserByDepToNull(PageData pd) {
		return usersMapper.listAllUserByDepToNull(pd);
	}

	@Override
	public PageData findByDepId(PageData pd) throws Exception {
		return usersMapper.findByDepId(pd);
	}

	/**
	 * 用户导入时的添加方法
	 */
	@Override
	public void saveUserDepExcle(PageData pd) throws Exception {
		PageData dep = departmentMapper.findById(pd);
		if (dep !=null) {
			dep.put("USER_ID", pd.getString("USER_ID"));
			dep.put("HEADMAN", pd.getString("NAME"));
			dep.put("TEL", pd.getString("PHONE"));
			departmentMapper.edit(dep);
			usersMapper.saveUser(pd);
		}else {
			usersMapper.saveUser(pd);
		}
		
	}



	@Override
	public Map<String,Object> getUserAndOriganizationInfo() {
		Map<String,Object> userInfo=new HashMap<>();
		User user = Jurisdiction.getUser();
		userInfo.put("user",user);
		List<PageData> organization = organizationMapper.findByUserId(user.getUSER_ID());
		if(organization.size()!=0){
			userInfo.put("organization",organization.get(0));
		}
		return userInfo;
	}

}
