package org.fh.service.tabledata.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.tabledata.TableDataMapper;
import org.fh.service.tabledata.TableDataService;

/** 
 * 说明： 通知反馈表数据存储表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-11-15
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class TableDataServiceImpl implements TableDataService{

	@Autowired
	private TableDataMapper tabledataMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		tabledataMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		tabledataMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		tabledataMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return tabledataMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return tabledataMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return tabledataMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		tabledataMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public PageData findByInformIdAndUserId(PageData pd) {
		return tabledataMapper.findByInformIdAndUserId(pd);
	}

	@Override
	public List<PageData> findByInformId(PageData pd) {
		return tabledataMapper.findByInformId(pd);
	}

}

