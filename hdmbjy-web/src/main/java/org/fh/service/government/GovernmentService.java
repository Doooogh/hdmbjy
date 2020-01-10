package org.fh.service.government;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 行政审批接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-09-17
 * 官网：www.fhadmin.org
 * @version
 */
public interface GovernmentService{

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception;

	/**
	 *新增 只有两个字段  GOVERNMENT_ID 和USERNAME
	 * @author li long
	 * @date 2019/10/17
	 * @param  * @param pd
	 * @return void
	 */
	void autoSave(PageData pd);


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

	boolean isHas(PageData pd);

	List<PageData> findByUserId(PageData pd);
	
}

