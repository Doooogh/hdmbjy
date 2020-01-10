package org.fh.mapper.dsno2.system;

import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.entity.system.User;

/**
 * 说明：用户Mapper
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface Users2Mapper {
	
	/**通过用户获取数据
	 * @param pd
	 * @return
	 */
	PageData findByUsername(PageData pd);
	
	/**用户列表
	 * @param page
	 * @return
	 */
	List<PageData> userlistPage(Page page);
	
	/**通过用户ID获取用户信息和角色信息
	 * @param USER_ID
	 * @return
	 */
	User getUserAndRoleById(String USER_ID);
	
	/**通过邮箱获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	PageData findByEmail(PageData pd);
	
	/**通过编码获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	PageData findByNumbe(PageData pd);
	
	/**列出某角色下的所有用户
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	List<PageData> listAllUserByRoldId(PageData pd);
	
	/**通过用户ID获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	PageData findById(PageData pd);
	
	/**保存用户IP
	 * @param pd
	 */
	void saveIP(PageData pd);
	
	/**保存用户
	 * @param pd
	 * @throws Exception
	 */
	void saveUser(PageData pd);
	
	/**保存用户系统皮肤
	 * @param pd
	 * @throws Exception
	 */
	void saveSkin(PageData pd);
	
	/**修改用户
	 * @param pd
	 * @throws Exception
	 */
	void editUser(PageData pd);
	
	/**删除用户
	 * @param pd
	 * @throws Exception
	 */
	void deleteUser(PageData pd);
	
	/**批量删除用户
	 * @param pd
	 * @throws Exception
	 */
	void deleteAllUser(String[] USER_IDS);

}
