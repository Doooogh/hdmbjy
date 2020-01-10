package org.fh.service.act.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.act.FHModelMapper;
import org.fh.service.act.FHModelService;

/** 
 * 说明： 模型管理接口实现类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 * @version
 */
@Service(value="fHModelServiceImpl")
@Transactional //开启事物
public class FHModelServiceImpl implements FHModelService{

	@Autowired
	private FHModelMapper fhmodelMapper;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return fhmodelMapper.datalistPage(page);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return fhmodelMapper.findById(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		fhmodelMapper.edit(pd);
	}
	
}

