package org.fh.service.government.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.government.GovernmentMapper;
import org.fh.service.government.GovernmentService;

/** 
 * 说明： 行政审批接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-09-17
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class GovernmentServiceImpl implements GovernmentService{

	@Autowired
	private GovernmentMapper governmentMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		governmentMapper.save(pd);
	}

	@Override
	public void autoSave(PageData pd) {
		governmentMapper.autoSave(pd);
	}

	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		governmentMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		governmentMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return governmentMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return governmentMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return governmentMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		governmentMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public boolean isHas(PageData pd) {
		List<PageData> list = governmentMapper.findByUserId(pd);
		if(list.size()>0){
			return true;
		}
		return false;
	}

	@Override
	public List<PageData> findByUserId(PageData pd) {
		return governmentMapper.findByUserId(pd);
	}
	
}

