package org.fh.service.supervise.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.supervise.SuperviseMapper;
import org.fh.service.supervise.SuperviseService;

/** 
 * 说明： 日常监管接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-10-08
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class SuperviseServiceImpl implements SuperviseService{

	@Autowired
	private SuperviseMapper superviseMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		superviseMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		superviseMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		superviseMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return superviseMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return superviseMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return superviseMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		superviseMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public List<PageData> findByTypeSup(String type, int count) {
		return superviseMapper.findByTypeSup(type,count);
	}
	
}

