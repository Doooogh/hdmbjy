package org.fh.service.formdata.gbslformdata.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.gbslformdata.GbslFormDataMapper;
import org.fh.service.formdata.gbslformdata.GbslFormDataService;

/** 
 * 说明： 审批表单填报(公办幼儿园设立举办者基本信息)接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-10-17
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class GbslFormDataServiceImpl implements GbslFormDataService{

	@Autowired
	private GbslFormDataMapper gbslformdataMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		gbslformdataMapper.save(pd);
	}

	@Override
	public String saveRetId(PageData pd) {
		return gbslformdataMapper.saveRetId(pd);
	}

	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		gbslformdataMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		gbslformdataMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return gbslformdataMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return gbslformdataMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return gbslformdataMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		gbslformdataMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

