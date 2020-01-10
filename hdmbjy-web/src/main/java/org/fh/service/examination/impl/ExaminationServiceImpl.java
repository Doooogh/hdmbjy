package org.fh.service.examination.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.examination.ExaminationMapper;
import org.fh.service.examination.ExaminationService;

/** 
 * 说明： 年度审核接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-09-03
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class ExaminationServiceImpl implements ExaminationService{

	@Autowired
	private ExaminationMapper examinationMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		examinationMapper.save(pd);
	}

	@Override
	public void autoSave(PageData pd) {
		examinationMapper.autoSave(pd);
	}

	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		examinationMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		examinationMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return examinationMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return examinationMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return examinationMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		examinationMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public boolean isHas(PageData pd) {
		List<PageData> list = examinationMapper.findByUserId(pd);
		if(list.size()>0){
			return true;
		}
		return false;
	}

	@Override
	public List<PageData> findByUserId(PageData pd) {
		return examinationMapper.findByUserId(pd);
	}


}

