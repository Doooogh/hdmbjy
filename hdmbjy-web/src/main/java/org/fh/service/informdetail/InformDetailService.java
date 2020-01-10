package org.fh.service.informdetail;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 通知详细接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-10
 * 官网：www.fhadmin.org
 * @version
 */
public interface InformDetailService {

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

	/**
	 *功能描述
	 * 根据通知id删除数据
	 * @author li long
	 * @date 2019/10/12
	 * @param  * @param pd
	 * @return void
	 */
	void deleteByInformId(PageData pd);
	
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

	/**
	 * 批量添加
	 * @param informDetails
	 * @return
	 */
	int batchSave(List<PageData> informDetails);

	/**
	 * 根据通知id 查找被通知人的详细信息
	 * @param pd
	 * @return
	 */
	List<PageData> findPersonByInformId(PageData pd);

	PageData findByinformantId(PageData pd);


	/**
	 *根据通知id 获取
	 * @author li long
	 * @date 2019/10/12
	 * @param  * @param pd
	 * @return java.util.List<org.fh.entity.PageData>
	 */
	List<PageData> findListByInformId(PageData pd);




}

