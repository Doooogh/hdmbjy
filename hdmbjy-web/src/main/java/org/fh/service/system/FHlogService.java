package org.fh.service.system;

import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;

/**
 * 说明：操作日志记录接口
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface FHlogService {
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(String USERNAME, String CONTENT)throws Exception;

	void save(PageData pd);


	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception;

}
