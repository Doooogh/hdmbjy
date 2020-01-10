package org.fh.service.bookinginfo;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 预约信息接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-30
 * 官网：www.fhadmin.org
 * @version
 */
public interface BookingInfoService{

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

	/**
	 * 查找预约信息表中没有结束的预约信息 （审批结束时间>此时时间 &&审批开始时间此时时间）
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAllWithNoEnd(PageData pd)throws Exception;
	
}

