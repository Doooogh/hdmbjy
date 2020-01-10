package org.fh.service.approveform;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 流程审批和填报表单关联表接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-17
 * 官网：www.fhadmin.org
 * @version
 */
public interface ApproveFormService{

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception;
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception;
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception;
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception;
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception;

	List<PageData> findApproveAndFormType(PageData pd);


	/**
	* 描述:
	* author: li long
	* date:  2019/10/20
	* param   * @param null
	* return 
	*/
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

