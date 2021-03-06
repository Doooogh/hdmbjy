package org.fh.service.approvetype;

import java.util.List;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 审批类型接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-10-14
 * 官网：www.fhadmin.org
 * @version
 */
public interface ApproveTypeService {

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

	List<PageData> listAllApproveType(PageData pageData) throws Exception;

	List<PageData> listAllTree(PageData pageData) throws Exception;

	public List<PageData> listSubApproveTypeByParentId(Page page)throws Exception;

	/**
	 *通过审批类型id 获取文件目录
	 * @author li long
	 * @date 2019/10/16
	 * @param  * @param pd
	 * @return java.lang.String
	 */
	String getAllPathByApproveTypeId(PageData pd);

	/**
	 *根据添加的表单的父类型id获取顶级审批类型
	 * @author li long
	 * @date 2019/10/16
	 * @param  * @param pd
	 * @return java.lang.String
	 */
    PageData getTopApproveTypeAndAllPath(PageData pd) throws Exception;



}

