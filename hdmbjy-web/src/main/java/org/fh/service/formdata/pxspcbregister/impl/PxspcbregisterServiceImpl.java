package org.fh.service.formdata.pxspcbregister.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.pxspcbregister.PxspcbregisterMapper;
import org.fh.service.formdata.pxspcbregister.PxspcbregisterService;

/** 
 * 说明： 海淀区民办教育培训机构审批备案登记表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-12-05
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class PxspcbregisterServiceImpl implements PxspcbregisterService{

	@Autowired
	private PxspcbregisterMapper pxspcbregisterMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		pxspcbregisterMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		pxspcbregisterMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		pxspcbregisterMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return pxspcbregisterMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return pxspcbregisterMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return pxspcbregisterMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		pxspcbregisterMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

