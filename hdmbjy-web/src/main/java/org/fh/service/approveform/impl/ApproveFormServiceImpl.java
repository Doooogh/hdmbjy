package org.fh.service.approveform.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.fh.entity.Page;
import org.fh.entity.PageData;
import org.fh.mapper.dsno1.approveform.ApproveFormMapper;
import org.fh.service.approveform.ApproveFormService;

/** 
 * 说明： 流程审批和填报表单关联表接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-10-17
 * 官网：www.fhadmin.org
 * @version
 */
@Service
@Transactional //开启事物
public class ApproveFormServiceImpl implements ApproveFormService{

	@Autowired
	private ApproveFormMapper approveformMapper;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception{
		approveformMapper.save(pd);
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception{
		approveformMapper.delete(pd);
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception{
		approveformMapper.edit(pd);
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return approveformMapper.datalistPage(page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception{
		return approveformMapper.listAll(pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception{
		return approveformMapper.findById(pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception{
		approveformMapper.deleteAll(ArrayDATA_IDS);
	}

	@Override
	public List<PageData> findApproveAndFormType(PageData pd) {
		return approveformMapper.findApproveAndFormType(pd);
	}

	@Override
	public List<PageData> findApproveFormAndFullDataUrl(PageData pd) {
		return approveformMapper.findApproveFormAndFullDataUrl(pd);
	}

	@Override
	public PageData findApproveTypeNameByApproveId(PageData pd) {
		return approveformMapper.findApproveTypeNameByApproveId(pd);
	}

}

