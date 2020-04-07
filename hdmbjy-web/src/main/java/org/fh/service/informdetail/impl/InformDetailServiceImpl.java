package org.fh.service.informdetail.impl;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.informdetail.InformDetailMapper;
import org.fh.service.informdetail.InformDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 
 * 说明： 通知详细接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-10-10
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class InformDetailServiceImpl implements InformDetailService {

	@Autowired
	private InformDetailMapper informdetailMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		informdetailMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		informdetailMapper.delete(pd);
	}

	@Override
	public void deleteByInformId(PageData pd) {
		informdetailMapper.deleteByInformId(pd);
	}

	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		informdetailMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return informdetailMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return informdetailMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return informdetailMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		informdetailMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public int batchSave(List<PageData> informDetails) {
		return informdetailMapper.batchSave(informDetails);
	}

	@Override
	public List<PageData> findPersonByInformId(PageData pd) {
		return informdetailMapper.findPersonByInformId(pd);
	}

	@Override
	public int findPersonByInformIdCount(PageData pd) {
		return informdetailMapper.findPersonByInformIdCount(pd);
	}

	@Override
	public PageData findByinformantId(PageData pd) {
		return informdetailMapper.findByinformantId(pd);
	}

	@Override
	public List<PageData> findListByInformId(PageData pd) {
		return informdetailMapper.findListByInformId(pd);
	}

}

