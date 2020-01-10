package org.fh.service.formdata.mark.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.mark.MarkMapper;
import org.fh.service.formdata.mark.MarkService;

/** 
 * 说明： 海淀区民办幼儿园年检自查表-评分表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-11-05
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class MarkServiceImpl implements MarkService{

	@Autowired
	private MarkMapper markMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		markMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		markMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		markMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return markMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return markMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return markMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		markMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public int batchSave(List<PageData> list) {
		return markMapper.batchSave(list);
	}

	@Override
	public List<PageData> findByYexmyCheckId(PageData pd) {
		return markMapper.findByYexmyCheckId(pd);
	}

	@Override
	public int deleteByYexmyCheckId(PageData pd) {
		return markMapper.deleteByYexmyCheckId(pd);
	}

}

