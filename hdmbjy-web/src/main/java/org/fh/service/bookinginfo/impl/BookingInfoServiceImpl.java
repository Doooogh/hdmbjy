package org.fh.service.bookinginfo.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.bookinginfo.BookingInfoMapper;
import org.fh.service.bookinginfo.BookingInfoService;

/** 
 * 说明： 预约信息接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-08-30
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class BookingInfoServiceImpl implements BookingInfoService{

	@Autowired
	private BookingInfoMapper bookinginfoMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		bookinginfoMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		bookinginfoMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		bookinginfoMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return bookinginfoMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return bookinginfoMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return bookinginfoMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		bookinginfoMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public List<PageData> listAllWithNoEnd(PageData pd) throws Exception {
		return bookinginfoMapper.listAllWithNoEnd(pd);
	}

}

