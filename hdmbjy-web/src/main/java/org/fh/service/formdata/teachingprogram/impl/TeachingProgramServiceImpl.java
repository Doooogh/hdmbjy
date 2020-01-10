package org.fh.service.formdata.teachingprogram.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.teachingprogram.TeachingProgramMapper;
import org.fh.service.formdata.teachingprogram.TeachingProgramService;

/** 
 * 说明： 民办培训学校设立教学计划接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-12-05
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class TeachingProgramServiceImpl implements TeachingProgramService{

	@Autowired
	private TeachingProgramMapper teachingprogramMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		teachingprogramMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		teachingprogramMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		teachingprogramMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return teachingprogramMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return teachingprogramMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return teachingprogramMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		teachingprogramMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

