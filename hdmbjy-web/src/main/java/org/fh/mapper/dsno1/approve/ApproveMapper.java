package org.fh.mapper.dsno1.approve;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 审批类型Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-14
 * 官网：www.fhadmin.org
 * @version
 */
public interface ApproveMapper{

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

	/**
	 * 查询所有机构
	 * @param pageData
	 * @return
	 */
	List<PageData> listAllOrganization(PageData pageData);

	/**
	 * 通过父id 查询子级机构
	 * @param
	 * @return
	 */
	List<PageData> listSublistPage(Page page);



	
}

