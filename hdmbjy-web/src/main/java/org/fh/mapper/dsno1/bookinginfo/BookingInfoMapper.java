package org.fh.mapper.dsno1.bookinginfo;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 预约信息Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-30
 * 官网：www.fhadmin.org
 * @version
 */
public interface BookingInfoMapper{

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	void save(PageData pd);
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	void delete(PageData pd);
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	void edit(PageData pd);
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	List<PageData> datalistPage(Page page);
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	List<PageData> listAll(PageData pd);
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	PageData findById(PageData pd);
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	void deleteAll(String[] ArrayDATA_IDS);


	/**
	 * 查找预约信息表中没有结束的预约信息 （审批结束时间>此时时间）
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAllWithNoEnd(PageData pd);

	
}

