package org.fh.service.questionnaire.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.questionnaire.SubjectMapper;
import org.fh.service.questionnaire.SubjectService;

/** 
 * 说明： 问卷题库接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-08-29
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class SubjectServiceImpl implements SubjectService{

	@Autowired
	private SubjectMapper subjectMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		subjectMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		subjectMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		subjectMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return subjectMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return subjectMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return subjectMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		subjectMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public PageData findByLast() throws Exception {
		// TODO Auto-generated method stub
		return subjectMapper.findByLast();
	}
	
}

