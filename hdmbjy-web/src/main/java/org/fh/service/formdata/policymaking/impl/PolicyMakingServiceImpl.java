package org.fh.service.formdata.policymaking.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.policymaking.PolicyMakingMapper;
import org.fh.service.formdata.policymaking.PolicyMakingService;

/** 
 * 说明： 决策机构接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-11-04
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class PolicyMakingServiceImpl implements PolicyMakingService{

	@Autowired
	private PolicyMakingMapper policymakingMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		policymakingMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		policymakingMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		policymakingMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return policymakingMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return policymakingMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return policymakingMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		policymakingMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

