package org.fh.service.table.impl;

import java.util.List;

import org.fh.mapper.dsno1.option.OptionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.table.TableMapper;
import org.fh.service.table.TableService;

/** 
 * 说明： 通知反馈表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-11-15
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class TableServiceImpl implements TableService{

	@Autowired
	private TableMapper tableMapper;

	@Autowired
	private OptionMapper optionMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		tableMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		tableMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		tableMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return tableMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return tableMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return tableMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		tableMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public PageData findInformTableByInformId(PageData pageData) {
		return tableMapper.findInformTableByInformId(pageData);
	}

}

