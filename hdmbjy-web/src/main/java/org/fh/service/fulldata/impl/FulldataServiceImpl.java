package org.fh.service.fulldata.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.fulldata.FulldataMapper;
import org.fh.service.fulldata.FulldataService;

/** 
 * 说明： 填报数据接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-10-15
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class FulldataServiceImpl implements FulldataService{

	@Autowired
	private FulldataMapper fulldataMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		fulldataMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		fulldataMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		fulldataMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return fulldataMapper.datalistPage(page);
	}

	@Override
	public List<PageData> listByApproveId(PageData pd) {
		return fulldataMapper.listByApproveId(pd);
	}

	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return fulldataMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return fulldataMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		fulldataMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

