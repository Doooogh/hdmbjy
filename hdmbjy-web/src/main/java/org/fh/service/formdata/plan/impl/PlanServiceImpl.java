package org.fh.service.formdata.plan.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.plan.PlanMapper;
import org.fh.service.formdata.plan.PlanService;

/** 
 * 说明： 民办培训学校设立教学计划列表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-12-05
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class PlanServiceImpl implements PlanService{

	@Autowired
	private PlanMapper planMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		planMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		planMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		planMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return planMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return planMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return planMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		planMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public int batchSave(List<PageData> list) {
		return planMapper.batchSave(list);
	}

	@Override
	public List<PageData> findByTeachdingProgramId(PageData pd) {
		return planMapper.findByTeachdingProgramId(pd);
	}

	@Override
	public int deleteByTeachdingProgramId(PageData pd) {
		return planMapper.deleteByTeachdingProgramId(pd);
	}

}

