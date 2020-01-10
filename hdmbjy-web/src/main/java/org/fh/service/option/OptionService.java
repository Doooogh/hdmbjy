package org.fh.service.option;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.fh.entity.Page;
import org.fh.entity.PageData;

/** 
 * 说明： 反馈表表单数据选项表接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-11-15
 * 官网：www.fhadmin.org
 * @version
 */
public interface OptionService{

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

	/**
	 * 根据tableId 删除
	 * @param pd
	 */
	void deleteByTableId(PageData pd);

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

	int batchSave(@Param("list")List<PageData> list);

	List<PageData> findTreeByTableId(PageData pd);
	
	List<PageData> findByPId(PageData pd);
	
}

