package org.fh.service.formdata.zhongzhiapprove.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.formdata.zhongzhiapprove.ZhongzhiApproveMapper;
import org.fh.service.formdata.zhongzhiapprove.ZhongzhiApproveService;

/** 
 * 说明： 海淀区民办学校申请终止审核表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-11-13
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class ZhongzhiApproveServiceImpl implements ZhongzhiApproveService{

	@Autowired
	private ZhongzhiApproveMapper zhongzhiapproveMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		zhongzhiapproveMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		zhongzhiapproveMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		zhongzhiapproveMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return zhongzhiapproveMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return zhongzhiapproveMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return zhongzhiapproveMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		zhongzhiapproveMapper.deleteAll(ArrayDATA_IDS);
	}
	
}

