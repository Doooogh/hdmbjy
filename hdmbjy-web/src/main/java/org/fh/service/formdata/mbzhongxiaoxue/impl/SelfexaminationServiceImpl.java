package org.fh.service.formdata.mbzhongxiaoxue.impl;

import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.mbzhongxiaoxue.SelfexaminationMapper;
import org.fh.service.formdata.mbzhongxiaoxue.SelfexaminationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 
 * 说明： 海淀区民办中小学年检自查表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-11-13
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class SelfexaminationServiceImpl implements SelfexaminationService{

	@Autowired
	private SelfexaminationMapper selfexaminationMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		selfexaminationMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		selfexaminationMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		selfexaminationMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return selfexaminationMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return selfexaminationMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return selfexaminationMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		selfexaminationMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

