package org.fh.service.formdata.determinativetable.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.determinativetable.DeterminativeTableMapper;
import org.fh.service.formdata.determinativetable.DeterminativeTableService;

/** 
 * 说明： 民办学校举办者基本情况及政治思想品德鉴定表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-10-21
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class DeterminativeTableServiceImpl implements DeterminativeTableService{

	@Autowired
	private DeterminativeTableMapper determinativetableMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		determinativetableMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		determinativetableMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		determinativetableMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return determinativetableMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return determinativetableMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return determinativetableMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		determinativetableMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

