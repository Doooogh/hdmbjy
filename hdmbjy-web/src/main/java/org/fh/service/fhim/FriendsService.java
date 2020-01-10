package org.fh.service.fhim;

import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;

/**
 * 说明：好友管理服务接口
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface FriendsService {
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception;
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception;
	
	/**拉黑
	 * @param pd
	 * @throws Exception
	 */
	public void pullblack(PageData pd)throws Exception;
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception;
	
	/**修改同意状态 
	 * @param pd
	 * @throws Exception
	 */
	public void editAllow(PageData pd)throws Exception;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> datalistPage(Page page)throws Exception;
	
	/**列表(全部自己的好友)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception;
	
	/**列表(添加好友页面检索好友)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAllToSearch(PageData pd)throws Exception;
	
	/**列表(全部全部有自己好友的用户)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAllFri(PageData pd)throws Exception;
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception;
	
	/**获取某个好友详细信息
	 * @param pd
	 * @throws Exception
	 */
	public PageData getTheFriend(PageData pd)throws Exception;
	
	/**获取我的某个好友
	 * @param pd
	 * @throws Exception
	 */
	public PageData findMyFriend(PageData pd)throws Exception;
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception;

}
