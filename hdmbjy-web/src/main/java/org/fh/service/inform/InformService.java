package org.fh.service.inform;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 系统通知接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-22
 * 官网：www.fhadmin.org
 * @version
 */
public interface InformService{

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
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception;
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception;
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception;

	public void deleteFileById(PageData pd)throws Exception;

	List<PageData> findAttachmentByIds(PageData pd);

	List<PageData> listNoInformByUserIdlistPage(Page page);

	void removeUserIdFromNoInform(PageData pd) throws Exception;

	List<PageData> findInformUser(PageData pd);


	
}

