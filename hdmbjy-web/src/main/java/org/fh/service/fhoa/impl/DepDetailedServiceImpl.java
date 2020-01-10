package org.fh.service.fhoa.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.fhoa.DepDetailedMapper;
import org.fh.service.fhoa.DepDetailedService;

/** 
 * 说明： 机构详细信息接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-09-18
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class DepDetailedServiceImpl implements DepDetailedService{

	@Autowired
	private DepDetailedMapper depdetailedMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		depdetailedMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		depdetailedMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		depdetailedMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return depdetailedMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return depdetailedMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return depdetailedMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		depdetailedMapper.deleteAll(ArrayDATA_IDS);
	}
	/**
	 * 通过机构id查询信息
	 */
	@Override
	public PageData findByDepId(PageData pd) throws Exception {
		return depdetailedMapper.findByDepId(pd);
	}

	@Override
	public PageData findByDepAllId(PageData pd) throws Exception {
		return depdetailedMapper.findByDepAllId(pd);
	}
	
}

