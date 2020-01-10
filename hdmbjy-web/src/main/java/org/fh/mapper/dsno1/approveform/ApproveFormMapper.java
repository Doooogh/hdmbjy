package org.fh.mapper.dsno1.approveform;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 流程审批和填报表单关联表Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-17
 * 官网：www.fhadmin.org
 * @version
 */
public interface ApproveFormMapper{

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	void save(PageData pd);
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	void delete(PageData pd);
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	void edit(PageData pd);
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	List<PageData> datalistPage(Page page);
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	List<PageData> listAll(PageData pd);
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	PageData findById(PageData pd);
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	void deleteAll(String[] ArrayDATA_IDS);

	List<PageData> findApproveAndFormType(PageData pd);

	List<PageData> findApproveFormAndFullDataUrl(PageData pd);


	/**
	 *根据审批的id 获取审批类型
	 * @author li long
	 * @date 2019/10/23
	 * @param  * @param pd
	 * @return org.fh.entity.PageData
	 */
	PageData findApproveTypeNameByApproveId(PageData pd);
	
}

