package org.fh.service.fhim.impl;

import java.util.List;

import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.fhim.ImstateMapper;
import org.fh.service.fhim.ImstateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 说明：状态(在线or隐身以及签名)服务接口实现类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class ImstateServiceImpl implements ImstateService {
	
	@Autowired
	private ImstateMapper imstateMapper;

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		imstateMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		imstateMapper.delete(pd);
	}
	
	/**修改在线状态
	 * @param pd
	 * @throws Exception
	 */
	public void editOnline(PageData pd)throws Exception{
		imstateMapper.editOnline(pd);
	}
	
	/**修改个性签名
	 * @param pd
	 * @throws Exception
	 */
	public void editAuto(PageData pd)throws Exception{
		imstateMapper.editAuto(pd);
	}
	
	/**修改皮肤
	 * @param pd
	 * @throws Exception
	 */
	public void editSign(PageData pd)throws Exception{
		imstateMapper.editSign(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> datalistPage(Page page)throws Exception{
		return imstateMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return imstateMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return imstateMapper.findById(pd);
	}
	
	/**通过用户名获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findByUsername(PageData pd)throws Exception{
		return imstateMapper.findByUsername(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		imstateMapper.deleteAll(ArrayDATA_IDS);
	}
	
}
