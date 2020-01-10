package org.fh.service.system;

import java.util.List;
import java.util.Map;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.User;

/**
 * 说明：用户服务接口
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface UsersService {
	
	/**通过用户名获取用户信息
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findByUsername(PageData pd)throws Exception;
	
	/**通过用户ID获取用户信息
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception;


	public PageData findWithDepartmentById(PageData pd)throws Exception;
	/**用户列表
	 * @param page
	 * @return
	 * @throws Exception
	 */
	public List<PageData> userlistPage(Page page)throws Exception;
	
	/**通过用户ID获取用户信息和角色信息
	 * @param USER_ID
	 * @return
	 * @throws Exception
	 */
	public User getUserAndRoleById(String USER_ID) throws Exception;
	
	/**保存用户IP
	 * @param pd
	 * @throws Exception
	 */
	public void saveIP(PageData pd)throws Exception;
	
	/**通过邮箱获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findByEmail(PageData pd)throws Exception;
	
	/**通过编码获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findByNumbe(PageData pd) throws Exception;
	
	/**列出某角色下的所有用户
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAllUserByRoldId(PageData pd) throws Exception;
	
	/**用户列表(全部)
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAllUser(PageData pd)throws Exception;
	
	/**用户列表(弹窗选择用)
	 * @param page
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listUsersBystaff(Page page)throws Exception;
	
	/**保存用户
	 * @param pd
	 * @throws Exception
	 */
	public void saveUser(PageData pd)throws Exception;
	/**
	 * 保存用户 关联机构
	 * @param pd 用户信息
	 * @param dep 机构信息
	 * @throws Exception
	 */
	public void saveUserDep(PageData pd,PageData dep)throws Exception;
	
	/**保存用户系统皮肤
	 * @param pd
	 * @throws Exception
	 */
	public void saveSkin(PageData pd)throws Exception;
	
	/**修改用户
	 * @param pd
	 * @throws Exception
	 */
	public void editUser(PageData pd)throws Exception;
	
	/**删除用户
	 * @param pd
	 * @throws Exception
	 */
	public void deleteUser(PageData pd)throws Exception;
	
	/**批量删除用户
	 * @param pd
	 * @throws Exception
	 */
	public void deleteAllUser(String[] USER_IDS)throws Exception;

	/**列出某部门机构下的所有用户
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAllUserByDepartmentId(PageData pd) throws Exception;
	
	public void editUserDep(PageData pd,PageData dep)throws Exception;
	
	/**
	 * 查询所有的机构id
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData listAllDepartmentid()throws Exception;

	public List<PageData> listAllUserByDepToNull(PageData pd);

	public PageData findByDepId(PageData pd)throws Exception;

	public void saveUserDepExcle(PageData pd)throws Exception;

	/**
	 *获取当前用户和机构信息
	 * @author li long
	 * @date 2019/11/18
	 * @param  * @param
	 * @return org.fh.entity.PageData   user 用户信息  organization 机构信息
	 */
	Map<String,Object> getUserAndOriganizationInfo();
	
}
