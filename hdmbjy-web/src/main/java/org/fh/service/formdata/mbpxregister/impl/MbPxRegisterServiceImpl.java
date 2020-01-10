package org.fh.service.formdata.mbpxregister.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.mbpxregister.MbPxRegisterMapper;
import org.fh.service.formdata.mbpxregister.MbPxRegisterService;

/** 
 * 说明： 海淀区民办培训学校申请备案登记表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-12-06
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class MbPxRegisterServiceImpl implements MbPxRegisterService{

	@Autowired
	private MbPxRegisterMapper mbpxregisterMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		mbpxregisterMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		mbpxregisterMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		mbpxregisterMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return mbpxregisterMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return mbpxregisterMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return mbpxregisterMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		mbpxregisterMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

